#!/bin/bash

create_site() {
  name=$1
  url=$2
  curl -X POST -d '{"name": "$name", "url": "$url"}' --header "Content-Type:application/json" 127.0.0.1:8080/v1/sites
}

create_site "google" "http://google.com"
create_site "twitter" "http://twitter.com"
