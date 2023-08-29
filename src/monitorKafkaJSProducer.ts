import { type Registry } from 'prom-client'
import { type Producer } from 'kafkajs'
import { KafkaJSProducerPrometheusExporter } from './kafkaJSProducerPrometheusExporter'
import { type KafkaJSProducerExporterOptions } from './kafkaJSProducerExporterOptions'

/**
 * Exposes metrics for a KafkaJS producer in prometheus format.
 *
 * @param producer The KafkaS producer to monitor.
 * @param clientId The client id for the application. The client id is identical across different instances of the same application.
 * @param register The prometheus registry used to expose the metrics.
 * @param options Optional parameter to configure the exporter
 */
export function monitorKafkaJSProducer (producer: Producer, clientId: string, register: Registry, options?: KafkaJSProducerExporterOptions): void {
  const exporter = new KafkaJSProducerPrometheusExporter(producer, clientId, register, options)
  exporter.enableMetrics()
}
