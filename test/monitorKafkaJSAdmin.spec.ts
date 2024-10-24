import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import type { Admin } from 'kafkajs'
import { Registry } from 'prom-client'

import { KafkaJSAdminPrometheusExporter } from '../src/kafkaJSAdminPrometheusExporter'
import { monitorKafkaJSAdmin } from '../src/monitorKafkaJSAdmin'

jest.mock('../src/kafkaJSAdminPrometheusExporter')
const mockKafkaJSAdminPrometheusExporter = jest.mocked(KafkaJSAdminPrometheusExporter)

describe('tests monitorKafkaAdminJS', () => {
  let kafkaAdmin: Admin
  let register: Registry

  beforeEach(() => {
    register = new Registry()
    mockKafkaJSAdminPrometheusExporter.mockClear()
  })

  test('monitorKafkaJSAdmin called KafkaJSAdminPrometheusExporter with mandatory parameter', () => {
    monitorKafkaJSAdmin(kafkaAdmin, register)
    expect(mockKafkaJSAdminPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSAdminPrometheusExporter).toHaveBeenCalledWith(kafkaAdmin, register, undefined)
  })

  test('monitorKafkaJSAdmin called KafkaJSAdminPrometheusExporter with optional parameter', () => {
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    monitorKafkaJSAdmin(kafkaAdmin, register, options)
    expect(mockKafkaJSAdminPrometheusExporter).toHaveBeenCalledTimes(1)
    expect(mockKafkaJSAdminPrometheusExporter).toHaveBeenCalledWith(kafkaAdmin, register, options)
  })

  test('monitorKafkaJSAdmin called methods of KafkaJSAdminPrometheusExporter instance', () => {
    monitorKafkaJSAdmin(kafkaAdmin, register)
    // eslint-disable-next-line @typescript-eslint/prefer-destructuring
    const mockKafkaJSAdminPrometheusExporterInstance = mockKafkaJSAdminPrometheusExporter.mock.instances[0]
    // eslint-disable-next-line jest/unbound-method
    const monitorEnableMetrics = mockKafkaJSAdminPrometheusExporterInstance.enableMetrics as jest.Mock
    expect(monitorEnableMetrics).toHaveBeenCalledTimes(1)
  })
})
