import { beforeEach, describe, expect, test, jest } from '@jest/globals'
import { Registry } from 'prom-client'

import { monitorKafkaJSConsumer } from '../src/monitorKafkaJSConsumer'
import { KafkaJSConsumerPrometheusExporter } from '../src/kafkaJSConsumerPrometheusExporter'
import { type Consumer } from 'kafkajs'

jest.mock('../src/kafkaJSConsumerPrometheusExporter')
const mockKafkaJSConsumerPrometheusExporter = jest.mocked(KafkaJSConsumerPrometheusExporter)

describe('tests monitorKafkaConsumerJS', () => {
  const clientId = 'myTestClientId'
  let kafkaConsumer: Consumer
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSConsumerPrometheusExporter.mockClear()
  })

  test('tests if monitorKafkaJSConsumer called KafkaJSConsumerPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSConsumer(kafkaConsumer, clientId, register)
    expect(mockKafkaJSConsumerPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSConsumerPrometheusExporter).toBeCalledWith(kafkaConsumer, clientId, register)
  })

  test('tests if monitorKafkaJSConsumer called methods of KafkaJSConsumerPrometheusExporter instance', () => {
    monitorKafkaJSConsumer(kafkaConsumer, clientId, register)
    const mockKafkaJSConsumerPrometheusExporterInstance = mockKafkaJSConsumerPrometheusExporter.mock.instances[0]
    const monitorEnableMetrics = mockKafkaJSConsumerPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
