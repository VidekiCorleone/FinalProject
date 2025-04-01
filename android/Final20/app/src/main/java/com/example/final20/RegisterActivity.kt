package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

interface ApiService {
    @POST("register")
    fun registerUser(@Body request: RegisterRequest): Call<ResponseBody>
}

data class RegisterRequest(
    val registerUser: String,
    val registerPassword: String,
    val registerEmail: String,
    val registerName: String,
)

class RegisterActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val registerBTN = findViewById<Button>(R.id.RegisterBTN)
        val backBTN = findViewById<Button>(R.id.BackBTN)
        val usernameET = findViewById<EditText>(R.id.userNameET)
        val passwordET = findViewById<EditText>(R.id.passwordET)
        val emailET = findViewById<EditText>(R.id.email_REG_ET)
        val name_REG_ET = findViewById<EditText>(R.id.name_REG_ET)

        backBTN.setOnClickListener {
            finish()
        }

        registerBTN.setOnClickListener {
            val username = usernameET.text.toString().trim()
            val password = passwordET.text.toString().trim()
            val email = emailET.text.toString().trim()
            val name = name_REG_ET.text.toString().trim()

            if (username.isEmpty() || password.isEmpty() || email.isEmpty() || name.isEmpty()) {
                Toast.makeText(this, "Minden mezőt ki kell tölteni!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            registerUser(username, password, email, name)
        }
    }

    private fun registerUser(username: String, password: String, email: String, name: String) {
        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val apiService = retrofit.create(ApiService::class.java)
        val request = RegisterRequest(username, password, email, name)
        val call = apiService.registerUser(request)

        call.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    runOnUiThread {
                        Toast.makeText(this@RegisterActivity, "Sikeres regisztráció", Toast.LENGTH_LONG).show()

                        val registerBTN = findViewById<Button>(R.id.RegisterBTN)
                        registerBTN.setOnClickListener {
                            val intent = Intent(this@RegisterActivity, LoginActivity::class.java)
                            startActivity(intent)
                            finish()
                        }
                    }
                } else {
                    runOnUiThread {
                        Toast.makeText(this@RegisterActivity, "Regisztrációs hiba: ${response.message()}", Toast.LENGTH_LONG).show()
                    }
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                runOnUiThread {
                    Toast.makeText(this@RegisterActivity, "Hálózati hiba: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }
}