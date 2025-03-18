package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity



class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main2)


        val registerBTN = findViewById<Button>(R.id.RegisterBTN)
        val loginBTN = findViewById<Button>(R.id.LoginBTN)

        registerBTN.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }

        loginBTN.setOnClickListener {
            val intent = Intent(this, ChoosingMenuActivity::class.java)
            startActivity(intent)
        }



    }
}
