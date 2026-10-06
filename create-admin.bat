@echo off
title Amar Dokan - Admin Account Creator
cd /d "%~dp0"
cls
echo =======================================================
echo          Amar Dokan - Create Admin Account
echo =======================================================
echo.
node scripts/create-admin.js
echo.
pause
