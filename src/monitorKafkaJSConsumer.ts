import { type Consumer } from 'kafkajs'
import { type Registry } from 'prom-client'

import { type KafkaJSConsumerExporterOptions } from './kafkaJSConsumerExporterOptions'
import { KafkaJSConsumerPrometheusExporter } from './kafkaJSConsumerPrometheusExporter'

/**
 * Exposes metrics for a KafkaJS consumer in prometheus format.
 *
 * @param consumer The KafkaJS consumer to monitor.
 * @param register The prometheus registry used to expose the metrics.
 * @param options Optional parameter to configure the exporter
 */
export function monitorKafkaJSConsumer(consumer: Consumer, register: Registry, options?: KafkaJSConsumerExporterOptions): void {
  const exporter = new KafkaJSConsumerPrometheusExporter(consumer, register, options)
  exporter.enableMetrics()
}
