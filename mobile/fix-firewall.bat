@echo off
echo Adding Windows Firewall rule for Expo Mobile Testing...
netsh advfirewall firewall add rule name="Expo Port 8081" dir=in action=allow protocol=TCP localport=8081
echo.
echo =======================================================
echo Success! The firewall is now allowing your phone to connect!
echo Please go back to your terminal, press Ctrl+C to stop the server,
echo then run 'npx expo start -c' and scan the QR code.
echo =======================================================
pause
