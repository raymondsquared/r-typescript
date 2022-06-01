#!/bin/bash

helm upgrade --install \
rtypescript ../../pawlution/charts/pawlution/rtypescript \
--set rtypescript.imageTag=1653792755 \
--namespace paw --create-namespace

# helm uninstall puzzlecity -n paw
