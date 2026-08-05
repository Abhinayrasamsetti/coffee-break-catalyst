# FleetOps Runner — bulk service restart

An Ansible playbook for restarting a specific, reviewed list of services across a Linux fleet. It checks status before and after the change.

## Run

```bash
cp inventory.example.ini inventory.ini
ansible-playbook -i inventory.ini restart-services.yml --check -e 'service_names=["nginx"]'
ansible-playbook -i inventory.ini restart-services.yml -e 'service_names=["nginx"]'
```

`--check` is the required first run. Limit the blast radius with `--limit server-a` before targeting the full inventory. Credentials belong in Ansible Vault or an approved identity system, not in the inventory.
