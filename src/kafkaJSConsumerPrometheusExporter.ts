import { type Registry, Gauge, Counter } from 'prom-client'
import { type DisconnectEvent, type ConnectEvent, type Consumer } from 'kafkajs'

export class KafkaJSConsumerPrometheusExporter {
  private readonly consumer: Consumer
  private readonly register: Registry

  private readonly consumerConnections: Gauge
  private readonly consumerConnectionsCreatedTotal: Counter
  private readonly consumerConnectionsClosedTotal: Counter

  constructor (consumer: Consumer, register: Registry) {
    this.consumer = consumer
    this.register = register

    this.consumerConnections = new Gauge({
      name: 'kafka_consumer_connections',
      help: 'The current number of connections established with a broker',
      registers: [this.register]
    })

    this.consumerConnectionsCreatedTotal = new Counter({
      name: 'kafka_consumer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      registers: [this.register]
    })

    this.consumerConnectionsClosedTotal = new Counter({
      name: 'kafka_consumer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    this.consumer.on('consumer.connect', event => { this.onConsumerConnect(event) })
    this.consumer.on('consumer.disconnect', event => { this.onConsumerDisconnect(event) })
  }

  onConsumerConnect (event: ConnectEvent): void {
    this.consumerConnections.inc()
    this.consumerConnectionsCreatedTotal.inc()
  }

  onConsumerDisconnect (event: DisconnectEvent): void {
    this.consumerConnections.dec()
    this.consumerConnectionsClosedTotal.inc()
  }
}
