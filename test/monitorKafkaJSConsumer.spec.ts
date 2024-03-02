import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { Registry } from 'prom-client'

import { type Consumer } from 'kafkajs'
import { KafkaJSConsumerPrometheusExporter } from '../src/kafkaJSConsumerPrometheusExporter'
import { monitorKafkaJSConsumer } from '../src/monitorKafkaJSConsumer'

jest.mock('../src/kafkaJSConsumerPrometheusExporter')
const mockKafkaJSConsumerPrometheusExporter = jest.mocked(KafkaJSConsumerPrometheusExporter)

describe('tests monitorKafkaConsumerJS', () => {
  let kafkaConsumer: Consumer
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSConsumerPrometheusExporter.mockClear()
  })

  test('tests if monitorKafkaJSConsumer called KafkaJSConsumerPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSConsumer(kafkaConsumer, register)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSConsumerPrometheusExporter).toBeCalledWith(kafkaConsumer, register, undefined)
  })

  test('tests if monitorKafkaJSConsumer called KafkaJSConsumerPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSConsumer(kafkaConsumer, register, options)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSConsumerPrometheusExporter).toBeCalledWith(kafkaConsumer, register, options)
  })

  test('tests if monitorKafkaJSConsumer called methods of KafkaJSConsumerPrometheusExporter instance', () => {
    monitorKafkaJSConsumer(kafkaConsumer, register)
    const mockKafkaJSConsumerPrometheusExporterInstance = mockKafkaJSConsumerPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockKafkaJSConsumerPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
