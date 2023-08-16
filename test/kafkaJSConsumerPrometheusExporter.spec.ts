import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { KafkaJSConsumerPrometheusExporter } from '../src/kafkaJSConsumerPrometheusExporter'
import { Kafka, type Consumer } from 'kafkajs'

describe('tests kafkaJSConsumerPrometheusExporter', () => {
  const clientId = 'myTestClientId'
  let register: Registry
  let consumer: Consumer
  const kafka = new Kafka({
    clientId,
    brokers: ['localhost:9094']
  })

  beforeEach(() => {
    register = new Registry()
    consumer = kafka.consumer({ groupId: 'group1' })
  })

  test('test if all metrics are registered in registry', () => {
    const exporter = new KafkaJSConsumerPrometheusExporter(consumer, clientId, register)
    exporter.enableMetrics()
    expect(register.getMetricsAsArray().length).toBe(6)
    expect(register.getSingleMetric('kafka_consumer_connections')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_creation_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_close_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_crashed_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_heartbeats')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_queue_size')).toBeDefined()
  })
})
