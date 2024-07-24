import type { KafkaJSExporterOptions } from './kafkaJSExporterOptions'

/**
 * Optional parameter to configure the exporter.
 */
export interface KafkaJSConsumerExporterOptions extends KafkaJSExporterOptions {
  /**
   * Buckets for the kafka_consumer_request_duration_seconds_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerRequestDurationHistogramBuckets?: number[]

  /**
   * @deprecated
   * Buckets for the kafka_consumer_fetch_latency_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerFetchLatencyHistogramBuckets?: number[]

  /**
   * Buckets for the kafka_consumer_fetch_duration_seconds_bucket metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerFetchDurationHistogramBuckets?: number[]

  /**
   * @deprecated
   * Buckets for the kafka_consumer_batch_latency metric_bucket. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerBatchLatencyHistogramBuckets?: number[]

  /**
   * Buckets for the kafka_consumer_batch_duration_second_buckets metric. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
   */
  consumerBatchDurationHistogramBuckets?: number[]
}
