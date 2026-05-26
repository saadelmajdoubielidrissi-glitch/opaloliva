Get-ChildItem "src/components/site" -Filter "*.jsx" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "from '\.\.\/i18n\/", "from '../../i18n/"
    $content = $content -replace "from '\.\.\/lib\/", "from '../../lib/"
    Set-Content $_.FullName $content
    Write-Host "Fixed: $($_.Name)"
}
Write-Host "All imports fixed!"
