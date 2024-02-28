# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] 2024-02

The detailed changelog can be found [here](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v3.0.1...v3.1.0).

### Added

- support for new metrics _kafka_admin_request_latency_sum_, _kafka_admin_request_latency_count_ and _kafka_admin_request_latency_bucket_. _kafka_admin_request_latency_count_ and _kafka_admin_request_total_ contain the same value.
- support for new metrics _kafka_consumer_request_latency_sum_, _kafka_consumer_request_latency_count_ and _kafka_consumer_request_latency_bucket_. _kafka_consumer_request_latency_count_ and _kafka_consumer_request_total_ contain the same value.

### Deprecated

- _kafka_admin_request_total_ will be potentially removed in a future version in favor of _kafka_admin_request_latency_count_. It is recommended to already switch now to the new metric.
- _kafka_consumer_request_total_ will be potentially removed in a future version in favor of _kafka_consumer_request_latency_count_. It is recommended to already now today to the new metric.

## [3.0.1] 2024-01-10

The detailed changelog can be found [here](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v3.0.0...v3.0.1).

### Fixed

- Fixed missing label group_id for kafka_consumer_connection_crashed_total metric.

## [3.0.0] 2023-10-17

The detailed changelog can be found [here](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v2.0.0...v3.0.0).

### Changed

- upgraded prom-client from 14.2.0 to 15.0.0
- added compatibility matrix to documentation
- introduced Github actions for complete build process
- added Github actions for build and snyk
- added renovate to build process

## [2.0.0] 2023-09-10

### Changed

- **client_id** is no longer a mandatory parameter for _monitorKafkaJSProducer_, _monitorKafkaJSConsumer_ and _monitorKafkaJSAdmin_ respectively. This is to harmonize the interface with KafkaJS, remove special handling for client_id and prepare for a future release of KafkaJS where the client_id is provided by [KafkaJS instrumentation events](https://kafka.js.org/docs/instrumentation-events) for all metrics and not only for some. Instead it is strongly recommended to add the client_id as a default label until the client_id is provided by [KafkaJS instrumentation events](https://kafka.js.org/docs/instrumentation-events).

## [1.0.1] 2023-08-31

### Fixed

- Fixed wrong path to main entry.

## [1.0.0] 2023-08-31

### Added

- support for new metrics for the admin client.

## [0.9.0] 2023-08-29

### Added

- support for new metrics kafka_consumer_batch_size_total, kafka_consumer_request_size_total and kafka_producer_request_size_total.
- added Grafana dashboard sample

## [0.8.1] 2023-08-27

### Fixed

- wrong label definition for client_id in consumer request queue size metric

## [0.8.0] 2023-08-26

### Added

- initial project setup
- support for major consumer and producer metrics
- support for configuration for exporters
