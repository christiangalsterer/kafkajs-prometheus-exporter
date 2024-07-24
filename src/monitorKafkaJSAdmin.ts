import type { Admin } from 'kafkajs'
import type { Registry } from 'prom-client'

import type { KafkaJSAdminExporterOptions } from './kafkaJSAdminExporterOptions'
import { KafkaJSAdminPrometheusExporter } from './kafkaJSAdminPrometheusExporter'

/**
 * Exposes metrics for a KafkaJS admin in prometheus format.
 *
 * @param admin The KafkaJS admin to monitor.
 * @param register The prometheus registry used to expose the metrics.
 * @param options Optional parameter to configure the exporter
 */
export function monitorKafkaJSAdmin(admin: Admin, register: Registry, options?: KafkaJSAdminExporterOptions): void {
  const exporter = new KafkaJSAdminPrometheusExporter(admin, register, options)
  exporter.enableMetrics()
}
