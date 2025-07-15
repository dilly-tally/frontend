"use client"

import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { motion } from "framer-motion"

const FAQSection = () => {
  const faqs = [
    {
      question: "How can I track my progress on Dilly Tally?",
      answer:
        "You can track your progress through our comprehensive dashboard that shows your completed lessons, quiz scores, and learning milestones.",
    },
    {
      question: "Can I use Dilly Tally on my phone or tablet?",
      answer:
        "Yes! Dilly Tally is fully responsive and works seamlessly on all devices including phones, tablets, and desktop computers.",
    },
    {
      question: "Is Dilly Tally free to use?",
      answer:
        "We offer both free and premium plans. The free plan includes basic features, while premium unlocks advanced tools and resources.",
    },
  ]

  return (
    <Box sx={{ py: 10, backgroundColor: " #ffffff" }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: "bold",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Frequently Asked <span style={{ color: "#4CAF50" }}>Questions?</span>
        </Typography>
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Accordion sx={{ mb: 2, boxShadow: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6" sx={{ fontWeight: "500" }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ lineHeight: 1.6 }}>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Container>
    </Box>
  )
}

export default FAQSection
