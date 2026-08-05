# FleetOps Runner — bulk service restart

An Ansible playbook for restarting a specific, reviewed list of services across a Linux fleet. It checks status before and after the change.

## 1. What to install and open

Use an Ubuntu/WSL terminal, Linux jump host, or CI runner that can SSH to the servers. Install Ansible, then verify it:

```bash
sudo apt update && sudo apt install -y ansible
ansible --version
```

## 2. Prepare the inventory

Copy `inventory.example.ini` to `inputs/inventory.ini`, then replace the example IPs and host names. Store SSH keys in `~/.ssh` or use Ansible Vault; never put passwords in the inventory. Test connectivity:

```bash
ansible -i inputs/inventory.ini fleet -m ping
```

## 3. Preview one server

Run from this directory. Replace `nginx` and `server-a` with approved values:

```bash
ansible-playbook -i inputs/inventory.ini restart-services.yml --check --limit server-a -e 'service_names=["nginx"]'
```

## 4. Restart, then scale up

Apply to one host and confirm the application is healthy. Only then remove `--limit` to target the fleet:

```bash
ansible-playbook -i inputs/inventory.ini restart-services.yml --limit server-a -e 'service_names=["nginx"]'
ansible-playbook -i inputs/inventory.ini restart-services.yml -e 'service_names=["nginx"]'
```

The console records status for each host. Save its output with `| tee reports/restart-YYYYMMDD.log` if your change process requires evidence.
