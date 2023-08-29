import { type Registry } from 'prom-client'
import { type Consumer } from 'kafkajs'
import { KafkaJSConsumerPrometheusExporter } from './kafkaJSConsumerPrometheusExporter'
import { type KafkaJSConsumerExporterOptions } from './kafkaJSConsumerExporterOptions'

/**
 * Exposes metrics for a KafkaJS consumer in prometheus format.
 *
 * @param consumer The KafkaS consumer to monitor.
 * @param clientId The client id for the application. The client id is identical across different instances of the same application.
 * @param register The prometheus registry used to expose the metrics.
 * @param options Optional parameter to configure the exporter
 */
export function monitorKafkaJSConsumer (consumer: Consumer, clientId: string, register: Registry, options?: KafkaJSConsumerExporterOptions): void {
  const exporter = new KafkaJSConsumerPrometheusExporter(consumer, clientId, register, options)
  exporter.enableMetrics()
}
