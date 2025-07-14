"use client"

import { useState, useEffect } from "react"
import { Typography, Box } from "@mui/material"

const TypingBannerInHeader = () => {
  const words = ["DILLY TALLY", "DILLY TALLY", "DILLY TALLY"]
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    const currentWord = words[currentWordIndex]

    if (isTyping) {
      if (currentText.length < currentWord.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentWord.slice(0, currentText.length + 1))
        }, 120)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false)
        }, 1500)
        return () => clearTimeout(timeout)
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1))
        }, 80)
        return () => clearTimeout(timeout)
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
        setIsTyping(true)
      }
    }
  }, [currentText, isTyping, currentWordIndex, words])

  return (
    <Typography
      variant="h6"
      sx={{
        fontWeight: "600",
        color: "#4CAF50",
        minHeight: "30px",
        display: "flex",
        alignItems: "center",
        // Apply Lemon Milk font and adjust size for responsiveness
        fontFamily: "'Lemon Milk', sans-serif",
        fontSize: { xs: "0.7rem", sm: "1rem", md: "1.1rem" }, // Smaller on xs
        letterSpacing: { xs: "0.5px", sm: "1px" }, // Adjust letter spacing
        whiteSpace: "nowrap",
      }}
    >
      {currentText}
      <Box
        component="span"
        sx={{
          display: "inline-block",
          width: "2px",
          height: "20px",
          backgroundColor: "#4CAF50",
          ml: 1,
          animation: "blink 1s infinite",
          "@keyframes blink": {
            "0%, 50%": { opacity: 1 },
            "51%, 100%": { opacity: 0 },
          },
        }}
      />
    </Typography>
  )
}

export default TypingBannerInHeader
