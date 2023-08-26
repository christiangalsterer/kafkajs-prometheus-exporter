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
|kafka_producer_connection_count|The current number of active connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_producer_connection_creation_total|The total number of connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_producer_connection_close_total|The total number of connections closed with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_producer_request_total|The total number of requests sent.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>||
|kafka_producer_request_queue_size|Size of the request queue.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>|0.8.0|


### Consumer Metrics

|Metric Name|Description|Labels|Since|
|---|---|---|---|
|kafka_consumer_connection_count|The current number of active connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_consumer_connection_creation_total|The total number of connections established with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_consumer_connection_close_total|The total number of connections closed with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_consumer_connection_crashed_total|The total number of crashed connections with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_error_: The error which caused the connection crash.</li><li>_restart_: Determines of the connection was automatically restarted.</li><ul>|0.8.0|
|kafka_consumer_heartbeat_total|The total numer of heartbeats with a broker|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_group_id_: The id of the consumer group.</li><li>_member_id_: The member of the consumer group.</li><ul>|0.8.0|
|kafka_consumer_request_queue_size|Size of the request queue.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>|0.8.0|
|kafka_consumer_request_total|The total number of requests sent.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_broker_: The broker</li><ul>|0.8.0|
|kafka_consumer_fetch_latency|The time taken for a fetch request.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_consumer_fetch_total|The total number of fetch requests.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><ul>|0.8.0|
|kafka_consumer_batch_size_max|The max number of bytes received per partition per request|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_topic_: The topic from which the messages are consumed.</li><li>_partition_: The partition of the topic from which the messages are consumed.</li><ul>||
|kafka_consumer_batch_latency|The time taken for processing a batch.|<ul><li>_client_id_: An id string to pass to the server when making requests. The purpose of this is to be able to track the source of requests beyond just ip/port by allowing a logical application name. The client_id is shared across multiple instances of the same application.</li><li>_topic_: The topic from which the messages are consumed.</li><li>_partition_: The partition of the topic from which the messages are consumed.</li><ul>|0.8.0|

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

# HELP kafka_consumer_heartbeat_total The total numer of heartbeats with a broker
# TYPE kafka_consumer_heartbeat_total counter
kafka_consumer_heartbeat_total{client_id="nodejs-example-app",group_id="group-1",member_id="nodejs-example-app-e8962841-acad-4c88-a076-f4f4fa9f27bd",alice="bob"} 7

# HELP kafka_consumer_request_total The total number of requests sent.
# TYPE kafka_consumer_request_total counter
kafka_consumer_request_total{client_id="nodejs-example-app",broker="broker1:9094",alice="bob"} 37
kafka_consumer_request_total{client_id="nodejs-example-app",broker="broker2:9094",alice="bob"} 186
kafka_consumer_request_total{client_id="nodejs-example-app",broker="broker3:9094",alice="bob"} 34

# HELP kafka_consumer_request_size_max The maximum size of any request sent.
# TYPE kafka_consumer_request_size_max gauge
kafka_consumer_request_size_max{client_id="nodejs-example-app",broker="glider.srvs.cloudkafka.com:9094",alice="bob"} 422
kafka_consumer_request_size_max{client_id="nodejs-example-app",broker="broker1:9094",alice="bob"} 458
kafka_consumer_request_size_max{client_id="nodejs-example-app",broker="broker2:9094",alice="bob"} 40
kafka_consumer_request_size_max{client_id="nodejs-example-app",broker="broker3:9094",alice="bob"} 458

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

# HELP kafka_consumer_batch_size_max The max number of bytes received per partition per request
# TYPE kafka_consumer_batch_size_max gauge
kafka_consumer_batch_size_max{client_id="nodejs-example-app",topic="topic1",partition="2",alice="bob"} 1
kafka_consumer_batch_size_max{client_id="nodejs-example-app",topic="topic1",partition="1",alice="bob"} 1
kafka_consumer_batch_size_max{client_id="nodejs-example-app",topic="topic1",partition="4",alice="bob"} 1
kafka_consumer_batch_size_max{client_id="nodejs-example-app",topic="topic1",partition="3",alice="bob"} 1
kafka_consumer_batch_size_max{client_id="nodejs-example-app",topic="topic1",partition="0",alice="bob"} 1

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

# HELP kafka_producer_request_size_max The maximum size of any request sent.
# TYPE kafka_producer_request_size_max summary
kafka_producer_request_size_max{quantile="0.01",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 40.15085714285714
kafka_producer_request_size_max{quantile="0.05",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 42.12571428571429
kafka_producer_request_size_max{quantile="0.5",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 64.65714285714286
kafka_producer_request_size_max{quantile="0.9",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 102.50857142857143
kafka_producer_request_size_max{quantile="0.95",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 107.23999999999998
kafka_producer_request_size_max{quantile="0.99",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 114.68
kafka_producer_request_size_max{quantile="0.999",client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 116
kafka_producer_request_size_max_sum{client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 4682
kafka_producer_request_size_max_count{client_id="nodejs-example-app",broker="broker2:9094",foo="bar"} 72
kafka_producer_request_size_max{quantile="0.01",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 40.31182481751825
kafka_producer_request_size_max{quantile="0.05",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 42.25985401459854
kafka_producer_request_size_max{quantile="0.5",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 64.33576642335767
kafka_producer_request_size_max{quantile="0.9",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 101.67299270072994
kafka_producer_request_size_max{quantile="0.95",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 106.34014598540145
kafka_producer_request_size_max{quantile="0.99",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 110.65999999999991
kafka_producer_request_size_max{quantile="0.999",client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 116
kafka_producer_request_size_max_sum{client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 8970
kafka_producer_request_size_max_count{client_id="nodejs-example-app",broker="broker3:9094",foo="bar"} 139
kafka_producer_request_size_max{quantile="0.01",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 40.31182481751825
kafka_producer_request_size_max{quantile="0.05",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 42.25985401459854
kafka_producer_request_size_max{quantile="0.5",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 64.33576642335767
kafka_producer_request_size_max{quantile="0.9",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 101.67299270072994
kafka_producer_request_size_max{quantile="0.95",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 106.34014598540145
kafka_producer_request_size_max{quantile="0.99",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 110.65999999999991
kafka_producer_request_size_max{quantile="0.999",client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 116
kafka_producer_request_size_max_sum{client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 8970
kafka_producer_request_size_max_count{client_id="nodejs-example-app",broker="broker1:9094",foo="bar"} 139

# HELP kafka_producer_request_queue_size Size of the request queue.
# TYPE kafka_producer_request_queue_size gauge
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
| consumerBatchLatencyHistogramBuckets | Buckets for the kafka_consumer_batch_latency metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 0.8.0|
| consumerFetchLatencyHistogramBuckets | Buckets for the kafka_consumer_fetch_latency metric in seconds. Default buckets are [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10] | [0.001, 0.005, 0.010, 0.020, 0.030, 0.040, 0.050, 0.100, 0.200, 0.500, 1.0, 2.0, 5.0, 10]| 0.8.0|
| defaultLabels | Default labels added to each metrics. | {'foo':'bar', 'alice': 3} | 0.8.0|

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
