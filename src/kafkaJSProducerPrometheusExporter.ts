/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { ConnectEvent, DisconnectEvent, Producer, RequestEvent, RequestQueueSizeEvent } from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'

import type { KafkaJSProducerExporterOptions } from './kafkaJSProducerExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

const MILLISECONDS_IN_A_SECOND = 1000

/**
 * Exports metrics for a Kafka producer
 */
export class KafkaJSProducerPrometheusExporter {
  private readonly producer: Producer
  private readonly register: Registry
  private readonly options: KafkaJSProducerExporterOptions
  private readonly defaultOptions: KafkaJSProducerExporterOptions = {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    producerRequestDurationHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10]
  }

  private readonly producerActiveConnections: Gauge
  private readonly producerConnectionsCreatedTotal: Counter
  private readonly producerConnectionsClosedTotal: Counter
  private readonly producerRequestDuration: Histogram
  private readonly producerRequestTotal: Counter
  private readonly producerRequestSizeTotal: Counter
  private readonly producerRequestQueueSize: Gauge

  private readonly KAFKA_PRODUCER_CONNECTION_COUNT = 'kafka_producer_connection_count'
  private readonly KAFKA_PRODUCER_CONNECTION_CREATION_TOTAL = 'kafka_producer_connection_creation_total'
  private readonly KAFKA_PRODUCER_CONNECTION_CLOSE_TOTAL = 'kafka_producer_connection_close_total'
  private readonly KAFKA_PRODUCER_REQUEST_DURATION_SECONDS = 'kafka_producer_request_duration_seconds'
  private readonly KAFKA_PRODUCER_REQUEST_TOTAL = 'kafka_producer_request_total'
  private readonly KAFKA_PRODUCER_REQUEST_SIZE_TOTAL = 'kafka_producer_request_size_total'
  private readonly KAFKA_PRODUCER_REQUEST_QUEUE_SIZE = 'kafka_producer_request_queue_size'

  constructor(producer: Producer, register: Registry, options?: KafkaJSProducerExporterOptions) {
    this.producer = producer
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.producerActiveConnections = (this.register.getSingleMetric(this.KAFKA_PRODUCER_CONNECTION_COUNT) ??
      new Gauge({
        name: this.KAFKA_PRODUCER_CONNECTION_COUNT,
        help: 'The current number of active connections established with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.producerConnectionsCreatedTotal = (this.register.getSingleMetric(this.KAFKA_PRODUCER_CONNECTION_CREATION_TOTAL) ??
      new Counter({
        name: this.KAFKA_PRODUCER_CONNECTION_CREATION_TOTAL,
        help: 'The total number of connections established with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.producerConnectionsClosedTotal = (this.register.getSingleMetric(this.KAFKA_PRODUCER_CONNECTION_CLOSE_TOTAL) ??
      new Counter({
        name: this.KAFKA_PRODUCER_CONNECTION_CLOSE_TOTAL,
        help: 'The total number of connections closed with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.producerRequestDuration = (this.register.getSingleMetric(this.KAFKA_PRODUCER_REQUEST_DURATION_SECONDS) ??
      new Histogram({
        name: this.KAFKA_PRODUCER_REQUEST_DURATION_SECONDS,
        help: 'The time taken for processing a producer request.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        buckets: this.options.producerRequestDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram

    this.producerRequestTotal = (this.register.getSingleMetric(this.KAFKA_PRODUCER_REQUEST_TOTAL) ??
      new Counter({
        name: this.KAFKA_PRODUCER_REQUEST_TOTAL,
        help: 'The total number of requests sent.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.producerRequestSizeTotal = (this.register.getSingleMetric(this.KAFKA_PRODUCER_REQUEST_SIZE_TOTAL) ??
      new Counter({
        name: this.KAFKA_PRODUCER_REQUEST_SIZE_TOTAL,
        help: 'The size of any request sent.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.producerRequestQueueSize = (this.register.getSingleMetric(this.KAFKA_PRODUCER_REQUEST_QUEUE_SIZE) ??
      new Gauge({
        name: this.KAFKA_PRODUCER_REQUEST_QUEUE_SIZE,
        help: 'Size of the request queue.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge
  }

  public enableMetrics(): void {
    this.producer.on('producer.connect', (event) => {
      this.onProducerConnect(event)
    })
    this.producer.on('producer.disconnect', (event) => {
      this.onProducerDisconnect(event)
    })
    this.producer.on('producer.network.request', (event) => {
      this.onProducerRequest(event)
    })
    this.producer.on('producer.network.request_queue_size', (event) => {
      this.onProducerRequestQueueSize(event)
    })
  }

  onProducerConnect(event: ConnectEvent): void {
    this.producerActiveConnections.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.producerConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onProducerDisconnect(event: DisconnectEvent): void {
    this.producerActiveConnections.dec(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.producerConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onProducerRequest(event: RequestEvent): void {
    this.producerRequestTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels))
    this.producerRequestSizeTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
    this.producerRequestDuration.observe(
      mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels),
      event.payload.duration / MILLISECONDS_IN_A_SECOND
    )
  }

  onProducerRequestQueueSize(event: RequestQueueSizeEvent): void {
    this.producerRequestQueueSize.set(
      mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels),
      event.payload.queueSize
    )
  }
}
