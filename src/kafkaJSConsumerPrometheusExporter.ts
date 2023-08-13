import { type Registry, Gauge, Counter } from 'prom-client'
import { type DisconnectEvent, type ConnectEvent, type Consumer } from 'kafkajs'

export class KafkaJSConsumerPrometheusExporter {
  private readonly consumer: Consumer
  private readonly register: Registry

  private readonly consumerConnections: Gauge
  private readonly consumerConnectionsTotal: Counter

  constructor (consumer: Consumer, register: Registry) {
    this.consumer = consumer
    this.register = register

    this.consumerConnections = new Gauge({
      name: 'kafka_consumer_connection_count',
      help: 'the current connections established with a broker',
      registers: [this.register]
    })

    this.consumerConnectionsTotal = new Counter({
      name: 'kafka_consumer_connection_total',
      help: 'the number of connections established with a broker',
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    this.consumer.on('consumer.connect', event => { this.onConsumerConnect(event) })
    this.consumer.on('consumer.disconnect', event => { this.onConsumerDisconnect(event) })
  }

  onConsumerConnect (event: ConnectEvent): void {
    this.consumerConnections.inc()
    this.consumerConnectionsTotal.inc()
  }

  onConsumerDisconnect (event: DisconnectEvent): void {
    this.consumerConnections.dec()
  }
}
