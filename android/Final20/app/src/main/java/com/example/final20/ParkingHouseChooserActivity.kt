package com.example.final20

import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONArray
import java.io.IOException

class ParkingHouseChooserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking_house_chooser)

        fetchParkhouses() // Parkolóházak lekérése szerverről
    }

    private fun fetchParkhouses() {
        val client = OkHttpClient()
        val request = Request.Builder()
            .url("http://10.0.2.2:3000/parkhouses")
            .get()
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@ParkingHouseChooserActivity, "Nem sikerült lekérni a parkolóházakat!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    val responseBody = response.body()?.string()
                    val jsonArray = JSONArray(responseBody)

                    runOnUiThread {
                        generateParkingButtons(jsonArray)
                    }
                } else {
                    runOnUiThread {
                        Toast.makeText(this@ParkingHouseChooserActivity, "Hiba történt: ${response.message()}", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    private fun generateParkingButtons(jsonArray: JSONArray) {
        val layout = findViewById<LinearLayout>(R.id.buttonContainer) // Hely, ahová gombokat rakunk

        for (i in 0 until jsonArray.length()) {
            val parkhouse = jsonArray.getJSONObject(i)
            val button = Button(this)

            button.text = parkhouse.getString("name") // Parkolóház neve
            button.setOnClickListener {
                Toast.makeText(this, "Kiválasztott parkolóház: ${parkhouse.getString("name")}", Toast.LENGTH_SHORT).show()
            }

            layout.addView(button) // Gomb hozzáadása a felülethez
        }
    }
}
