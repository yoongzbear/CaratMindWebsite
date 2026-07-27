#!/bin/bash
source /var/app/venv/*/bin/activate 2>/dev/null || true
pip install torch==2.12.1 --index-url https://download.pytorch.org/whl/cpu