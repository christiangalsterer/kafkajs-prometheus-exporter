import { type KafkaJSExporterOptions } from './kafkaJSExporterOptions'

/**
 * Optional parameter to configure the exporter.
 */
export interface KafkaJSProducerExporterOptions extends KafkaJSExporterOptions {
  /**
   * Buckets for the kafka_producer_request_latency metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  producerRequestLatencyHistogramBuckets?: number[]
}
