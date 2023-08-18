import { type Registry, Gauge, Counter } from 'prom-client'
import type { DisconnectEvent, ConnectEvent, RequestQueueSizeEvent, Producer, RequestEvent } from 'kafkajs'

export class KafkaJSProducerPrometheusExporter {
  private readonly producer: Producer
  private readonly clientId: string
  private readonly register: Registry

  private readonly producerActiveConnections: Gauge
  private readonly producerConnectionsCreatedTotal: Counter
  private readonly producerConnectionsClosedTotal: Counter
  private readonly producerRequestsTotal: Counter
  private readonly producerRequestSizeMax: Gauge
  private readonly producerRequestQueueSize: Gauge

  constructor (producer: Producer, clientId: string, register: Registry) {
    this.producer = producer
    this.clientId = clientId
    this.register = register

    this.producerActiveConnections = new Gauge({
      name: 'kafka_producer_connections',
      help: 'The current number of active connections established with a broker',
      labelNames: ['client_id'],
      registers: [this.register]
    })

    this.producerConnectionsCreatedTotal = new Counter({
      name: 'kafka_producer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: ['client_id'],
      registers: [this.register]
    })

    this.producerConnectionsClosedTotal = new Counter({
      name: 'kafka_producer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: ['client_id'],
      registers: [this.register]
    })

    this.producerRequestsTotal = new Counter({
      name: 'kafka_producer_requests_total',
      help: 'Size of the request queue.',
      labelNames: ['client_id', 'broker'],
      registers: [this.register]
    })

    this.producerRequestSizeMax = new Gauge({
      name: 'kafka_producer_requests_size_max',
      help: 'Size of the request queue.',
      labelNames: ['client_id', 'broker'],
      registers: [this.register]
    })

    this.producerRequestQueueSize = new Gauge({
      name: 'kafka_producer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['client_id', 'broker'],
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
    this.producerActiveConnections.inc({ client_id: this.clientId })
    this.producerConnectionsCreatedTotal.inc({ client_id: this.clientId })
  }

  onProducerDisconnect (event: DisconnectEvent): void {
    this.producerActiveConnections.dec({ client_id: this.clientId })
    this.producerConnectionsClosedTotal.inc({ client_id: this.clientId })
  }

  onProducerRequest (event: RequestEvent): void {
    this.producerRequestsTotal.inc({ client_id: event.payload.clientId, broker: event.payload.broker })
    this.producerRequestSizeMax.set({ client_id: event.payload.clientId, broker: event.payload.broker }, event.payload.size)
  }

  onProducerRequestQueueSize (event: RequestQueueSizeEvent): void {
    this.producerRequestQueueSize.set({ client_id: event.payload.clientId, broker: event.payload.broker }, event.payload.queueSize)
  }
}
