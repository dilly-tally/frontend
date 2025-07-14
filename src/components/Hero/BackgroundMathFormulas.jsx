"use client"

import { useState, useEffect } from "react"
import { Box } from "@mui/material"
import { motion } from "framer-motion"

const BackgroundMathFormulas = ({ showFormulas }) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const desktopMathFormulas = [
    // Top row - distributed across the top
    { formula: "BODMAS", left: "10%", top: "15%", fontSize: 24, delay: 0.2, color: "#ddd" },
    { formula: "Algebra", left: "45%", top: "8%", fontSize: 20, delay: 0.4, color: "#ddd" },
    { formula: "a²+b² = (a+b)(a+b)", left: "75%", top: "12%", fontSize: 16, delay: 0.6, color: "#ddd" },

    // Left side - vertical distribution
    { formula: "Geometry", left: "8%", top: "35%", fontSize: 22, delay: 0.8, color: "#ddd" },
    { formula: "sin(90°-x) = cos x", left: "5%", top: "55%", fontSize: 16, delay: 1.0, color: "#ddd" },

    // Right side - vertical distribution
    { formula: "Area of Cone", left: "85%", top: "30%", fontSize: 18, delay: 1.2, color: "#ddd" },
    { formula: "Area of Cone", left: "88%", top: "60%", fontSize: 18, delay: 1.4, color: "#ddd" },
    { formula: "∂u/∂t", left: "90%", top: "75%", fontSize: 16, delay: 1.6, color: "#ddd" },

    // Center area - around but not overlapping main content
    { formula: "Boolean Algebra", left: "20%", top: "45%", fontSize: 18, delay: 1.8, color: "#ddd" },
    { formula: "HCF, LCM", left: "15%", top: "70%", fontSize: 16, delay: 2.0, color: "#ddd" },
    { formula: "1/2*(B+B)*H", left: "50%", top: "80%", fontSize: 14, delay: 2.2, color: "#ddd" },
  ]

  const mobileMathFormulas = [
    { formula: "BODMAS", left: "15%", top: "15%", fontSize: 18, delay: 0.3, color: "#ddd" },
    { formula: "Algebra", left: "70%", top: "10%", fontSize: 16, delay: 0.6, color: "#ddd" },
    { formula: "Geometry", left: "10%", top: "40%", fontSize: 16, delay: 0.9, color: "#ddd" },
    { formula: "Area of Cone", left: "75%", top: "35%", fontSize: 14, delay: 1.2, color: "#ddd" },
    { formula: "Boolean Algebra", left: "20%", top: "60%", fontSize: 14, delay: 1.5, color: "#ddd" },
    { formula: "HCF, LCM", left: "15%", top: "75%", fontSize: 13, delay: 1.8, color: "#ddd" },
    { formula: "sin(90°-x)", left: "70%", top: "70%", fontSize: 12, delay: 2.1, color: "#ddd" },
    { formula: "∂u/∂t", left: "80%", top: "55%", fontSize: 13, delay: 2.4, color: "#ddd" },
  ]

  const formulas = isMobile ? mobileMathFormulas : desktopMathFormulas

  if (!showFormulas) return null

  return (
    <>
      {formulas.map((item, index) => (
        <Box
          key={`formula-${index}`}
          component={motion.div}
          initial={{
            opacity: 0,
            scale: 0.5,
            y: 20,
          }}
          animate={{
            opacity: 0.6,
            scale: 1,
            y: 0,
          }}
          transition={{
            delay: item.delay,
            duration: 0.6,
            ease: "easeOut",
          }}
          whileHover={{
            scale: 1.3,
            opacity: 1,
            color: "#4CAF50",
            textShadow: "0 0 10px #4CAF5050",
            transition: {
              duration: 0.2,
            },
          }}
          sx={{
            position: "fixed",
            left: item.left,
            top: item.top,
            fontSize: item.fontSize,
            fontFamily: "'Inter', sans-serif",
            fontWeight: "500",
            cursor: "pointer",
            userSelect: "none",
            color: item.color,
            transformOrigin: "center",
            pointerEvents: "auto",
            zIndex: 9999,
            "&:hover": {
              color: "#4CAF50",
            },
          }}
        >
          {item.formula}
        </Box>
      ))}
    </>
  )
}

export default BackgroundMathFormulas
