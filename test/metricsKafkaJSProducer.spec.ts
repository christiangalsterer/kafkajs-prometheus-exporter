/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { KafkaJSProducerPrometheusExporter } from '../src/kafkaJSProducerPrometheusExporter'
import { Kafka, type Producer } from 'kafkajs'
import { Counter, Gauge, type Registry } from 'prom-client'

jest.mock('prom-client', () => ({
  Counter: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  }),
  Gauge: jest.fn(() => {
    return {
      set: jest.fn(),
      get: jest.fn()
    }
  })
}))

describe('test if all metrics are created with the correct parameters', () => {
  const options = { defaultLabels: { foo: 'bar', alice: 2 } }
  const clientId = 'myTestClientId'
  const register: Registry = {} as Registry
  const kafka = new Kafka({
    clientId,
    brokers: ['localhost:9094']
  })
  let producer: Producer

  beforeEach(() => {
    jest.clearAllMocks()
    producer = kafka.producer()
  })

  test('tests if all metrics are created', () => {
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register)

    expect(Counter).toHaveBeenCalledTimes(4)
    expect(Gauge).toHaveBeenCalledTimes(2)

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_request_total',
      help: 'The total number of requests sent.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_request_size_total',
      help: 'The size of any request sent.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_producer_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_producer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['broker'],
      registers: [register]
    })
  })

  test('tests if all metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new KafkaJSProducerPrometheusExporter(producer, register, options)

    expect(Counter).toHaveBeenCalledTimes(4)
    expect(Gauge).toHaveBeenCalledTimes(2)

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_request_total',
      help: 'The total number of requests sent.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_producer_request_size_total',
      help: 'The size of any request sent.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_producer_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_producer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })
  })
})
