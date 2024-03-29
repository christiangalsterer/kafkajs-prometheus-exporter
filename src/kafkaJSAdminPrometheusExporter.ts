import type { Admin, ConnectEvent, DisconnectEvent, RequestEvent, RequestQueueSizeEvent } from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'

import { type KafkaJSAdminExporterOptions } from './kafkaJSAdminExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

/**
 * Exports metrics for a Kafka admin client
 */
export class KafkaJSAdminPrometheusExporter {
  private readonly admin: Admin
  private readonly register: Registry
  private readonly options: KafkaJSAdminExporterOptions
  private readonly defaultOptions: KafkaJSAdminExporterOptions = {
    adminRequestDurationHistogramBuckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]
  }

  private readonly adminActiveConnections: Gauge
  private readonly adminConnectionsCreatedTotal: Counter
  private readonly adminConnectionsClosedTotal: Counter
  private readonly adminRequestTotal: Counter
  private readonly adminRequestDuration: Histogram
  private readonly adminRequestSizeTotal: Counter
  private readonly adminRequestQueueSize: Gauge
  /**
   * Creates a new exporter
   * @param admin the admin client to monitor
   * @param register the register to use to export the metrics
   * @param options optional configuration options
   */
  constructor (admin: Admin, register: Registry, options?: KafkaJSAdminExporterOptions) {
    this.admin = admin
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.adminActiveConnections = new Gauge({
      name: 'kafka_admin_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminConnectionsCreatedTotal = new Counter({
      name: 'kafka_admin_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminConnectionsClosedTotal = new Counter({
      name: 'kafka_admin_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: mergeLabelNamesWithStandardLabels([], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminRequestTotal = new Counter({
      name: 'kafka_admin_request_total',
      help: 'The total number of requests sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminRequestDuration = new Histogram({
      name: 'kafka_admin_request_duration_seconds',
      help: 'The time taken for processing an admin request.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      buckets: this.options.adminRequestDurationHistogramBuckets,
      registers: [this.register]
    })

    this.adminRequestSizeTotal = new Counter({
      name: 'kafka_admin_request_size_total',
      help: 'The size of any request sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminRequestQueueSize = new Gauge({
      name: 'kafka_admin_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: mergeLabelNamesWithStandardLabels(['broker'], this.options.defaultLabels),
      registers: [this.register]
    })
  }

  public enableMetrics (): void {
    this.admin.on('admin.connect', event => { this.onAdminConnect(event) })
    this.admin.on('admin.disconnect', event => { this.onAdminDisconnect(event) })
    this.admin.on('admin.network.request', event => { this.onAdminRequest(event) })
    this.admin.on('admin.network.request_queue_size', event => { this.onAdminRequestQueueSize(event) })
  }

  onAdminConnect (event: ConnectEvent): void {
    this.adminActiveConnections.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.adminConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onAdminDisconnect (event: DisconnectEvent): void {
    this.adminActiveConnections.dec(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
    this.adminConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({}, this.options.defaultLabels))
  }

  onAdminRequest (event: RequestEvent): void {
    this.adminRequestTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels))
    this.adminRequestSizeTotal.inc(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
    this.adminRequestDuration.observe(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.duration / 1000)
  }

  onAdminRequestQueueSize (event: RequestQueueSizeEvent): void {
    this.adminRequestQueueSize.set(mergeLabelsWithStandardLabels({ broker: event.payload.broker }, this.options.defaultLabels), event.payload.queueSize)
  }
}
