#!/usr/bin/env python3
"""Read-only Azure hygiene scan using the authenticated Azure CLI."""
import argparse, json, os, subprocess
def az(*args): return json.loads(subprocess.check_output(["az", *args, "-o", "json"], text=True))
def main():
 p=argparse.ArgumentParser(); p.add_argument("--output",default="reports/azure-hygiene.md"); a=p.parse_args()
 disks=az("disk","list"); ips=az("network","public-ip","list")
 unattached=[d for d in disks if not d.get("managedBy")]
 unused_ips=[ip for ip in ips if not ip.get("ipConfiguration")]
 os.makedirs(os.path.dirname(a.output) or ".",exist_ok=True)
 with open(a.output,"w",encoding="utf-8") as f:
  f.write("# Azure hygiene scan\n\nThis report is read-only; review ownership and dependencies before removal.\n\n")
  for title,items in (("Unattached managed disks",unattached),("Unassociated public IPs",unused_ips)):
   f.write(f"## {title} ({len(items)})\n\n")
   for x in items: f.write(f"- `{x['name']}` — resource group `{x['resourceGroup']}`\n")
 print(a.output)
if __name__ == "__main__": main()
