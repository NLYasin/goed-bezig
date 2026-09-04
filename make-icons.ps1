param([string]$Out = "C:\Users\Admin\Downloads\goed-bezig-pwason")
Add-Type -AssemblyName System.Drawing

function C($hex){ return [System.Drawing.ColorTranslator]::FromHtml($hex) }

function RoundRect([float]$x,[float]$y,[float]$w,[float]$h,[float]$r){
  $p = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r*2
  $p.AddArc($x, $y, $d, $d, 180, 90)
  $p.AddArc($x+$w-$d, $y, $d, $d, 270, 90)
  $p.AddArc($x+$w-$d, $y+$h-$d, $d, $d, 0, 90)
  $p.AddArc($x, $y+$h-$d, $d, $d, 90, 90)
  $p.CloseFigure()
  return $p
}

function Draw-Master([float]$scale, [bool]$simple){
  $S = 1024
  $bmp = New-Object System.Drawing.Bitmap -ArgumentList $S, $S
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.Clear((C '#0E7FD4'))

  $g.TranslateTransform($S/2, $S/2)
  $g.ScaleTransform($scale, $scale)
  $g.TranslateTransform(-$S/2, -$S/2)

  if($simple){ $cx=112; $cy=176; $cw=800; $ch=672; $r=96 } else { $cx=152; $cy=176; $cw=720; $ch=672; $r=88 }
  $card = RoundRect $cx $cy $cw $ch $r

  $white = New-Object System.Drawing.SolidBrush -ArgumentList (C '#FFFFFF')
  $red   = New-Object System.Drawing.SolidBrush -ArgumentList (C '#AE1C28')
  $blue  = New-Object System.Drawing.SolidBrush -ArgumentList (C '#21468B')

  $g.FillPath($white, $card)

  $g.SetClip($card)
  $bandH = [float]($ch * 0.40 / 3)
  $by = [float]($cy + $ch - 3*$bandH)
  $g.FillRectangle($red,   [float]$cx, $by,                      [float]$cw, $bandH)
  $g.FillRectangle($white, [float]$cx, [float]($by+$bandH),      [float]$cw, $bandH)
  $g.FillRectangle($blue,  [float]$cx, [float]($by+2*$bandH),    [float]$cw, [float]($bandH+2))
  $g.ResetClip()

  if(-not $simple){
    $pen = New-Object System.Drawing.Pen -ArgumentList (C '#0E7FD4'), ([float]78)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap   = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $midY = ($cy + $by)/2
    $p1 = New-Object System.Drawing.PointF -ArgumentList ([float]($cx+$cw*0.27)), ([float]($midY+10))
    $p2 = New-Object System.Drawing.PointF -ArgumentList ([float]($cx+$cw*0.44)), ([float]($midY+120))
    $p3 = New-Object System.Drawing.PointF -ArgumentList ([float]($cx+$cw*0.74)), ([float]($midY-110))
    $g.DrawLines($pen, [System.Drawing.PointF[]]@($p1,$p2,$p3))
    $pen.Dispose()
  }
  $white.Dispose(); $red.Dispose(); $blue.Dispose()
  $g.Dispose()
  return $bmp
}

function Save-Sized($master, [int]$size, [string]$name){
  $bmpOut = New-Object System.Drawing.Bitmap -ArgumentList $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmpOut)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.DrawImage($master, 0, 0, $size, $size)
  $g.Dispose()
  $path = Join-Path $Out $name
  $bmpOut.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmpOut.Dispose()
  Write-Output "wrote $name ($size px)"
}

$any = Draw-Master 1.0 $false
foreach($s in 72,96,128,144,152,192,384,512){ Save-Sized $any $s "icon-$s.png" }
Save-Sized $any 180 "icon-180.png"
Save-Sized $any 180 "apple-touch-icon.png"
$any.Dispose()

$mask = Draw-Master 0.74 $false
Save-Sized $mask 192 "icon-maskable-192.png"
Save-Sized $mask 512 "icon-maskable-512.png"
$mask.Dispose()

$fav = Draw-Master 1.0 $true
Save-Sized $fav 32 "favicon-32.png"
Save-Sized $fav 16 "favicon-16.png"
$fav.Dispose()
