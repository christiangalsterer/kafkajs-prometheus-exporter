import { beforeEach, describe, expect, test, jest } from '@jest/globals'
import { Registry } from 'prom-client'

import { monitorKafkaJSAdmin } from '../src/monitorKafkaJSAdmin'
import { KafkaJSAdminPrometheusExporter } from '../src/kafkaJSAdminPrometheusExporter'
import { type Admin } from 'kafkajs'

jest.mock('../src/kafkaJSAdminPrometheusExporter')
const mockKafkaJSAdminPrometheusExporter = jest.mocked(KafkaJSAdminPrometheusExporter)

describe('tests monitorKafkaAdminJS', () => {
  let kafkaAdmin: Admin
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSAdminPrometheusExporter.mockClear()
  })

  test('tests if monitorKafkaJSAdmin called KafkaJSAdminPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSAdmin(kafkaAdmin, register)
    expect(mockKafkaJSAdminPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSAdminPrometheusExporter).toBeCalledWith(kafkaAdmin, register, undefined)
  })

  test('tests if monitorKafkaJSAdmin called KafkaJSAdminPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSAdmin(kafkaAdmin, register, options)
    expect(mockKafkaJSAdminPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSAdminPrometheusExporter).toBeCalledWith(kafkaAdmin, register, options)
  })

  test('tests if monitorKafkaJSAdmin called methods of KafkaJSAdminPrometheusExporter instance', () => {
    monitorKafkaJSAdmin(kafkaAdmin, register)
    const mockKafkaJSAdminPrometheusExporterInstance = mockKafkaJSAdminPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockKafkaJSAdminPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
