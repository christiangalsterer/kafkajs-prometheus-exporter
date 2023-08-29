# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
