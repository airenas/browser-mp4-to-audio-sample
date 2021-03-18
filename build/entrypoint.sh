#!/bin/bash
set -e
echo Starting nginx
exec nginx -g 'daemon off;'