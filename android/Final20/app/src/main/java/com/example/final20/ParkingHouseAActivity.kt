package com.example.final20


import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.GridLayout
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.final20.R.id.buttonContainer
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

data class ParkhouseCapacity(val capacity: Int)

// Retrofit interfész az API végpont lekérdezéséhez
interface ParkhouseService {
    @GET("parkhouse/capacity/{id}")
    fun getParkhouseCapacity(@Path("id") parkhouseId: Int): Call<ParkhouseCapacity>
}

class ParkingHouseAActivity : AppCompatActivity() {

    private var selectedNum: Int = 0


    private lateinit var createButtons: Button
    private lateinit var buttonContainer: GridLayout
    private val buttonList = mutableListOf<Button>() // Lista a gombok tárolására


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking_house_aactivity)


        buttonContainer = findViewById(R.id.buttonContainer)

        // Az alkalmazás indításakor hívjuk meg a `createDynamicButtons` metódust
        createDynamicButtons()

        val BTN_back = findViewById<Button>(R.id.backBTN);
        BTN_back.setOnClickListener {
            val intent = Intent(this, ParkingHouseChooserActivity::class.java)
            startActivity(intent)
        }
    }
    private fun createDynamicButtons() {
        val service = RetrofitClient.instance.create(ParkhouseService::class.java)

        val parkhouseId = 1 // Use the appropriate ID for Parking House A
        service.getParkhouseCapacity(parkhouseId).enqueue(object : retrofit2.Callback<ParkhouseCapacity> {
            override fun onResponse(call: Call<ParkhouseCapacity>, response: retrofit2.Response<ParkhouseCapacity>) {
                if (response.isSuccessful) {
                    val capacity = response.body()?.capacity ?: 0
                    generateButtons(capacity)
                } else {
                    Toast.makeText(this@ParkingHouseAActivity, "Error fetching capacity", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ParkhouseCapacity>, t: Throwable) {
                Toast.makeText(this@ParkingHouseAActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun generateButtons(numberOfButtons: Int) {
        Log.d("ParkingHouseAActivity", "Gombok generálása, száma: $numberOfButtons")
        buttonContainer.removeAllViews()
        buttonList.clear()

        for (i in 1..numberOfButtons) {
            val button = Button(this)
            button.text = "Parking slot $i"
            button.layoutParams = GridLayout.LayoutParams().apply {
                width = 500
                height = GridLayout.LayoutParams.WRAP_CONTENT
                setMargins(8, 8, 8, 8)


            }

            val shape = GradientDrawable()
            shape.cornerRadius = 16f // Set corner radius
            shape.setColor(resources.getColor(android.R.color.holo_blue_light, theme)) // Set background color
            button.background = shape



            button.setOnClickListener {
                selectedNum = i
                val parkhouseName = intent.getStringExtra("parkhouseName") ?: "Ismeretlen"
                val parkhouseId = intent.getIntExtra("parkhouseId", 0) // ID lekérése
                val dialog = DialogFragment(selectedNum,parkhouseName ,parkhouseId.toString()) // ID átadása
                dialog.show(supportFragmentManager, "CustomDialog")
            }
            buttonContainer.addView(button)
            buttonList.add(button)
        }
    }
}
