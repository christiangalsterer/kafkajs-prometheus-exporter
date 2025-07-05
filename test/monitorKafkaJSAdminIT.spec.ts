import { beforeEach, describe, expect, test } from '@jest/globals'
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka'
import { type Admin, Kafka } from 'kafkajs'
import { Registry } from 'prom-client'

import { monitorKafkaJSAdmin } from '../src/monitorKafkaJSAdmin'
import { adminMetrics } from './constants'

describe('it monitorKafkaJSAdmin', () => {
  const clientId = 'myTestClientId'
  const KAFKA_PORT = 9093
  const KAFKA_TEST_TOPIC = 'test-topic'
  let register: Registry
  let admin: Admin
  let kafka: Kafka
  let kafkaContainer: StartedKafkaContainer

  beforeAll(async () => {
    kafkaContainer = await new KafkaContainer('confluentinc/cp-kafka:7.4.10').withExposedPorts(KAFKA_PORT).start()
    kafka = new Kafka({
      clientId,
      brokers: [`${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(KAFKA_PORT).toString()}`]
    })
  }, 60000)

  afterAll(async () => {
    await kafkaContainer.stop()
  })

  beforeEach(() => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    register = new Registry()
    admin = kafka.admin()
    monitorKafkaJSAdmin(admin, register, options)
  })

  test('it kafka admin connection metrics', async () => {
    await admin.connect()

    const kafkaAdminConnectionCount = await register.getSingleMetric('kafka_admin_connection_count')?.get()
    expect(kafkaAdminConnectionCount?.type).toEqual('gauge')
    expect(kafkaAdminConnectionCount?.values.length).toEqual(1)
    expect(kafkaAdminConnectionCount?.values.at(0)?.value).toEqual(1)

    const kafkaAdminConnectionCreationTotal = await register.getSingleMetric('kafka_admin_connection_creation_total')?.get()
    expect(kafkaAdminConnectionCreationTotal?.type).toEqual('counter')
    expect(kafkaAdminConnectionCreationTotal?.values.length).toEqual(1)
    expect(kafkaAdminConnectionCreationTotal?.values.at(0)?.value).toEqual(1)

    await admin.disconnect()

    const kafkaAdminConnectionCloseTotal = await register.getSingleMetric('kafka_admin_connection_close_total')?.get()
    expect(kafkaAdminConnectionCloseTotal?.type).toEqual('counter')
    expect(kafkaAdminConnectionCloseTotal?.values.length).toEqual(1)
    expect(kafkaAdminConnectionCloseTotal?.values.at(0)?.value).toEqual(1)
  })

  test('it kafka admin request metrics', async () => {
    await admin.connect()
    await admin.createTopics({
      waitForLeaders: true,
      topics: [{ topic: KAFKA_TEST_TOPIC, numPartitions: 1, replicationFactor: 1 }]
    })

    const topics: string[] = await admin.listTopics()
    const kafkaAdminRequestTotal = await register.getSingleMetric('kafka_admin_request_total')?.get()
    expect(kafkaAdminRequestTotal?.type).toEqual('counter')
    expect(kafkaAdminRequestTotal?.values.length).toEqual(1)
    expect(kafkaAdminRequestTotal?.values.at(0)?.value).toBeGreaterThan(0)
    expect(topics.length).toEqual(1)

    await admin.disconnect()
  })

  test.each(adminMetrics)('it kafka admin metric "%s" is emitted with default labels', async (metric) => {
    const expectedLabels = { foo: 'bar', alice: 2 }

    await admin.connect()
    await admin.createTopics({
      waitForLeaders: true,
      topics: [{ topic: KAFKA_TEST_TOPIC, numPartitions: 1, replicationFactor: 1 }]
    })
    await admin.disconnect()
    const metrics = await register.getMetricsAsJSON()
    for (const metric of metrics) {
      for (const value of metric.values) {
        expect(value.labels).toMatchObject(expectedLabels)
      }
    }
  })
})
