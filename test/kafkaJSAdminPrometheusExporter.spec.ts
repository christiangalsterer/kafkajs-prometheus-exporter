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
  const metrics: string[] = [
    'kafka_admin_connection_count', 'kafka_admin_connection_creation_total', 'kafka_admin_connection_close_total',
    'kafka_admin_request_total', 'kafka_admin_request_size_total', 'kafka_admin_request_queue_size'
  ]

  beforeEach(() => {
    register = new Registry()
    admin = kafka.admin()
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSAdminPrometheusExporter(admin, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new KafkaJSAdminPrometheusExporter(admin, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })
})
