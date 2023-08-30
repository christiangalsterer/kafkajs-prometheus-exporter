import { type Registry } from 'prom-client'
import { type Admin } from 'kafkajs'
import { KafkaJSAdminPrometheusExporter } from './kafkaJSAdminPrometheusExporter'
import { type KafkaJSAdminExporterOptions } from './kafkaJSAdminExporterOptions'

/**
 * Exposes metrics for a KafkaJS admin in prometheus format.
 *
 * @param admin The KafkaJS admin to monitor.
 * @param clientId The client id for the application. The client id is identical across different instances of the same application.
 * @param register The prometheus registry used to expose the metrics.
 * @param options Optional parameter to configure the exporter
 */
export function monitorKafkaJSAdmin (admin: Admin, clientId: string, register: Registry, options?: KafkaJSAdminExporterOptions): void {
  const exporter = new KafkaJSAdminPrometheusExporter(admin, clientId, register, options)
  exporter.enableMetrics()
}
