package com.example.final20

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class PasswordChangerActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_password_changer)

        val backBTN = findViewById<Button>(R.id.backBTN2)
        val changePasswordBTN = findViewById<Button>(R.id.ChangePassBTN)
        val oldPasswordET = findViewById<EditText>(R.id.editTextText)
        val newPasswordET = findViewById<EditText>(R.id.editTextText2)
        val newPasswordAgainET = findViewById<EditText>(R.id.editTextText3)

        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
        val token = sharedPreferences.getString("TOKEN", null)

        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Token hiányzik, jelentkezz be újra!", Toast.LENGTH_SHORT).show()
            return
        }

        backBTN.setOnClickListener {
            finish()
        }

        changePasswordBTN.setOnClickListener {
            val oldPassword = oldPasswordET.text.toString().trim()
            val newPassword = newPasswordET.text.toString().trim()
            val newPasswordAgain = newPasswordAgainET.text.toString().trim()

            if (oldPassword.isEmpty() || newPassword.isEmpty() || newPasswordAgain.isEmpty()) {
                Toast.makeText(this, "Kérlek tölts ki minden mezőt!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (newPassword != newPasswordAgain) {
                Toast.makeText(this, "Az új jelszavak nem egyeznek!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val client = OkHttpClient()
            val json = JSONObject().apply {
                put("oldPassword", oldPassword)
                put("newPassword", newPassword)
            }

            val body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                json.toString()
            )

            val request = Request.Builder()
                .url("http://10.0.2.2:3000/changePassword")
                .addHeader("Authorization", "Bearer $token")
                .put(body)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@PasswordChangerActivity,
                            "Nem sikerült frissíteni a jelszót!",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        runOnUiThread {
                            Toast.makeText(
                                this@PasswordChangerActivity,
                                "Jelszó sikeresen frissítve!",
                                Toast.LENGTH_SHORT
                            ).show()
                            finish() // Visszalépés a főképernyőre
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(
                                this@PasswordChangerActivity,
                                "Hiba történt: ${response.message()}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                }
            })
        }
    }
}