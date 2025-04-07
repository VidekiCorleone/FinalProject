package com.example.final20

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONObject
import java.io.IOException

class CarProfileActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_car_profile)

        val plateNumberET = findViewById<EditText>(R.id.plateNumberET_CR)
        val carHeightET = findViewById<EditText>(R.id.heightET_CR)
        val carTypeET = findViewById<EditText>(R.id.typeET_CR)
        val registerCarBTN = findViewById<Button>(R.id.registerCarBTN) // Gomb hozzáadása
        val backBTN = findViewById<Button>(R.id.BackBTN5)


        val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
        val token = sharedPreferences.getString("TOKEN", null)

        if (token.isNullOrEmpty()) {
            Toast.makeText(this, "Token hiányzik, jelentkezz be újra!", Toast.LENGTH_SHORT).show()
            return
        }

        backBTN.setOnClickListener {
            finish()
        }

        registerCarBTN.setOnClickListener {
            val plateNumber = plateNumberET.text.toString().trim()
            val carHeight = carHeightET.text.toString().trim()
            val carType = carTypeET.text.toString().trim()

            if (plateNumber.isEmpty() || carHeight.isEmpty() || carType.isEmpty()) {
                Toast.makeText(this, "Minden mezőt ki kell tölteni!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val client = OkHttpClient()
            val json = JSONObject().apply {
                put("plate", plateNumber)
                put("height", carHeight)
                put("type", carType)
            }

            val body = RequestBody.create(
                MediaType.parse("application/json; charset=utf-8"),
                json.toString()
            )

            val request = Request.Builder()
                .url("http://10.0.2.2:3000/registerCar")
                .addHeader("Authorization", "Bearer $token")
                .post(body)
                .build()

            client.newCall(request).enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    runOnUiThread {
                        Toast.makeText(
                            this@CarProfileActivity,
                            "Nem sikerült regisztrálni az autót!",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }

                override fun onResponse(call: Call, response: Response) {
                    if (response.isSuccessful) {
                        runOnUiThread {
                            Toast.makeText(
                                this@CarProfileActivity,
                                "Az autó sikeresen regisztrálva lett!",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    } else {
                        runOnUiThread {
                            Toast.makeText(
                                this@CarProfileActivity,
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