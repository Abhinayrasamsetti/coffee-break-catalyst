# Coffee Break Catalyst

Practical, safety-first automation for routine enterprise operations. Each tool is designed to turn a repetitive task into a reviewable run you can start during a coffee break.

## Included automation

| Tool | What it does | Primary technology |
| --- | --- | --- |
| [AD Bulk Onboarder](ad-bulk-onboarder/README.md) | Validates a CSV and creates Active Directory users and group memberships | PowerShell |
| [FleetOps Runner](fleetops-runner/README.md) | Performs bulk service restarts across Linux hosts | Ansible |
| [ServiceNow Bulk Toolkit](servicenow-bulk-toolkit/README.md) | Previews and applies controlled incident updates from CSV | Python |
| [Kube Coffee Check](kube-coffee-check/README.md) | Creates a concise Kubernetes cluster-health report | Python / kubectl |
| [Azure Hygiene Scanner](azure-hygiene-scanner/README.md) | Finds common unused Azure resources without changing anything | Python / Azure CLI |
| [Incident Brief Generator](incident-brief-generator/README.md) | Redacts and groups incident exports into an action brief | Python |
| [Linux Service Recovery Pack](linux-service-recovery-pack/README.md) | Captures evidence and safely recovers Linux services | Ansible |

Also included: a **disk-space cleanup playbook** that reports first and removes only explicitly allowlisted junk locations.

## Safety model

- Preview or report mode is the default wherever a change is possible.
- No tool stores credentials in source control. Use environment variables, Ansible Vault, or your secret manager.
- Cleanup is restricted to temp/cache locations; it does not touch user documents, application data, registries, or system packages.
- Run every tool against a test environment before production and follow your organisation's change-control process.

## Quick start

1. Read the README in the tool directory.
2. Copy a sample input/configuration and fill in non-sensitive test data.
3. Run its preview/report command.
4. Review the generated report before using the apply command.

## Repository conventions

- `examples/` contains synthetic data only.
- Reports are written to a local `reports/` folder and ignored by Git.
- Python tools use only the standard library.

## Disclaimer

These are reference automations, not a replacement for organisational approvals, backups, access controls, or monitoring. You are responsible for validating them in your environment.
