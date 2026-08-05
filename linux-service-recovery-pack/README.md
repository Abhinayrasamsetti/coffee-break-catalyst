# Linux Service Recovery Pack

Two Ansible playbooks support controlled operations: evidence-first service recovery and conservative disk cleanup.

## Recover one approved service

```bash
ansible-playbook -i inventory.ini recover-service.yml --limit server-a -e target_service=nginx
```

The playbook captures status and the last 80 journal lines before restarting, then requires the service to be `active`.

## Disk-space cleanup

```bash
ansible-playbook -i inventory.ini disk-cleanup.yml --check
ansible-playbook -i inventory.ini disk-cleanup.yml
ansible-playbook -i inventory.ini disk-cleanup.yml -e cleanup_apply=true
```

The first two commands only report candidate path sizes. The apply command removes files older than seven days from `/tmp` and `/var/tmp`, then attempts supported package cache cleanup. It does **not** delete directories, user home files, logs, databases, container images, or anything outside the explicit allowlist. Review results per host and set a maintenance window before applying.
