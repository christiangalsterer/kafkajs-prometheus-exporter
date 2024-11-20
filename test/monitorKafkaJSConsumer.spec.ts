import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import type { Consumer } from 'kafkajs'
import { Registry } from 'prom-client'

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

  test('monitorKafkaJSConsumer called KafkaJSConsumerPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSConsumer(kafkaConsumer, register)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledWith(kafkaConsumer, register, undefined)
  })

  test('monitorKafkaJSConsumer called KafkaJSConsumerPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSConsumer(kafkaConsumer, register, options)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledWith(kafkaConsumer, register, options)
  })

  test('monitorKafkaJSConsumer called methods of KafkaJSConsumerPrometheusExporter instance', () => {
    monitorKafkaJSConsumer(kafkaConsumer, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    const mockKafkaJSConsumerPrometheusExporterInstance = mockKafkaJSConsumerPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method, @typescript-eslint/no-unsafe-type-assertion
    const monitorEnableMetrics = mockKafkaJSConsumerPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
