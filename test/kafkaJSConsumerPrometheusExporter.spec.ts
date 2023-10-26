import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { KafkaJSConsumerPrometheusExporter } from '../src/kafkaJSConsumerPrometheusExporter'
import { Kafka, type Consumer } from 'kafkajs'

describe('tests kafkaJSConsumerPrometheusExporter', () => {
  let register: Registry
  let consumer: Consumer
  const kafka = new Kafka({
    brokers: ['localhost:9094']
  })

  beforeEach(() => {
    register = new Registry()
    consumer = kafka.consumer({ groupId: 'group1' })
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register)
    expect(register.getSingleMetric('kafka_consumer_connection_count')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_creation_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_close_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_crashed_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_heartbeat_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_size_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_queue_size')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_fetch_latency')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_fetch_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_batch_size_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_batch_latency')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(12)
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register, options)
    expect(register.getSingleMetric('kafka_consumer_connection_count')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_creation_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_close_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_connection_crashed_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_heartbeat_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_size_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_request_queue_size')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_fetch_latency')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_fetch_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_batch_size_total')).toBeDefined()
    expect(register.getSingleMetric('kafka_consumer_batch_latency')).toBeDefined()
    expect(register.getMetricsAsArray().length).toBe(12)
  })
})
