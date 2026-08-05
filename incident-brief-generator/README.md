# Incident Brief Generator

Converts a CSV export into a small Markdown brief grouped by assignment group and state. It redacts email addresses and phone-like strings in the report.

## 1. What to install and open

Use **VS Code** or a terminal with Python 3.10+. Confirm it with:

```bash
python --version
```

## 2. Export and store the input safely

1. Export the approved ServiceNow list to CSV.
2. Save it as `inputs/incident-export.csv`, which is ignored by Git.
3. Open it in Excel and confirm it has useful columns such as `number`, `short_description`, `assignment_group`, and `state`.
4. Do not commit the export or any generated production report.

## 3. Trigger the report

```bash
python incident_brief.py --csv inputs/incident-export.csv --output reports/incident-brief.md
```

## 4. Read and share safely

Open the generated Markdown file in VS Code. The tool groups records by assignment group and state, and redacts common email/phone patterns. Redaction is not a data-loss-prevention guarantee: review the report before sharing it outside the authorised team.
