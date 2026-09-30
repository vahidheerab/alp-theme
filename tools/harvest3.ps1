param(
  [string[]]$Queries = @(),
  [string]$OutDir = "$PSScriptRoot\..\img-candidates3"
)
$ErrorActionPreference = "Stop"
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$all = @()
foreach ($q in $Queries) {
  $enc = [uri]::EscapeDataString($q)
  $url = "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=$enc&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&iiurlwidth=1400&format=json"
  try {
    $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30 -Headers @{ "User-Agent" = "AlpDesignBot/1.0 (design prototype)" }
    $j = $r.Content | ConvertFrom-Json
    foreach ($p in $j.query.pages.PSObject.Properties) {
      $ii = $p.Value.imageinfo[0]
      if (-not $ii) { continue }
      if ($ii.thumburl -notmatch '\.(jpg|jpeg|png)(\?|$)') { continue }
      $all += [pscustomobject]@{ q = $q; title = $p.Value.title; url = $ii.thumburl; page = $ii.descriptionurl }
    }
  } catch { Write-Host "query failed: $q -> $($_.Exception.Message)" }
}
$i = 0
$manifest = @()
foreach ($c in $all) {
  $i++
  $fn = "{0:d3}_{1}.jpg" -f $i, ($c.q -replace '[^\w]', '_')
  $p = Join-Path $OutDir $fn
  if (Test-Path $p) { $manifest += "$fn`t$($c.title)"; continue }
  try {
    Invoke-WebRequest -Uri $c.url -UseBasicParsing -TimeoutSec 40 -OutFile $p -Headers @{ "User-Agent" = "AlpDesignBot/1.0 (design prototype)" }
    $manifest += "$fn`t$($c.title)"
  } catch { Remove-Item $p -ErrorAction SilentlyContinue; Write-Host "dl fail $fn" }
}
$manifest | Out-File -FilePath "$OutDir\manifest.txt" -Encoding utf8
Write-Host "candidates=$($all.Count) downloaded=$((Get-ChildItem $OutDir -Filter *.jpg).Count)"
