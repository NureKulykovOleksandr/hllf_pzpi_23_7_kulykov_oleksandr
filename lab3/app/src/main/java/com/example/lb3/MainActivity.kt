package com.example.lb3

import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.MediaController
import android.widget.TextView
import android.widget.Toast
import android.widget.VideoView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private var isLiked = false
    private var likeCount = 0
    private lateinit var videoView: VideoView

    private val pickVideoLauncher = registerForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        if (uri != null) {
            videoView.setVideoURI(uri)
            videoView.start()
            Toast.makeText(this, "Відео успішно завантажено!", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        videoView = findViewById(R.id.videoView)
        val btnUploadVideo = findViewById<Button>(R.id.btnUploadVideo)
        val btnLike = findViewById<Button>(R.id.btnLike)
        val tvLikeCount = findViewById<TextView>(R.id.tvLikeCount)
        val etComment = findViewById<EditText>(R.id.etComment)
        val btnSendComment = findViewById<Button>(R.id.btnSendComment)
        val commentsContainer = findViewById<LinearLayout>(R.id.commentsContainer)

        val mediaController = MediaController(this)
        mediaController.setAnchorView(videoView)
        videoView.setMediaController(mediaController)

        val defaultVideoUri = Uri.parse("https://www.w3schools.com/html/mov_bbb.mp4")
        videoView.setVideoURI(defaultVideoUri)
        videoView.requestFocus()
        videoView.start()

        btnUploadVideo.setOnClickListener {
            pickVideoLauncher.launch("video/*")
        }

        btnLike.setOnClickListener {
            if (isLiked) {
                likeCount--
                isLiked = false
                btnLike.text = "🤍 Лайк"
            } else {
                likeCount++
                isLiked = true
                btnLike.text = "❤️ Прибрати лайк"
            }
            tvLikeCount.text = "Лайків: $likeCount"
        }

        btnSendComment.setOnClickListener {
            val commentText = etComment.text.toString()

            if (commentText.isNotEmpty()) {
                val newComment = TextView(this)
                newComment.text = "👤 Користувач: $commentText"
                newComment.textSize = 16f
                newComment.setPadding(0, 0, 0, 16)

                commentsContainer.addView(newComment)
                etComment.text.clear()
            }
        }
    }
}