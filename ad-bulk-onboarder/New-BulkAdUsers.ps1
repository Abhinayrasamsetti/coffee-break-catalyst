[CmdletBinding(SupportsShouldProcess)]
param(
  [Parameter(Mandatory)] [string]$CsvPath,
  [Parameter(Mandatory)] [string]$TargetOu,
  [string]$DefaultPassword,
  [switch]$RequirePasswordChange,
  [string]$ReportPath = "reports/ad-onboarding-$(Get-Date -Format yyyyMMdd-HHmmss).csv"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Import-Module ActiveDirectory

if (-not (Test-Path -LiteralPath $CsvPath)) { throw "CSV not found: $CsvPath" }
if (-not $DefaultPassword -and -not $WhatIfPreference) { throw 'Pass -DefaultPassword only from a secure secret source.' }

$required = 'GivenName','Surname','SamAccountName','UserPrincipalName','Department','Groups'
$users = Import-Csv -LiteralPath $CsvPath
if (-not $users) { throw 'CSV has no user rows.' }
$missing = $required | Where-Object { $_ -notin $users[0].PSObject.Properties.Name }
if ($missing) { throw "Missing CSV columns: $($missing -join ', ')" }

New-Item -ItemType Directory -Force -Path (Split-Path $ReportPath) | Out-Null
$results = foreach ($user in $users) {
  $result = [ordered]@{ SamAccountName=$user.SamAccountName; Status='Skipped'; Detail='' }
  try {
    if ([string]::IsNullOrWhiteSpace($user.SamAccountName) -or [string]::IsNullOrWhiteSpace($user.UserPrincipalName)) { throw 'Account name and UPN are required.' }
    if (Get-ADUser -Filter "SamAccountName -eq '$($user.SamAccountName.Replace("'","''"))'" -ErrorAction SilentlyContinue) { throw 'Account already exists.' }
    $params = @{ Name = "$($user.GivenName) $($user.Surname)"; GivenName=$user.GivenName; Surname=$user.Surname; SamAccountName=$user.SamAccountName; UserPrincipalName=$user.UserPrincipalName; Department=$user.Department; Path=$TargetOu; Enabled=$true }
    if ($DefaultPassword) { $params.AccountPassword = ConvertTo-SecureString $DefaultPassword -AsPlainText -Force; $params.ChangePasswordAtLogon = [bool]$RequirePasswordChange }
    if ($PSCmdlet.ShouldProcess($user.SamAccountName, 'Create Active Directory user')) { New-ADUser @params }
    foreach ($group in ($user.Groups -split ';' | Where-Object { $_.Trim() })) {
      if ($PSCmdlet.ShouldProcess($user.SamAccountName, "Add to group $group")) { Add-ADGroupMember -Identity $group.Trim() -Members $user.SamAccountName }
    }
    $result.Status = if ($WhatIfPreference) { 'Previewed' } else { 'Created' }; $result.Detail = 'Validated and processed.'
  } catch { $result.Status='Failed'; $result.Detail=$_.Exception.Message }
  [pscustomobject]$result
}
$results | Export-Csv -NoTypeInformation -LiteralPath $ReportPath
$results | Format-Table -AutoSize
Write-Host "Report written to $ReportPath"
