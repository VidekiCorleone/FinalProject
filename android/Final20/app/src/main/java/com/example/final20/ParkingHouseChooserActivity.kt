package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Size
import android.webkit.WebSettings.TextSize
import android.widget.Button
import android.widget.LinearLayout
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.gridlayout.widget.GridLayout
import okhttp3.*
import org.json.JSONArray
import java.io.IOException



class ParkingHouseChooserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking_house_chooser)

        fetchParkhouses()


        val back_to_menu = findViewById<Button>(R.id.back_to_the_menu)
        back_to_menu.setOnClickListener {
            val intent = Intent(this, ChoosingMenuActivity::class.java)
            startActivity(intent)
        }
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

                    Log.d("fetchParkhouses", "Lekérés indult...")
                    Log.d("fetchParkhouses", "Response: $responseBody")

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
        val layout = findViewById<GridLayout>(R.id.buttonContainer2)


        for (i in 0 until jsonArray.length()) {
            val parkhouse = jsonArray.getJSONObject(i)
            val button = Button(this)


            button.text = parkhouse.optString("name", "Ismeretlen parkolóház")
            button.layoutParams = GridLayout.LayoutParams().apply {
                width = 550
                height = 550
                setMargins(20, 20, 20, 20)
                setGravity(android.view.Gravity.CENTER)

            }


            button.setOnClickListener {
                val intent = when (parkhouse.getInt("id")) {
                    1 -> Intent(this, ParkingHouseAActivity::class.java)
                    2 -> Intent(this, ParkingHouseBActivity::class.java)
                    3 -> Intent(this, ParkingHouseCActivity::class.java)
                    4 -> Intent(this, ParkingHouseDActivity::class.java)
                    else -> {
                        Toast.makeText(this, "Ismeretlen parkolóház!", Toast.LENGTH_SHORT).show()
                        return@setOnClickListener
                    }
                }


                intent.putExtra("parkhouseId", parkhouse.getInt("id"))
                intent.putExtra("parkhouseName", parkhouse.optString("name", "Ismeretlen"))

                startActivity(intent)
            }

            layout.addView(button)
        }
    }
}
