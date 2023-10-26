import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { KafkaJSAdminPrometheusExporter } from '../src/kafkaJSAdminPrometheusExporter'
import { Kafka, type Admin } from 'kafkajs'

describe('tests KafkaJSAdminPrometheusExporter', () => {
  const clientId = 'myTestClientId'
  let register: Registry
  let admin: Admin
  const kafka = new Kafka({
    clientId,
    brokers: ['localhost:9094']
  })

  beforeEach(() => {
    register = new Registry()
    admin = kafka.admin()
  })

  test('test if all metrics are registered in registry', () => {
    const exporter = new KafkaJSAdminPrometheusExporter(admin, register)
    exporter.enableMetrics()
    expect(register.getSingleMetric('kafka_admin_connection_count')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_connection_creation_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_connection_close_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_request_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_request_size_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_request_queue_size')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(6)
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    const exporter = new KafkaJSAdminPrometheusExporter(admin, register, options)
    exporter.enableMetrics()
    expect(register.getSingleMetric('kafka_admin_connection_count')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_connection_creation_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_connection_close_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_request_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_request_size_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_admin_request_queue_size')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(6)
  })
})
