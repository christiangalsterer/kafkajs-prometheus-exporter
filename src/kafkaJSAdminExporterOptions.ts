import type { KafkaJSExporterOptions } from './kafkaJSExporterOptions'

/**
 * Optional parameter to configure the exporter.
 */
export interface KafkaJSAdminExporterOptions extends KafkaJSExporterOptions {
  /**
   * Buckets for the kafka_admin_request_duration_seconds_bucket metric.
   */
  adminRequestDurationHistogramBuckets?: number[]
}
