# Incident Brief Generator

Converts a CSV export into a small Markdown brief grouped by assignment group and state. It redacts email addresses and phone-like strings in the report.

```bash
python incident_brief.py --csv incident-export.csv --output reports/incident-brief.md
```

Expected useful columns: `number`, `short_description`, `assignment_group`, and `state`. Redaction is a convenience layer, not a data-loss-prevention guarantee; do not commit exports or generated reports containing production information.
