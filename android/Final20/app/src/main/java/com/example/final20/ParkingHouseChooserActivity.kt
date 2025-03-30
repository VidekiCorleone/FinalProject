package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class ParkingHouseChooserActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_parking_house_chooser)


        val ParkHouse_A = findViewById<TextView>(R.id.textView2)
        val ParkHouse_A_capacity = 20
        val ParkHouse_A_taken = 0
        val ParkHouse_A_BTN = findViewById<Button>(R.id.P1_BTN)

        ParkHouse_A_BTN.setOnClickListener {
            val intent = Intent(this, ParkingHouseAActivity::class.java)
            startActivity(intent)
        }

        ParkHouse_A.text = "The 'A' parkinghouse $/nFree slots: $ParkHouse_A_taken/$ParkHouse_A_capacity"


        val ParkHouse_B = findViewById<TextView>(R.id.textView)
        val ParkHouse_B_capacity = 20
        val ParkHouse_B_taken = 0
        val ParkHouse_B_BTN = findViewById<Button>(R.id.P2_BTN)

        ParkHouse_B_BTN.setOnClickListener {
            val intent = Intent(this, ParkingHouseBActivity::class.java)
            startActivity(intent)
        }

        ParkHouse_B.text = "The 'B' parkinghouse /n Free slots: $ParkHouse_B_taken/$ParkHouse_B_capacity"

        val ParkHouse_C = findViewById<TextView>(R.id.textView3)
        val ParkHouse_C_capacity = 20
        val ParkHouse_C_taken = 0
        val ParkHouse_C_BTN = findViewById<Button>(R.id.P3_BTN)

        ParkHouse_C_BTN.setOnClickListener {
            val intent = Intent(this, ParkingHouseCActivity::class.java)
            startActivity(intent)
        }

        ParkHouse_C.text = "The 'C' parkinghouse /n Free slots: $ParkHouse_C_taken/$ParkHouse_C_capacity"

        val ParkHouse_D = findViewById<TextView>(R.id.textView4)
        val ParkHouse_D_capacity = 20
        val ParkHouse_D_taken = 0
        val ParkHouse_D_BTN = findViewById<Button>(R.id.P4_BTN)

        ParkHouse_D_BTN.setOnClickListener {
            val intent = Intent(this, ParkingHouseDActivity::class.java)
            startActivity(intent)
        }

        ParkHouse_D.text = "The 'D' parkinghouse /n Free slots: $ParkHouse_D_taken/$ParkHouse_D_capacity"

        //val ParkHouse_E = findViewById<TextView>(R.id.textView5)
        //val ParkHouse_E_capacity = 20
        //val ParkHouse_E_taken = 0
        //val ParkHouse_E_BTN = findViewById<Button>(R.id.P5_BTN)

        //ParkHouse_E_BTN.setOnClickListener {
        //    val intent = Intent(this, ParkingHouseAActivity::class.java)
        //    startActivity(intent)
        //}

        //ParkHouse_D.text = "The 'D' parkinghouse /n Free slots: $ParkHouse_E_taken/$ParkHouse_E_capacity"


    }
}