[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/christiangalsterer/kafkajs-prometheus-exporter/build.yaml)](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/actions/workflows/build.yaml)
[![Known Vulnerabilities](https://snyk.io/test/github/christiangalsterer/kafkajs-prometheus-exporter/badge.svg)](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/security/advisories)
[![npm downloads](https://img.shields.io/npm/dt/@christiangalsterer/kafkajs-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/kafkajs-prometheus-exporter)
[![npm version](https://img.shields.io/npm/v/@christiangalsterer/kafkajs-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/kafkajs-prometheus-exporter?activeTab=versions)
[![npm license](https://img.shields.io/npm/l/@christiangalsterer/kafkajs-prometheus-exporter.svg)](https://www.npmjs.com/package/@christiangalsterer/kafkajs-prometheus-exporter)
[![renovate](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://developer.mend.io/github/christiangalsterer/kafkajs-prometheus-exporter)
![github stars](https://img.shields.io/github/stars/christiangalsterer/kafkajs-prometheus-exporter.svg)

# Prometheus Exporter for KafkaJS

A prometheus exporter exposing metrics for [KafkaJS](https://kafka.js.org/).

Metrics names follow the same naming convention used by [Kafka JMX MBeans](https://kafka.apache.org/documentation/#monitoring) and [micrometer](https://github.com/micrometer-metrics/micrometer). This allows to use the same metrics in dashboards and alerts across different technology stacks, e.g. when you use Spring Boot and Node.js in different applications.

## Available Metrics
The exporter provides the following metrics.

### Producer Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_producer_connection_count|The current number of active connections established with a broker||0.8.0|
|kafka_producer_connection_creation_total|The total number of connections established with a broker||0.8.0|
|kafka_producer_connection_close_total|The total number of connections closed with a broker||0.8.0|
|kafka_producer_request_duration|The time taken for processing a producer request.|<ul><li>_broker_: The broker</li><ul>|3.1.0|
|kafka_producer_request_total|The total number of requests sent.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>|0.8.0|
|kafka_producer_request_size_total|The size of any request sent.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>|0.9.0|
|kafka_producer_request_queue_size|Size of the request queue.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>|0.8.0|


### Consumer Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_consumer_connection_count|The current number of active connections established with a broker||0.8.0|
|kafka_consumer_connection_creation_total|The total number of connections established with a broker||0.8.0|
|kafka_consumer_connection_close_total|The total number of connections closed with a broker||0.8.0|
|kafka_consumer_connection_crashed_total|The total number of crashed connections with a broker|<ul><li>_group_id_: The id of the consumer group.</li><li>_error_: The error which caused the connection crash.</li><li>_restart_: Determines if the connection was automatically restarted.</li><ul>|0.8.0|
|kafka_consumer_heartbeat_total|The total number of heartbeats with a broker|<ul><li>_group_id_: The id of the consumer group.</li><li>_member_id_: The member of the consumer group.</li><ul>|0.8.0|
|kafka_consumer_request_duration|The time taken for processing a consumer request.|<ul><li>_broker_: The broker</li><ul>|3.1.0|
|kafka_consumer_request_total|The total number of requests sent.|<ul><li>_broker_: The broker</li><ul>|0.8.0|
|kafka_consumer_request_queue_size|Size of the request queue.|<ul><li>_broker_: The broker</li><ul>|0.8.0|
|kafka_consumer_request_size_total|The size of any request sent.|<ul><li>_broker_: The broker</li><ul>|0.9.0|
|kafka_consumer_fetch_latency|The time taken for processing a fetch request.||0.8.0|
|kafka_consumer_fetch_total|The total number of fetch requests.||0.8.0|
|kafka_consumer_batch_size_total|The number of bytes received per partition per request|<ul><li>_topic_: The topic from which the messages are consumed.</li><li>_partition_: The partition of the topic from which the messages are consumed.</li><ul>|0.9.0|
|kafka_consumer_batch_latency|The time taken for processing a batch.|<ul><li>_topic_: The topic from which the messages are consumed.</li><li>_partition_: The partition of the topic from which the messages are consumed.</li><ul>|0.8.0|

### Admin Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_admin_connection_count|The current number of active connections established with a broker||1.0.0|
|kafka_admin_connection_creation_total|The total number of connections established with a broker||1.0.0|
|kafka_admin_connection_close_total|The total number of connections closed with a broker||1.0.0|
|kafka_admin_request_duration|The time taken for processing an admin request.|<ul><li>_broker_: The broker</li><ul>|3.1.0|
|kafka_admin_request_total|The total number of requests sent.|<ul><li>_broker_: The broker</li><ul>|1.0.0|
|kafka_admin_request_size_total|The size of any request sent.|<ul><li>_broker_: The broker</li><ul>|1.0.0|
|kafka_admin_request_queue_size|Size of the request queue.|<ul><li>_broker_: The broker</li><ul>|1.0.0|

## Client Id

As documented in the [KafkaJS documentation](https://kafka.js.org/docs/configuration#client-id) the client-id is a logical identifier for an application which is shared across multiple instances of the same application. Until v2.0.0 of the exporter the client_id was a dedicated parameter for _monitorKafkaJSProducer_, _monitorKafkaJSConsumer_ and _monitorKafkaJSAdmin_ respectively, but was removed starting with v2.0.0, see [changelog](/CHANGELOG.md) for details.

Until KafkaJS instrumentation events](https://kafka.js.org/docs/instrumentation-events) don't provide the client_id for all events it is **strongly** recommended to add the client_id as a default label as in the following example.

```ts
    kafkaExporter.monitorKafkaJSProducer(producer, register, { defaultLabels: {client_id:'nodejs-example-app'} })
```

## Example Output

Here an example output in the prometheus format of the provided metrics.

```sh
# HELP kafka_consumer_connection_count The current number of active connections established with a broker
# TYPE kafka_consumer_connection_count gauge
kafka_consumer_connection_count{client_id="nodejs-example-app",alice="bob"} 2

# HELP kafka_consumer_connection_creation_total The total number of connections established with a broker
# TYPE kafka_consumer_connection_creation_total counter
kafka_consumer_connection_creation_total{client_id="nodejs-example-app",alice="bob"} 2

# HELP kafka_consumer_connection_close_total The total number of connections closed with a broker
# TYPE kafka_consumer_connection_close_total counter

# HELP kafka_consumer_connection_crashed_total The total number of crashed connections with a broker
# TYPE kafka_consumer_connection_crashed_total counter

# HELP kafka_consumer_heartbeat_total The total number of heartbeats with a broker
# TYPE kafka_consumer_heartbeat_total counter
kafka_consumer_heartbeat_total{client_id="nodejs-example-app",group_id="myGroupId",member_id="nodejs-example-app-e8962841-acad-4c88-a076-f4f4fa9f27bd",alice="bob"} 7

# HELP kafka_consumer_request_total The total number of requests sent.
# TYPE kafka_consumer_request_total counter
kafka_consumer_request_total{client_id="nodejs-example-app",broker="broker1:9094",alice="bob"} 37
kafka_consumer_request_total{client_id="nodejs-example-app",broker="broker2:9094",alice="bob"} 186
kafka_consumer_request_total{client_id="nodejs-example-app",broker="broker3:9094",alice="bob"} 34

# HELP kafka_consumer_request_size_total The size of any request sent.
# TYPE kafka_consumer_request_size_total counter
kafka_consumer_request_size_total{client_id="nodejs-example-app",broker="broker1:9094",alice="bob"} 458
kafka_consumer_request_size_total{client_id="nodejs-example-app",broker="broker2:9094",alice="bob"} 40
kafka_consumer_request_size_total{client_id="nodejs-example-app",broker="broker3:9094",alice="bob"} 458

# HELP kafka_consumer_request_queue_size Size of the request queue.
# TYPE kafka_consumer_request_queue_size gauge

# HELP kafka_consumer_fetch_latency The time taken for a fetch request.
# TYPE kafka_consumer_fetch_latency histogram
kafka_consumer_fetch_latency_bucket{le="0.001",client_id="nodejs-example-app",alice="bob"} 0
kafka_consumer_fetch_latency_bucket{le="0.005",client_id="nodejs-example-app",alice="bob"} 0
kafka_consumer_fetch_latency_bucket{le="0.01",client_id="nodejs-example-app",alice="bob"} 0
kafka_consumer_fetch_latency_bucket{le="0.02",client_id="nodejs-example-app",alice="bob"} 0
kafka_consumer_fetch_latency_bucket{le="0.03",client_id="nodejs-example-app",alice="bob"} 0
kafka_consumer_fetch_latency_bucket{le="0.04",client_id="nodejs-example-app",alice="bob"} 0
kafka_consumer_fetch_latency_bucket{le="0.05",client_id="nodejs-example-app",alice="bob"} 24
kafka_consumer_fetch_latency_bucket{le="0.1",client_id="nodejs-example-app",alice="bob"} 79
kafka_consumer_fetch_latency_bucket{le="0.2",client_id="nodejs-example-app",alice="bob"} 82
kafka_consumer_fetch_latency_bucket{le="0.5",client_id="nodejs-example-app",alice="bob"} 84
kafka_consumer_fetch_latency_bucket{le="1",client_id="nodejs-example-app",alice="bob"} 86
kafka_consumer_fetch_latency_bucket{le="2",client_id="nodejs-example-app",alice="bob"} 86
kafka_consumer_fetch_latency_bucket{le="5",client_id="nodejs-example-app",alice="bob"} 86
kafka_consumer_fetch_latency_bucket{le="10",client_id="nodejs-example-app",alice="bob"} 86
kafka_consumer_fetch_latency_bucket{le="+Inf",client_id="nodejs-example-app",alice="bob"} 86
kafka_consumer_fetch_latency_sum{client_id="nodejs-example-app",alice="bob"} 6.728
kafka_consumer_fetch_latency_count{client_id="nodejs-example-app",alice="bob"} 86

# HELP kafka_consumer_fetch_total The total number of fetch requests.
# TYPE kafka_consumer_fetch_total counter
kafka_consumer_fetch_total{client_id="nodejs-example-app",alice="bob"} 86

# HELP kafka_consumer_batch_size_total The number of bytes received per partition per request
# TYPE kafka_consumer_batch_size_total counter
kafka_consumer_batch_size_total{client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 1
kafka_consumer_batch_size_total{client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 1
kafka_consumer_batch_size_total{client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 1
kafka_consumer_batch_size_total{client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 1
kafka_consumer_batch_size_total{client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 1

# HELP kafka_consumer_batch_latency The time taken for processing a batch.
# TYPE kafka_consumer_batch_latency histogram
kafka_consumer_batch_latency_bucket{le="0.001",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 21
kafka_consumer_batch_latency_bucket{le="0.005",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.01",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.02",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.03",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.04",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.05",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.1",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.2",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.5",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="1",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="2",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="5",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="10",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="+Inf",client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_sum{client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 0.12200000000000003
kafka_consumer_batch_latency_count{client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.001",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 26
kafka_consumer_batch_latency_bucket{le="0.005",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.01",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.02",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.03",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.04",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.05",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.1",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.2",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.5",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="1",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="2",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="5",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="10",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="+Inf",client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_sum{client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 0.024000000000000014
kafka_consumer_batch_latency_count{client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.001",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 25
kafka_consumer_batch_latency_bucket{le="0.005",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.01",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.02",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.03",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.04",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.05",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.1",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.2",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.5",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="1",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="2",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="5",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="10",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="+Inf",client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_sum{client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 0.025000000000000012
kafka_consumer_batch_latency_count{client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.001",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 21
kafka_consumer_batch_latency_bucket{le="0.005",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.01",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.02",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.03",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.04",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.05",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.1",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.2",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.5",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="1",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="2",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="5",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="10",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="+Inf",client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_sum{client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 0.039000000000000014
kafka_consumer_batch_latency_count{client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 27
kafka_consumer_batch_latency_bucket{le="0.001",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 26
kafka_consumer_batch_latency_bucket{le="0.005",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.01",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.02",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.03",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.04",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.05",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.1",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.2",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="0.5",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="1",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="2",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="5",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="10",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_bucket{le="+Inf",client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28
kafka_consumer_batch_latency_sum{client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 0.023000000000000013
kafka_consumer_batch_latency_count{client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 28

# HELP kafka_producer_connection_count The current number of active connections established with a broker
# TYPE kafka_producer_connection_count gauge
kafka_producer_connection_count{client_id="nodejs-example-app",foo="bar"} 342

# HELP kafka_producer_connection_creation_total The total number of connections established with a broker
# TYPE kafka_producer_connection_creation_total counter
kafka_producer_connection_creation_total{client_id="nodejs-example-app",foo="bar"} 342

# HELP kafka_producer_connection_close_total The total number of connections closed with a broker
# TYPE kafka_producer_connection_close_total counter

# HELP kafka_producer_request_total The total number of requests sent.
# TYPE kafka_producer_request_total counter
kafka_producer_request_total{client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 72
kafka_producer_request_total{client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 139
kafka_producer_request_total{client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 139

# HELP kafka_producer_request_size_total The size of any request sent.
# TYPE kafka_producer_request_size_total counter
kafka_producer_request_size_total{client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 649
kafka_producer_request_size_total{client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 457
kafka_producer_request_size_total{client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 585

# HELP kafka_producer_request_queue_size Size of the request queue.
# TYPE kafka_producer_request_queue_size gauge

# HELP kafka_admin_connection_count The current number of active connections established with a broker
# TYPE kafka_admin_connection_count gauge
kafka_admin_connection_count{client_id="nodejs-example-app",foo="bar"} 0

# HELP kafka_admin_connection_creation_total The total number of connections established with a broker
# TYPE kafka_admin_connection_creation_total counter
kafka_admin_connection_creation_total{client_id="nodejs-example-app",foo="bar"} 11

# HELP kafka_admin_connection_close_total The total number of connections closed with a broker
# TYPE kafka_admin_connection_close_total counter
kafka_admin_connection_close_total{client_id="nodejs-example-app",foo="bar"} 11

# HELP kafka_admin_request_total The total number of requests sent.
# TYPE kafka_admin_request_total counter
kafka_admin_request_total{client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 32
kafka_admin_request_total{client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 4
kafka_admin_request_total{client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 8

# HELP kafka_admin_request_size_total The size of any request sent.
# TYPE kafka_admin_request_size_total counter
kafka_admin_request_size_total{client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 5499
kafka_admin_request_size_total{client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 687
kafka_admin_request_size_total{client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 1376

# HELP kafka_admin_request_queue_size Size of the request queue.
# TYPE kafka_admin_request_queue_size gauge
```

# Usage

## Add Dependency

Add the following dependency to your project to download the package from [npm](https://www.npmjs.com/package/@christiangalsterer/kafkajs-prometheus-exporter).

```sh
npm i @christiangalsterer/kafkajs-prometheus-exporter
```

## TypeScript

The following example illustrates how to use the exporter to enable monitoring for the KafkaJS.

```ts
import { Kafka } from "kafkajs";
import { Registry, collectDefaultMetrics } from "prom-client";
import { monitorKafkaJSProducer, monitorKafkaJSConsumer, monitorKafkaJSAdmin } from "@christiangalsterer/kafkajs-prometheus-exporter";

...

// set up the KafkaJS client
const clientId = 'myClientId'
const kafka = new Kafka({
    clientId: clientId,
    brokers: ['localhost:9094'],
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'myGroupId' })
const admin = kafka.admin()

// set up the prometheus client
const register = new Registry();
collectDefaultMetrics({ register })

// monitor KafkaJS producer
monitorKafkaJSProducer(producer, register, { defaultLabels: {client_id: clientId} })

// monitor KafkaJS consumer
monitorKafkaJSConsumer(consumer, register, { defaultLabels: {client_id: clientId} })

// monitor KafkaJS admin
kafkaExporter.monitorKafkaJSAdmin(admin, register, { defaultLabels: {client_id: clientId} })

...

// connect to Kafka *after* calling monitorKafkaJSProducer() / monitorKafkaJSConsumer / monitorKafkaJSAdmin
await producer.connect()
await consumer.connect()
await admin.connect()
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
const admin = kafka.admin()

// set up the prometheus client
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();
collectDefaultMetrics({ register });

// monitor KafkaJS producer
kafkaExporter.monitorKafkaJSProducer(producer, register, { defaultLabels: {client_id: clientId} })

// monitor KafkaJS consumer
kafkaExporter.monitorKafkaJSConsumer(consumer, register, { defaultLabels: {client_id: clientId} })

// monitor KafkaJS admin
kafkaExporter.monitorKafkaJSAdmin(admin, register, { defaultLabels: {client_id: clientId} })

...

// connect to Kafka *after* calling monitorKafkaJSProducer() / monitorKafkaJSConsumer / monitorKafkaJSAdmin
await producer.connect()
await consumer.connect()
await admin.connect()
```

# Configuration

The exporter can be configured via properties specified on the optional parameter of type 
_KafkaJSProducerExporterOptions_, _KafkaJSConsumerExporterOptions_ and _KafkaJSAdminExporterOptions_ respectively.

## KafkaJSProducerExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| producerRequestDurationHistogramBuckets | Buckets for the kafka_producer_request_duration metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 3.1.0|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 0.8.0 |

## KafkaJSConsumerExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| consumerRequestDurationHistogramBuckets | Buckets for the kafka_consumer_request_duration metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 3.1.0|
| consumerBatchLatencyHistogramBuckets | Buckets for the kafka_consumer_batch_latency metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 0.8.0|
| consumerFetchLatencyHistogramBuckets | Buckets for the kafka_consumer_fetch_latency metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 0.8.0|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 0.8.0|

## KafkaJSAdminExporterOptions

|property|Description|Example|Since |
|---|---|---|---|
| adminRequestDurationHistogramBuckets | Buckets for the kafka_admin_request_duration metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 3.1.0|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 1.0.0 |

# Grafana Dashboard

An example dashboard for Grafana is available [here](/docs/grafana/dashboard.json) displaying the provided metrics by the exporter.

Here an example for KafkaJS producer metrics:
![Grafana:KafkaJS Producer Metrics](/docs/images/grafana_kafkajs_producer_1.png "Grafana: KafkaJS Producer Metrics")

Here an example for KafkaJS consumer metrics:
![Grafana:KafkaJS Consumer Metrics](/docs/images/grafana_kafkajs_consumer_1.png "Grafana: KafkaJS Consumers Metrics")

Here an example for KafkaJS admin metrics:
![Grafana:KafkaJS Admin Metrics](/docs/images/grafana_kafkajs_admin_1.png "Grafana: KafkaJS Admin Metrics")


# Changelog

The changes to project can be found in the [changelog](/CHANGELOG.md).

# Compatibility
The following table list the compatibility of exporter versions with different KafkaJS and prom-client versions.

|Exporter Version|KafkaJS Version|prom-client version|
|---|---|---|
|^1.0.0|^2.2.4|^14.2.0|
|^2.0.0|^2.2.4|^14.2.0|
|^3.0.0|^2.2.4|^15.0.0|
|^3.1.0|^2.2.4|^15.0.0|

# Contributions

Contributions are highly welcome. If you want to contribute to this project please follow the steps described in the [contribution guidelines](/CONTRIBUTING.md).

# Projects Using The Exporter

If you want to support this project, please add a link to your project and/or company when you use this exporter.

# Related Projects

If you are looking for a way to monitor your MongoDB Driver for Node.js you may have a look at https://github.com/christiangalsterer/mongodb-driver-prometheus-exporter.

If you are looking for a way to monitor node-postgres you may have a look at https://github.com/christiangalsterer/node-postgres-prometheus-exporter.
