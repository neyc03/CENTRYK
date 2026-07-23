package io.centryx.mdm

import android.app.admin.DeviceAdminReceiver
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.UserManager
import android.widget.Toast

class CentryxDeviceAdminReceiver : DeviceAdminReceiver() {

    override fun onEnabled(context: Context, intent: Intent) {
        super.onEnabled(context, intent)
        
        val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        val compName = ComponentName(context, CentryxDeviceAdminReceiver::class.java)

        try {
            // 1. Bloquear desinstalación de la aplicación Centryx
            if (dpm.isDeviceOwnerApp(context.packageName) || dpm.isAdminActive(compName)) {
                dpm.setUninstallBlocked(compName, context.packageName, true)
                dpm.addUserRestriction(compName, UserManager.DISALLOW_UNINSTALL_APPS)
                dpm.addUserRestriction(compName, UserManager.DISALLOW_FACTORY_RESET)
                dpm.addUserRestriction(compName, UserManager.DISALLOW_SAFE_BOOT)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }

        Toast.makeText(context, "Centryx MDM: Administrador DPC & Protección Anti-Desinstalación ACTIVADOS", Toast.LENGTH_LONG).show()
    }

    override fun onDisableRequested(context: Context, intent: Intent): CharSequence {
        return "¡ALERTA DE SEGURIDAD CENTRYX MDM!\n\nEste teléfono está bajo supervisión corporativa. Desactivar el Administrador DPC bloqueará la unidad inmediatamente y enviará una alerta de brecha de seguridad a la consola central."
    }

    override fun onDisabled(context: Context, intent: Intent) {
        super.onDisabled(context, intent)
        Toast.makeText(context, "Advertencia: El Administrador DPC ha sido desactivado", Toast.LENGTH_LONG).show()
    }

    override fun onProfileProvisioningComplete(context: Context, intent: Intent) {
        super.onProfileProvisioningComplete(context, intent)
        Toast.makeText(context, "Centryx MDM: Provisionamiento corporativo completado", Toast.LENGTH_LONG).show()
    }
}
