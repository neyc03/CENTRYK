package io.centryx.mdm

import android.Manifest
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.BatteryManager
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.View
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import io.centryx.mdm.services.LocationTrackerService
import io.centryx.mdm.services.UsageStatsCollectorService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.UUID

class PermissionsActivity : AppCompatActivity() {

    private lateinit var tvStatus: TextView
    private lateinit var btnGrantUsageStats: Button
    private lateinit var btnGrantDeviceAdmin: Button
    private lateinit var btnGrantLocation: Button
    private lateinit var btnCompleteEnrollment: Button
    private lateinit var progressBar: ProgressBar

    private lateinit var devicePolicyManager: DevicePolicyManager
    private lateinit var compName: ComponentName
    private val httpClient = OkHttpClient()

    private val cloudEndpointUrl = "https://sylwwjuwxtziljjkowsz.supabase.co/rest/v1/devices"
    private val cloudApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_permissions)

        devicePolicyManager = getSystemService(Context.DEVICE_POLICY_SERVICE) as DevicePolicyManager
        compName = ComponentName(this, CentryxDeviceAdminReceiver::class.java)

        tvStatus = findViewById(R.id.tvStatus)
        btnGrantUsageStats = findViewById(R.id.btnGrantUsageStats)
        btnGrantDeviceAdmin = findViewById(R.id.btnGrantDeviceAdmin)
        btnGrantLocation = findViewById(R.id.btnCompleteEnrollment)
        btnCompleteEnrollment = findViewById(R.id.btnCompleteEnrollment)
        progressBar = findViewById(R.id.progressBar)

        requestSystemPermissions()

        btnGrantUsageStats.setOnClickListener {
            startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS))
        }

        btnGrantDeviceAdmin.setOnClickListener {
            val intent = Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
            intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName)
            intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "REQUERIDO: Activa el control y supervisión DPC Centryx MDM.")
            startActivity(intent)
        }

        btnCompleteEnrollment.setOnClickListener {
            registerDeviceInCloudAndFinish()
        }
    }

    private fun requestSystemPermissions() {
        val permissionsToRequest = mutableListOf<String>()

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.ACCESS_FINE_LOCATION)
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.ACCESS_COARSE_LOCATION)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_BACKGROUND_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            permissionsToRequest.add(Manifest.permission.ACCESS_BACKGROUND_LOCATION)
        }

        if (permissionsToRequest.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, permissionsToRequest.toTypedArray(), 101)
        }
    }

    private fun registerDeviceInCloudAndFinish() {
        progressBar.visibility = View.VISIBLE
        btnCompleteEnrollment.isEnabled = false
        tvStatus.text = "Sincronizando dispositivo con Centryx Enterprise Cloud..."

        val deviceName = "${Build.MANUFACTURER.uppercase()} ${Build.MODEL}"
        val androidId = Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID) ?: UUID.randomUUID().toString()
        val osVersion = "Android ${Build.VERSION.RELEASE} (API ${Build.VERSION.SDK_INT})"
        
        val batteryManager = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
        val batteryLevel = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)

        val jsonPayload = JSONObject().apply {
            put("device_name", deviceName)
            put("imei", "IMEI-$androidId")
            put("serial_number", androidId)
            put("os_version", osVersion)
            put("battery_level", if (batteryLevel > 0) batteryLevel else 88)
            put("is_locked", false)
            put("last_ping_at", java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", java.util.Locale.US).format(java.util.Date()))
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val body = jsonPayload.toString().toMediaType().let { mediaType ->
                    jsonPayload.toString().toRequestBody(mediaType)
                }

                val request = Request.Builder()
                    .url(cloudEndpointUrl)
                    .addHeader("apikey", cloudApiKey)
                    .addHeader("Authorization", "Bearer $cloudApiKey")
                    .addHeader("Content-Type", "application/json")
                    .addHeader("Prefer", "return=representation")
                    .post(body)
                    .build()

                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string()

                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnCompleteEnrollment.isEnabled = true

                    if (response.isSuccessful || response.code == 201 || response.code == 200) {
                        startService(Intent(this@PermissionsActivity, UsageStatsCollectorService::class.java))
                        startService(Intent(this@PermissionsActivity, LocationTrackerService::class.java))

                        tvStatus.text = "¡DISPOSITIVO REGISTRADO EXITOSAMENTE!\n\nModelo: $deviceName\nEstado: Conectado a la Red Corporativa Centryx"
                        Toast.makeText(this@PermissionsActivity, "Dispositivo enrolado exitosamente", Toast.LENGTH_LONG).show()

                        btnCompleteEnrollment.visibility = View.GONE
                        btnGrantUsageStats.visibility = View.GONE
                        btnGrantDeviceAdmin.visibility = View.GONE
                    } else {
                        tvStatus.text = "Error de sincronización con servidor de plataforma."
                        Toast.makeText(this@PermissionsActivity, "Error de enlace con servidor corporativo", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnCompleteEnrollment.isEnabled = true
                    tvStatus.text = "Error de conexión con el servidor de la plataforma."
                }
            }
        }
    }
}
