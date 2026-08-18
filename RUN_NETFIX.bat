@echo off
cd /d "%~dp0"
if not exist node_modules (
    echo Installing NETFIX dependencies...
    npm install
)
echo.
echo Starting NETFIX OTP server...
echo Open http://localhost:3000/index.html in your browser.
echo.
npm start
pause
