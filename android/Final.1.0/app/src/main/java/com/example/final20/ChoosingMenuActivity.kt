package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class ChoosingMenuActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_choosing_menu)


        val myProfileBTN = findViewById<Button>(R.id.MyProfileBTN)
        val parkingSlotsBTN = findViewById<Button>(R.id.ParkingPickBTN)
        val myReservationsBTN = findViewById<Button>(R.id.MyBookingBTN)
        val logOutBTN = findViewById<Button>(R.id.LogoutBTN)


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

        logOutBTN.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }

    }
}