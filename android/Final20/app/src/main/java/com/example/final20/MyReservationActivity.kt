package com.example.final20

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Header
import java.util.concurrent.TimeUnit


data class Reservation(
    val reservation_owner_id: Int,
    val start_time: String,
    val reservation_time_hour: Int,
    val park_slot: Int,
    val parkhouse_id: Int,
    val active: Boolean,
    val inactive: Boolean,
    val sum: Int
)


data class MyReservationResponse(
    val activeReservations: List<Reservation>,
    val inactiveReservations: List<Reservation>
)

interface MyReservationService {
    @GET("reservations/my")
    fun getMyReservations(@Header("Authorization") authHeader: String): Call<MyReservationResponse>
}


object RetrofitClientst {
    private var retrofit: Retrofit? = null


    fun getInstance(context: Context): Retrofit {
        if (retrofit == null) {
            // A token SharedPreferences-ből
            val sharedPreferences = context.getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
            val token = sharedPreferences.getString("TOKEN", "") ?: ""

            val client = OkHttpClient.Builder()
                .addInterceptor { chain ->
                    val originalRequest = chain.request()
                    val newRequest = originalRequest.newBuilder()
                        // A token formátuma: "Bearer <TOKEN>"
                        .addHeader("Authorization", "Bearer $token")
                        .build()
                    chain.proceed(newRequest)
                }
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build()

            retrofit = Retrofit.Builder()
                .baseUrl("http://10.0.2.2:3000/")  // Állítsd be a szerver URL-jét!
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofit!!
    }
}


class MyReservationActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_my_reservation)

        val activeReservationsText = findViewById<TextView>(R.id.activeReservationsText)
        val inactiveReservationsText = findViewById<TextView>(R.id.inactiveReservationsText)
        val backBTN = findViewById<Button>(R.id.backButton)

        backBTN.setOnClickListener {
            val intent = Intent(this, ChoosingMenuActivity::class.java)
            startActivity(intent)
        }


        val retrofitInstance = RetrofitClientst.getInstance(this)
        val myReservationService = retrofitInstance.create(MyReservationService::class.java)


        val sharedPreferences = getSharedPreferences("MyAppPrefs", Context.MODE_PRIVATE)
        val token = sharedPreferences.getString("TOKEN", "") ?: ""

        myReservationService.getMyReservations("Bearer $token").enqueue(object : Callback<MyReservationResponse> {
            override fun onResponse(
                call: Call<MyReservationResponse>,
                response: Response<MyReservationResponse>
            ) {
                if (!response.isSuccessful) {
                    Toast.makeText(
                        this@MyReservationActivity,
                        "Hiba a foglalások lekérésekor: ${response.message()}",
                        Toast.LENGTH_SHORT
                    ).show()
                    return
                }

                val responseBody = response.body()
                if (responseBody == null) {
                    Toast.makeText(
                        this@MyReservationActivity,
                        "Hiba a foglalások lekérésekor: Üres válasz",
                        Toast.LENGTH_SHORT
                    ).show()
                    return
                }

                val activeText = if (responseBody.activeReservations.isEmpty()) {
                    getString(R.string.no_active_reservations)
                } else {
                    responseBody.activeReservations.joinToString(separator = "\n") { reservation ->
                        "Slot: ${reservation.park_slot}, Start: ${reservation.start_time}, Duration: ${reservation.reservation_time_hour}h"
                    }
                }

                val inactiveText = if (responseBody.inactiveReservations.isEmpty()) {
                    getString(R.string.no_inactive_reservations)
                } else {
                    responseBody.inactiveReservations.joinToString(separator = "\n") { reservation ->
                        "Slot: ${reservation.park_slot}, Start: ${reservation.start_time}, Duration: ${reservation.reservation_time_hour}h"
                    }
                }

                activeReservationsText.text = getString(R.string.active_reservations, activeText)
                inactiveReservationsText.text = getString(R.string.inactive_reservations, inactiveText)
            }

            override fun onFailure(call: Call<MyReservationResponse>, t: Throwable) {
                Toast.makeText(this@MyReservationActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
