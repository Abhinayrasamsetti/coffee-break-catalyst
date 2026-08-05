#!/usr/bin/env python3
"""Write a short Markdown health report from the active kubectl context."""
import argparse, datetime, json, subprocess
def kubectl(*args):
    return json.loads(subprocess.check_output(["kubectl", *args, "-o", "json"], text=True))
def main():
    p=argparse.ArgumentParser(); p.add_argument("--output", default="reports/kube-coffee-check.md"); args=p.parse_args()
    pods=kubectl("get","pods","-A")["items"]; nodes=kubectl("get","nodes")["items"]
    issues=[]
    for pod in pods:
        status=pod.get("status",{}); restarts=sum(s.get("restartCount",0) for s in status.get("containerStatuses",[]))
        phase=status.get("phase","Unknown")
        waiting=[s.get("state",{}).get("waiting",{}).get("reason") for s in status.get("containerStatuses",[]) if s.get("state",{}).get("waiting")]
        if phase != "Running" or restarts >= 3 or waiting: issues.append((pod["metadata"]["namespace"],pod["metadata"]["name"],phase,restarts,", ".join(filter(None,waiting))))
    bad_nodes=[n["metadata"]["name"] for n in nodes if any(c["type"]=="Ready" and c["status"]!="True" for c in n.get("status",{}).get("conditions",[]))]
    import os; os.makedirs(os.path.dirname(args.output) or ".",exist_ok=True)
    with open(args.output,"w",encoding="utf-8") as out:
        out.write(f"# Kubernetes coffee check\n\nGenerated: {datetime.datetime.now().isoformat(timespec='seconds')}\n\n")
        out.write(f"- Nodes: {len(nodes)}; not ready: {', '.join(bad_nodes) or 'none'}\n- Pods checked: {len(pods)}; attention needed: {len(issues)}\n\n")
        out.write("## Pods needing attention\n\n| Namespace | Pod | Phase | Restarts | Waiting reason |\n|---|---|---:|---:|---|\n")
        for item in issues: out.write("| " + " | ".join(map(str,item)) + " |\n")
    print(args.output)
if __name__ == "__main__": main()
