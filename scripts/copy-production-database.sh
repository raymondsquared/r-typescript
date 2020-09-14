#!/bin/bash

echo 'Copy production database to development or staging environment'

# TO DO:
# 1. EXTRACT production data
# 2. TRANSFORM
#      mask the data using `SecurityClient`.`mask` with [`PassportNumber`] parameter
#      make sure the passport number is masked from `A1234567` to `X0000000`
# 3. LOAD the data into development or staging environment
