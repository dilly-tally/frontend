"use client"

import { useState, useEffect } from "react"
import { Box, Container, Typography } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"

// Component for the floating math topics (similar to signup.js)
const MathFormulaComponent = ({ className, text = "Geometry", divClassName }) => {
  return (
    <div className={`math-formula-component ${className}`}>
      <div className={`formula-text ${divClassName}`}>{text}</div>
    </div>
  )
}

const HeroSection = () => {
  const [animationPhase, setAnimationPhase] = useState(0)
  const [showFormulas, setShowFormulas] = useState(false)

  useEffect(() => {
    const runAnimation = async () => {
      setTimeout(() => setAnimationPhase(1), 1200)
      setTimeout(() => setAnimationPhase(2), 2500)
      setTimeout(() => setAnimationPhase(3), 4500)
      setTimeout(() => setAnimationPhase(4), 7000)
      setTimeout(() => setShowFormulas(true), 8500)
    }
    runAnimation()
  }, [])

  const getAnimatedWords = () => {
    switch (animationPhase) {
      case 0:
        return ["Simplifying"]
      case 1:
        return ["Simplifying", "Teaching"]
      case 2:
        return ["Simplifying", "Teaching", "Inspiring"]
      case 3:
        return ["Simplifying", "Teaching", "Learning"]
      case 4:
      default:
        return ["Simplifying", "Teaching", "Inspiring", "Learning"]
    }
  }

  const renderAnimatedText = () => {
    const animatedWords = getAnimatedWords()

    return (
      <Typography
        variant="h1"
        sx={{
          fontWeight: "700",
          fontSize: { xs: "2.2rem", md: "3.5rem" },
          lineHeight: 1.2,
          mb: 2,
          textAlign: "center",
          color: "#2c3e50",
          minHeight: { xs: "50px", md: "50px" },
          position: "relative",
          zIndex: 100,
        }}
      >
        {animatedWords.map((word, index) => {
          if (index === 0) {
            return (
              <motion.span
                key="simplified-constant"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{
                  display: "inline-block",
                  marginRight: "0.5rem",
                  color: "#2c3e50",
                }}
              >
                {word}
              </motion.span>
            )
          }

          return (
            <motion.span
              key={`${word}-${animationPhase}`}
              initial={{
                opacity: 0,
                y: 50,
                rotateX: 90,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotateX: 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                type: "spring",
                stiffness: 100,
              }}
              style={{
                display: "inline-block",
                marginRight: "0.5rem",
                color: word === "Teaching" || word === "Learning" ? "#4CAF50" : "#2c3e50",
                transformOrigin: "50% 100%",
              }}
            >
              {word}
            </motion.span>
          )
        })}
      </Typography>
    )
  }

  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        background: "#ffffff",
        marginTop: "130px",
        py: { xs: 0, md: 3 },
        overflow: "hidden",
      }}
    >
      <div className="hero-wrapper" style={{ position: "relative", width: "100%", height: "100%" }}>
        <div className="overlap-wrapper" style={{ position: "relative", width: "100%", height: "100%" }}>
          <div className="overlap" style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Floating Math Formulas Frame - Similar to signup.js */}
            {showFormulas && (
              <div className="formula-frame" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, pointerEvents: "none" }}>
              <MathFormulaComponent className="formula-1" text="BODMAS" divClassName="formula-bodmas formula-font-1" />
              <MathFormulaComponent className="formula-2" text="a²+b² = (a+b)(a+b)" divClassName="formula-algebra-exp formula-font-2" />
              <MathFormulaComponent className="formula-3" text="Area of Cone" divClassName="formula-area-cone formula-font-3" />
              <MathFormulaComponent className="formula-4" text="Geometry" divClassName="formula-geometry formula-font-2" />
              <MathFormulaComponent className="formula-5" text="Area of Cone" divClassName="formula-area-cone-2 formula-font-1" />
              <MathFormulaComponent className="formula-6" text="1/2*(B+B)*H" divClassName="formula-trapezoid formula-font-3" />
              <MathFormulaComponent className="formula-7" text="sin(90°−x) = cos x" divClassName="formula-trig formula-font-2" />
              <MathFormulaComponent className="formula-8" text="HCF, LCM" divClassName="formula-hcf-lcm formula-font-1" />
              <MathFormulaComponent className="formula-9" text="Algebra" divClassName="formula-algebra formula-font-3" />
              <MathFormulaComponent className="formula-10" text="Boolean Algebra" divClassName="formula-boolean formula-font-2" />
              <MathFormulaComponent className="formula-11" text="∂u/∂t" divClassName="formula-partial formula-font-1" />
            </div>
            )}

            {/* Main Hero Content */}
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 50 }}>
              <Box
                sx={{ textAlign: "center", position: "relative", display: "flex", flexDirection: "column", gap: "0px" }}
              >
                <Box sx={{ mb: 3, position: "relative" }}>
                  {/* Hero Text */}
                  <Box sx={{ position: "relative", zIndex: 100 }}>
                    {renderAnimatedText()}
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#666",
                        fontSize: { xs: "1.1rem", md: "1.3rem" },
                        fontWeight: "400",
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: 1.5,
                        position: "relative",
                        zIndex: 100,
                        top: "50px",
                      }}
                    >
                      Empowering educators with innovative tools and resources for effective learning
                    </Typography>
                  </Box>
                </Box>

                {/* Animation Section */}
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: "250px", md: "280px" },
                    mt: 3,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    zIndex: 80,
                  }}
                >
                  <AnimatePresence mode="wait">
                    {animationPhase === 1 && (
                      <>
                        <motion.div
                          key="student-slide"
                          initial={{ x: -800, opacity: 0 }}
                          animate={{ x: -280, opacity: 1 }}
                          exit={{ x: -800, opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 90,
                          }}
                        >
                          <img
                            src="/images/student.png"
                            alt="Student"
                            style={{
                              width: "100px",
                              height: "150px",
                              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                            }}
                          />
                        </motion.div>

                        <motion.div
                          key="teacher-slide"
                          initial={{ x: 800, opacity: 0 }}
                          animate={{ x: 200, opacity: 1 }}
                          exit={{ x: 800, opacity: 0 }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 90,
                          }}
                        >
                          <img
                            src="/images/teacher.png"
                            alt="Teacher"
                            style={{
                              width: "80px",
                              height: "210px",
                              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                            }}
                          />
                        </motion.div>
                      </>
                    )}

                    {animationPhase === 2 && (
                      <>
                        <motion.div
                          key="student-closer"
                          initial={{ x: -280, opacity: 1 }}
                          animate={{ x: -180, opacity: 1 }}
                          exit={{ x: -400, opacity: 0, scale: 0.8 }}
                          transition={{ duration: 1.0, ease: "easeInOut" }}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 90,
                          }}
                        >
                          <img
                            src="/images/student.png"
                            alt="Student"
                            style={{
                              width: "100px",
                              height: "150px",
                              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                            }}
                          />
                        </motion.div>

                        <motion.div
                          key="teacher-closer"
                          initial={{ x: 200, opacity: 1 }}
                          animate={{ x: 100, opacity: 1 }}
                          exit={{ x: 400, opacity: 0, scale: 0.8 }}
                          transition={{ duration: 1.0, ease: "easeInOut" }}
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 90,
                          }}
                        >
                          <img
                            src="/build/images/teacher.png"
                            alt="Teacher"
                            style={{
                              width: "80px",
                              height: "210px",
                              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                            }}
                          />
                        </motion.div>
                      </>
                    )}

                    {animationPhase === 3 && (
                      <motion.div
                        key="blackboard-learning"
                        initial={{ y: 400, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 400, opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: 1.5,
                          ease: "easeOut",
                          type: "spring",
                          stiffness: 80,
                          damping: 20,
                        }}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          position: "absolute",
                          left: 0,
                          top: 0,
                          width: "100%",
                          height: "100%",
                          zIndex: 90,
                        }}
                      >
                        <img
                          src="/images/blackboard.png"
                          alt="Blackboard"
                          style={{
                            width: "200px",
                            filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.15))",
                            maxWidth: "100%",
                          }}
                        />
                      </motion.div>
                    )}

                    {animationPhase === 4 && (
                      <motion.div
                        key="final-trio"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.0, ease: "easeOut" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "end",
                            gap: { xs: 1, md: 2 },
                            flexWrap: { xs: "wrap", md: "nowrap" },
                          }}
                        >
                          <motion.div
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 30, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                          >
                            <img
                              src="/images/student.png"
                              alt="Student"
                              style={{
                                width: "100px",
                                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                              }}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                          >
                            <img
                              src="/images/blackboard.png"
                              alt="Blackboard"
                              style={{
                                width: "200px",
                                filter: "drop-shadow(0 12px 30px rgba(0,0,0,0.15))",
                              }}
                            />
                          </motion.div>

                          <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: -50, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.6 }}
                          >
                            <img
                              src="/images/teacher.png"
                              alt="Teacher"
                              style={{
                                width: "80px",
                                height: "210px",
                                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.1))",
                              }}
                            />
                          </motion.div>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </Box>
            </Container>
          </div>
        </div>
      </div>

      {/* CSS Styles for Math Formulas */}
      <style jsx>{`
  .math-formula-component {
    position: absolute;
    z-index: 1001;
    pointer-events: auto;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: glow-scale 3s ease-in-out infinite;
    animation-delay: calc(var(--i, 1) * 0.5s);
  }

  @keyframes glow-scale {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Fonts */
.formula-font-1 {
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}
.formula-font-2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
}
.formula-font-3 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  font-style: italic;
}

.formula-text {
  transition: all 0.3s ease;
  user-select: none;
  color: #ccc;
}

/* Add gradient glow on animation */
.math-formula-component:not(:hover) .formula-text {
  animation: gradientText 3s ease-in-out infinite;
  animation-delay: calc(var(--i, 1) * 0.5s);
}

@keyframes gradientText {
  0%, 100% {
    background: none;
    color: #ccc;
  }
  50% {
    background: linear-gradient(90deg, #f4e06d, #7fff8a, #ff80bf);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}


  .math-formula-component:hover .formula-text {
    color: #4CAF50;
    transform: scale(1.2);
    text-shadow: 0 0 10px #4CAF5050;
    background: none;
    font-weight: 700;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
  }

  /* Gradient only when animating (not on hover) */
  .math-formula-component:not(:hover) .formula-text {
    animation: gradientText 3s ease-in-out infinite;
    animation-delay: calc(var(--i, 1) * 0.5s);
  }

  @keyframes gradientText {
    0%, 100% {
      background: none;
      color: #ccc;
    }
    50% {
      background: linear-gradient(90deg, #f4e06d, #7fff8a, #ff80bf);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  /* Floating formula positions + individual font sizes */
  .formula-1 { left: 8%; top: 15%; --i: 1; }
  .formula-2 { left: 80%; top: -2%; --i: 2; }
  .formula-3 { left: 85%; top: 25%; --i: 3; }
  .formula-4 { left: 5%; top: 35%; --i: 4; }
  .formula-5 { left: 85%; top: 55%; --i: 5; }
  .formula-6 { left: 45%; top: 80%; --i: 6; }
  .formula-7 { left: 3%; top: 55%; --i: 7; }
  .formula-8 { left: 15%; top: 70%; --i: 8; }
  .formula-9 { left: 40%; top: 19%; --i: 9; }
  .formula-10 { left: 20%; top: 45%; --i: 10; }
  .formula-11 { left: 88%; top: 75%; --i: 11; }

  .formula-bodmas { font-size: 24px; }
  .formula-algebra-exp { font-size: 16px; }
  .formula-area-cone { font-size: 18px; }
  .formula-geometry { font-size: 22px; }
  .formula-area-cone-2 { font-size: 18px; }
  .formula-trapezoid { font-size: 14px; }
  .formula-trig { font-size: 16px; }
  .formula-hcf-lcm { font-size: 16px; }
  .formula-algebra { font-size: 20px; }
  .formula-boolean { font-size: 18px; }
  .formula-partial { font-size: 16px; }

  @media (max-width: 768px) {
    .formula-1 { left: 10%; top: 12%; }
    .formula-2 { left: 70%; top: 8%; }
    .formula-3 { left: 80%; top: 30%; }
    .formula-4 { left: 8%; top: 40%; }
    .formula-5 { left: 75%; top: 60%; }
    .formula-6 { left: 40%; top: 75%; }
    .formula-7 { left: 5%; top: 60%; }
    .formula-8 { left: 15%; top: 75%; }
    .formula-9 { left: 45%; top: 5%; }
    .formula-10 { left: 75%; top: 50%; }
    .formula-11 { left: 85%; top: 70%; }

    .formula-text {
      font-size: 14px !important;
    }

    img[src*="student.png"] {
      width: 70px !important;
      height: auto !important;
    }

    img[src*="teacher.png"] {
      width: 60px !important;
      height: auto !important;
    }

    img[src*="blackboard.png"] {
      width: 150px !important;
      height: auto !important;
    }
  }
`}</style>

    </Box>
  )
}

export default HeroSection
