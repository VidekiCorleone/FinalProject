package com.example.final20

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.DialogFragment
import okhttp3.OkHttpClient
import retrofit2.*
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST


data class ReservationResponse(val message: String, val reservation: ReservationDetails)
data class ReservationDetails(
    val park_slot: Int,
    val parkhouse_id: Int,
    val reservation_owner_id: String,
    val reservation_time_hour: Int,
    val start_time: String
)




interface ReservationService {
    @POST("/reserve")
    fun makeReservation(@Body reservation: ReservationDetails): Call<ReservationResponse>
}


private fun getRetrofit(token: String): Retrofit {
    val client = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val newRequest = chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
            chain.proceed(newRequest)
        }
        .build()

    return Retrofit.Builder()
        .baseUrl("http://10.0.2.2:3000/")
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
}


class DialogFragment(
    private val slotNumber: Int,
    private val parkhouseName: String,
    private val parkHouseID: String
) : DialogFragment() {

    private lateinit var slotText: EditText
    private lateinit var parkHouseText: EditText
    private lateinit var ownerText: EditText
    private lateinit var reserveTimeText: Spinner
    private lateinit var finishButton: Button
    private lateinit var cancelButton: Button
    private lateinit var checkBox: CheckBox

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.dialog_layout, container, false)

        slotText = view.findViewById(R.id.editTextText4)
        parkHouseText = view.findViewById(R.id.editTextText5)
        ownerText = view.findViewById(R.id.editTextText6)
        reserveTimeText = view.findViewById(R.id.spinner)
        finishButton = view.findViewById(R.id.booking_button)
        cancelButton = view.findViewById(R.id.cancel_button)
        checkBox = view.findViewById(R.id.checkBox)

        cancelButton.setOnClickListener {
            dismiss()
        }

        parkHouseText.setText(parkhouseName)
        slotText.setText(slotNumber.toString())

        val sharedPreferences = requireContext().getSharedPreferences("MyAppPrefs", AppCompatActivity.MODE_PRIVATE)
        val username = sharedPreferences.getString("USERNAME", "Unknown User")
        ownerText.setText(username)


        val numbers = (1..6).toList()
        val adapter = ArrayAdapter(requireContext(), R.layout.spinner_item, numbers)
        adapter.setDropDownViewResource(R.layout.spinner_item)
        reserveTimeText.adapter = adapter



        finishButton.setOnClickListener {
            if (!checkBox.isChecked) {
                Toast.makeText(context, "Foglaláshoz el kell fogadnod a felhasználási feltételeket!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }


            val currentTime = System.currentTimeMillis()
            val formattedTime = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss", java.util.Locale.getDefault())
                .format(java.util.Date(currentTime))


            val reservation = ReservationDetails(
                park_slot = slotText.text.toString().toIntOrNull() ?: -1,
                parkhouse_id = parkHouseID.toIntOrNull() ?: -1,
                reservation_owner_id = ownerText.text.toString(),
                reservation_time_hour = reserveTimeText.selectedItem.toString().toIntOrNull() ?: 0,
                start_time = formattedTime
            )

            // Token beolvasása és ellenőrzése
            val token = sharedPreferences.getString("TOKEN", "") ?: ""
            if (token.isEmpty()) {
                Toast.makeText(context, "Nincs érvényes token", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val apiService = getRetrofit(token).create(ReservationService::class.java)
            val call = apiService.makeReservation(reservation)

            call.enqueue(object : Callback<ReservationResponse> {
                override fun onResponse(call: Call<ReservationResponse>, response: Response<ReservationResponse>) {
                    if (response.isSuccessful) {
                        Toast.makeText(context, "Foglalás sikeres!", Toast.LENGTH_SHORT).show()
                        dismiss()
                    } else {
                        val errorBody = response.errorBody()?.string() ?: "Ismeretlen hiba"
                        Toast.makeText(context, "Hiba történt: $errorBody", Toast.LENGTH_LONG).show()
                    }
                }

                override fun onFailure(call: Call<ReservationResponse>, t: Throwable) {
                    Toast.makeText(context, "Hálózati hiba: ${t.message}", Toast.LENGTH_SHORT).show()
                }
            })
        }
        return view
    }
}
