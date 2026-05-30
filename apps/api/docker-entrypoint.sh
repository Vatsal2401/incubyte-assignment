#!/bin/sh
# Apply migrations, seed once if the DB is empty, then start the API.
set -e
cd /app/apps/api

echo "[entrypoint] applying database migrations"
npx prisma migrate deploy

COUNT=$(node -e "const{PrismaClient}=require('@prisma/client');const p=new PrismaClient();p.employee.count().then(c=>{process.stdout.write(String(c));return p.\$disconnect();}).catch(()=>process.stdout.write('0'));" 2>/dev/null)
echo "[entrypoint] existing employees: ${COUNT:-0}"

if [ -z "$COUNT" ] || [ "$COUNT" = "0" ]; then
  echo "[entrypoint] seeding 10,000 employees"
  npm run seed
fi

echo "[entrypoint] starting API on :${PORT:-3000}"
exec node dist/main.js
