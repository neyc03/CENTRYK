@echo off
title Compilador Centryx MDM Agent APK
color 0A
echo ============================================================
echo      COMPILADOR DE AGENTE ANDROID DPC (CENTRYX MDM)
echo ============================================================
echo.

set FOUND=0

if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo Iniciando Android Studio desde Program Files...
    start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0"
    set FOUND=1
) else if exist "C:\Program Files\Android\Android Studio\studio64.exe" (
    echo Iniciando Android Studio...
    start "" "C:\Program Files\Android\Android Studio\studio64.exe" "%~dp0"
    set FOUND=1
) else if exist "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" (
    echo Iniciando Android Studio desde LocalAppData...
    start "" "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" "%~dp0"
    set FOUND=1
)

if %FOUND%==1 (
    echo.
    echo [OK] Android Studio abierto exitosamente con la carpeta de Android!
    echo.
    echo Pasos finales en Android Studio para generar la APK:
    echo 1. En el menú de arriba haz clic en: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
    echo 2. Tu archivo centryx-agent.apk quedara listo!
) else (
    echo [ATENCION] No se encontro Android Studio en la ruta por defecto.
    echo.
    echo PASO FACIL MANUAL:
    echo 1. Abre Android Studio desde tu Menu de Inicio de Windows.
    echo 2. Haz clic en "Open" (Abrir) y selecciona esta carpeta:
    echo    %~dp0
    echo 3. Arriba ve al menú: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
)

echo.
pause
