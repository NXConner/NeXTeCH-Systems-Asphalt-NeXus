#!/bin/bash
set -e
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="./db_backups"
mkdir -p $BACKUP_DIR
pg_dump "$DATABASE_URL" > "$BACKUP_DIR/backup_$DATE.sql"
echo "Backup saved to $BACKUP_DIR/backup_$DATE.sql" 