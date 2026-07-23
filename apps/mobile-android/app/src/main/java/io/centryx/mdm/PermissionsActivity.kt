package io.centryx.mdm

import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import io.centryx.mdm.services.LocationTrackerService
import io.centryx.mdm.services.UsageStatsCollectorService

class PermissionsActivity : AppCompatActivity() {

    private lateinit var tvStatus: TextView
    private lateinit var btnGrantUsageStats: Button
    private lateinit var btnGrantDeviceAdmin: Button
    private lateinit var btnCompleteEnrollment: Button

    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var compName: ComponentName

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_permissions)

        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        compName = ComponentName(this, CentryxDeviceAdminReceiver::class.java)

        tvStatus = findViewById(R.id.tvStatus)
        btnGrantUsageStats = findViewById(R.id.btnGrantUsageStats)
        btnGrantDeviceAdmin = findViewById(R.id.btnGrantDeviceAdmin)
        btnCompleteEnrollment = findViewById(R.id.btnCompleteEnrollment)

        btnGrantUsageStats.setOnClickListener {
            startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        }

        btnGrantDeviceAdmin.setOnClickListener {
            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName)
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Requerido para activar la supervisión DPC Centryx MDM.")
            startActivity(intent)
        }

        btnCompleteEnrollment.setOnClickListener {
            // Iniciar Servicios de Supervisión en Segundo Plano
            startService(Intent(this, UsageStatsCollectorService::class.java))
            startService(Intent(this, LocationTrackerService::class.java))

            tvStatus.text = "¡DISPOSITIVO AGREGADO CON ÉXITO A CENTRYX MDM!\n\nSupervisión DPC activa en segundo plano."
            Toast.makeText(this, "Dispositivo enrolado exitosamente en Centryx", Toast.LENGTH_LONG).show()

            btnCompleteEnrollment.visibility = View.GONE
            btnGrantUsageStats.visibility = View.GONE
            btnGrantDeviceAdmin.visibility = View.GONE
        }
    }
}
