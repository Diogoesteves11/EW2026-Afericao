#!/bin/bash

cd /docker-entrypoint-initdb.d

python3 prepair.py

mongoimport --host localhost -d autoRepair -c repairs --type json --file dataset_pronto.json --jsonArray

mongosh autoRepair --eval '
  db.repairs.countDocuments();
  db.repairs.findOne();
  db.repairs.createIndex({ "viatura.matricula": 1 });
  db.repairs.createIndex({ "nome": "text" });
'