import { type Registry, Gauge, Counter, Summary } from 'prom-client'
import type { DisconnectEvent, ConnectEvent, RequestQueueSizeEvent, Producer, RequestEvent } from 'kafkajs'
import { type KafkaJSProducerExporterOptions } from './monitorKafkaJSProducer'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

export class KafkaJSProducerPrometheusExporter {
  private readonly producer: Producer
  private readonly clientId: string
  private readonly register: Registry
  private readonly options: KafkaJSProducerExporterOptions
  private readonly defaultOptions: KafkaJSProducerExporterOptions = {}

  private readonly producerActiveConnections: Gauge
  private readonly producerConnectionsCreatedTotal: Counter
  private readonly producerConnectionsClosedTotal: Counter
  private readonly producerRequestTotal: Counter
  private readonly producerRequestSizeMax: Summary
  private readonly producerRequestQueueSize: Gauge

  constructor (producer: Producer, clientId: string, register: Registry, options?: KafkaJSProducerExporterOptions) {
    this.producer = producer
    this.clientId = clientId
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.producerActiveConnections = new Gauge({
      name: 'kafka_producer_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerConnectionsCreatedTotal = new Counter({
      name: 'kafka_producer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerConnectionsClosedTotal = new Counter({
      name: 'kafka_producer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerRequestTotal = new Counter({
      name: 'kafka_producer_request_total',
      help: 'The total number of requests sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id', 'broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerRequestSizeMax = new Summary({
      name: 'kafka_producer_request_size_max',
      help: 'The maximum size of any request sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id', 'broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.producerRequestQueueSize = new Gauge({
      name: 'kafka_producer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id', 'broker'], this.options.defaultLabels),
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
    this.producerActiveConnections.inc(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
    this.producerConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
  }

  onProducerDisconnect (event: DisconnectEvent): void {
    this.producerActiveConnections.dec(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
    this.producerConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
  }

  onProducerRequest (event: RequestEvent): void {
    this.producerRequestTotal.inc(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels))
    // this.producerRequestSizeMax.set(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
    this.producerRequestSizeMax.observe(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
  }

  onProducerRequestQueueSize (event: RequestQueueSizeEvent): void {
    this.producerRequestQueueSize.set(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels), event.payload.queueSize)
  }
}
