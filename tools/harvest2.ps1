param(
  [string[]]$Queries = @(),
  [string]$Source = "",
  [switch]$NoSize,
  [string]$OutDir = "$PSScriptRoot\..\img-candidates2"
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$all = @()
foreach ($q in $Queries) {
  $enc = [uri]::EscapeDataString($q)
  $url = "https://api.openverse.org/v1/images/?q=$enc&page_size=8&mature=false"
  if (-not $NoSize) { $url += "&size=large" }
  if ($Source) { $url += "&source=$Source" }
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -Headers @{ "User-Agent" = "AlpDesignBot/1.0" }
    $j = $r.Content | ConvertFrom-Json
    foreach ($it in $j.results) {
      if (-not $it.url) { continue }
      $all += [pscustomobject]@{
        q = $q; title = $it.title; url = $it.url; src = $it.source
        lic = "$($it.license) $($it.license_version)"; page = $it.foreign_landing_url
      }
    }
  } catch { Write-Host "query failed: $q -> $($_.Exception.Message)" }
}
function Get-LocalUrl([string]$u) {
  if ($u -match '^https://upload\.wikimedia\.org/wikipedia/commons/([0-9a-f])/([0-9a-f]{2})/(.+)$') {
    $name = $Matches[3]
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/$($Matches[1])/$($Matches[2])/$name/1200px-$name"
  }
  return $u
}
$i = 0
$manifest = @()
foreach ($c in $all) {
  $i++
  $fn = "{0:d3}_{1}.jpg" -f $i, ($c.q -replace '[^\w]', '_')
  $p = Join-Path $OutDir $fn
  if (Test-Path $p) { $manifest += "$fn`t$($c.title)`t$($c.url)"; continue }
  try {
    Invoke-WebRequest -Uri (Get-LocalUrl $c.url) -UseBasicParsing -TimeoutSec 40 -OutFile $p -Headers @{ "User-Agent" = "AlpDesignBot/1.0 (design)" }
    $manifest += "$fn`t$($c.title)`t$($c.url)"
  } catch { Remove-Item $p -ErrorAction SilentlyContinue; Write-Host "dl fail $fn" }
}
$manifest | Out-File -FilePath "$OutDir\manifest.txt" -Encoding utf8
Write-Host "candidates=$($all.Count) downloaded=$((Get-ChildItem $OutDir -Filter *.jpg).Count)"
