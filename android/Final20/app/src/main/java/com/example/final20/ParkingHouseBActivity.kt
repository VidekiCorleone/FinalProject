package com.example.final20

import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.GridLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET




class ParkingHouseBActivity : AppCompatActivity() {

    private var selectedNum: Int = 0


    private lateinit var createButtons: Button
    private lateinit var buttonContainer: GridLayout
    private val buttonList = mutableListOf<Button>() // Lista a gombok tárolására

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_parking_house_bactivity)

        buttonContainer = findViewById(R.id.buttonContainer)


        createDynamicButtons()

        val BTN_back = findViewById<Button>(R.id.backBTN)
        BTN_back.setOnClickListener {
            val intent = Intent(this, ParkingHouseChooserActivity::class.java)
            startActivity(intent)
        }

        val parkHousename = intent.getStringExtra("parkhouseName")
        val textView = findViewById<TextView>(R.id.textView6)
        textView.text = parkHousename.toString()

    }
    private fun generateButtons(numberOfButtons: Int, reservedSlots: Set<Int>) {
        Log.d("ParkingHouseAActivity", "Gombok generálása, száma: $numberOfButtons, Foglalt: $reservedSlots")
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

            val shape = GradientDrawable().apply {
                cornerRadius = 16f
                if (reservedSlots.contains(i))
                    setColor(resources.getColor(android.R.color.holo_red_dark, theme))
                else
                    setColor(resources.getColor(android.R.color.holo_green_dark, theme))
            }
            button.background = shape

            button.setOnClickListener {
                selectedNum = i
                val parkhouseName = intent.getStringExtra("parkhouseName") ?: "Ismeretlen"
                val parkhouseId = intent.getIntExtra("parkhouseId", 0)
                val dialog = DialogFragment(selectedNum, parkhouseName, parkhouseId.toString())
                dialog.show(supportFragmentManager, "CustomDialog")
            }
            buttonContainer.addView(button)
            buttonList.add(button)
        }
    }



    private fun createDynamicButtons() {
        val service = RetrofitClient.instance.create(ParkhouseService::class.java)


        val parkhouseId = 2
        service.getParkhouseCapacity(parkhouseId)
            .enqueue(object : retrofit2.Callback<ParkhouseCapacity> {
                override fun onResponse(
                    call: Call<ParkhouseCapacity>,
                    response: retrofit2.Response<ParkhouseCapacity>
                ) {
                    Log.d("ParkHouseBActivity", "Kapacitás lekérdezés indítása.")
                    if (response.isSuccessful) {
                        val capacity = response.body()?.capacity ?: 0
                        Log.d("ParkHouseBActivity", "API válasz kapacitás: $capacity")
                        getReservedSlotsAndGenerateButtons(parkhouseId,capacity)
                    } else {
                        Log.d("ParkHouseBActivity", "API válasz sikertelen.")
                        Toast.makeText(this@ParkingHouseBActivity, "Hiba a kapacitás lekérdezésénél", Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ParkhouseCapacity>, t: Throwable) {
                    Log.e("ParkHouseBActivity", "Hálózati hiba: ${t.message}")
                }
            })
    }

    private fun getReservedSlotsAndGenerateButtons(parkhouseId: Int, capacity: Int) {
        val reservedSlotsService = RetrofitClient.instance.create(ReservedSlotsService::class.java)
        reservedSlotsService.getReservedSlots(parkhouseId).enqueue(object :
            Callback<ReservedSlotsResponse> {
            override fun onResponse(call: Call<ReservedSlotsResponse>, response: Response<ReservedSlotsResponse>) {
                if (response.isSuccessful) {

                    val reservedSlots = response.body()?.reservedSlots?.toSet() ?: emptySet()
                    generateButtons(capacity, reservedSlots)
                } else {

                    generateButtons(capacity, emptySet())
                }
            }

            override fun onFailure(call: Call<ReservedSlotsResponse>, t: Throwable) {

                generateButtons(capacity, emptySet())
            }
        })
    }
}


object RetrofitClient {
    private const val BASE_URL = "http://10.0.2.2:3000/" // Az emulátor IP címe

    val instance: Retrofit by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
}

