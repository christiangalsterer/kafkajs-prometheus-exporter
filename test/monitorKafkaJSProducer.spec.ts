import { beforeEach, describe, expect, test, jest } from '@jest/globals'
import { Registry } from 'prom-client'

import { monitorKafkaJSProducer } from '../src/monitorKafkaJSProducer'
import { KafkaJSProducerPrometheusExporter } from '../src/kafkaJSProducerPrometheusExporter'
import { type Producer } from 'kafkajs'

jest.mock('../src/kafkaJSProducerPrometheusExporter')
const mockKafkaJSProducerPrometheusExporter = jest.mocked(KafkaJSProducerPrometheusExporter)

describe('tests monitorKafkaProducerJS', () => {
  const clientId = 'myTestClientId'
  let kafkaProducer: Producer
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSProducerPrometheusExporter.mockClear()
  })

  test('tests if monitorKafkaJSProducer called KafkaJSProducerPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSProducer(kafkaProducer, clientId, register)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSProducerPrometheusExporter).toBeCalledWith(kafkaProducer, clientId, register, undefined)
  })

  test('tests if monitorKafkaJSProducer called KafkaJSProducerPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSProducer(kafkaProducer, clientId, register, options)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSProducerPrometheusExporter).toBeCalledWith(kafkaProducer, clientId, register, options)
  })

  test('tests if monitorKafkaJSProducer called methods of KafkaJSProducerPrometheusExporter instance', () => {
    monitorKafkaJSProducer(kafkaProducer, clientId, register)
    const mockKafkaJSProducerPrometheusExporterInstance = mockKafkaJSProducerPrometheusExporter.mock.instances[0]
    const monitorEnableMetrics = mockKafkaJSProducerPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
