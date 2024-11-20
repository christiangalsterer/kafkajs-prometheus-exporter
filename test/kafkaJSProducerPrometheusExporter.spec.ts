import { beforeEach, describe, expect, test } from '@jest/globals'
import { Kafka, type Producer, type ProducerEvents } from 'kafkajs'
import { Registry } from 'prom-client'

import { KafkaJSProducerPrometheusExporter } from '../src/kafkaJSProducerPrometheusExporter'
import { producerMetrics } from './constants'

describe('tests kafkaJSProducerPrometheusExporter', () => {
  const KAFKA_CLIENT_ID = 'myTestClientId'
  let register: Registry
  let producer: Producer
  const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: ['localhost:9094']
  })

  beforeEach(() => {
    register = new Registry()
    producer = kafka.producer()
  })

  test('all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register)
    expect(register.getMetricsAsArray()).toHaveLength(producerMetrics.length)
    producerMetrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(producerMetrics.length)
    producerMetrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('enableMetrics method should attach event listeners to producer client', () => {
    const mockProducer: Producer = {
      connect: jest.fn(),
      disconnect: jest.fn(),
      isIdempotent: jest.fn(),
      on: jest.fn(),
      send: jest.fn(),
      sendBatch: jest.fn(),
      transaction: jest.fn(),
      logger: jest.fn(),
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions, @typescript-eslint/no-unsafe-type-assertion
      events: {} as ProducerEvents
    }

    const events: string[] = ['producer.connect', 'producer.disconnect', 'producer.network.request', 'producer.network.request_queue_size']

    const exporter = new KafkaJSProducerPrometheusExporter(mockProducer, register)
    exporter.enableMetrics()

    expect(mockProducer.on).toHaveBeenCalledTimes(events.length)
    events.forEach((event) => {
      expect(mockProducer.on).toHaveBeenCalledWith(event, expect.any(Function))
    })
  })

  test('registered metrics are taken from the registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register)
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register)
    expect(register.getMetricsAsArray()).toHaveLength(producerMetrics.length)
    producerMetrics.forEach((metric) => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })
})
