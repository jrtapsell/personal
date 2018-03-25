#!/bin/bash
sleep 5
echo "Site is running at: http://$(docker port website 80)"
