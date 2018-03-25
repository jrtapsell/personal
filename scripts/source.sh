#!/bin/bash

function build() {
    docker build -t website ../;
}

function print_port() {
    sleep 5;
    echo "Site is running at: http://$(docker port website 80)";
}

function run_site() {
    echo "Started docker container"
    echo "Press Ctrl+C to quit"
    docker run --rm -ti --name website -p 80 website
}

function run_and_print() {
    print_port &
    run_site
}
