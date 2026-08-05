# Azure Hygiene Scanner

Creates a read-only Markdown inventory of unattached managed disks and public IPs with no associated configuration.

```bash
az login
az account set --subscription '<subscription-id>'
python azure_hygiene_scan.py --output reports/azure-hygiene.md
```

An unused-looking resource may still be intentionally reserved. Confirm owner, tags, backups, locks, and change approvals before deletion. This repository intentionally has no delete command.
