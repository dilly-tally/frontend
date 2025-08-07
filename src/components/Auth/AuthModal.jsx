"use client"

import { useState } from "react"
import { Dialog, DialogContent, Box, Typography, Button, IconButton, CircularProgress, Alert } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"

const AuthModal = ({ open, onClose, mode = "login" }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      await signInWithGoogle()
      onClose()
      // Navigation will be handled by the auth state change in LandingPage
    } catch (error) {
      setError("Failed to sign in with Google. Please try again.")
      console.error("Google sign in error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ position: "relative", p: { xs: 3, md: 4 } }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#666",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.05)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4CAF50, #45a049)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                  border: "2px solid rgba(255,255,255,0.5)",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: "white",
                    fontWeight: "bold",
                    fontFamily: "'Lemon Milk', sans-serif",
                  }}
                >
                  DT
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: "700",
                  color: "#2c3e50",
                  mb: 1,
                  fontSize: { xs: "1.8rem", md: "2.2rem" },
                }}
              >
                Welcome to Dilly Tally
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  fontSize: "1.1rem",
                  mb: 3,
                }}
              >
                {mode === "login"
                  ? "Sign in to continue your learning journey"
                  : "Join thousands of learners worldwide"}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleGoogleSignIn}
              disabled={loading}
              sx={{
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: "600",
                borderRadius: "12px",
                backgroundColor: "#65d878ff",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(66, 133, 244, 0.3)",
                "&:hover": {
                  backgroundColor: "#3367d6",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 25px rgba(66, 133, 244, 0.45)",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
                transition: "all 0.3s ease",
              }}
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1_10)">
                      <path
                        d="M19.6 10.232C19.6 9.599 19.545 9.101 19.451 8.573H10.201V11.847H15.804C15.607 12.994 14.928 13.993 13.958 14.652V17.059H16.901C18.65 15.309 19.6 12.903 19.6 10.232Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M10.201 19.601C12.96 19.601 15.309 18.65 16.901 17.059L13.958 14.652C13.163 15.181 12.213 15.537 10.201 15.537C8.451 15.537 6.952 14.49 6.319 12.994L3.38 15.309C4.971 18.252 7.47 19.601 10.201 19.601Z"
                        fill="#34A853"
                      />
                      <path
                        d="M6.319 12.994C6.018 12.044 5.84 11.094 5.84 10.001C5.84 8.907 6.018 7.957 6.319 7.007L3.38 4.692C2.333 6.704 1.75 8.716 1.75 10.001C1.75 11.286 2.333 13.298 3.38 15.309L6.319 12.994Z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M10.201 4.065C11.697 4.065 12.994 4.648 13.958 5.51L16.901 2.567C15.309 0.976 12.96 0 10.201 0C7.47 0 4.971 1.349 3.38 4.292L6.319 6.704C6.952 5.208 8.451 4.065 10.201 4.065Z"
                        fill="#EA4335"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_10">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                )
              }
            >
              {loading ? "Signing in..." : `${mode === "login" ? "Sign in" : "Sign up"} with Google`}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "#888",
                mt: 3,
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Typography>
          </motion.div>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default AuthModal
