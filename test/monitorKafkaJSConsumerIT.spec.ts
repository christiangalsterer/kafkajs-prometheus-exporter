import { beforeEach, describe, expect, test } from '@jest/globals'
import { KafkaContainer, type StartedKafkaContainer } from '@testcontainers/kafka'
import { type Consumer, Kafka, type Producer } from 'kafkajs'
import { Registry } from 'prom-client'

import { monitorKafkaJSConsumer } from '../src/monitorKafkaJSConsumer'
import { consumerMetrics } from './constants'

describe('it monitorKafkaJSConsumer', () => {
  const clientId = 'myTestClientId'
  const KAFKA_PORT = 9093
  const KAFKA_TEST_TOPIC = 'test-topic'
  const KAFKA_GROUP_ID = 'test-group'
  let register: Registry
  let consumer: Consumer
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
    const options = { defaultLabels: { foo: 'bar', alice: 2 } }
    register = new Registry()
    consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID, allowAutoTopicCreation: true })
    producer = kafka.producer()
    monitorKafkaJSConsumer(consumer, register, options)
  })

  test('it kafka consumer connection metrics', async () => {
    await consumer.connect()

    const kafkaConsumerConnectionCount = await register.getSingleMetric('kafka_consumer_connection_count')?.get()
    expect(kafkaConsumerConnectionCount?.type).toEqual('gauge')
    expect(kafkaConsumerConnectionCount?.values.length).toEqual(1)
    expect(kafkaConsumerConnectionCount?.values.at(0)?.value).toEqual(1)

    const kafkaConsumerConnectionCreationTotal = await register.getSingleMetric('kafka_consumer_connection_creation_total')?.get()
    expect(kafkaConsumerConnectionCreationTotal?.type).toEqual('counter')
    expect(kafkaConsumerConnectionCreationTotal?.values.length).toEqual(1)
    expect(kafkaConsumerConnectionCreationTotal?.values.at(0)?.value).toEqual(1)

    await consumer.disconnect()

    const kafkaConsumerConnectionCloseTotal = await register.getSingleMetric('kafka_consumer_connection_close_total')?.get()
    expect(kafkaConsumerConnectionCloseTotal?.type).toEqual('counter')
    expect(kafkaConsumerConnectionCloseTotal?.values.length).toEqual(1)
    expect(kafkaConsumerConnectionCloseTotal?.values.at(0)?.value).toEqual(1)
  })

  test('it kafka consumer request metrics', async () => {
    await consumer.connect()
    await consumer.subscribe({ topics: [KAFKA_TEST_TOPIC], fromBeginning: true })
    await producer.connect()
    const KAFKA_MESSAGE = 'Hello from the KafkaJS user!'
    await producer.send({
      topic: KAFKA_TEST_TOPIC,
      messages: [{ value: KAFKA_MESSAGE }]
    })

    // eslint-disable-next-line promise/avoid-new
    const consumedMessage = await new Promise((resolve) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      consumer.run({
        // eslint-disable-next-line @typescript-eslint/require-await
        eachMessage: async ({ message }) => {
          resolve(message.value?.toString())
        }
      })
    })

    const kafkaConsumerRequestTotal = await register.getSingleMetric('kafka_consumer_request_total')?.get()
    
    expect(kafkaConsumerRequestTotal?.type).toEqual('counter')
    expect(kafkaConsumerRequestTotal?.values.length).toEqual(1)
    expect(kafkaConsumerRequestTotal?.values.at(0)?.value).toBeGreaterThan(0)
    expect(consumedMessage).toEqual(KAFKA_MESSAGE)

    // await consumer.run({
    //   eachMessage: async () => {
    //     const kafkaConsumerRequestTotal = await register.getSingleMetric('kafka_consumer_request_total')?.get()
    //     expect(kafkaConsumerRequestTotal?.type).toEqual('counter')
    //     expect(kafkaConsumerRequestTotal?.values.length).toEqual(1000)
    //     expect(kafkaConsumerRequestTotal?.values.at(0)?.value).toBeGreaterThan(0)
    //   }
    // })

    await consumer.disconnect()
    await consumer.disconnect()
    await producer.disconnect()
  })

  test.each(consumerMetrics)('it kafka consumer metric "%s" is emitted with default labels', async (metric) => {
    const expectedLabels = { foo: 'bar', alice: 2 }

    await consumer.connect()
    await consumer.subscribe({ topics: [KAFKA_TEST_TOPIC], fromBeginning: true })
    await producer.connect()
    const KAFKA_MESSAGE = 'Hello from the KafkaJS user!'
    await producer.send({
      topic: KAFKA_TEST_TOPIC,
      messages: [{ value: KAFKA_MESSAGE }]
    })

    await consumer.disconnect()
    await producer.disconnect()

    const metrics = await register.getMetricsAsJSON()
    console.log(metrics.length)
    for (const metric of metrics) {
      for (const value of metric.values) {
        expect(value.labels).toMatchObject(expectedLabels)
      }
    }
  })
})
