package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.GridLayout
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ParkingHouseCActivity : AppCompatActivity() {
    private var selectedNum: Int = 0


    private lateinit var createButtons: Button
    private lateinit var buttonContainer: GridLayout
    private val buttonList = mutableListOf<Button>() // Lista a gombok tárolására

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_parking_house_bactivity)

        buttonContainer = findViewById(R.id.buttonContainer)

        // Call `createDynamicButtons` when the app starts
        createDynamicButtons()

        val BTN_back = findViewById<Button>(R.id.backBTN)
        BTN_back.setOnClickListener {
            val intent = Intent(this, ParkingHouseChooserActivity::class.java)
            startActivity(intent)
        }



    }
    private fun generateButtons(numberOfButtons: Int) {
        Log.d("ParkingHouseCActivity", "Gombok generálása, száma: $numberOfButtons")
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



    private fun createDynamicButtons() {
        val service = RetrofitClient.instance.create(ParkhouseService::class.java)

        // A parkolóház ID-t dinamikusan adhatod át
        val parkhouseId = 3 // Példa ID, dinamikusan is átadható
        service.getParkhouseCapacity(parkhouseId)
            .enqueue(object : retrofit2.Callback<ParkhouseCapacity> {
                override fun onResponse(
                    call: Call<ParkhouseCapacity>,
                    response: retrofit2.Response<ParkhouseCapacity>
                ) {
                    Log.d("ParkingHouseCActivity", "Kapacitás lekérdezés indítása.")
                    if (response.isSuccessful) {
                        val capacity = response.body()?.capacity ?: 0
                        Log.d("ParkingHouseCActivity", "API válasz kapacitás: $capacity")
                        generateButtons(capacity)
                    } else {
                        Log.d("ParkingHouseCActivity", "API válasz sikertelen.")
                        Toast.makeText(this@ParkingHouseCActivity, "Hiba a kapacitás lekérdezésénél", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ParkhouseCapacity>, t: Throwable) {
                    Log.e("ParkingHouseCActivity", "Hálózati hiba: ${t.message}")
                }
            })
    }
}



