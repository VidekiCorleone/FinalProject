package com.example.final20


import android.content.Intent
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

data class ParkhouseCapacity(val capacity: Int)

// Retrofit interfész az API végpont lekérdezéséhez
interface ParkhouseService {
    @GET("/parkhouse/capacity/1")
    fun getParkhouseCapacity(): Call<ParkhouseCapacity>
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
        // Retrofit példány létrehozása
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/") // A szerver alap URL-je (10.0.2.2 az emulátornak)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val service = retrofit.create(ParkhouseService::class.java)

        service.getParkhouseCapacity().enqueue(object : retrofit2.Callback<ParkhouseCapacity> {
            override fun onResponse(call: Call<ParkhouseCapacity>, response: retrofit2.Response<ParkhouseCapacity>) {
                if (response.isSuccessful) {
                    val capacity = response.body()?.capacity ?: 0
                    generateButtons(capacity)
                } else {
                    Toast.makeText(this@ParkingHouseAActivity, "Hiba a kapacitás lekérdezésénél", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ParkhouseCapacity>, t: Throwable) {
                Toast.makeText(this@ParkingHouseAActivity, "Hálózati hiba: ${t.message}", Toast.LENGTH_SHORT).show()
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
            button.setOnClickListener {
                selectedNum = i
                val dialog = DialogFragment(selectedNum)
                dialog.show(supportFragmentManager, "CustomDialog")
            }
            buttonContainer.addView(button)
            buttonList.add(button)
        }
    }
}
