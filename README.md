![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/kafkajs-prometheus-exporter.svg)
![npm version](https://img.shields.io/npm/v/@christiangalsterer/kafkajs-prometheus-exporter.svg)
![npm licence](https://img.shields.io/npm/l/@christiangalsterer/kafkajs-prometheus-exporter.svg)
![github stars](https://img.shields.io/github/stars/christiangalsterer/kafkajs-prometheus-exporter.svg)
![Known Vulnerabilities](https://snyk.io/test/github/christiangalsterer/kafkajs-prometheus-exporter/badge.svg)

# Prometheus Exporter for KafkaJS

A prometheus exporter exposing metrics for [KafkaJS](https://kafka.js.org/).

Metrics names follow the same naming convention used by [micrometer](https://github.com/micrometer-metrics/micrometer). This allows to use the same metrics in dashboards and alerts across different technology stacks, e.g. when you use Spring Boot and Node.js in different applications.

## Available Metrics
The exporter provides the following metrics.

### Consumer Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_consumer_connections|The current number of active connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_connection_creation_total|The total number of connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_connection_close_total|The total number of connections closed with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>||
|kafka_consumer_connection_crashed_total|The total number of crashed connections with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_error_: The error which caused the connection crash.</li><li>_restart_: Determines of the connection was automatically restarted.</li><ul>||
|kafka_consumer_heartbeats|The total numer of heartbeats with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_group_id_: The id of the consumer group.</li><li>_member_id_: The member of the consumer group.</li><ul>||
|kafka_consumer_request_queue_size|Size of the request queue.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>||
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

The following example illustrates how to use the exporter to enable monitoring for the MongoDB Node.js driver.

```ts
import { MongoClient } from "mongodb";
import { Registry, collectDefaultMetrics } from "prom-client";
import { monitorMongoDBDriver } from "@christiangalsterer/kafkajs-prometheus-exporter";

...

// set up the MongoDB client, monitorCommands needs to be set to true to enable command monitoring.
const mongoClient = new MongoClient("mongodb", { monitorCommands: true })

// set up the prometheus client
const register = new Registry();
collectDefaultMetrics({ register });

// monitor KafkaJS
monitorMongoDBDriver(mongoClient, register);

...

// connect to Kafka after calling monitorMongoDBDriver()
mongoClient.connect();
```
## JavaScript

The following example illustrates how to use the exporter to enable monitoring for the MongoDB Node.js driver.

```js
const MongoClient = require('mongodb');
const promClient = require( 'prom-client');
const exporter = require('@christiangalsterer/kafkajs-prometheus-exporter')

...

// set up the MongoDB client, monitorCommands needs to be set to true to enable command monitoring.
const mongoClient = new MongoClient("mongodb", { monitorCommands: true })

// set up the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor KafkaJS
exporter.monitorMongoDBDriver(client, register);

...

// connect to Kafka after calling monitorMongoDBDriver()
mongoClient.connect();
```

# Configuration

The exporter can be configured via properties specified on the optional parameter of type 
_MongoDBDriverExporterOptions_.

|property|Description|Example|Since |
|---|---|---|---|
| mongodbDriverCommandsSecondsHistogramBuckets | Buckets for the mongodb_driver_commands_seconds_bucket metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 1.0.0|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 1.1.0 |


# Grafana Dashboard

An example dashboard for Grafana is available [here](/docs/grafana/dashbaord.json) displaying the provided metrics by the exporter.

Here an example for collection metrics:
![Grafana:Collection Metrics](/docs/images/grafana_mongodb_driver_collections_1.png "Grafana: Collection Metrics")

Here an example for command metrics:
![Grafana:Commands Metrics](/docs/images/grafana_mongodb_driver_commands_1.png "Grafana: Command Metrics")


# Changelog

The changes to project can be found in the [changelog](/CHANGELOG.md).

# Contributions

Contributions are highly welcomed. If you want to contribute to this project please create a github issue and/or provide a pull request for review.

