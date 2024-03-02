import { beforeEach, describe, expect, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { Kafka, type Producer, type ProducerEvents } from 'kafkajs'
import { KafkaJSProducerPrometheusExporter } from '../src/kafkaJSProducerPrometheusExporter'

describe('tests kafkaJSProducerPrometheusExporter', () => {
  const clientId = 'myTestClientId'
  let register: Registry
  let producer: Producer
  const kafka = new Kafka({
    clientId,
    brokers: ['localhost:9094']
  })
  const metrics: string[] = [
    'kafka_producer_connection_count', 'kafka_producer_connection_creation_total', 'kafka_producer_connection_close_total',
    'kafka_producer_request_duration_seconds', 'kafka_producer_request_total', 'kafka_producer_request_size_total', 'kafka_producer_request_queue_size'
  ]

  beforeEach(() => {
    register = new Registry()
    producer = kafka.producer()
  })

  test('test if all metrics are registered in registry', () => {
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
      expect(register.getSingleMetric(metric)).toBeDefined()
    })
  })

  test('test if all metrics are registered in registry with defaultLabels', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register, options)
    expect(register.getMetricsAsArray()).toHaveLength(metrics.length)
    metrics.forEach(metric => {
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
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      events: {} as ProducerEvents
    }

    const events: string[] = [
      'producer.connect', 'producer.disconnect', 'producer.network.request', 'producer.network.request_queue_size'
    ]

    const exporter = new KafkaJSProducerPrometheusExporter(mockProducer, register)
    exporter.enableMetrics()

    expect(mockProducer.on).toHaveBeenCalledTimes(events.length)
    events.forEach(event => {
      expect(mockProducer.on).toHaveBeenCalledWith(event, expect.any(Function))
    })
  })
})
