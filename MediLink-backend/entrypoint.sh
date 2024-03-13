#!/bin/bash

APP_PORT=${PORT:-8000}

python3 -m gunicorn -k uvicorn.workers.UvicornWorker MediLink.asgi --bind "0.0.0.0:${APP_PORT}"