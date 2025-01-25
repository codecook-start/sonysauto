# Sonysauto

## Run the app

```bash
docker compose up
```

## Backup and restore

```bash
mongodump --uri "mongodb+srv://admin:Be9KfQnULhttaXi@cluster0.ssi8w.mongodb.net/test" --out ./backup
```

```bash
mongorestore --uri "mongodb://root:Be9KfQnULhttaXi@167.88.43.58:27017/sonysauto?authSource=admin" ./backup/sonysauto
```
