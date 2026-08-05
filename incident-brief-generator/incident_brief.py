#!/usr/bin/env python3
"""Turn a ServiceNow-style incident CSV into a redacted Markdown triage brief."""
import argparse,csv,collections,re,os
EMAIL=re.compile(r"[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}"); PHONE=re.compile(r"\+?\d[\d -]{7,}\d")
def redact(value): return PHONE.sub("[phone]",EMAIL.sub("[email]",value or ""))
def main():
 p=argparse.ArgumentParser();p.add_argument("--csv",required=True);p.add_argument("--output",default="reports/incident-brief.md");a=p.parse_args()
 with open(a.csv,newline="",encoding="utf-8") as f: rows=list(csv.DictReader(f))
 groups=collections.Counter((r.get("assignment_group") or "Unassigned").strip() for r in rows)
 states=collections.Counter((r.get("state") or "Unknown").strip() for r in rows)
 os.makedirs(os.path.dirname(a.output) or ".",exist_ok=True)
 with open(a.output,"w",encoding="utf-8") as f:
  f.write(f"# Incident triage brief\n\nRecords analysed: **{len(rows)}**\n\n## By assignment group\n\n")
  f.writelines(f"- {name}: {count}\n" for name,count in groups.most_common())
  f.write("\n## By state\n\n");f.writelines(f"- {name}: {count}\n" for name,count in states.most_common())
  f.write("\n## Recent records (redacted)\n\n| Number | Short description | Group | State |\n|---|---|---|---|\n")
  for r in rows[:20]: f.write(f"| {redact(r.get('number',''))} | {redact(r.get('short_description',''))} | {redact(r.get('assignment_group',''))} | {redact(r.get('state',''))} |\n")
 print(a.output)
if __name__ == "__main__":main()
