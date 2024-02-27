import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { KafkaJSAdminPrometheusExporter } from '../src/kafkaJSAdminPrometheusExporter'
import { Kafka, type Admin, type AdminEvents } from 'kafkajs'

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

  test('enableMetrics method should attach event listeners to admin client', () => {
    const mockAdmin: Admin = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      listTopics: jest.fn(),
      createTopics: jest.fn(),
      deleteTopics: jest.fn(),
      createPartitions: jest.fn(),
      fetchTopicMetadata: jest.fn(),
      fetchOffsets: jest.fn(),
      fetchTopicOffsets: jest.fn(),
      fetchTopicOffsetsByTimestamp: jest.fn(),
      describeCluster: jest.fn(),
      setOffsets: jest.fn(),
      resetOffsets: jest.fn(),
      describeConfigs: jest.fn(),
      alterConfigs: jest.fn(),
      listGroups: jest.fn(),
      deleteGroups: jest.fn(),
      describeGroups: jest.fn(),
      describeAcls: jest.fn(),
      deleteAcls: jest.fn(),
      createAcls: jest.fn(),
      deleteTopicRecords: jest.fn(),
      alterPartitionReassignments: jest.fn(),
      listPartitionReassignments: jest.fn(),
      logger: jest.fn(),
      on: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      events: {} as AdminEvents
    }

    const events: string[] = [
      'admin.connect', 'admin.disconnect', 'admin.network.request', 'admin.network.request_queue_size'
    ]

    const exporter = new KafkaJSAdminPrometheusExporter(mockAdmin, register)
    exporter.enableMetrics()

    expect(mockAdmin.on).toHaveBeenCalledTimes(events.length)
    events.forEach(e => {
      expect(mockAdmin.on).toHaveBeenCalledWith(e, expect.any(Function))
    })
  })
})
