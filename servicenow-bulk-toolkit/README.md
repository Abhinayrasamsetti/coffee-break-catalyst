# ServiceNow Bulk Toolkit

Previews CSV-driven updates to a ServiceNow table and applies them only with an explicit `--apply`. It uses OAuth bearer tokens and the Table API.

## Use

```bash
python snow_bulk_update.py --instance https://example.service-now.com --csv ../examples/incidents.csv
export SNOW_OAUTH_TOKEN='<short-lived token>'
python snow_bulk_update.py --instance https://example.service-now.com --csv ../examples/incidents.csv --apply
```

The CSV must include `sys_id`; every other non-empty column becomes a field update. Test in a non-production instance and use a minimally privileged integration account. The preview output should be attached to your change request.
