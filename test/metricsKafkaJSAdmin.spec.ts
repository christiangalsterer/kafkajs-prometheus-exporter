/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { beforeEach } from '@jest/globals'
import { type Admin, Kafka } from 'kafkajs'
import { Counter, Gauge, Histogram, type Registry } from 'prom-client'

import { KafkaJSAdminPrometheusExporter } from '../src/kafkaJSAdminPrometheusExporter'

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
  let admin: Admin

  beforeEach(() => {
    jest.clearAllMocks()
    admin = kafka.admin()
  })

  test('tests if all metrics are created', () => {
    // eslint-disable-next-line no-new
    new KafkaJSAdminPrometheusExporter(admin, register)

    expect(Counter).toHaveBeenCalledTimes(4)
    expect(Gauge).toHaveBeenCalledTimes(2)
    expect(Histogram).toHaveBeenCalledTimes(1)

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_request_total',
      help: 'The total number of requests sent.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_request_size_total',
      help: 'The size of any request sent.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_admin_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: [],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_admin_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['broker'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_admin_request_duration_seconds',
      help: 'The time taken for processing an admin request.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['broker'],
      registers: [register]
    })
  })

  test('tests if all metrics are created with default labels', () => {
    // eslint-disable-next-line no-new
    new KafkaJSAdminPrometheusExporter(admin, register, options)

    expect(Counter).toHaveBeenCalledTimes(4)
    expect(Gauge).toHaveBeenCalledTimes(2)
    expect(Histogram).toHaveBeenCalledTimes(1)

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_connection_creation_total',
      help: 'The total number of connections established with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_connection_close_total',
      help: 'The total number of connections closed with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_request_total',
      help: 'The total number of requests sent.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Counter).toHaveBeenCalledWith({
      name: 'kafka_admin_request_size_total',
      help: 'The size of any request sent.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_admin_connection_count',
      help: 'The current number of active connections established with a broker',
      labelNames: ['foo', 'alice'],
      registers: [register]
    })

    expect(Gauge).toHaveBeenCalledWith({
      name: 'kafka_admin_request_queue_size',
      help: 'Size of the request queue.',
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })

    expect(Histogram).toHaveBeenCalledWith({
      name: 'kafka_admin_request_duration_seconds',
      help: 'The time taken for processing an admin request.',
      buckets: [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10],
      labelNames: ['broker', 'foo', 'alice'],
      registers: [register]
    })
  })
})
