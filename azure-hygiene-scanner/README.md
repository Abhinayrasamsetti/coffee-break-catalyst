# Azure Hygiene Scanner

Creates a read-only Markdown inventory of unattached managed disks and public IPs with no associated configuration.

## 1. What to install and open

Use VS Code, Windows Terminal, or a Bash shell with **Python 3.10+** and the **Azure CLI**. Verify:

```bash
python --version
az version
```

## 2. Select the Azure subscription

Sign in with a read-only account and explicitly select the subscription you want to inspect:

```bash
az login
az account list --output table
az account set --subscription '<subscription-id-or-name>'
az account show --output table
```

The last command is your safety check. No input file or secrets are stored in the repository; Azure CLI keeps its authenticated session locally.

## 3. Trigger the scan

```bash
python azure_hygiene_scan.py --output reports/azure-hygiene.md
```

## 4. Review before taking action

Open the report in VS Code. For each resource, verify tags, resource locks, backup dependencies, owner, and change approval. This tool has no delete functionality by design.
