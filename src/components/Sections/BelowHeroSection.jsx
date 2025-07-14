"use client"

import { Box, Container } from "@mui/material"
import { motion } from "framer-motion"

const BelowHeroSection = () => {
  return (
    <section>
      <Box
        sx={{
          py: { xs: 3, md: 4 },
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: "300px", md: "400px" },
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "visible",
              }}
            >
              <img
                src="/images/below-hero.png"
                alt="Teaching Challenges"
                style={{
                  width: "100%",
                  height: "auto",
                  maxWidth: "100%",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </Box>
          </motion.div>
        </Container>
      </Box>
    </section>
  )
}

export default BelowHeroSection
