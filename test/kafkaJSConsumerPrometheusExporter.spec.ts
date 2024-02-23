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
  const metrics: string[] = [
    'kafka_consumer_connection_count', 'kafka_consumer_connection_creation_total', 'kafka_consumer_connection_close_total',
    'kafka_consumer_connection_crashed_total', 'kafka_consumer_heartbeat_total', 'kafka_consumer_request_total',
    'kafka_consumer_request_size_total', 'kafka_consumer_request_queue_size', 'kafka_consumer_fetch_latency',
    'kafka_consumer_fetch_total', 'kafka_consumer_batch_size_total', 'kafka_consumer_batch_latency'
  ]

  beforeEach(() => {
    register = new Registry()
    consumer = kafka.consumer({ groupId: 'group1' })
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })
})
