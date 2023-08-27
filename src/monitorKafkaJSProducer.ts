import { type Registry } from 'prom-client'
import { type Producer } from 'kafkajs'
import { KafkaJSProducerPrometheusExporter } from './kafkaJSProducerPrometheusExporter'
import { type KafkaJSProducerExporterOptions } from './kafkaJSProducerExporterOptions'

export function monitorKafkaJSProducer (producer: Producer, clientId: string, register: Registry, options?: KafkaJSProducerExporterOptions): void {
  const exporter = new KafkaJSProducerPrometheusExporter(producer, clientId, register, options)
  exporter.enableMetrics()
}
