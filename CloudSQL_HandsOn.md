### Cloud SQL Node JS client

- Provision cloud sql instance with postgres
- enable public connectivity for the instance & enable port 5432 in firewall
- setup cloud sql proxy with service account having cloud sql client role and that key

```
set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\veetm\Downloads\cloud_sql_client.json
```
```
cloud-sql-proxy just-center-441712-i2:asia-south1:test-postgres-dev --address=0.0.0.0 --port=5432
```

- Use pg connect and try to connect with node js client.

-------

#### if we want to connect to cloud sql instance via cloud shell

-  gcloud sql connect test-postgres-dev --user=postgres --quiet
- \c fish
- \d
- select * from shark;