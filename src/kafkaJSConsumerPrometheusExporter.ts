import { type Registry, Gauge, Counter } from 'prom-client'
import { type DisconnectEvent, type ConnectEvent, type Consumer, type ConsumerCrashEvent, ConsumerHeartbeatEvent, RequestQueueSizeEvent } from 'kafkajs'

export class KafkaJSConsumerPrometheusExporter {
  private readonly consumer: Consumer
  private readonly clientId: string
  private readonly register: Registry

  private readonly consumerActiveConnections: Gauge
  private readonly consumerConnectionsCreatedTotal: Counter
  private readonly consumerConnectionsClosedTotal: Counter
  private readonly consumerConnectionsCrashedTotal: Counter
  private readonly consumerHeartbeats: Counter
  private readonly consumerRequestQueueSize: Gauge

  constructor (consumer: Consumer, clientId: string, register: Registry) {
    this.consumer = consumer
    this.clientId = clientId
    this.register = register

    this.consumerActiveConnections = new Gauge({
      name: 'kafka_consumer_connections',
      help: 'The current number of active connections established with a broker',
      labelNames: ['client_id'],
      registers: [this.register]
    })

    this.consumerConnectionsCreatedTotal = new Counter({
      name: 'kafka_consumer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: ['client_id'],
      registers: [this.register]
    })

    this.consumerConnectionsClosedTotal = new Counter({
      name: 'kafka_consumer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: ['client_id'],
      registers: [this.register]
    })

    this.consumerConnectionsCrashedTotal = new Counter({
      name: 'kafka_consumer_connection_crashed_total',
      help: 'The total number of crashed connections with a broker',
      labelNames: ['client_id', 'error', 'restart'],
      registers: [this.register]
    })

    this.consumerHeartbeats = new Counter({
      name: 'kafka_consumer_heartbeats',
      help: 'The total numer of heartbeats with a broker',
      labelNames: ['client_id', 'group_id', 'member_id'],
      registers: [this.register]
    })

    this.consumerRequestQueueSize = new Gauge({
      name: 'kafka_consumer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['client_id', 'broker', 'group_id'],
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    this.consumer.on('consumer.connect', event => { this.onConsumerConnect(event) })
    this.consumer.on('consumer.disconnect', event => { this.onConsumerDisconnect(event) })
    this.consumer.on('consumer.crash', event => { this.onConsumerCrashed(event) })
    this.consumer.on('consumer.heartbeat', event => { this.onConsumerHeartbeat(event) })
    this.consumer.on('consumer.network.request_queue_size', event => { this.onConsumerRequestQueueSize(event) })
  }

  onConsumerConnect (event: ConnectEvent): void {
    this.consumerActiveConnections.inc({ client_id: this.clientId })
    this.consumerConnectionsCreatedTotal.inc({ client_id: this.clientId })
  }

  onConsumerDisconnect (event: DisconnectEvent): void {
    this.consumerActiveConnections.dec({ client_id: this.clientId })
    this.consumerConnectionsClosedTotal.inc({ client_id: this.clientId })
  }

  onConsumerCrashed (event: ConsumerCrashEvent): void {
    this.consumerConnectionsCrashedTotal.inc({ client_id: event.payload.groupId, error: event.payload.error.name, restart: event.payload.restart.valueOf().toString() })
  }

  onConsumerHeartbeat (event: ConsumerHeartbeatEvent): void {
    this.consumerHeartbeats.inc({ client_id: this.clientId, group_id: event.payload.groupId, member_id: event.payload.memberId })
  }

  onConsumerRequestQueueSize (event: RequestQueueSizeEvent): void {
    this.consumerRequestQueueSize.set({ client_id: this.clientId, broker: event.payload.broker, clientId: event.payload.clientId }, event.payload.queueSize)
  }
}
