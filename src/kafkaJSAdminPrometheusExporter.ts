import type { Admin, ConnectEvent, DisconnectEvent, RequestEvent, RequestQueueSizeEvent } from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'

import type { KafkaJSAdminExporterOptions } from './kafkaJSAdminExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

const MILLISECONDS_IN_A_SECOND = 1000

/**
 * Exports metrics for a Kafka admin client
 */
export class KafkaJSAdminPrometheusExporter {
  private static readonly SECOND_IN_MILLISECOND = 1000
  private readonly admin: Admin
  private readonly register: Registry
  private readonly options: KafkaJSAdminExporterOptions
  private readonly defaultOptions: KafkaJSAdminExporterOptions = {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    adminRequestDurationHistogramBuckets: [0.001, 0.005, 0.01, 0.02, 0.03, 0.04, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0, 10]
  }

  private readonly adminActiveConnections: Gauge
  private readonly adminConnectionsCreatedTotal: Counter
  private readonly adminConnectionsClosedTotal: Counter
  private readonly adminRequestTotal: Counter
  private readonly adminRequestDuration: Histogram
  private readonly adminRequestSizeTotal: Counter
  private readonly adminRequestQueueSize: Gauge

  private readonly KAFKA_ADMIN_CONNECTION_COUNT = 'kafka_admin_connection_count'
  private readonly KAFKA_ADMIN_CONNECTION_CREATION_TOTAL = 'kafka_admin_connection_creation_total'
  private readonly KAFKA_ADMIN_CONNECTION_CLOSE_TOTAL = 'kafka_admin_connection_close_total'
  private readonly KAFKA_ADMIN_REQUEST_TOTAL = 'kafka_admin_request_total'
  private readonly KAFKA_ADMIN_REQUEST_DURATION_SECONDS = 'kafka_admin_request_duration_seconds'
  private readonly KAFKA_ADMIN_REQUEST_SIZE_TOTAL = 'kafka_admin_request_size_total'
  private readonly KAFKA_ADMIN_REQUEST_QUEUE_SIZE = 'kafka_admin_request_queue_size'

  /**
   * Creates a new exporter
   * @param admin the admin client to monitor
   * @param register the register to use to export the metrics
   * @param options optional configuration options
   */
  constructor(admin: Admin, register: Registry, options?: KafkaJSAdminExporterOptions) {
    this.admin = admin
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.adminActiveConnections = (this.register.getSingleMetric(this.KAFKA_ADMIN_CONNECTION_COUNT) ??
      new Gauge({
        name: this.KAFKA_ADMIN_CONNECTION_COUNT,
        help: 'The current number of active connections established with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge

    this.adminConnectionsCreatedTotal = (this.register.getSingleMetric(this.KAFKA_ADMIN_CONNECTION_CREATION_TOTAL) ??
      new Counter({
        name: this.KAFKA_ADMIN_CONNECTION_CREATION_TOTAL,
        help: 'The total number of connections established with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.adminConnectionsClosedTotal = (this.register.getSingleMetric(this.KAFKA_ADMIN_CONNECTION_CLOSE_TOTAL) ??
      new Counter({
        name: this.KAFKA_ADMIN_CONNECTION_CLOSE_TOTAL,
        help: 'The total number of connections closed with a broker',
        labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.adminRequestTotal = (this.register.getSingleMetric(this.KAFKA_ADMIN_REQUEST_TOTAL) ??
      new Counter({
        name: this.KAFKA_ADMIN_REQUEST_TOTAL,
        help: 'The total number of requests sent.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.adminRequestDuration = (this.register.getSingleMetric(this.KAFKA_ADMIN_REQUEST_DURATION_SECONDS) ??
      new Histogram({
        name: this.KAFKA_ADMIN_REQUEST_DURATION_SECONDS,
        help: 'The time taken for processing an admin request.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        buckets: this.options.adminRequestDurationHistogramBuckets,
        registers: [this.register]
      })) as Histogram

    this.adminRequestSizeTotal = (this.register.getSingleMetric(this.KAFKA_ADMIN_REQUEST_SIZE_TOTAL) ??
      new Counter({
        name: this.KAFKA_ADMIN_REQUEST_SIZE_TOTAL,
        help: 'The size of any request sent.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Counter

    this.adminRequestQueueSize = (this.register.getSingleMetric(this.KAFKA_ADMIN_REQUEST_QUEUE_SIZE) ??
      new Gauge({
        name: this.KAFKA_ADMIN_REQUEST_QUEUE_SIZE,
        help: 'Size of the request queue.',
        labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
        registers: [this.register]
      })) as Gauge
  }

  public enableMetrics(): void {
    this.admin.on('admin.connect', (event) => {
      this.onAdminConnect(event)
    })
    this.admin.on('admin.disconnect', (event) => {
      this.onAdminDisconnect(event)
    })
    this.admin.on('admin.network.request', (event) => {
      this.onAdminRequest(event)
    })
    this.admin.on('admin.network.request_queue_size', (event) => {
      this.onAdminRequestQueueSize(event)
    })
  }

  onAdminConnect(event: ConnectEvent): void {
    this.adminActiveConnections.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.adminConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onAdminDisconnect(event: DisconnectEvent): void {
    this.adminActiveConnections.dec(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.adminConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onAdminRequest(event: RequestEvent): void {
    this.adminRequestTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels))
    this.adminRequestSizeTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
    this.adminRequestDuration.observe(
      mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels),
      event.payload.duration / MILLISECONDS_IN_A_SECOND
    )
  }

  onAdminRequestQueueSize(event: RequestQueueSizeEvent): void {
    this.adminRequestQueueSize.set(
      mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels),
      event.payload.queueSize
    )
  }
}
