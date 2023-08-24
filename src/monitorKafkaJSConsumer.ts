import { type Registry } from 'prom-client'
import { type Consumer } from 'kafkajs'
import { KafkaJSConsumerPrometheusExporter } from './kafkaJSConsumerPrometheusExporter'

export function monitorKafkaJSConsumer (consumer: Consumer, clientId: string, register: Registry, options?: KafkaJSConsumerExporterOptions): void {
  const exporter = new KafkaJSConsumerPrometheusExporter(consumer, clientId, register, options)
  exporter.enableMetrics()
}

/**
 * Optional parameter to configure the exporter.
 */
export interface KafkaJSConsumerExporterOptions {

  /**
   * Default labels for all metrics, e.g. {'foo':'bar', alice: 3}
   */
  defaultLabels?: Record<string, string | number>
}
