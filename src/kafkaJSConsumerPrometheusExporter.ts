import { type Registry, Gauge } from 'prom-client'
import { type ConnectEvent, type Consumer } from 'kafkajs'

export class KafkaJSConsumerPrometheusExporter {
  private readonly consumer: Consumer
  private readonly register: Registry

  private readonly consumerConnections: Gauge

  constructor (consumer: Consumer, register: Registry) {
    this.consumer = consumer
    this.register = register

    this.consumerConnections = new Gauge({
      name: 'kafka_consumer_connections',
      help: 'the current connections established with a broker',
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    this.consumer.on('consumer.connect', event => { this.onConsumerConnect(event) })
  }

  onConsumerConnect (event: ConnectEvent): void {
    this.consumerConnections.inc()
  }
}
