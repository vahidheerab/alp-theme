param(
  [string[]]$Queries = @(),
  [string]$OutDir = "$PSScriptRoot\..\img-candidates"
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$all = @()
foreach ($q in $Queries) {
  $enc = [uri]::EscapeDataString($q)
  $url = "https://api.openverse.org/v1/images/?q=$enc&page_size=8&size=large&mature=false"
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -Headers @{ "User-Agent" = "AlpDesignBot/1.0" }
    $j = $r.Content | ConvertFrom-Json
    foreach ($it in $j.results) {
      $all += [pscustomobject]@{
        q     = $q
        title = $it.title
        url   = $it.url
        thumb = $it.thumbnail
        src   = $it.source
        lic   = "$($it.license) $($it.license_version)"
        page  = $it.foreign_landing_url
      }
    }
  } catch { Write-Host "query failed: $q -> $($_.Exception.Message)" }
}
$all | ConvertTo-Json -Depth 4 | Out-File -FilePath "$OutDir\candidates.json" -Encoding utf8
$i = 0
foreach ($c in $all) {
  $i++
  $fn = "{0:d3}_{1}.jpg" -f $i, ($c.q -replace '[^\w]', '_')
  $p = Join-Path $OutDir $fn
  if ($c.thumb -and !(Test-Path $p)) {
    try { Invoke-WebRequest -Uri $c.thumb -UseBasicParsing -TimeoutSec 25 -OutFile $p } catch { Write-Host "dl fail $fn" }
  }
}
Write-Host "total candidates: $($all.Count)"
$all | ForEach-Object { "$($_.q) :: $($_.title) :: $($_.src) :: $($_.url)" }
