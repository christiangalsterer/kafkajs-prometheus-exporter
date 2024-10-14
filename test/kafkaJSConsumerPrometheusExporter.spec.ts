import { beforeEach, describe, expect, test } from '@jest/globals'
import { type Consumer, type ConsumerEvents, Kafka } from 'kafkajs'
import { Registry } from 'prom-client'

import { KafkaJSConsumerPrometheusExporter } from '../src/kafkaJSConsumerPrometheusExporter'
import { consumerMetrics } from './consts'

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

  test('all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register)
    expect(register.getMetricsAsArray()).toHaveLength(consumerMetrics.length)
    consumerMetrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(consumerMetrics.length)
    consumerMetrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('enableMetrics method should attach event listeners to consumer client', () => {
    const mockConsumer: Consumer = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      subscribe: jest.fn(),
      stop: jest.fn(),
      run: jest.fn(),
      commitOffsets: jest.fn(),
      seek: jest.fn(),
      describeGroup: jest.fn(),
      logger: jest.fn(),
      on: jest.fn(),
      pause: jest.fn(),
      paused: jest.fn(),
      resume: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      events: {} as ConsumerEvents
    }

    const events: string[] = [
      'consumer.connect',
      'consumer.disconnect',
      'consumer.crash',
      'consumer.heartbeat',
      'consumer.network.request',
      'consumer.network.request_queue_size',
      'consumer.fetch',
      'consumer.end_batch_process'
    ]

    const exporter = new KafkaJSConsumerPrometheusExporter(mockConsumer, register)
    exporter.enableMetrics()

    expect(mockConsumer.on).toHaveBeenCalledTimes(events.length)
    events.forEach((event) => {
      expect(mockConsumer.on).toHaveBeenCalledWith(event, expect.any(Function))
    })
  })

  test('registered metrics are taken from the registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register)
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register)
    expect(register.getMetricsAsArray()).toHaveLength(consumerMetrics.length)
    consumerMetrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })
})
