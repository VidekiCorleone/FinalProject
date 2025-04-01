package com.example.final20

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import okhttp3.*
import org.json.JSONObject
import java.io.IOException
import android.widget.EditText
import android.widget.Toast

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main2)

        val registerBTN = findViewById<Button>(R.id.RegisterBTN)
        val loginBTN = findViewById<Button>(R.id.LoginBTN)
        val usernameET = findViewById<EditText>(R.id.userNameET)
        val passwordET = findViewById<EditText>(R.id.passwordET)

        registerBTN.setOnClickListener {
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }


        loginBTN.setOnClickListener {
            val username = usernameET.text.toString().trim()
            val password = passwordET.text.toString().trim()

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(this, "Felhasználónév vagy jelszó hiányzik!", Toast.LENGTH_SHORT).show()
            } else {
                loginUser(username, password) { success, token ->
                    runOnUiThread {
                        if (success) {
                            // JWT token mentése SharedPreferences-be
                            val sharedPreferences = getSharedPreferences("MyAppPrefs", MODE_PRIVATE)
                            sharedPreferences.edit().putString("TOKEN", token).apply()

                            // Navigálás a következő képernyőre
                            val intent = Intent(this, ChoosingMenuActivity::class.java)
                            startActivity(intent)
                        } else {
                            Toast.makeText(this, "Bejelentkezési hiba", Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            }
        }
    }


    private fun loginUser(username: String, password: String, callback: (Boolean, String?) -> Unit) {
        val client = OkHttpClient()

        val json = JSONObject().apply {
            put("loginUser", username)
            put("loginPassword", password)
        }

        val body = RequestBody.create(MediaType.parse("application/json; charset=utf-8"), json.toString())
        val request = Request.Builder()
            .url("http://10.0.2.2:3000/login") // Fontos: az "localhost"-ot cseréld "10.0.2.2"-re az emulátor miatt!
            .post(body)
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                callback(false, null)
            }

            override fun onResponse(call: Call, response: Response) {
                val responseBody = response.body()?.string()
                if (response.isSuccessful && !responseBody.isNullOrEmpty()) {
                    val jsonResponse = JSONObject(responseBody)
                    val token = jsonResponse.optString("token")
                    callback(true, token)
                } else {
                    callback(false, null)
                }
            }
        })
    }

}

