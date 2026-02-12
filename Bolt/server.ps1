# ArcadeX Web Server — PowerShell HTTP Listener
# Serves files from the current directory on http://localhost:8080
# Press Ctrl+C to stop

$port = 8080
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

$mimeTypes = @{
    '.html' = 'text/html'
    '.css'  = 'text/css'
    '.js'   = 'application/javascript'
    '.json' = 'application/json'
    '.png'  = 'image/png'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.gif'  = 'image/gif'
    '.svg'  = 'image/svg+xml'
    '.ico'  = 'image/x-icon'
    '.woff' = 'font/woff'
    '.woff2'= 'font/woff2'
    '.ttf'  = 'font/ttf'
    '.mp3'  = 'audio/mpeg'
    '.mp4'  = 'video/mp4'
    '.webp' = 'image/webp'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host ""
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host "   ArcadeX Web Server" -ForegroundColor White
Write-Host "   Running on: http://localhost:$port" -ForegroundColor Green
Write-Host "   Root: $root" -ForegroundColor DarkGray
Write-Host "   Press Ctrl+C to stop" -ForegroundColor DarkGray
Write-Host "  ========================================" -ForegroundColor Cyan
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq '/') { $urlPath = '/index.html' }

        $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/', '\'))
        $timestamp = Get-Date -Format "HH:mm:ss"

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { 'application/octet-stream' }
            
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($content, 0, $content.Length)
            
            Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
            Write-Host "200" -NoNewline -ForegroundColor Green
            Write-Host " $urlPath" -ForegroundColor White
        } else {
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("<html><body style='background:#0a0a0f;color:#f0f0f5;font-family:Inter,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh'><div style='text-align:center'><h1>404</h1><p>Page not found</p><a href='/' style='color:#7c3aed'>Go Home</a></div></body></html>")
            $response.ContentType = 'text/html'
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
            
            Write-Host "  [$timestamp] " -NoNewline -ForegroundColor DarkGray
            Write-Host "404" -NoNewline -ForegroundColor Red
            Write-Host " $urlPath" -ForegroundColor White
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "`n  Server stopped." -ForegroundColor Yellow
}
