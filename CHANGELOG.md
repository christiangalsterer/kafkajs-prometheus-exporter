# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 (2024-12-10)


### Features

* add support for node coveralls reports ([9fbbf89](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/9fbbf89e25344df93a2b0bcfa356becfcc3d0385))
* add support for re-registering metrics ([#98](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/98)) ([ed4d11f](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/ed4d11f2b9815e7ca14f9325dc0fad5fc478c44a))
* extend mergeLabelsWithStandardLabels with support undefined labels ([6e2a18c](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/6e2a18ca1e3d26ba2ba4f1eba12a59e60f1d7379))
* support for admin request latency metrics ([baaed85](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/baaed85e768d98e10d5e8101b896ed3a7a123157))
* support for consumer request latency metrics ([a1719a7](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/a1719a782570096b704ea33884951772aeeee6b4))
* support for producer request latency metrics ([b442f25](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/b442f2573b0e7e6e16ef81b438892cca4aeb0d83))
* use duration instead of latency in grafana dashboard ([c0dff16](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/c0dff165e5bfae58b6a43bb6c28839c55a0f56e3))


### Bug Fixes

* **91:** init consumerFetchDuration ([#92](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/92)) ([f7f5c55](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/f7f5c55294fc3d56790bb49caa7a037c70ac5f51))
* add missing label for connection-crashed metric ([#74](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/issues/74)) ([21884c1](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/21884c168da0b0517cc6a95e5999760a74c35e33))
* missing initialization for kafka_consumer_batch_duration_seconds metric ([39fd4fa](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/39fd4fa1f81c8df9a6a18e24e7140d55d7565af1))
* use duration instead of latency as the more correct term for .*request_duration metrics ([d9e90b1](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/d9e90b14616c20472476ae4e82bda556fbe2acb2))
* use duration instead of latency as the more correct term for .*request_duration metrics ([93b07da](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/93b07dadef839fef3e7fa987f3f110d2218b6278))
* use duration instead of latency as the more correct term for .*request_duration metrics ([636fe07](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/636fe07c0f552a510ba57786a6629fbbb4e5c788))
* use duration instead of latency as the more correct term for .*request_duration metrics ([09be3c8](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/09be3c8408bdfdd2bed576052cedf39d30aa1362))
* use duration instead of latency as the more correct term for .*request_duration metrics ([3bbcb53](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/3bbcb539d216ad81441e82a3cbd1b918948db3d4))
* use duration instead of latency as the more correct term for .*request_duration metrics ([c08b2af](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/c08b2afd921de74cc337e189db21660c7f28f8bb))
* use duration instead of latency as the more correct term for .*request_duration metrics ([3ed5f21](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/3ed5f216ea3eeeb5c6dda5e705c331509d5031a7))
* use duration instead of latency as the more correct term for .*request_duration metrics ([9d4014e](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/9d4014ed11f76d147e4629f023e77a64349c67fe))
* wrong entrypoint after migration to single tsconfig file ([3751531](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/37515318e1139e54642bf98fef39a56f8f22df07))


### Reverts

* release 3.1.1 ([8f7239a](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/8f7239af21dad08c8129d4fda25d7d6c609e5d91))
* release 3.1.1 ([2922c4a](https://github.com/christiangalsterer/kafkajs-prometheus-exporter/commit/2922c4abb646eb6ac464d84d78a95e331a3f0810))

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
