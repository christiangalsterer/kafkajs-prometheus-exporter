import { type Registry } from 'prom-client'
import { type Producer } from 'kafkajs'
import { KafkaJSProducerPrometheusExporter } from './kafkaJSProducerPrometheusExporter'
import { type KafkaJSProducerExporterOptions } from './kafkaJSProducerExporterOptions'

/**
 * Exposes metrics for a KafkaJS producer in prometheus format.
 *
 * @param producer The KafkaJS producer to monitor.
 * @param register The prometheus registry used to expose the metrics.
 * @param options Optional parameter to configure the exporter
 */
export function monitorKafkaJSProducer (producer: Producer, register: Registry, options?: KafkaJSProducerExporterOptions): void {
  const exporter = new KafkaJSProducerPrometheusExporter(producer, register, options)
  exporter.enableMetrics()
}
