# Linux Service Recovery Pack

Two Ansible playbooks support controlled operations: evidence-first service recovery and conservative disk cleanup.

## 1. What to install and open

Use Ubuntu/WSL, a Linux jump host, or a CI runner with SSH reachability to the target hosts. Install and verify Ansible:

```bash
sudo apt update && sudo apt install -y ansible
ansible --version
```

## 2. Store server inputs

Create `inputs/inventory.ini` with a small test group first:

```ini
[recovery_targets]
server-a ansible_host=192.0.2.10

[cleanup_targets]
server-a ansible_host=192.0.2.10
```

Use SSH keys or Ansible Vault for authentication, not passwords in this file. Confirm access:

```bash
ansible -i inputs/inventory.ini all -m ping
```

## 3. Recover a single approved service

First run against one server in a maintenance window. This captures status and recent journal entries before restarting, then verifies the service is active:

```bash
ansible-playbook -i inputs/inventory.ini recover-service.yml --limit server-a -e target_service=nginx
```

Review the diagnostic output. Scale out only after the application health check passes.

## 4. Check disk usage without deleting anything

The default run only measures `/tmp` and `/var/tmp` and prints a report:

```bash
ansible-playbook -i inputs/inventory.ini disk-cleanup.yml --limit server-a
```

You can also preview Ansible's planned changes:

```bash
ansible-playbook -i inputs/inventory.ini disk-cleanup.yml --check --limit server-a
```

## 5. Trigger approved cleanup

After reviewing output and obtaining approval, run the explicit apply flag on one host:

```bash
ansible-playbook -i inputs/inventory.ini disk-cleanup.yml --limit server-a -e cleanup_apply=true
```

It deletes only files older than seven days under `/tmp` and `/var/tmp`, and cleans package-manager caches where available. It never removes directories, user home files, logs, databases, or container images. Check free space with `ansible -i inputs/inventory.ini server-a -a 'df -h'` afterward.
