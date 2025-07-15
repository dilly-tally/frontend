"use client"

import { Box, Container, Typography, Grid } from "@mui/material"
import { motion } from "framer-motion"

const FeaturesSection = () => {
  const features = [
    { name: "Calendar", image: "/images/calendar.png" },
    { name: "Student Task", image: "/images/student-task.png" },
    { name: "Teacher Resources", image: "/images/teacher-resource.png" },
  ]

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: " #ffffff" }}>
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
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Box
                  sx={{
                    textAlign: "center",
                    backgroundColor: " #ffffff",
                    borderRadius: "16px",
                    p: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: " #ffffff",
                      cursor: "pointer",
                      transform: "translate(-7px,-7px) rotate(2deg)",
                    },
                  }}
                >
                  <img
                    src={feature.image || "/placeholder.svg"}
                    alt={feature.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      maxWidth: "300px",
                      borderRadius: "12px",
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default FeaturesSection
