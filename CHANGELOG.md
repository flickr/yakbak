# Change Log

## Unreleased

Nothing yet!

## [5.0.0] - 2020-05-18

This release simply upgrades a bunch of devDependencies, but those upgrades meant we needed to drop support for node < 10. Currently 10 is the lowest active LTS anyways so it's for the best.

## [4.0.0] - 2019-06-28

This release removes support for node < v6, mainly because our dev dependencies have done just that. Also we've got some new digs now so time to show it off in the copyright comments! 

### Removed

- Support for node < v6 and everything Yahoo! ([#50])

## [3.0.0] - 2018-01-17

This release is mainly to upgrade dependencies with security vulnerabilities. There are no yakbak API changes in this release, but if you were depending on global APIs of yakbak's dependencies (namely debug@2.x) you should check out those individual changelogs for details.

### Changed

- Upgrade [debug](https://github.com/visionmedia/debug) dependency. Version 3.0.0 contains [several breaking changes](https://github.com/visionmedia/debug/blob/master/CHANGELOG.md#300--2017-08-08) ([#42])
- Upgrade [ejs](https://github.com/mde/ejs) dependency
- Test against node 6/8/9

## [2.6.0] - 2017-05-03

### Added

- `hash` option that lets you provide your own IncomingMessage hash function if you don't want to use the default [incoming-message-hash](https://github.com/flickr/incoming-message-hash). This parameter should be a function with the signature `(req, body)` and should return a unique, consistent name for the tape based on these arguments.

## [2.5.0] - 2016-06-22

### Added

- `noRecord` option that will return a 404 and log the request if yakbak receives an unrecorded request ([#17])

## [2.4.3] - 2016-05-10

### Fixed

- Handler now returns a Promise ([#12])
- Added support for TLS SNI connections ([#13])

## 2.4.2 - 2016-05-06

### Added

- Initial CHANGELOG.

[2.4.3]: https://github.com/flickr/yakbak/compare/v2.4.2...v2.4.3
[2.5.0]: https://github.com/flickr/yakbak/compare/v2.4.3...v2.5.0
[2.6.0]: https://github.com/flickr/yakbak/compare/v2.5.0...v2.6.0
[3.0.0]: https://github.com/flickr/yakbak/compare/v2.6.0...v3.0.0
[4.0.0]: https://github.com/flickr/yakbak/compare/v3.0.0...v4.0.0
[5.0.0]: https://github.com/flickr/yakbak/compare/v4.0.0...v5.0.0

[#12]: https://github.com/flickr/yakbak/pull/12
[#13]: https://github.com/flickr/yakbak/pull/13
[#17]: https://github.com/flickr/yakbak/pull/17
[#30]: https://github.com/flickr/yakbak/pull/30
[#42]: https://github.com/flickr/yakbak/pull/42
[#50]: https://github.com/flickr/yakbak/pull/50
