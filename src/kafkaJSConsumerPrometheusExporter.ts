import type {
  ConnectEvent,
  Consumer,
  ConsumerCrashEvent,
  ConsumerEndBatchProcessEvent,
  ConsumerFetchEvent,
  ConsumerHeartbeatEvent,
  DisconnectEvent,
  RequestEvent,
  RequestQueueSizeEvent
} from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'

import type { KafkaJSConsumerExporterOptions } from './kafkaJSConsumerExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

/**
 * Exports metrics for a Kafka consumer
 */
export class KafkaJSConsumerPrometheusExporter {
  private readonly consumer: Consumer
  private readonly register: Registry
  private readonly options: KafkaJSConsumerExporterOptions
  private readonly defaultOptions: KafkaJSConsumerExporterOptions = {
    consumerRequestDurationHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10],
    consumerBatchLatencyHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10],
    consumerBatchDurationHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10],
    consumerFetchLatencyHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10],
    consumerFetchDurationHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10]
  }

  private readonly consumerActiveConnections: Gauge
  private readonly consumerConnectionsCreatedTotal: Counter
  private readonly consumerConnectionsClosedTotal: Counter
  private readonly consumerConnectionsCrashedTotal: Counter
  private readonly consumerHeartbeats: Counter
  private readonly consumerRequestQueueSize: Gauge
  private readonly consumerFetchLatency: Histogram
  private readonly consumerFetchDuration: Histogram
  private readonly consumerFetchTotal: Counter
  private readonly consumerBatchSizeTotal: Counter
  private readonly consumerBatchLatency: Histogram
  private readonly consumerBatchDuration: Histogram
  private readonly consumerRequestTotal: Counter
  private readonly consumerRequestSizeTotal: Counter
  private readonly consumerRequestDuration: Histogram

  private readonly KAFKA_CONSUMER_CONNECTION_COUNT = 'kafka_consumer_connection_count'
  private readonly KAFKA_CONSUMER_CONNECTION_CREATION_TOTAL = 'kafka_consumer_connection_creation_total'
  private readonly KAFKA_CONSUMER_CONNECTION_CLOSE_TOTAL = 'kafka_consumer_connection_close_total'
  private readonly KAFKA_CONSUMER_CONNECTION_CRASHED_TOTAL = 'kafka_consumer_connection_crashed_total'
  private readonly KAFKA_CONSUMER_HEARTBEAT_TOTAL = 'kafka_consumer_heartbeat_total'
  private readonly KAFKA_CONSUMER_REQUEST_TOTAL = 'kafka_consumer_request_total'
  private readonly KAFKA_CONSUMER_REQUEST_SIZE_TOTAL = 'kafka_consumer_request_size_total'
  private readonly KAFKA_CONSUMER_REQUEST_QUEUE_SIZE = 'kafka_consumer_request_queue_size'
  private readonly KAFKA_CONSUMER_FETCH_LATENCY = 'kafka_consumer_fetch_latency'
  private readonly KAFKA_CONSUMER_FETCH_DURATION_SECONDS = 'kafka_consumer_fetch_duration_seconds'
  private readonly KAFKA_CONSUMER_FETCH_TOTAL = 'kafka_consumer_fetch_total'
  private readonly KAFKA_CONSUMER_BATCH_SIZE_TOTAL = 'kafka_consumer_batch_size_total'
  private readonly KAFKA_CONSUMER_BATCH_LATENCY = 'kafka_consumer_batch_latency'
  private readonly KAFKA_CONSUMER_BATCH_DURATION_SECONDS = 'kafka_consumer_batch_duration_seconds'
  private readonly KAFKA_CONSUMER_REQUEST_DURATION_SECONDS = 'kafka_consumer_request_duration_seconds'

  constructor(consumer: Consumer, register: Registry, options?: KafkaJSConsumerExporterOptions) {
    this.consumer = consumer
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.consumerActiveConnections = (this.register.getSingleMetric(this.KAFKA_CONSUMER_CONNECTION_COUNT) ??
      new Gauge({
        name: this.KAFKA_CONSUMER_CONNECTION_COUNT,
        help: 'The current number of active connections established with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.consumerConnectionsCreatedTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_CONNECTION_CREATION_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_CONNECTION_CREATION_TOTAL,
        help: 'The total number of connections established with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerConnectionsClosedTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_CONNECTION_CLOSE_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_CONNECTION_CLOSE_TOTAL,
        help: 'The total number of connections closed with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerConnectionsCrashedTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_CONNECTION_CRASHED_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_CONNECTION_CRASHED_TOTAL,
        help: 'The total number of crashed connections with a broker',
        labelNames: mergeLabelNamesWithStandardLabels(['group_id', 'error', 'restart'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerHeartbeats = (this.register.getSingleMetric(this.KAFKA_CONSUMER_HEARTBEAT_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_HEARTBEAT_TOTAL,
        help: 'The total number of heartbeats with a broker',
        labelNames: mergeLabelNamesWithStandardLabels(['group_id', 'member_id'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerRequestTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_REQUEST_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_REQUEST_TOTAL,
        help: 'The total number of requests sent.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerRequestSizeTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_REQUEST_SIZE_TOTAL) ??
      new Gauge({
        name: this.KAFKA_CONSUMER_REQUEST_SIZE_TOTAL,
        help: 'The size of any request sent.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.consumerRequestQueueSize = (this.register.getSingleMetric(this.KAFKA_CONSUMER_REQUEST_QUEUE_SIZE) ??
      new Gauge({
        name: this.KAFKA_CONSUMER_REQUEST_QUEUE_SIZE,
        help: 'Size of the request queue.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.consumerFetchLatency = (this.register.getSingleMetric(this.KAFKA_CONSUMER_FETCH_LATENCY) ??
      new Histogram({
        name: this.KAFKA_CONSUMER_FETCH_LATENCY,
        help: 'The time taken for a fetch request.',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        buckets: this.options.consumerBatchDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram

    this.consumerFetchDuration = (this.register.getSingleMetric(this.KAFKA_CONSUMER_FETCH_DURATION_SECONDS) ??
      new Histogram({
        name: this.KAFKA_CONSUMER_FETCH_DURATION_SECONDS,
        help: 'The time taken for a fetch request.',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        buckets: this.options.consumerFetchDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram

    this.consumerFetchTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_FETCH_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_FETCH_TOTAL,
        help: 'The total number of fetch requests.',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerBatchSizeTotal = (this.register.getSingleMetric(this.KAFKA_CONSUMER_BATCH_SIZE_TOTAL) ??
      new Counter({
        name: this.KAFKA_CONSUMER_BATCH_SIZE_TOTAL,
        help: 'The number of bytes received per partition per request',
        labelNames: mergeLabelNamesWithStandardLabels(['topic', 'partition'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.consumerBatchLatency = (this.register.getSingleMetric(this.KAFKA_CONSUMER_BATCH_LATENCY) ??
      new Histogram({
        name: this.KAFKA_CONSUMER_BATCH_LATENCY,
        help: 'The time taken for processing a batch.',
        labelNames: mergeLabelNamesWithStandardLabels(['topic', 'partition'], this.options.defaultLabels),
        buckets: this.options.consumerBatchDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram

    this.consumerBatchDuration = (this.register.getSingleMetric(this.KAFKA_CONSUMER_BATCH_DURATION_SECONDS) ??
      new Histogram({
        name: this.KAFKA_CONSUMER_BATCH_DURATION_SECONDS,
        help: 'The time taken for processing a batch.',
        labelNames: mergeLabelNamesWithStandardLabels(['topic', 'partition'], this.options.defaultLabels),
        buckets: this.options.consumerBatchDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram

    this.consumerRequestDuration = (this.register.getSingleMetric(this.KAFKA_CONSUMER_REQUEST_DURATION_SECONDS) ??
      new Histogram({
        name: this.KAFKA_CONSUMER_REQUEST_DURATION_SECONDS,
        help: 'The time taken for processing a consumer request.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        buckets: this.options.consumerRequestDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram
  }

  public enableMetrics(): void {
    this.consumer.on('consumer.connect', (event) => {
      this.onConsumerConnect(event)
    })
    this.consumer.on('consumer.disconnect', (event) => {
      this.onConsumerDisconnect(event)
    })
    this.consumer.on('consumer.crash', (event) => {
      this.onConsumerCrashed(event)
    })
    this.consumer.on('consumer.heartbeat', (event) => {
      this.onConsumerHeartbeat(event)
    })
    this.consumer.on('consumer.network.request', (event) => {
      this.onConsumerRequest(event)
    })
    this.consumer.on('consumer.network.request_queue_size', (event) => {
      this.onConsumerRequestQueueSize(event)
    })
    this.consumer.on('consumer.fetch', (event) => {
      this.onConsumerFetch(event)
    })
    this.consumer.on('consumer.end_batch_process', (event) => {
      this.onConsumerEndBatch(event)
    })
  }

  onConsumerConnect(event: ConnectEvent): void {
    this.consumerActiveConnections.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.consumerConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onConsumerDisconnect(event: DisconnectEvent): void {
    this.consumerActiveConnections.dec(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.consumerConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onConsumerCrashed(event: ConsumerCrashEvent): void {
    this.consumerConnectionsCrashedTotal.inc(
      mergeLabelsWithStandardLabels(
        {
          group_id: event.payload.groupId,
          error: event.payload.error.name,
          restart: event.payload.restart.valueOf().toString()
        },
        this.options.defaultLabels
      )
    )
  }

  onConsumerHeartbeat(event: ConsumerHeartbeatEvent): void {
    this.consumerHeartbeats.inc(
      mergeLabelsWithStandardLabels({ group_id: event.payload.groupId, member_id: event.payload.memberId }, this.options.defaultLabels)
    )
  }

  onConsumerRequest(event: RequestEvent): void {
    this.consumerRequestTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels))
    this.consumerRequestSizeTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
    this.consumerRequestDuration.observe(
      mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels),
      event.payload.duration / 1000
    )
  }

  onConsumerRequestQueueSize(event: RequestQueueSizeEvent): void {
    this.consumerRequestQueueSize.set(
      mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels),
      event.payload.queueSize
    )
  }

  onConsumerFetch(event: ConsumerFetchEvent): void {
    this.consumerFetchDuration.observe(mergeLabelsWithStandardLabels({}, this.options.defaultLabels), event.payload.duration / 1000)
    this.consumerFetchLatency.observe(mergeLabelsWithStandardLabels({}, this.options.defaultLabels), event.payload.duration / 1000)
    this.consumerFetchTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onConsumerEndBatch(event: ConsumerEndBatchProcessEvent): void {
    this.consumerBatchSizeTotal.inc(
      mergeLabelsWithStandardLabels({ topic: event.payload.topic, partition: event.payload.partition }, this.options.defaultLabels),
      event.payload.batchSize
    )
    this.consumerBatchDuration.observe(
      mergeLabelsWithStandardLabels({ topic: event.payload.topic, partition: event.payload.partition }, this.options.defaultLabels),
      event.payload.duration / 1000
    )
    this.consumerBatchLatency.observe(
      mergeLabelsWithStandardLabels({ topic: event.payload.topic, partition: event.payload.partition }, this.options.defaultLabels),
      event.payload.duration / 1000
    )
  }
}
