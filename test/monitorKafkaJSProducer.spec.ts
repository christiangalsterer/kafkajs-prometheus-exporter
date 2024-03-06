import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { type Producer } from 'kafkajs'
import { Registry } from 'prom-client'

import { KafkaJSProducerPrometheusExporter } from '../src/kafkaJSProducerPrometheusExporter'
import { monitorKafkaJSProducer } from '../src/monitorKafkaJSProducer'

jest.mock('../src/kafkaJSProducerPrometheusExporter')
const mockKafkaJSProducerPrometheusExporter = jest.mocked(KafkaJSProducerPrometheusExporter)

describe('tests monitorKafkaProducerJS', () => {
  let kafkaProducer: Producer
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSProducerPrometheusExporter.mockClear()
  })

  test('tests if monitorKafkaJSProducer called KafkaJSProducerPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSProducer(kafkaProducer, register)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledWith(kafkaProducer, register, undefined)
  })

  test('tests if monitorKafkaJSProducer called KafkaJSProducerPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSProducer(kafkaProducer, register, options)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSProducerPrometheusExporter).toHaveBeenCalledWith(kafkaProducer, register, options)
  })

  test('tests if monitorKafkaJSProducer called methods of KafkaJSProducerPrometheusExporter instance', () => {
    monitorKafkaJSProducer(kafkaProducer, register)
    const mockKafkaJSProducerPrometheusExporterInstance = mockKafkaJSProducerPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockKafkaJSProducerPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
