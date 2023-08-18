import { type Registry } from 'prom-client'
import { type Producer } from 'kafkajs'
import { KafkaJSProducerPrometheusExporter } from './kafkaJSProducerPrometheusExporter'

export function monitorKafkaJSProducer (producer: Producer, clientId: string, register: Registry): void {
  const exporter = new KafkaJSProducerPrometheusExporter(producer, clientId, register)
  exporter.enableMetrics()
}
