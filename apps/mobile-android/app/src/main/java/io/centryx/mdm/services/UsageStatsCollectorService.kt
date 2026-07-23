package io.centryx.mdm.services

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import io.centryx.mdm.R

class UsageStatsCollectorService : Service() {

    override fun onCreate() {
        super.onCreate()
        startForegroundServiceNotification()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        collectForegroundAppUsage()
        return START_STICKY
    }

    private fun collectForegroundAppUsage() {
        val usageStatsManager = getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager
        val endTime = System.currentTimeMillis()
        val startTime = endTime - 60000 // Captura los últimos 60 segundos

        val usageEvents = usageStatsManager.queryEvents(startTime, endTime)
        val event = UsageEvents.Event()

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event)
            if (event.eventType == UsageEvents.Event.ACTIVITY_RESUMED) {
                val packageName = event.packageName
                val timestamp = event.timeStamp
                // Almacenar en buffer offline SQLite y sincronizar con la API Backend Centryx
            }
        }
    }

    private fun startForegroundServiceNotification() {
        val channelId = "centryx_telemetry_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                channelId,
                "Centryx Security Monitor",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("Centryx MDM Activo")
            .setContentText("Monitoreo corporativo de seguridad y productividad en ejecución")
            .setSmallIcon(R.drawable.ic_launcher)
            .build()

        startForeground(1001, notification)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
