# Change Log

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

[#12]: https://github.com/flickr/yakbak/pull/12
[#13]: https://github.com/flickr/yakbak/pull/13
[#17]: https://github.com/flickr/yakbak/pull/17
[#30]: https://github.com/flickr/yakbak/pull/30
