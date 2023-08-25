![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/kafkajs-prometheus-exporter.svg)
![npm version](https://img.shields.io/npm/v/@christiangalsterer/kafkajs-prometheus-exporter.svg)
![npm licence](https://img.shields.io/npm/l/@christiangalsterer/kafkajs-prometheus-exporter.svg)
![github stars](https://img.shields.io/github/stars/christiangalsterer/kafkajs-prometheus-exporter.svg)
![Known Vulnerabilities](https://snyk.io/test/github/christiangalsterer/kafkajs-prometheus-exporter/badge.svg)

# Prometheus Exporter for KafkaJS

A prometheus exporter exposing metrics for [KafkaJS](https://kafka.js.org/).

Metrics names follow the same naming convention used by [Kafka JMX MBeans](https://kafka.apache.org/documentation/#monitoring) and [micrometer](https://github.com/micrometer-metrics/micrometer). This allows to use the same metrics in dashboards and alerts across different technology stacks, e.g. when you use Spring Boot and Node.js in different applications.

## Available Metrics
The exporter provides the following metrics.

### Producer Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_producer_connection_count|The current number of active connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_producer_connection_creation_total|The total number of connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_producer_connection_close_total|The total number of connections closed with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_producer_request_total|The total number of requests sent.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>||
|kafka_producer_request_queue_size|Size of the request queue.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>||


### Consumer Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_consumer_connection_count|The current number of active connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_connection_creation_total|The total number of connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_connection_close_total|The total number of connections closed with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_connection_crashed_total|The total number of crashed connections with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_error_: The error which caused the connection crash.</li><li>_restart_: Determines of the connection was automatically restarted.</li><ul>||
|kafka_consumer_heartbeat_total|The total numer of heartbeats with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_group_id_: The id of the consumer group.</li><li>_member_id_: The member of the consumer group.</li><ul>||
|kafka_consumer_request_queue_size|Size of the request queue.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>||
|kafka_consumer_request_total|The total number of requests sent.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>||
|kafka_consumer_fetch_latency_max|The max time taken for a fetch request.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_fetch_total|The total number of fetch requests.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_batch_size_max|The max number of bytes received per partition per request|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_topic_: The topic from which the messages are consumed.</li><li>_partition_: The partition of the topic from which the messages are consumed.</li><ul>||
|kafka_consumer_batch_latency_max|The max time taken for processing a batch.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_topic_: The topic from which the messages are consumed.</li><li>_partition_: The partition of the topic from which the messages are consumed.</li><ul>||

## Example Output

Here an example output in the prometheus format of the provided metrics.

```sh

```

# Usage

## Add Dependency

Add the following dependency to your project.

```sh
npm i @christiangalsterer/kafkajs-prometheus-exporter
```

## TypeScript

The following example illustrates how to use the exporter to enable monitoring for the KafkaJS.

```ts
import { Kafka } from "kafkjs";
import { Registry, collectDefaultMetrics } from "prom-client";
import { monitorKafkaJSProducer, monitorKafkaJSConsumer } from "@christiangalsterer/kafkajs-prometheus-exporter";

...

// set up the KafkaJS client
const clientId = 'myClientId'
const kafka = new Kafka({
    clientId: clientId,
    brokers: ['localhost:9094'],
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'myGroupId' })

// set up the prometheus client
const register = new Registry();
collectDefaultMetrics({ register });

// monitor KafkaJS producer
monitorKafkaJSProducer(producer, clientId, register);

// monitor KafkaJS consumer
monitorKafkaJSConsumer(consumer, clientId, register);

...

// connect to Kafka after calling monitorKafkaJSProducer() and/or monitorKafkaJSConsumer
await producer.connect()
await consumer.connect()
```
## JavaScript

The following example illustrates how to use the exporter to enable monitoring for KafkaJS.

```js
const Kafka = require('kafkajs')
const promClient = require( 'prom-client');
const kafkaExporter = require('@christiangalsterer/kafkajs-prometheus-exporter')

...

// set up the KafkaJS client
const clientId = 'myClientId'
const kafka = new Kafka({
    clientId: clientId,
    brokers: ['localhost:9094'],
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'myGroupId' })

// set up the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor KafkaJS producer
kafkaExporter.monitorKafkaJSProducer(producer, clientId, register)

// monitor KafkaJS consumer
kafkaExporter.monitorKafkaJSConsumer(consumer, clientId, register)

...

// connect to Kafka *after* calling monitorKafkaJSProducer() and/or monitorKafkaJSConsumer
await producer.connect()
await consumer.connect()
```

# Configuration

The exporter can be configured via properties specified on the optional parameter of type 
_KafkaJSProducerExporterOptions_ and _KafkaJSConsumerExporterOptions_ respectively.

## KafkaJSProducerExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} |  |

## KafkaJSConsumerExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} |  |

# Grafana Dashboard

An example dashboard for Grafana is available [here](/docs/grafana/dashbaord.json) displaying the provided metrics by the exporter.

Here an example for KafkaJS producer metrics:
![Grafana:KafkaJS Producer Metrics](/docs/images/grafana_kafkajs_producer_1.png "Grafana: KafkaJS Producer Metrics")

Here an example for KafkaJS consumer metrics:
![Grafana:KafkaJS Consumer Metrics](/docs/images/grafana_kafkajs_consumer_1.png "Grafana: KafkaJS Consumers Metrics")


# Changelog

The changes to project can be found in the [changelog](/CHANGELOG.md).

# Contributions

Contributions are highly welcomed. If you want to contribute to this project please create a github issue and/or provide a pull request for review.

# Related Projects

If you are looking for a way to monitor your MongoDB Driver for Node.js you may have a look at https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter
