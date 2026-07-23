package io.centryx.mdm.services

import android.app.Service
import android.content.Intent
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import android.os.IBinder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class LocationTrackerService : Service(), LocationListener {

    private lateinit var locationManager: LocationManager
    private val httpClient = OkHttpClient()

    private val supabaseUrl = "https://sylwwjuwxtziljjkowsz.supabase.co/rest/v1/location_pings"
    private val supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bHd3anV3eHR6aWxqamtvd3N6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDgxMjk0NSwiZXhwIjoyMTAwMzg4OTQ1fQ.16CCyu_5JhbsMUEhQh78_Pzm_649LJb-DgasnUlqDwU"

    override fun onCreate() {
        super.onCreate()
        locationManager = getSystemService(LOCATION_SERVICE) as LocationManager
        requestLocationUpdates()
    }

    private fun requestLocationUpdates() {
        try {
            locationManager.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                15000L, // Cada 15 segundos
                5f,     // O si cambia 5 metros
                this
            )
        } catch (e: SecurityException) {
            e.printStackTrace()
        }
    }

    override fun onLocationChanged(location: Location) {
        val lat = location.latitude
        val lng = location.longitude
        val speed = location.speed
        val accuracy = location.accuracy

        val jsonPayload = JSONObject().apply {
            put("latitude", lat)
            put("longitude", lng)
            put("speed", speed)
            put("accuracy", accuracy)
            put("pinged_at", SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).format(Date()))
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val body = jsonPayload.toString().toMediaType().let { mediaType ->
                    jsonPayload.toString().toRequestBody(mediaType)
                }

                val request = Request.Builder()
                    .url(supabaseUrl)
                    .addHeader("apikey", supabaseKey)
                    .addHeader("Authorization", "Bearer $supabaseKey")
                    .addHeader("Content-Type", "application/json")
                    .post(body)
                    .build()

                httpClient.newCall(request).execute()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    override fun onStatusChanged(provider: String?, status: Int, extras: Bundle?) {}
    override fun onProviderEnabled(provider: String) {}
    override fun onProviderDisabled(provider: String) {}

    override fun onBind(intent: Intent?): IBinder? = null
}
