import { type Registry } from 'prom-client'
import { type Producer } from 'kafkajs'
import { KafkaJSProducerPrometheusExporter } from './kafkaJSProducerPrometheusExporter'

export function monitorKafkaJSProducer (producer: Producer, clientId: string, register: Registry, options?: KafkaJSProducerExporterOptions): void {
  const exporter = new KafkaJSProducerPrometheusExporter(producer, clientId, register, options)
  exporter.enableMetrics()
}

/**
 * Optional parameter to configure the exporter.
 */
export interface KafkaJSProducerExporterOptions {

  /**
   * Default labels for all metrics, e.g. {'foo':'bar', alice: 3}
   */
  defaultLabels?: Record<string, string | number>
}
