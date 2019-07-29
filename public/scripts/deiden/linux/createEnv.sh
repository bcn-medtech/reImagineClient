#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

echo "Create deiden env"

pip install virtualenvwrapper
mkvirtualenv deid
pip install pydicom
pip install deid
pip install sqlalchemy
pip install SimpleITK

