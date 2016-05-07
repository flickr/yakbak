#!/usr/bin/env bash

set -ex

npm run lint
npm run test

node package.json
