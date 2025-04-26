package com.example.final20

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

data class ReservationResponse(
    val message: String,
    val reservation: ReservationDetails
)


// Adatmodell a foglalás részleteihez
data class ReservationDetails(
    val parkSlot: String,
    val parkHouse: String,
    val owner: String,
    val reserveTime: String
)

// Retrofit interfész a szerverhez
interface ReservationService {
    @GET("reservation/details/{slotNumber}")
    fun getReservationDetails(@Path("slotNumber") slotNumber: Int): Call<ReservationDetails>
    @POST("reserve")
    fun reserveSlot(@Body requestBody: Map<String, Any>): Call<Void>

}

class DialogFragment(private val slotNumber: Int) : DialogFragment() {

    private lateinit var progressBar: ProgressBar
    private lateinit var slotText: EditText
    private lateinit var parkHouseText: EditText
    private lateinit var ownerText: EditText
    private lateinit var reserveTimeText: EditText
    private lateinit var finishButton: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.dialog_layout, container, false)

        progressBar = view.findViewById(R.id.progressBar)
        slotText = view.findViewById(R.id.editTextText4)
        parkHouseText = view.findViewById(R.id.editTextText5)
        ownerText = view.findViewById(R.id.editTextText6)
        reserveTimeText = view.findViewById(R.id.editTextText7)
        finishButton = view.findViewById(R.id.booking_button)

        // Automatikus adatbetöltés
        fetchReservationDetails()

        // Foglalás véglegesítése
        finishButton.setOnClickListener {
            val parkSlot = slotText.text.toString()
            val parkhouseId = parkHouseText.text.toString().toInt()
            val owner = ownerText.text.toString()
            val reserveTime = reserveTimeText.text.toString()

            if (parkSlot.isEmpty() || owner.isEmpty() || reserveTime.isEmpty()) {
                Toast.makeText(context, "Hiányzó adatok!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            sendReservationRequest(parkSlot, parkhouseId, owner, reserveTime)
        }

        return view
    }

    private fun fetchReservationDetails() {
        progressBar.visibility = View.VISIBLE

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val service = retrofit.create(ReservationService::class.java)
        service.getReservationDetails(slotNumber).enqueue(object : Callback<ReservationDetails> {
            override fun onResponse(call: Call<ReservationDetails>, response: Response<ReservationDetails>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    val details = response.body()
                    details?.let {
                        slotText.setText(it.parkSlot)
                        parkHouseText.setText(it.parkHouse)
                        ownerText.setText(it.owner)
                        reserveTimeText.setText(it.reserveTime)
                    }
                } else {
                    Toast.makeText(context, "Hiba az adatok betöltésekor!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ReservationDetails>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(context, "Hálózati hiba: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun sendReservationRequest(slotId: String, parkhouseId: Int, ownerId: String, reserveTime: String) {
        progressBar.visibility = View.VISIBLE

        val retrofit = Retrofit.Builder()
            .baseUrl("http://10.0.2.2:3000/") // API URL megadása
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val service = retrofit.create(ReservationService::class.java)

        val requestBody = mapOf(
            "slotId" to slotId,
            "parkhouseId" to parkhouseId,
            "ownerId" to ownerId,
            "reserveTime" to reserveTime
        )

        service.reserveSlot(requestBody).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                progressBar.visibility = View.GONE
                if (response.isSuccessful) {
                    Toast.makeText(context, "Foglalás sikeresen véglegesítve!", Toast.LENGTH_SHORT).show()
                    dismiss()
                } else {
                    Toast.makeText(context, "Foglalási hiba: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                progressBar.visibility = View.GONE
                Toast.makeText(context, "Hálózati hiba: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
