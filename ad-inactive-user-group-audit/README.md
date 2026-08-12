# AD Inactive User & Group Audit

A read-only PowerShell audit for inactive Active Directory accounts, never-expiring passwords, expired accounts, and inactive or disabled users in privileged groups. It never changes, disables, deletes, or removes an account.

## 1. What to install and open

Use a Windows domain-joined administration machine. Open **Windows PowerShell as Administrator** or a PowerShell tab in Windows Terminal. Check that the Active Directory module is installed:

```powershell
Get-Module -ListAvailable ActiveDirectory
```

If no module is displayed, install RSAT through your organisation's approved software centre. Use an account with read access to Active Directory and the groups being audited.

## 2. Prepare optional exclusions

Newly created service accounts, break-glass accounts, or approved exceptions may be excluded from the *inactivity* finding. Create `inputs/excluded-samaccountnames.txt` in VS Code or Notepad, one account name per line:

```text
# Approved exceptions only; reviewed periodically
svc_backup
breakglass_admin
```

The file is ignored by Git. Exclusions do **not** hide a disabled-account finding or a password-never-expires finding.

## 3. Run a small, safe first audit

Open PowerShell in this folder. Start with a test OU and a 30-day threshold; replace the example domain components:

```powershell
./Invoke-AdInactiveUserGroupAudit.ps1 -InactiveDays 30 -SearchBase 'OU=Test,DC=example,DC=com' -ExcludeSamAccountNamePath .\inputs\excluded-samaccountnames.txt
```

The script only reads AD data. If you do not use exclusions, omit `-ExcludeSamAccountNamePath`.

## 4. Audit the production scope

After you validate the test report, run against the approved production OU or omit `-SearchBase` to audit the full domain:

```powershell
./Invoke-AdInactiveUserGroupAudit.ps1 -InactiveDays 90 -SearchBase 'OU=Employees,DC=example,DC=com' -ExcludeSamAccountNamePath .\inputs\excluded-samaccountnames.txt
```

To use a different list of privileged groups, pass their exact AD group names:

```powershell
./Invoke-AdInactiveUserGroupAudit.ps1 -PrivilegedGroups 'Domain Admins','Backup Operators','Helpdesk Admins'
```

## 5. Read the results and act through change control

Each run creates a timestamped folder below `reports/` containing:

| File | Meaning |
| --- | --- |
| `summary.txt` | Scope, threshold, and finding counts. |
| `user-findings.csv` | Accounts with inactivity, password, expiry, or disabled-account findings. |
| `privileged-group-findings.csv` | Disabled or inactive users that retain effective membership in audited privileged groups. |

Open CSV files in Excel and validate the owner, service dependency, HR status, and last-logon context before taking action. Use your approved access-review/change process to disable accounts or remove group memberships; this script intentionally leaves remediation manual.

## Important limits

`LastLogonDate` is replicated and approximate. It is suitable for periodic hygiene reviews, but do not use it as sole evidence for an access-removal decision. Audit results depend on the reader's permissions, and nested group membership is included for the listed privileged groups.
