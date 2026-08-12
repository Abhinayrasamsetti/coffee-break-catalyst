[CmdletBinding()]
param(
    [ValidateRange(1, 3650)] [int]$InactiveDays = 90,
    [string]$SearchBase,
    [string]$ExcludeSamAccountNamePath,
    [string[]]$PrivilegedGroups = @(
        'Domain Admins', 'Enterprise Admins', 'Schema Admins', 'Administrators',
        'Account Operators', 'Server Operators', 'Backup Operators', 'Print Operators'
    ),
    [string]$ReportDirectory = "reports/ad-audit-$(Get-Date -Format yyyyMMdd-HHmmss)"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Import-Module ActiveDirectory

$cutoff = (Get-Date).AddDays(-$InactiveDays)
$excluded = @{}
if ($ExcludeSamAccountNamePath) {
    if (-not (Test-Path -LiteralPath $ExcludeSamAccountNamePath)) { throw "Allowlist file not found: $ExcludeSamAccountNamePath" }
    Get-Content -LiteralPath $ExcludeSamAccountNamePath | ForEach-Object {
        $name = $_.Trim()
        if ($name -and -not $name.StartsWith('#')) { $excluded[$name.ToLowerInvariant()] = $true }
    }
}

New-Item -ItemType Directory -Force -Path $ReportDirectory | Out-Null
$query = @{ Filter = '*'; Properties = @('LastLogonDate','PasswordLastSet','PasswordNeverExpires','AccountExpirationDate','Enabled','whenCreated','DistinguishedName') }
if ($SearchBase) { $query.SearchBase = $SearchBase }

$allUsers = Get-ADUser @query
$userAudit = foreach ($user in $allUsers) {
    $reasons = [System.Collections.Generic.List[string]]::new()
    $isExcluded = $excluded.ContainsKey($user.SamAccountName.ToLowerInvariant())
    if ($user.Enabled -and -not $isExcluded) {
        if ($null -eq $user.LastLogonDate -and $user.whenCreated -lt $cutoff) { $reasons.Add('Never logged on') }
        elseif ($user.LastLogonDate -and $user.LastLogonDate -lt $cutoff) { $reasons.Add("Inactive for $InactiveDays+ days") }
    }
    if ($user.PasswordNeverExpires) { $reasons.Add('Password never expires') }
    if ($user.AccountExpirationDate -and $user.AccountExpirationDate -lt (Get-Date)) { $reasons.Add('Account expired') }
    if (-not $user.Enabled) { $reasons.Add('Account disabled') }
    if ($reasons.Count -gt 0) {
        [pscustomobject]@{
            SamAccountName = $user.SamAccountName; Name = $user.Name; Enabled = $user.Enabled
            LastLogonDate = $user.LastLogonDate; PasswordLastSet = $user.PasswordLastSet
            PasswordNeverExpires = $user.PasswordNeverExpires; AccountExpirationDate = $user.AccountExpirationDate
            WhenCreated = $user.whenCreated; ExcludedFromInactivityCheck = $isExcluded
            Findings = $reasons -join '; '; DistinguishedName = $user.DistinguishedName
        }
    }
}

$privilegedMembership = foreach ($groupName in $PrivilegedGroups) {
    try {
        $group = Get-ADGroup -Identity $groupName -ErrorAction Stop
        Get-ADGroupMember -Identity $group -Recursive -ErrorAction Stop | Where-Object objectClass -eq 'user' | ForEach-Object {
            $member = Get-ADUser -Identity $_.DistinguishedName -Properties LastLogonDate,Enabled,whenCreated -ErrorAction Stop
            $findings = [System.Collections.Generic.List[string]]::new()
            if (-not $member.Enabled) { $findings.Add('Disabled account in privileged group') }
            if (-not $excluded.ContainsKey($member.SamAccountName.ToLowerInvariant())) {
                if ($null -eq $member.LastLogonDate -and $member.whenCreated -lt $cutoff) { $findings.Add('Never logged on') }
                elseif ($member.LastLogonDate -and $member.LastLogonDate -lt $cutoff) { $findings.Add("Inactive for $InactiveDays+ days") }
            }
            if ($findings.Count -gt 0) {
                [pscustomobject]@{ PrivilegedGroup=$group.Name; SamAccountName=$member.SamAccountName; Name=$member.Name; Enabled=$member.Enabled; LastLogonDate=$member.LastLogonDate; Findings=$findings -join '; '; DistinguishedName=$member.DistinguishedName }
            }
        }
    } catch {
        Write-Warning "Could not audit group '$groupName': $($_.Exception.Message)"
    }
}

$userPath = Join-Path $ReportDirectory 'user-findings.csv'
$membershipPath = Join-Path $ReportDirectory 'privileged-group-findings.csv'
$summaryPath = Join-Path $ReportDirectory 'summary.txt'
$scopeLabel = if ($SearchBase) { $SearchBase } else { '<domain root>' }
$userAudit | Export-Csv -NoTypeInformation -LiteralPath $userPath
$privilegedMembership | Export-Csv -NoTypeInformation -LiteralPath $membershipPath
@(
    "AD audit completed: $(Get-Date -Format s)",
    "Search base: $scopeLabel",
    "Inactivity threshold: $InactiveDays days (cutoff: $($cutoff.ToString('yyyy-MM-dd')))",
    "User findings: $(@($userAudit).Count)",
    "Privileged-group findings: $(@($privilegedMembership).Count)",
    "Excluded account names: $($excluded.Count)"
) | Set-Content -LiteralPath $summaryPath
Write-Host "Audit complete. Open: $ReportDirectory"
Get-Content -LiteralPath $summaryPath
