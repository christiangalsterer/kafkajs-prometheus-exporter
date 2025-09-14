# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.2.1 (2025-09-14)


### Features

* add support for node coveralls reports ([9fbbf89](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/9fbbf89e25344df93a2b0bcfa356becfcc3d0385))
* add support for re-registering metrics ([#98](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/98)) ([ed4d11f](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/ed4d11f2b9815e7ca14f9325dc0fad5fc478c44a))


### Bug Fixes

* **91:** init consumerFetchDuration ([#92](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/92)) ([f7f5c55](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/f7f5c55294fc3d56790bb49caa7a037c70ac5f51))
* missing initialization for kafka_consumer_batch_duration_seconds metric ([39fd4fa](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/39fd4fa1f81c8df9a6a18e24e7140d55d7565af1))
* wrong entrypoint after migration to single tsconfig file ([3751531](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/37515318e1139e54642bf98fef39a56f8f22df07))


### Reverts

* release 3.1.1 ([8f7239a](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/8f7239af21dad08c8129d4fda25d7d6c609e5d91))
* release 3.1.1 ([2922c4a](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/2922c4abb646eb6ac464d84d78a95e331a3f0810))


### Miscellaneous Chores

* release 3.2.1 ([ef770f8](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/ef770f8ff7859ca3425ecb268a2b52cb29223f6f))

## [3.2.0](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v3.1.1...v3.2.0) (2024-05-07)


### Features

* add support for re-registering metrics ([#98](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/98)) ([ed4d11f](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/ed4d11f2b9815e7ca14f9325dc0fad5fc478c44a))

## [3.1.1] 2024-04-04

The detailed changelog can be found [here](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v3.1.0...v3.1.1).

### Fixed

- Missing initialization for _kafka_consumer_fetch_duration_seconds_ [(issue #91)](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/91)
- Missing initialization for _kafka_consumer_batch_duration_seconds_

## [3.1.0] 2024-02-29

The detailed changelog can be found [here](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v3.0.1...v3.1.0).

### Added

- support for new metrics _kafka_consumer_fetch_duration_seconds_count_, _kafka_consumer_fetch_duration_seconds_sum_ and _kafka_consumer_fetch_duration_seconds_bucket_. These are replacements for the corresponding _kafka_consumer_fetch_latency.*_ metrics. See also the deprecation notices below.
- support for new metrics _kafka_consumer_batch_duration_seconds_count_, _kafka_consumer_batch_duration_seconds_sum_ and _kafka_consumer_batch_duration_seconds_bucket_. These are replacements for the corresponding _kafka_consumer_batch_latency.*_ metrics. See also the deprecation notices below.
- support for new metrics _kafka_admin_request_duration_seconds_count_, _kafka_admin_request_duration_seconds_sum_ and _kafka_admin_request_duration_seconds_bucket_. _kafka_admin_request_duration_seconds_count_ and _kafka_admin_request_total_ contain the same value.
- support for new metrics _kafka_producer_request_duration_seconds_count_, _kafka_producer_request_duration_seconds_sum_ and _kafka_producer_request_duration_seconds_bucket_. _kafka_producer_request_duration_seconds_count_ and _kafka_producer_request_total_ contain the same value.
- support for new metrics _kafka_consumer_request_duration_seconds_count_, _kafka_consumer_request_duration_seconds_sum_ and _kafka_consumer_request_duration_seconds_bucket_. _kafka_consumer_request_duration_seconds_count_ and _kafka_consumer_request_total_ contain the same value.

### Deprecated

- _kafka_admin_request_total_ will be potentially removed in a future version in favor of _kafka_admin_request_duration_seconds_count_. It is recommended to already switch now to the new metric.
- _kafka_producer_request_total_ will be potentially removed in a future version in favor of _kafka_producer_request_duration_seconds_count_. It is recommended to already switch now to the new metric.
- _kafka_consumer_request_total_ will be potentially removed in a future version in favor of _kafka_consumer_request_duration_seconds_count_. It is recommended to already switch now to the new metric.
- _kafka_consumer_fetch_latency_count_, _kafka_consumer_fetch_latency_sum_ and _kafka_consumer_fetch_latency_buckets_ will be removed in the next major release and are replaced with _kafka_consumer_fetch_duration_seconds.*_ counterparts. This is to better align the metric names with the Prometheus naming conventions and other metrics used in the Prometheus ecosystem. It is recommended to already switch now to the new metrics.
- _kafka_consumer_batch_latency_count_, _kafka_consumer_batch_latency_sum_ and _kafka_consumer_batch_latency_buckets_ will be removed in the next major release and are replaced with the _kafka_consumer_batch_duration_seconds.*_ counterparts. This is to better align the metric names with the Prometheus naming conventions and other metrics used in the Prometheus ecosystem. It is recommended to already switch now to the new metrics.

## [3.0.1] 2024-01-10

The detailed changelog can be found [here](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/compare/v3.0.0...v3.0.1).

### Fixed

- Fixed missing label group_id for _kafka_consumer_connection_crashed_total metric_.

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
