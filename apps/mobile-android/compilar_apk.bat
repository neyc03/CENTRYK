@echo off
title Compilador Centryx MDM Agent APK
echo ============================================================
echo      COMPILADOR DE AGENTE ANDROID DPC (CENTRYX MDM)
echo ============================================================
echo.
echo Abriendo proyecto Android Kotlin en Android Studio...
echo.
if exist "C:\Program Files\Android\Android Studio\bin\studio64.exe" (
    start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0"
    echo [OK] Android Studio iniciado con el proyecto.
    echo.
    echo Pasos finales en Android Studio:
    echo 1. Haz clic arriba en el menú: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
    echo 2. Tu archivo centryx-agent.apk quedará listo en: app\build\outputs\apk\release\
) else (
    echo [INFO] Por favor abre Android Studio -> Open Folder -> Selecciona:
    echo %~dp0
)
echo.
pause
