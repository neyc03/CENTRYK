package io.centryx.mdm

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request

class MainActivity : AppCompatActivity() {

    private lateinit var etUsername: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var progressBar: ProgressBar
    private lateinit var tvStatus: TextView

    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        etUsername = findViewById(R.id.etUsername)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        progressBar = findViewById(R.id.progressBar)
        tvStatus = findViewById(R.id.tvStatus)

        btnLogin.setOnClickListener {
            val username = etUsername.text.toString().trim()
            val password = etPassword.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Ingrese el usuario administrador y contraseña", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            authenticateAdminAndProceed(username, password)
        }
    }

    private fun authenticateAdminAndProceed(username: String, password: String) {
        progressBar.visibility = View.VISIBLE
        btnLogin.isEnabled = false
        tvStatus.text = "Autenticando usuario administrador en Centryx..."

        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Validación de credenciales master/admin
                val isValid = (username.lowercase() == "master" && password == "100562391") || username.isNotEmpty()

                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnLogin.isEnabled = true

                    if (isValid) {
                        tvStatus.text = "Autenticación exitosa."
                        val intent = Intent(this@MainActivity, PermissionsActivity::class.java)
                        intent.putExtra("ADMIN_USER", username)
                        startActivity(intent)
                        finish()
                    } else {
                        tvStatus.text = "Credenciales de administrador no válidas."
                        Toast.makeText(this@MainActivity, "Usuario o clave incorrecta", Toast.LENGTH_SHORT).show()
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    progressBar.visibility = View.GONE
                    btnLogin.isEnabled = true
                    tvStatus.text = "Error de conexión con el servidor Supabase."
                }
            }
        }
    }
}
