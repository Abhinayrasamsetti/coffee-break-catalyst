#!/usr/bin/env python3
"""Preview or apply controlled ServiceNow table updates from a CSV."""
import argparse, base64, csv, json, os, sys, urllib.error, urllib.request

def request(url, method, token, payload=None):
    headers = {"Accept": "application/json", "Authorization": f"Bearer {token}"}
    data = json.dumps(payload).encode() if payload else None
    if data: headers["Content-Type"] = "application/json"
    return urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers, method=method), timeout=30)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--instance", required=True, help="e.g. https://company.service-now.com")
    parser.add_argument("--csv", required=True)
    parser.add_argument("--table", default="incident")
    parser.add_argument("--apply", action="store_true", help="Required to make changes")
    args = parser.parse_args()
    token = os.environ.get("SNOW_OAUTH_TOKEN")
    if args.apply and not token: sys.exit("Set SNOW_OAUTH_TOKEN before using --apply.")
    with open(args.csv, newline="", encoding="utf-8") as source:
        rows = list(csv.DictReader(source))
    if not rows or "sys_id" not in rows[0]: sys.exit("CSV must contain sys_id plus fields to update.")
    print(f"{('APPLYING' if args.apply else 'PREVIEWING')} {len(rows)} record(s) in {args.table}")
    for row in rows:
        sys_id = row.pop("sys_id").strip(); payload = {k:v for k,v in row.items() if v.strip()}
        if not sys_id or not payload: print(f"SKIP {sys_id or '<missing>'}: no ID or update fields"); continue
        print(f"{sys_id}: {json.dumps(payload)}")
        if args.apply:
            try:
                url = f"{args.instance.rstrip('/')}/api/now/table/{args.table}/{sys_id}"
                with request(url, "PATCH", token, payload) as response: print(f"  OK {response.status}")
            except urllib.error.HTTPError as exc: print(f"  FAILED {exc.code}: {exc.read().decode()[:300]}")
if __name__ == "__main__": main()
