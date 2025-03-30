package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class MyProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_my_profile)

        val backBTN = findViewById<Button>(R.id.BackBTN)
        val modifyMyDataBTN = findViewById<Button>(R.id.ChangeMyDataBTN)
        val nameET = findViewById<EditText>(R.id.nameET)
        val emailET = findViewById<EditText>(R.id.emailET)
        val passwordET = findViewById<EditText>(R.id.passwordET)
        val usernameET = findViewById<EditText>(R.id.usernameET)
        val telnumberET = findViewById<EditText>(R.id.telNumberET)

        // Token lekérése a SharedPreferences-ből
        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
        val token = sharedPreferences.getString("TOKEN", null) // A mentett token kiolvasása

        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Token hiányzik, jelentkezz be újra!", Toast.LENGTH_SHORT).show()
            return
        }

        // "Vissza" gomb eseménykezelés
        backBTN.setOnClickListener {
            val intent = Intent(this, ChoosingMenuActivity::class.java)
            startActivity(intent)
        }

        // A profil adatok betöltése
        loadUserProfile(token, nameET, emailET, passwordET, telnumberET, usernameET)

        modifyMyDataBTN.setOnClickListener {
            val name = nameET.text.toString().trim()
            val email = emailET.text.toString().trim()
            val phone = telnumberET.text.toString()
                .trim() // Hibajavítás: helyesen a telefon mezőt használjuk
            val username = usernameET.text.toString().trim()
            val newPassword = passwordET.text.toString().trim() // Új jelszó mező

            val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
            val token = sharedPreferences.getString("TOKEN", null)

            if (token.isNullOrEmpty()) {
                Toast.makeText(
                    this,
                    "Token hiányzik, kérlek jelentkezz be újra!",
                    Toast.LENGTH_SHORT
                ).show()
                return@setOnClickListener
            }

            val client = OkHttpClient()
            val json = JSONObject().apply {
                put("name", name)
                put("email", email)
                put("phone_num", phone) // Telefon mező helyes használata
                put("username", username) // Felhasználónév
                put("password", newPassword) // Jelszó
            }

            val body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                json.toString()
            )
            val request = Request.Builder()
                .url("http://10.0.2.2:3000/profileDataUpdate") // Backend PUT végpont az adatok frissítéséhez
                .addHeader("Authorization", "Bearer $token")
                .put(body) // PUT kérés
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@MyProfileActivity,
                            "Nem sikerült frissíteni az adatokat!",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        // Szerver válaszának feldolgozása
                        val responseBody = response.body()?.string()
                        val jsonResponse = JSONObject(responseBody)

                        val updatedUsername =
                            jsonResponse.optString("username") // Frissített felhasználónév

                        // SharedPreferences frissítése az új felhasználónévvel
                        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                        sharedPreferences.edit().putString("USERNAME", updatedUsername).apply()

                        runOnUiThread {
                            Toast.makeText(
                                this@MyProfileActivity,
                                "Adatok sikeresen frissítve!",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(
                                this@MyProfileActivity,
                                "Hiba történt: ${response.message()}",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                }
            })
        }
    }

    // Adatok újratöltése az onResume segítségével
    override fun onResume() {
        super.onResume()
        val token = getSharedPreferences("MyAppPrefs", MODE_PRIVATE).getString("TOKEN", null)

        if (!token.isNullOrEmpty()) {
            val nameET = findViewById<EditText>(R.id.nameET)
            val emailET = findViewById<EditText>(R.id.emailET)
            val passwordET = findViewById<EditText>(R.id.passwordET)
            val telnumberET = findViewById<EditText>(R.id.telNumberET)
            val usernameET = findViewById<EditText>(R.id.usernameET)

            loadUserProfile(token, nameET, emailET, passwordET, telnumberET, usernameET)
        } else {
            Toast.makeText(this, "Token hiányzik, jelentkezz be újra!", Toast.LENGTH_SHORT).show()
        }
    }

    private fun loadUserProfile(
        token: String,
        nameET: EditText,
        emailET: EditText,
        passwordET: EditText,
        telnumberET: EditText,
        usernameET: EditText
    ) {
        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
        val currentUsername =
            sharedPreferences.getString("USERNAME", null) // Frissített felhasználónév

        val client = OkHttpClient()
        val request = Request.Builder()
            .url("http://10.0.2.2:3000/profile?username=$currentUsername") // Új felhasználónév használata
            .addHeader(
                "Authorization",
                "Bearer $token"
            ) // Token hozzáadása az Authorization headerhez
            .get()
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(
                        this@MyProfileActivity,
                        "Nem sikerült lekérni az adatokat!",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val responseBody = response.body()?.string()
                    val json = JSONObject(responseBody)

                    runOnUiThread {
                        nameET.setText(json.optString("name"))
                        emailET.setText(json.optString("email"))
                        passwordET.setText("******") // Biztonsági okokból ne jelenítsd meg a jelszót
                        telnumberET.setText(json.optString("phone_num"))
                        usernameET.setText(json.optString("username"))
                    }
                } else {
                    runOnUiThread {
                        Toast.makeText(
                            this@MyProfileActivity,
                            "Hiba történt: ${response.message()}",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        })
    }
}
