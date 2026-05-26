$src = "C:\Users\T470 user\.gemini\antigravity-ide\brain\642d510a-efec-4420-a0f6-23aee50c9a67"
$dst = "C:\Users\T470 user\Desktop\Opaloliva\frontend\public\images"

New-Item -ItemType Directory -Force -Path $dst | Out-Null

$files = @{
    "hero_olive_grove_1779797268377.png" = "hero-bg.png"
    "ziziolera_product_1779797297336.png" = "ziziolera.png"
    "puntolino_product_1779797314229.png" = "puntolino.png"
    "story_olive_closeup_1779797336913.png" = "story.png"
    "about_mediterranean_1779797352760.png" = "about.png"
    "gallery_terrace_1779797378771.png" = "gallery-terrace.png"
    "gallery_garden_1779797403636.png" = "gallery-garden.png"
}

foreach ($src_file in $files.Keys) {
    $dst_file = $files[$src_file]
    $full_src = Join-Path $src $src_file
    $full_dst = Join-Path $dst $dst_file
    Copy-Item -Path $full_src -Destination $full_dst -Force
    Write-Host "Copied: $src_file -> $dst_file"
}

Write-Host "Done! Files in destination:"
Get-ChildItem $dst | Format-Table Name, Length
