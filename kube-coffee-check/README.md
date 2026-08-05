# Kube Coffee Check

Reads the active `kubectl` context and writes a Markdown report of unready nodes, non-running pods, repeated restarts, and waiting reasons. It is read-only.

```bash
python kube_coffee_check.py --output reports/aks-health.md
```

Run `kubectl config current-context` first. The account needs only cluster read permissions. Treat the report as a triage signal: inspect events and application logs before remediation.
