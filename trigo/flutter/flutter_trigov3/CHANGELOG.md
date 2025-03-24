# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Local Supabase instance setup with PostGIS support
- Database tables for TODAs, drivers, and rides
- Spatial indexing for location-based queries
- Sample TODA data for Las Piñas area
- Kong API Gateway configuration for service routing
- Supabase Studio web interface
- Authentication service using GoTrue
- RESTful API using PostgREST
- Realtime subscriptions support
- Postgres Meta service for database management

### Changed
- Updated database schema to include spatial data types
- Modified Docker configuration to use PostGIS-enabled Postgres image
- Restructured initialization scripts for better maintainability

### Fixed
- Architecture compatibility issues with ARM64 platform
- Port conflicts in Docker services
- Database initialization and extension loading issues

## [1.0.0] - 2024-03-20

### Added
- Initial release of Trigo multi-app ride service platform
- Passenger application for trip booking
- Driver application for ride management
- Dispatcher application for system administration
- Docker containerization for all applications
- Python-based Docker container management
- Firebase integration for location data
- Automated deployment scripts for Google Cloud Run
- Comprehensive documentation for setup and deployment 