"use client"

import { Box, Container, Typography, Button, Grid } from "@mui/material"
import { motion } from "framer-motion"

const ContactSection = () => {
  return (
    <Box
      component="section"
      sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        backgroundColor: "#4CAF50",
        py: { xs: 6, md: 8 },
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "700",
                fontSize: { xs: "2rem", md: "2.5rem" },
                mb: 3,
                color: "white",
              }}
            >
              Still have queries? Contact Us
            </Typography>

            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                mb: 4,
                maxWidth: "600px",
                margin: "0 auto 2rem auto",
                opacity: 0.9,
              }}
            >
              Please request a callback. A representative from the admissions office will contact you within the next 24
              working hours.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm="auto">
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    color: "#4CAF50",
                    px: 4,
                    py: 1.5,
                    fontWeight: "600",
                    borderRadius: "25px",
                    textTransform: "none",
                    fontSize: "1rem",
                    minWidth: "180px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  REQUEST CALL BACK
                </Button>
              </Grid>
              <Grid item xs={12} sm="auto">
                <a href="tel:+447733491277" style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontWeight: "600",
                      borderRadius: "25px",
                      textTransform: "none",
                      fontSize: "1rem",
                      minWidth: "180px",
                      borderWidth: "2px",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    CALL US
                  </Button>
                </a>
              </Grid>
            </Grid>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}

export default ContactSection
