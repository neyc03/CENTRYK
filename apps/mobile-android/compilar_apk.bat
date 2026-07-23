@echo off
title Compilador Centryx MDM Agent APK
color 0A
echo ============================================================
echo      COMPILADOR DE AGENTE ANDROID DPC (CENTRYX MDM)
echo ============================================================
echo.

:: Obtener ruta limpia sin comillas ni barras duplicadas
set "TARGET_DIR=%~dp0"
if "%TARGET_DIR:~-1%"=="\" set "TARGET_DIR=%TARGET_DIR:~0,-1%"

set FOUND=0

if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    echo Iniciando Android Studio desde Program Files...
    start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%TARGET_DIR%"
    set FOUND=1
) else if exist "C:\Program Files\Android\Android Studio\studio64.exe" (
    echo Iniciando Android Studio...
    start "" "C:\Program Files\Android\Android Studio\studio64.exe" "%TARGET_DIR%"
    set FOUND=1
) else if exist "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" (
    echo Iniciando Android Studio desde LocalAppData...
    start "" "%LOCALAPPDATA%\Programs\Android Studio\bin\studio64.exe" "%TARGET_DIR%"
    set FOUND=1
)

if %FOUND%==1 (
    echo.
    echo [OK] Android Studio abierto exitosamente!
    echo.
    echo Pasos finales en Android Studio para generar la APK:
    echo 1. En el menú de arriba haz clic en: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
    echo 2. Tu archivo centryx-agent.apk quedara listo!
) else (
    echo [ATENCION] No se ejecuto Android Studio automaticamente.
    echo.
    echo PASO MANUAL DIRECTO:
    echo 1. Abre Android Studio desde tu Menu de Inicio.
    echo 2. Haz clic en "Open" y busca la carpeta:
    echo    %TARGET_DIR%
    echo 3. Arriba ve al menú: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
)

echo.
pause
