/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { KafkaJSConsumerPrometheusExporter } from '../src/kafkaJSConsumerPrometheusExporter'
import { Kafka, type Consumer } from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'

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
  }),
  Histogram: jest.fn(() => {
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
  let consumer: Consumer

  beforeEach(() => {
    jest.clearAllMocks()
    consumer = kafka.consumer({ groupId: 'group1' })
  })

  test('tests if all metrics are created', () => {
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register)

    expect(Counter).toHaveBeenCalledTimes(7)
    expect(Gauge).toHaveBeenCalledTimes(3)
    expect(Histogram).toHaveBeenCalledTimes(3)

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_crashed_total',
      help: 'The total number of crashed connections with a broker',
      labelNames: ['group_id', 'error', 'restart'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_heartbeat_total',
      help: 'The total number of heartbeats with a broker',
      labelNames: ['group_id', 'member_id'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_total',
      help: 'The total number of requests sent.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_duration',
      help: 'The time taken for processing a consumer request.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_fetch_total',
      help: 'The total number of fetch requests.',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_batch_size_total',
      help: 'The number of bytes received per partition per request',
      labelNames: ['topic', 'partition'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_size_total',
      help: 'The size of any request sent.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_consumer_fetch_latency',
      help: 'The time taken for a fetch request.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: [],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_consumer_batch_latency',
      help: 'The time taken for processing a batch.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['topic', 'partition'],
      registers: [register]
    })
  })

  test('tests if all metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new KafkaJSConsumerPrometheusExporter(consumer, register, options)

    expect(Counter).toHaveBeenCalledTimes(7)
    expect(Gauge).toHaveBeenCalledTimes(3)
    expect(Histogram).toHaveBeenCalledTimes(3)

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_crashed_total',
      help: 'The total number of crashed connections with a broker',
      labelNames: ['group_id', 'error', 'restart', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_heartbeat_total',
      help: 'The total number of heartbeats with a broker',
      labelNames: ['group_id', 'member_id', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_total',
      help: 'The total number of requests sent.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_duration',
      help: 'The time taken for processing a consumer request.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_fetch_total',
      help: 'The total number of fetch requests.',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_consumer_batch_size_total',
      help: 'The number of bytes received per partition per request',
      labelNames: ['topic', 'partition', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_consumer_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_size_total',
      help: 'The size of any request sent.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_consumer_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_consumer_fetch_latency',
      help: 'The time taken for a fetch request.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_consumer_batch_latency',
      help: 'The time taken for processing a batch.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['topic', 'partition', 'foo', 'alice'],
      registers: [register]
    })
  })
})
