import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Kafka, type Producer } from 'kafkajs'
import { Registry } from 'prom-client'

import { KafkaJSProducerPrometheusExporter } from '../src/kafkaJSProducerPrometheusExporter'
import { monitorKafkaJSProducer } from '../src/monitorKafkaJSProducer'

jest.mock('../src/kafkaJSProducerPrometheusExporter')
const mockKafkaJSProducerPrometheusExporter = jest.mocked(KafkaJSProducerPrometheusExporter)

describe('tests monitorKafkaProducerJS', () => {
  const KAFKA_CLIENT_ID = 'myTestClientId'
  const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: ['localhost:9094']
  })
  const kafkaProducer: Producer = kafka.producer()
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSProducerPrometheusExporter.mockClear()
  })

  test('monitorKafkaJSProducer called KafkaJSProducerPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSProducer(kafkaProducer, register)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledWith(kafkaProducer, register, undefined)
  })

  test('monitorKafkaJSProducer called KafkaJSProducerPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSProducer(kafkaProducer, register, options)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledWith(kafkaProducer, register, options)
  })

  test('monitorKafkaJSProducer called methods of KafkaJSProducerPrometheusExporter instance', () => {
    monitorKafkaJSProducer(kafkaProducer, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    const mockKafkaJSProducerPrometheusExporterInstance = mockKafkaJSProducerPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method, @typescript-eslint/no-unsafe-type-assertion
    const monitorEnableMetrics = mockKafkaJSProducerPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
