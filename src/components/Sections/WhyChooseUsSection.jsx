"use client"

import { Box, Container, Typography, Grid } from "@mui/material"
import { motion } from "framer-motion"

const WhyChooseUsSection = () => {
  const benefits = [
    {
      icon: "📚",
      title: "Convenient",
      description:
        "All teaching resources and lesson planning tools in one place. Easy to access and organised for quick use.",
    },
    {
      icon: "⏰",
      title: "Time-Saving",
      description: "Save precious time with ready-made lessons, and streamlined planning tools.",
    },
    {
      icon: "🎯",
      title: "Engaging",
      description: "Make learning fun and exciting for students with interactive resources and instant feedback.",
    },
  ]

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: "white" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 6,
            fontWeight: "bold",
            fontSize: { xs: "2rem", md: "2.5rem" },
            color: "#2c3e50",
          }}
        >
          Why <span style={{ color: "#4CAF50" }}>Choose Us?</span>
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: " #ffffff",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: " #ffffff",
                      cursor: "pointer",
                      transform: "translate(7px,-7px) rotate(2deg)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      backgroundColor: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.5rem auto",
                      fontSize: "2rem",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                    }}
                  >
                    {benefit.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      mb: 1.5,
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      color: "#2c3e50",
                    }}
                  >
                    {benefit.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}
                  >
                    {benefit.description}
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default WhyChooseUsSection
