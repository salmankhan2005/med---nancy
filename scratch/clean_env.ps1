$env_lines = Get-Content .env
foreach ($line in $env_lines) {
    if ($line -match '^([^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $val = $matches[2].Trim()
        if ($key -ne 'VITE_API_BASE_URL') {
            Write-Host "Cleaning $key on Vercel..."
            # Write to file without newline
            [System.IO.File]::WriteAllText("$(Get-Location)/temp_val.txt", $val)
            # Remove existing
            & vercel env rm $key production -y
            # Add new from file
            cmd /c "vercel env add $key production < temp_val.txt"
        }
    }
}
if (Test-Path temp_val.txt) { Remove-Item temp_val.txt }
