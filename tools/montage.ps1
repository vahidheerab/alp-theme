param(
  [string]$SrcDir = "C:\laragon\www\Alp\img-candidates2",
  [string]$OutDir = "C:\laragon\www\Alp\sheets",
  [int]$Cols = 6,
  [int]$Cell = 230,
  [int]$Label = 22
)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing
if (!(Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
$files = Get-ChildItem $SrcDir -Filter *.jpg | Sort-Object Name
$perSheet = $Cols * 4
$sheets = [math]::Ceiling($files.Count / $perSheet)
for ($s = 0; $s -lt $sheets; $s++) {
  $batch = $files | Select-Object -Skip ($s * $perSheet) -First $perSheet
  $rows = [math]::Ceiling($batch.Count / $Cols)
  $w = $Cols * $Cell
  $h = $rows * ($Cell + $Label)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::FromArgb(30, 30, 30))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
  $font = New-Object System.Drawing.Font("Segoe UI", 9)
  $brush = [System.Drawing.Brushes]::White
  for ($i = 0; $i -lt $batch.Count; $i++) {
    $col = $i % $Cols; $row = [math]::Floor($i / $Cols)
    $x = $col * $Cell; $y = $row * ($Cell + $Label)
    try {
      $img = [System.Drawing.Image]::FromFile($batch[$i].FullName)
      $scale = [math]::Min($Cell / $img.Width, $Cell / $img.Height)
      $nw = [int]($img.Width * $scale); $nh = [int]($img.Height * $scale)
      $dx = $x + [int](($Cell - $nw) / 2); $dy = $y + [int](($Cell - $nh) / 2)
      $g.DrawImage($img, $dx, $dy, $nw, $nh)
      $img.Dispose()
    } catch { $g.DrawString("ERR", $font, $brush, $x + 8, $y + 8) }
    $name = $batch[$i].BaseName
    if ($name.Length -gt 30) { $name = $name.Substring(0, 30) }
    $g.DrawString($name, $font, $brush, $x + 4, $y + $Cell + 3)
  }
  $out = Join-Path $OutDir ("sheet{0:d2}.png" -f ($s + 1))
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $g.Dispose(); $bmp.Dispose()
  Write-Host "wrote $out"
}
