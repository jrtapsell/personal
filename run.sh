#!/bin/bash
echo "Started docker container"
echo "Press Ctrl+C to quit"
./showPortAsync.sh &
docker run --rm -ti --name website -p 80 website

