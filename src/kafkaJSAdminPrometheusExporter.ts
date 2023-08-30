import { type Registry, Gauge, Counter } from 'prom-client'
import type { DisconnectEvent, ConnectEvent, RequestQueueSizeEvent, Admin, RequestEvent } from 'kafkajs'
import { type KafkaJSAdminExporterOptions } from './kafkaJSAdminExporterOptions'
import { mergeLabelNamesWithStandardLabels, mergeLabelsWithStandardLabels } from './utils'

export class KafkaJSAdminPrometheusExporter {
  private readonly admin: Admin
  private readonly clientId: string
  private readonly register: Registry
  private readonly options: KafkaJSAdminExporterOptions
  private readonly defaultOptions: KafkaJSAdminExporterOptions = {}

  private readonly adminActiveConnections: Gauge
  private readonly adminConnectionsCreatedTotal: Counter
  private readonly adminConnectionsClosedTotal: Counter
  private readonly adminRequestTotal: Counter
  private readonly adminRequestSizeTotal: Counter
  private readonly adminRequestQueueSize: Gauge

  constructor (admin: Admin, clientId: string, register: Registry, options?: KafkaJSAdminExporterOptions) {
    this.admin = admin
    this.clientId = clientId
    this.register = register
    this.options = { ...this.defaultOptions, ...options }

    this.adminActiveConnections = new Gauge({
      name: 'kafka_admin_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminConnectionsCreatedTotal = new Counter({
      name: 'kafka_admin_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminConnectionsClosedTotal = new Counter({
      name: 'kafka_admin_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminRequestTotal = new Counter({
      name: 'kafka_admin_request_total',
      help: 'The total number of requests sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id', 'broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminRequestSizeTotal = new Counter({
      name: 'kafka_admin_request_size_total',
      help: 'The size of any request sent.',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id', 'broker'], this.options.defaultLabels),
      registers: [this.register]
    })

    this.adminRequestQueueSize = new Gauge({
      name: 'kafka_admin_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: mergeLabelNamesWithStandardLabels(['client_id', 'broker'], this.options.defaultLabels),
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
    this.adminActiveConnections.inc(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
    this.adminConnectionsCreatedTotal.inc(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
  }

  onAdminDisconnect (event: DisconnectEvent): void {
    this.adminActiveConnections.dec(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
    this.adminConnectionsClosedTotal.inc(mergeLabelsWithStandardLabels({ client_id: this.clientId }, this.options.defaultLabels))
  }

  onAdminRequest (event: RequestEvent): void {
    this.adminRequestTotal.inc(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels))
    this.adminRequestSizeTotal.inc(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels), event.payload.size)
  }

  onAdminRequestQueueSize (event: RequestQueueSizeEvent): void {
    this.adminRequestQueueSize.set(mergeLabelsWithStandardLabels({ client_id: event.payload.clientId, broker: event.payload.broker }, this.options.defaultLabels), event.payload.queueSize)
  }
}
