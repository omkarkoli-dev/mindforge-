$content = Get-Content -Path "scripts/demo-data.js" -Raw
$pattern = [regex]'\s*([a-zA-Z0-9_]+):\s*\{\s*id:\s*[''"]([^''"]+)[''"],'
$matches = $pattern.Matches($content)
foreach ($m in $matches) {
    Write-Host "Lesson ID in demo-data: $($m.Groups[2].Value)"
}
