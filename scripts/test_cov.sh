#! /bin/bash

npm run test:cov

ls

npm run report-coverage

echo "$CODECOV_TOKEN"

node_modules/.bin/codecov --token $CODECOV_TOKEN

