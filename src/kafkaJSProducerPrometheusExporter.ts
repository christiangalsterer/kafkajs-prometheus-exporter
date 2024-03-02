import type { ConnectEvent, DisconnectEvent, Producer, RequestEvent, RequestQueueSizeEvent } from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'
import { type KafkaJSProducerExporterOptions } from './kafkaJSProducerExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

/**
 * Exports metrics for a Kafka producer
 */
export class KafkaJSProducerPrometheusExporter {
  private readonly producer: Producer
  private readonly register: Registry
  private readonly options: KafkaJSProducerExporterOptions
  private readonly defaultOptions: KafkaJSProducerExporterOptions = {
    producerRequestDurationHistogramBuckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
  }

  private readonly producerActiveConnections: Gauge
  private readonly producerConnectionsCreatedTotal: Counter
  private readonly producerConnectionsClosedTotal: Counter
  private readonly producerRequestDuration: Histogram
  private readonly producerRequestTotal: Counter
  private readonly producerRequestSizeTotal: Counter
  private readonly producerRequestQueueSize: Gauge

  constructor (producer: Producer, register: Registry, options?: KafkaJSProducerExporterOptions) {
    this.producer = producer
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.producerActiveConnections = new Gauge({
      name: 'kafka_producer_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerConnectionsCreatedTotal = new Counter({
      name: 'kafka_producer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerConnectionsClosedTotal = new Counter({
      name: 'kafka_producer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerRequestDuration = new Histogram({
      name: 'kafka_producer_request_duration_seconds',
      help: 'The time taken for processing a producer request.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      buckets: this.options.producerRequestDurationHistogramBuckets,
      registers: [this.register]
    })

    this.producerRequestTotal = new Counter({
      name: 'kafka_producer_request_total',
      help: 'The total number of requests sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerRequestSizeTotal = new Counter({
      name: 'kafka_producer_request_size_total',
      help: 'The size of any request sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerRequestQueueSize = new Gauge({
      name: 'kafka_producer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    this.producer.on('producer.connect', event => { this.onProducerConnect(event) })
    this.producer.on('producer.disconnect', event => { this.onProducerDisconnect(event) })
    this.producer.on('producer.network.request', event => { this.onProducerRequest(event) })
    this.producer.on('producer.network.request_queue_size', event => { this.onProducerRequestQueueSize(event) })
  }

  onProducerConnect (event: ConnectEvent): void {
    this.producerActiveConnections.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.producerConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onProducerDisconnect (event: DisconnectEvent): void {
    this.producerActiveConnections.dec(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.producerConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onProducerRequest (event: RequestEvent): void {
    this.producerRequestTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels))
    this.producerRequestSizeTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
    this.producerRequestDuration.observe(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.duration / 1000)
  }

  onProducerRequestQueueSize (event: RequestQueueSizeEvent): void {
    this.producerRequestQueueSize.set(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.queueSize)
  }
}
