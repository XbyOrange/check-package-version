# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [unreleased]

### Added

### Changed

### Fixed

### Removed

## [2.0.2] - 2018-10-16

### Fixed
- Fix badges links
- Change publish to npm method in CI configuration

## [2.0.1] - 2018-10-01

### Fixed

- `checkAll()` exucutes `versionNotPublished` and `versionInChangelog` returning `true` when two both checks are positive and `false` as long as one of them are negative.

## [2.0.0] - 2018-09-20

### Added

- Add package path option to use check functions
- `checkAll()` function exported
- `checkVersion()` function exported
- `checkChangelog()` function exported

### Removed

- `check()` function not exported
- `versionExists()` function not exported
- `versionInChangelog()` function not exported

## [1.0.0] - 2018-09-17

### Added

- Add check-version-in-changelog feature

## [1.0.0-alpha.2] - 2018-09-14

### Added

- Add unit tests
- Add acceptance tests

### Fixed

- Fix method for returning true in versionNotPublished. Was using number of logs, not all joined logs length.

## [1.0.0-alpha.1] - 2018-09-13

### Added

- First release. Only "check-version-not-published" feature is available.
