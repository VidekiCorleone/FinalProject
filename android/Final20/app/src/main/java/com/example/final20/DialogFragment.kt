package com.example.final20

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.fragment.app.DialogFragment



class DialogFragment(private val slotNumber: Int) : DialogFragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.dialog_layout, container, false)

        val slotText: TextView = view.findViewById(R.id.slot_text)
        slotText.text = "Foglalj helyet a(z) $slotNumber. parkolóhelyre!"

        val closeButton: Button = view.findViewById(R.id.button_close)
        closeButton.setOnClickListener {
            dismiss() // A párbeszédablak bezárása
        }

        return view
    }
}