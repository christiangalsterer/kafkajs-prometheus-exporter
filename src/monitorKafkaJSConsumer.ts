import { type Registry } from 'prom-client'
import { type Consumer } from 'kafkajs'
import { KafkaJSConsumerPrometheusExporter } from './kafkaJSConsumerPrometheusExporter'
import { type KafkaJSConsumerExporterOptions } from './kafkaJSConsumerExporterOptions'

export function monitorKafkaJSConsumer (consumer: Consumer, clientId: string, register: Registry, options?: KafkaJSConsumerExporterOptions): void {
  const exporter = new KafkaJSConsumerPrometheusExporter(consumer, clientId, register, options)
  exporter.enableMetrics()
}
