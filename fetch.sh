#!/usr/bin/env bash

url="https://icticingalp01.ms.uhbs.ch:5665/v1/objects/"
curl -k -s -u dash:dashboard "$url/services" > services.json
curl -k -s -u dash:dashboard "$url/hosts" > hosts.json
