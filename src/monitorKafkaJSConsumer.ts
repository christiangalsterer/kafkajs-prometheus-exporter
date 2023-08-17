import { type Registry } from 'prom-client'
import { type Consumer } from 'kafkajs'
import { KafkaJSConsumerPrometheusExporter } from './kafkaJSConsumerPrometheusExporter'

export function monitorKafkaJSConsumer (consumer: Consumer, clientId: string, register: Registry): void {
  const exporter = new KafkaJSConsumerPrometheusExporter(consumer, clientId, register)
  exporter.enableMetrics()
}
