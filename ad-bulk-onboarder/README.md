# AD Bulk Onboarder

Creates Active Directory accounts from a CSV and adds them to named groups. It validates required fields and refuses duplicate `SamAccountName` values.

## Prerequisites

- Windows PowerShell 5.1+ with the ActiveDirectory module.
- An account delegated to create users in the selected OU and edit the listed groups.
- A CSV following [`../examples/users.csv`](../examples/users.csv).

## Preview first

```powershell
./New-BulkAdUsers.ps1 -CsvPath ../examples/users.csv -TargetOu 'OU=Test,DC=example,DC=com' -WhatIf
```

To apply, obtain the initial password from a secure secret mechanism and pass it at runtime. Do not add it to a command history, CSV, or source file.

```powershell
./New-BulkAdUsers.ps1 -CsvPath users.csv -TargetOu 'OU=NewJoiners,DC=example,DC=com' -DefaultPassword '<secure runtime value>' -RequirePasswordChange
```

## Output and recovery

The CSV report records `Previewed`, `Created`, or `Failed` for every row. This tool deliberately does not delete accounts automatically; review the report and use your approved deprovisioning procedure if a rollback is needed.
