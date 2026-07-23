package io.centryx.mdm

import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import org.json.JSONArray
import org.json.JSONObject

class AppManager(private val context: Context) {

    private val dpm = context.getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
    private val compName = ComponentName(context, CentryxDeviceAdminReceiver::class.java)

    /**
     * Lista el 100% de las aplicaciones instaladas en el telefono Android
     */
    fun getInstalledApplicationsJson(): String {
        val packageManager = context.packageManager
        val packages = packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
        val jsonArray = JSONArray()

        for (appInfo in packages) {
            // Filtrar apps del sistema si se requiere o incluir todas
            val appName = packageManager.getApplicationLabel(appInfo).toString()
            val packageName = appInfo.packageName
            val isSystemApp = (appInfo.flags and ApplicationInfo.FLAG_SYSTEM) != 0

            val isSuspended = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N && dpm.isDeviceOwnerApp(context.packageName)) {
                dpm.isPackageSuspended(compName, packageName)
            } else {
                false
            }

            val appObj = JSONObject().apply {
                put("name", appName)
                put("package", packageName)
                put("is_system", isSystemApp)
                put("is_suspended", isSuspended)
            }
            jsonArray.put(appObj)
        }

        return jsonArray.toString()
    }

    /**
     * Suspende (Bloquea) u Oculta una aplicacion especifica mediante DevicePolicyManager.setPackagesSuspended()
     */
    fun setAppSuspended(packageName: String, suspend: Boolean): Boolean {
        return try {
            if (dpm.isDeviceOwnerApp(context.packageName) || dpm.isAdminActive(compName)) {
                val packagesToSuspend = arrayOf(packageName)
                val result = dpm.setPackagesSuspended(compName, packagesToSuspend, suspend)
                result.isEmpty()
            } else {
                false
            }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    /**
     * Activa el Modo Kiosko (Fijacion de pantalla a app unica) mediante setLockTaskPackages()
     */
    fun enableKioskMode(activity: Activity, kioskPackageName: String) {
        try {
            if (dpm.isDeviceOwnerApp(context.packageName)) {
                dpm.setLockTaskPackages(compName, arrayOf(kioskPackageName))
                activity.startLockTask()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Desactiva el Modo Kiosko
     */
    fun disableKioskMode(activity: Activity) {
        try {
            activity.stopLockTask()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
