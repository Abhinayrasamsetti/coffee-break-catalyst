# AD Bulk Onboarder

Creates Active Directory accounts from a CSV and adds them to named groups. It validates required fields and refuses duplicate `SamAccountName` values.

## 1. What to install and open

Use a Windows domain-joined administration machine. Open **Windows PowerShell as Administrator** (or Windows Terminal with a PowerShell tab). Confirm the AD module is available:

```powershell
Get-Module -ListAvailable ActiveDirectory
```

If this prints nothing, install RSAT using your organisation's approved software centre, then sign in with an account delegated to create users in the target OU and edit the target groups.

## 2. Prepare the input file

1. Copy [`../examples/users.csv`](../examples/users.csv) to `inputs/users.csv`.
2. Open it in Excel or VS Code. Keep the header row exactly as shown.
3. Put one user on each row. Separate multiple AD group names with a semicolon (`Group-A;Group-B`).
4. Save as **CSV UTF-8**. Do not put passwords in the file.

## 3. Run a safe preview

From this folder, replace the example domain path with your test OU:

```powershell
./New-BulkAdUsers.ps1 -CsvPath .\inputs\users.csv -TargetOu 'OU=Test,DC=example,DC=com' -WhatIf
```

Read the console output and the CSV created under `reports/`. Correct every `Failed` row before continuing.

## 4. Apply the change

Run in a test OU first. Get the initial password from an approved secret manager; do not save it in source control or the CSV.

```powershell
$initialPassword = Read-Host 'Initial password' -AsSecureString
$plainPassword = [System.Net.NetworkCredential]::new('', $initialPassword).Password
./New-BulkAdUsers.ps1 -CsvPath .\inputs\users.csv -TargetOu 'OU=NewJoiners,DC=example,DC=com' -DefaultPassword $plainPassword -RequirePasswordChange
Remove-Variable plainPassword
```

## 5. Verify and recover

Open the newest `reports/ad-onboarding-*.csv` in Excel. Check account and group membership in Active Directory Users and Computers. The tool never deletes accounts automatically; use your approved deprovisioning process for any rollback.
