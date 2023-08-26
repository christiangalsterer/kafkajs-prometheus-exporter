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

  /**
   * Buckets for the kafka_consumer_fetch_latency metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerFetchLatencyHistogramBuckets?: number[]

  /**
   * Buckets for the kafka_consumer_batch_latency metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerBatchLatencyHistogramBuckets?: number[]
}
