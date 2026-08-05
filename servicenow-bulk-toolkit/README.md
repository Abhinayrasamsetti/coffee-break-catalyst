# ServiceNow Bulk Toolkit

Previews CSV-driven updates to a ServiceNow table and applies them only with an explicit `--apply`. It uses OAuth bearer tokens and the Table API.

## 1. What to install and open

Use **VS Code** or a terminal with Python 3.10+. Check it with `python --version`. In ServiceNow, create or obtain an OAuth token for a minimally privileged integration user; the user needs write access only to the fields being updated.

## 2. Prepare the input file

1. Copy [`../examples/incidents.csv`](../examples/incidents.csv) to `inputs/incidents.csv`.
2. Open it in Excel or VS Code.
3. Keep `sys_id` as the first column. Add only the fields you are approved to change; blank values are ignored.
4. Save as CSV UTF-8. Never include bearer tokens in this file.

## 3. Preview the request

Replace the instance URL. This prints every proposed update but makes no API calls that change data:

```bash
python snow_bulk_update.py --instance https://example.service-now.com --csv inputs/incidents.csv
```

## 4. Trigger the update

Store the short-lived token only in the current terminal session, then use `--apply`:

```powershell
$env:SNOW_OAUTH_TOKEN = 'paste-short-lived-token-here'
python snow_bulk_update.py --instance https://example.service-now.com --csv inputs/incidents.csv --apply
Remove-Item Env:SNOW_OAUTH_TOKEN
```

For Bash/WSL use `export SNOW_OAUTH_TOKEN='...'` and `unset SNOW_OAUTH_TOKEN` afterward.

## 5. Verify

The console prints `OK 200` for each successful record and shows HTTP error details for failures. Check a sample of records in the ServiceNow UI and retain the preview/output with the change request. Test in a non-production instance first.
