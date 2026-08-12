# Coffee Break Catalyst

Practical, safety-first automation for routine enterprise operations. Each tool is designed to turn a repetitive task into a reviewable run you can start during a coffee break.

## Included automation

| Tool | What it does | Primary technology |
| --- | --- | --- |
| [AD Bulk Onboarder](ad-bulk-onboarder/README.md) | Validates a CSV and creates Active Directory users and group memberships | PowerShell |
| [AD Inactive User & Group Audit](ad-inactive-user-group-audit/README.md) | Reports stale accounts and risky privileged-group memberships without changing AD | PowerShell |
| [Architecture Diagram Builder](architecture-diagram-builder/README.md) | Browser-based Azure/Kubernetes/ServiceNow diagram editor with validation and exports | HTML / CSS / JavaScript |
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

1. Read the numbered beginner guide in the chosen tool directory.
2. Install the listed application (PowerShell, Python, Azure CLI, kubectl, or Ansible).
3. Store real CSVs and inventories in that tool's `inputs/` folder. Git ignores its contents to prevent accidental uploads.
4. Copy an example input where provided, use non-sensitive test data, and run the preview/report command.
5. Review the console/report before using an explicit apply command.

## Repository conventions

- `examples/` contains synthetic data only.
- Reports are written to a local `reports/` folder and ignored by Git.
- Python tools use only the standard library.

## Disclaimer

These are reference automations, not a replacement for organisational approvals, backups, access controls, or monitoring. You are responsible for validating them in your environment.
