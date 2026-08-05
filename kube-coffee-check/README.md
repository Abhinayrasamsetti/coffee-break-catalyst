# Kube Coffee Check

Reads the active `kubectl` context and writes a Markdown report of unready nodes, non-running pods, repeated restarts, and waiting reasons. It is read-only.

## 1. What to install and open

Use a terminal with **Python 3.10+** and **kubectl**. For AKS, also install the Azure CLI if you need to download credentials. Confirm the tools:

```bash
python --version
kubectl version --client
```

## 2. Connect to the intended cluster

For AKS, use a permitted subscription and resource group:

```bash
az login
az aks get-credentials --resource-group <resource-group> --name <cluster-name>
kubectl config current-context
kubectl get nodes
```

The final command must show the expected cluster before you continue. No input file is needed; the script reads the active kubectl context only.

## 3. Trigger the check

From this folder run:

```bash
python kube_coffee_check.py --output reports/kube-coffee-check.md
```

## 4. Read the result

Open `reports/kube-coffee-check.md` in VS Code. It lists unready nodes and pods needing attention. This tool makes no changes. For a listed pod, investigate with `kubectl describe pod <pod> -n <namespace>` before remediating.
