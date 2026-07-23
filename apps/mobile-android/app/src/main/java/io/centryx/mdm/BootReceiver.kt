package io.centryx.mdm

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import io.centryx.mdm.services.LocationTrackerService
import io.centryx.mdm.services.UsageStatsCollectorService

class BootReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED) {
            try {
                context.startService(Intent(context, UsageStatsCollectorService::class.java))
                context.startService(Intent(context, LocationTrackerService::class.java))
                context.startService(Intent(context, io.centryx.mdm.services.AdminWatchdogService::class.java))
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
