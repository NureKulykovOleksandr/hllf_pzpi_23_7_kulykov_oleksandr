package com.example.pz3

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlin.random.Random

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val etNumA = findViewById<EditText>(R.id.etNumA)
        val etNumB = findViewById<EditText>(R.id.etNumB)
        val btnDivide = findViewById<Button>(R.id.btnDivide)
        val tvDivisionResult = findViewById<TextView>(R.id.tvDivisionResult)

        btnDivide.setOnClickListener {
            val strA = etNumA.text.toString()
            val strB = etNumB.text.toString()

            if (strA.isEmpty() || strB.isEmpty()) {
                Toast.makeText(this, "Будь ласка, заповніть обидва поля!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val numA = strA.toDoubleOrNull()
            val numB = strB.toDoubleOrNull()

            if (numA == null || numB == null) {
                Toast.makeText(this, "Введено некоректні числа!", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (numB == 0.0) {
                tvDivisionResult.text = "Результат: Помилка (ділення на 0 неможливе!)"
            } else {
                val result = numA / numB
                tvDivisionResult.text = "Результат: $result"
            }
        }

        val btnRollDice = findViewById<Button>(R.id.btnRollDice)
        val tvPlayer1Score = findViewById<TextView>(R.id.tvPlayer1Score)
        val tvPlayer2Score = findViewById<TextView>(R.id.tvPlayer2Score)
        val tvGameWinner = findViewById<TextView>(R.id.tvGameWinner)

        btnRollDice.setOnClickListener {
            val p1Dice1 = Random.nextInt(1, 7)
            val p1Dice2 = Random.nextInt(1, 7)
            val p1Sum = p1Dice1 + p1Dice2

            val p2Dice1 = Random.nextInt(1, 7)
            val p2Dice2 = Random.nextInt(1, 7)
            val p2Sum = p2Dice1 + p2Dice2

            tvPlayer1Score.text = "Гравець 1: $p1Dice1 + $p1Dice2 = Сума ($p1Sum)"
            tvPlayer2Score.text = "Гравець 2: $p2Dice1 + $p2Dice2 = Сума ($p2Sum)"

            if (p1Sum > p2Sum) {
                tvGameWinner.text = "Переможець: Гравець 1 👑"
            } else if (p2Sum > p1Sum) {
                tvGameWinner.text = "Переможець: Гравець 2 👑"
            } else {
                tvGameWinner.text = "Переможець: Нічия 🤝"
            }
        }
    }
}