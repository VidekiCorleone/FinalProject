package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity

class ChoosingMenuActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_choosing_menu)


        val myProfileBTN = findViewById<Button>(R.id.myCarBTN)
        val parkingSlotsBTN = findViewById<Button>(R.id.ParkingPickBTN)
        val myReservationsBTN = findViewById<Button>(R.id.MyBookingBTN)
        val logOutBTN = findViewById<Button>(R.id.LogoutBTN)
        val carProfileBTN = findViewById<Button>(R.id.myCarBTN)


        myProfileBTN.setOnClickListener {
            val intent = Intent(this, MyProfileActivity::class.java)
            startActivity(intent)
        }

        parkingSlotsBTN.setOnClickListener {
            val intent = Intent(this, ParkingHouseChooserActivity::class.java)
            startActivity(intent)
        }

        myReservationsBTN.setOnClickListener {
            val intent = Intent(this, MyReservationActivity::class.java)
            startActivity(intent)
        }

        carProfileBTN.setOnClickListener {
            val intent = Intent(this, CarProfileActivity::class.java)
            startActivity(intent)
        }

        logOutBTN.setOnClickListener {
            val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
            sharedPreferences.edit().remove("TOKEN").apply()
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

    }
}