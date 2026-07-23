package io.centryx.mdm.services

import android.app.Service
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import io.centryx.mdm.CentryxDeviceAdminReceiver
import io.centryx.mdm.PermissionsActivity

class AdminWatchdogService : Service() {

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var dpm: DevicePolicyManager
    private lateinit var compName: ComponentName

    private val watchdogRunnable = object : Runnable {
        override fun run() {
            try {
                if (!dpm.isAdminActive(compName)) {
                    val lockIntent = Intent(applicationContext, PermissionsActivity::class.java).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                    }
                    startActivity(lockIntent)
                } else {
                    dpm.setUninstallBlocked(compName, packageName, true)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
            handler.postDelayed(this, 3000)
        }
    }

    override fun onCreate() {
        super.onCreate()
        dpm = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        compName = ComponentName(this, CentryxDeviceAdminReceiver::class.java)
        handler.post(watchdogRunnable)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(watchdogRunnable)
        // Intentar auto-reiniciar el servicio guardián
        startService(Intent(this, AdminWatchdogService::class.java))
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
