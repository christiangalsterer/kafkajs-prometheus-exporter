export const adminMetrics: string[] = [
  'kafka_admin_connection_count',
  'kafka_admin_connection_creation_total',
  'kafka_admin_connection_close_total',
  'kafka_admin_request_duration_seconds',
  'kafka_admin_request_total',
  'kafka_admin_request_size_total',
  'kafka_admin_request_queue_size'
]

export const consumerMetrics: string[] = [
  'kafka_consumer_connection_count',
  'kafka_consumer_connection_creation_total',
  'kafka_consumer_connection_close_total',
  'kafka_consumer_connection_crashed_total',
  'kafka_consumer_heartbeat_total',
  'kafka_consumer_request_duration_seconds',
  'kafka_consumer_request_total',
  'kafka_consumer_request_size_total',
  'kafka_consumer_request_queue_size',
  'kafka_consumer_fetch_duration_seconds',
  'kafka_consumer_fetch_latency',
  'kafka_consumer_fetch_total',
  'kafka_consumer_batch_size_total',
  'kafka_consumer_batch_duration_seconds',
  'kafka_consumer_batch_latency'
]

export const producerMetrics: string[] = [
  'kafka_producer_connection_count',
  'kafka_producer_connection_creation_total',
  'kafka_producer_connection_close_total',
  'kafka_producer_request_duration_seconds',
  'kafka_producer_request_total',
  'kafka_producer_request_size_total',
  'kafka_producer_request_queue_size'
]
