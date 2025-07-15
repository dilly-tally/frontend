"use client"

import { Box, Container, Typography } from "@mui/material"
import { motion } from "framer-motion"
import ScrollHeader from "../Header/ScrollHeader"

const Dashboard = () => {
  return (
    <Box>
      <ScrollHeader />

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          marginTop: "70px",
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "700",
                  color: "white",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  mb: 2,
                  textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                Welcome to Dashboard
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: { xs: "1.1rem", md: "1.3rem" },
                  fontWeight: "400",
                  maxWidth: "600px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                }}
              >
                Your learning journey starts here. Explore our features and start achieving your goals.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default Dashboard
