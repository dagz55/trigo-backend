# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Docker containerization for separate passenger, driver, and dispatcher interfaces
- Container-aware context provider to handle container-specific features
- Environment variables for container type configuration
- Docker Compose setup for local development with multiple containers
- Container-specific navigation and home pages
- Updated authentication flow to handle container-specific roles
- Docker build and run scripts in package.json
- Comprehensive Docker documentation in README.md
- `docker_manager.py` script for managing Docker containers with start, stop, restart capabilities
- Error handling and logging for Docker operations
- Daily PDF status report generation

### Changed
- Refactored application structure to support containerization
- Updated auth provider to be container-aware
- Modified bottom navigation to adapt based on container type
- Changed landing page to login/signup for better user flow
- Updated profile page to show container-specific information
- Improved error handling in authentication flows
- Updated README.md to include instructions for using the new Docker manager script

### Fixed
- Resolved unhandled promise rejection in authentication process
- Fixed Firebase permission issues with improved error handling

## [3.0.0] - 2025-03-15

### Added
- Admin dashboard for community management
- Real-time analytics for ride patterns and driver performance
- Integration with local government APIs for tricycle regulation compliance

### Changed
- Upgraded to Next.js 15 for improved performance
- Redesigned user interface for better accessibility

### Fixed
- Resolved issue with ride history not updating in real-time

## [2.0.0] - 2024-09-01

### Added
- In-app messaging between drivers and passengers
- Multi-language support (English, Filipino, Cebuano)
- Advanced route optimization algorithm

### Changed
- Switched payment gateway to support more local payment methods
- Improved map rendering performance

### Removed
- Deprecated old rating system in favor of new comprehensive feedback system

## [1.0.0] - 2024-03-01

### Added
- Initial release of TriGo app
- Basic ride booking functionality
- Driver and passenger profiles
- Simple rating system
- Cash payment option

## [0.1.0] - 2023-05-15

### Added
- Initial project setup with Next.js
- Basic routing for home, passenger, and driver pages
- Placeholder components for main features

[Unreleased]: https://github.com/your-username/trigo-app/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/your-username/trigo-app/releases/tag/v0.1.0

