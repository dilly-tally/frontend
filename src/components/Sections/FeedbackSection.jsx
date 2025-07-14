"use client"

import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from "@mui/material"
import { motion } from "framer-motion"

const FeedbackSection = () => {
  const testimonials = [
    {
      name: "Lauren",
      text: "I really love using Dilly Tally! The explanations are super clear, and the practice questions helped me understand topics I used to struggle with.",
      avatar: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=L",
    },
    {
      name: "Linda",
      text: "I really love using Dilly Tally! The explanations are super clear, and the practice questions helped me understand topics I used to struggle with.",
      avatar: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=L",
    },
    {
      name: "Mike",
      text: "I really love using explanations are super and the practice helped me understand used to struggle.",
      avatar: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=M",
    },
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
          Feedback
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: "100%",
                    p: 3,
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px) rotate(7deg)",
                      cursor: "pointer",
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 3,
                        fontStyle: "italic",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        color: "#555",
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Avatar src={testimonial.avatar} sx={{ mr: 2, width: 50, height: 50 }} />
                      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
                        {testimonial.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default FeedbackSection
