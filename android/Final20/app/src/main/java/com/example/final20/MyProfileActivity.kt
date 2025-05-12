package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.util.Log
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
        val usernameET = findViewById<EditText>(R.id.usernameET)
        val telnumberET = findViewById<EditText>(R.id.telNumberET)
        val passwordChanger = findViewById<Button>(R.id.passwordChangeBTN)


        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
        val token = sharedPreferences.getString("TOKEN", null)
        val userId = sharedPreferences.getString("USER_ID", null) // ID tárolása

        if (token.isNullOrEmpty() || userId.isNullOrEmpty()) {
            Toast.makeText(this, "Token vagy ID hiányzik, jelentkezz be újra!", Toast.LENGTH_SHORT).show()
            return
        }


        loadUserProfile(token, userId, nameET, emailET, telnumberET, usernameET)

        backBTN.setOnClickListener {
            startActivity(Intent(this, ChoosingMenuActivity::class.java))
        }

        passwordChanger.setOnClickListener {
            startActivity(Intent(this, PasswordChangerActivity::class.java))
        }

        modifyMyDataBTN.setOnClickListener {
            val name = nameET.text.toString().trim()
            val email = emailET.text.toString().trim()
            val phone = telnumberET.text.toString().trim()
            val username = usernameET.text.toString().trim()


            if (name.isEmpty() || email.isEmpty() || phone.isEmpty() || username.isEmpty()) {
                Toast.makeText(this, "Kérlek tölts ki minden mezőt!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val client = OkHttpClient()
            val json = JSONObject().apply {
                put("id", userId) // ID hozzáadása
                put("name", name)
                put("email", email)
                put("phone_num", phone)
                put("username", username)

            }

            val body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                json.toString()
            )

            val request = Request.Builder()
                .url("http://10.0.2.2:3000/profileDataUpdate")
                .addHeader("Authorization", "Bearer $token")
                .put(body)
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

    private fun loadUserProfile(
        token: String,
        userId: String,
        nameET: EditText,
        emailET: EditText,

        telnumberET: EditText,
        usernameET: EditText
    ) {
        val client = OkHttpClient()
        val request = Request.Builder()
            .url("http://10.0.2.2:3000/profile?id=$userId") // ID alapján keresés
            .addHeader("Authorization", "Bearer $token")
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
