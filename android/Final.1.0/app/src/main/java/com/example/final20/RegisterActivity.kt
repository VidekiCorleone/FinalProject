package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_register)


        val registerBTN = findViewById<Button>(R.id.RegisterBTN)
        val backBTN = findViewById<Button>(R.id.BackBTN)

        registerBTN.setOnClickListener {
            val intent = Intent(this, ChoosingMenuActivity::class.java)
            startActivity(intent)
        }

        backBTN.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
    }
}