import { Registry } from 'prom-client'
import { Consumer } from 'kafkajs'
import { KafkaJSConsumerPrometheusExporter } from './kafkaJSConsumerPrometheusExporter'

export function monitorKafkaJS (consumer: Consumer, register: Registry): void {
    const exporter = new KafkaJSConsumerPrometheusExporter(consumer, register)
    exporter.enableMetrics()
}