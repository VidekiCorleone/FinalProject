package com.example.final20

import android.content.Intent
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.GridLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Path

// Az API által visszaadott adatok
data class ParkhouseCapacity(val capacity: Int)
data class ReservedSlotsResponse(val reservedSlots: List<Int>)

// Retrofit interfész a parkolóház kapacitásának lekérdezéséhez
interface ParkhouseService {
    @GET("parkhouse/capacity/{id}")
    fun getParkhouseCapacity(@Path("id") parkhouseId: Int): Call<ParkhouseCapacity>
}

// Retrofit interfész a foglalt helyek lekérdezéséhez
interface ReservedSlotsService {
    @GET("parkhouse/reservedSlots/{id}")
    fun getReservedSlots(@Path("id") parkhouseId: Int): Call<ReservedSlotsResponse>
}

class ParkingHouseAActivity : AppCompatActivity() {

    private var selectedNum: Int = 0
    private lateinit var buttonContainer: GridLayout
    private val buttonList = mutableListOf<Button>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_parking_house_aactivity)
        buttonContainer = findViewById(R.id.buttonContainer)

        // API hívások: először lehívjuk a kapacitást, majd a foglalt helyeket
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


    private fun createDynamicButtons() {
        val parkhouseId = 1 // Az aktuális parkolóház azonosítója
        val parkhouseService = RetrofitClient.instance.create(ParkhouseService::class.java)

        // Lekérjük a parkolóház kapacitását
        parkhouseService.getParkhouseCapacity(parkhouseId).enqueue(object : Callback<ParkhouseCapacity> {
            override fun onResponse(call: Call<ParkhouseCapacity>, response: Response<ParkhouseCapacity>) {
                if (response.isSuccessful) {
                    val capacity = response.body()?.capacity ?: 0
                    // A kapacitás lekérése után kérjük le a foglalt slotok sorszámát
                    getReservedSlotsAndGenerateButtons(parkhouseId, capacity)
                } else {
                    Toast.makeText(this@ParkingHouseAActivity, "Error fetching capacity", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ParkhouseCapacity>, t: Throwable) {
                Toast.makeText(this@ParkingHouseAActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun getReservedSlotsAndGenerateButtons(parkhouseId: Int, capacity: Int) {
        val reservedSlotsService = RetrofitClient.instance.create(ReservedSlotsService::class.java)
        reservedSlotsService.getReservedSlots(parkhouseId).enqueue(object : Callback<ReservedSlotsResponse> {
            override fun onResponse(call: Call<ReservedSlotsResponse>, response: Response<ReservedSlotsResponse>) {
                if (response.isSuccessful) {
                    // A szerver által visszaküldött foglalt helyek listáját Set-é alakítjuk
                    val reservedSlots = response.body()?.reservedSlots?.toSet() ?: emptySet()
                    generateButtons(capacity, reservedSlots)
                } else {
                    // Hiba esetén üres foglalt lista
                    generateButtons(capacity, emptySet())
                }
            }

            override fun onFailure(call: Call<ReservedSlotsResponse>, t: Throwable) {
                // Hálózati hiba esetén üres foglalt lista
                generateButtons(capacity, emptySet())
            }
        })
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
                cornerRadius = 16f  // lekerekített sarkok
                // Ha a slot szerepel a foglalt listában, piros, különben zöld
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
}
