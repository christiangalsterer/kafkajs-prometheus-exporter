import { beforeEach, describe, expect, test } from '@jest/globals'
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka'
import { Kafka, type Producer } from 'kafkajs'
import { Registry } from 'prom-client'

import { monitorKafkaJSProducer } from '../src/monitorKafkaJSProducer'

describe('it monitorKafkaJSProducer', () => {
  const clientId = 'myTestClientId'
  const KAFKA_PORT = 9093
  const KAFKA_TEST_TOPIC = 'test-topic'
  let register: Registry
  let producer: Producer
  let kafka: Kafka
  let kafkaContainer: StartedKafkaContainer

  beforeAll(async () => {
    kafkaContainer = await new KafkaContainer().withExposedPorts(KAFKA_PORT).start()
    kafka = new Kafka({
      clientId,
      brokers: [`${kafkaContainer.getHost()}:${kafkaContainer.getMappedPort(KAFKA_PORT).toString()}`]
    })
  }, 60000)

  afterAll(async () => {
    await kafkaContainer.stop()
  })

  beforeEach(() => {
    register = new Registry()
    producer = kafka.producer()

    monitorKafkaJSProducer(producer, register)
  })

  test('it kafka producer connection metrics', async () => {
    await producer.connect()

    const kafkaProducerConnectionCount = await register.getSingleMetric('kafka_producer_connection_count')?.get()
    expect(kafkaProducerConnectionCount?.type).toEqual('gauge')
    expect(kafkaProducerConnectionCount?.values.length).toEqual(1)
    expect(kafkaProducerConnectionCount?.values.at(0)?.value).toEqual(1)

    const kafkaProducerConnectionCreationTotal = await register.getSingleMetric('kafka_producer_connection_creation_total')?.get()
    expect(kafkaProducerConnectionCreationTotal?.type).toEqual('counter')
    expect(kafkaProducerConnectionCreationTotal?.values.length).toEqual(1)
    expect(kafkaProducerConnectionCreationTotal?.values.at(0)?.value).toEqual(1)

    await producer.disconnect()

    const kafkaProducerConnectionCloseTotal = await register.getSingleMetric('kafka_producer_connection_close_total')?.get()
    expect(kafkaProducerConnectionCloseTotal?.type).toEqual('counter')
    expect(kafkaProducerConnectionCloseTotal?.values.length).toEqual(1)
    expect(kafkaProducerConnectionCloseTotal?.values.at(0)?.value).toEqual(1)
  })

  test('it kafka producer request metrics', async () => {
    await producer.connect()
    await producer.send({
      topic: KAFKA_TEST_TOPIC,
      messages: [{ value: 'Hello from the KafkaJS user!' }]
    })

    const kafkaProducerRequestTotal = await register.getSingleMetric('kafka_producer_request_total')?.get()
    expect(kafkaProducerRequestTotal?.type).toEqual('counter')
    expect(kafkaProducerRequestTotal?.values.length).toEqual(1)
    expect(kafkaProducerRequestTotal?.values.at(0)?.value).toBeGreaterThan(0)

    await producer.disconnect()
  })
})
