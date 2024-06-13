/**
 * Optional parameter to configure the exporter.
 */
export interface KafkaJSExporterOptions {
  /**
   * Default labels for all metrics, e.g. {'foo':'bar', alice: 3}
   */
  defaultLabels?: Record<string, string | number>
}
