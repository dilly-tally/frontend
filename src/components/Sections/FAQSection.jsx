"use client"

import { Box, Container, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { motion } from "framer-motion"

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Dilly Tally?",
      answer:
        "Dilly Tally is a growing platform created by educators, for educators. We offer clear, curriculum aligned maths resources designed to help introduce, explain and revise key concepts in the classroom or at home. Whether you're teaching or supporting a learner, Dilly Tally is here to make maths meaningful and accessible.",
    },
    {
      question: "Who can use Dilly Tally?",
      answer:
        "Our platform is for all educators: including classroom teachers, tutors, homeschoolers, teaching assistants, and even parents. You don't need to be a registered teacher to access our resources.",
    },
    {
      question: "What kind of resources are available right now?",
      answer: (
        <>
          We currently offer:
          <br />
          <br />
          <strong>• Concept explanations</strong> to support first-time teaching or revision
          <br />
          <strong>• Structured topic pages</strong> for middle and high school maths
          <br />
          <strong>• Visual and interactive elements</strong> like Desmos and GeoGebra links
          <br />
          <br />
          Resources can be viewed online and used to introduce new topics or support student revision.{" "}
          <strong>Printable worksheets and task sets</strong> are coming soon.
        </>
      ),
    },
    {
      question: "Can students use Dilly Tally too?",
      answer:
        "Yes! While the platform is designed with educators in mind, students can use our resources for self-study and revision. Each topic page acts as a mini guide to help learners understand key ideas clearly and independently.",
    },
    {
      question: "Is Dilly Tally free to use?",
      answer:
        "Yes, everything is free while we build and improve. In the future, we may introduce premium options, but a free version will always be available.",
    },
    {
      question: "What features are coming soon?",
      answer: (
        <>
          We're just getting started and exciting new features are on the way! Here's what to look out for:
          <br />
          <br />
          <strong>📝 Printable Worksheets</strong>
          <br />
          To go alongside our online content
          <br />
          <br />
          <strong>📅 Calendar Tool</strong>
          <br />
          For educators to log lessons, tasks and plans in one place
          <br />
          <br />
          <strong>🎯 Student Resource Hub</strong>
          <br />
          With interactive tasks and guided revision content
          <br />
          <br />
          <strong>🤖 AI-Powered Planning Support</strong>
          <br />
          To help educators build lessons faster using our resources. Simply select your topic and let our smart tools
          suggest activities, tasks and explanations.
          <br />
          <br />
          <strong>👥 Community Feedback Loop</strong>
          <br />
          So educators can request, rate and improve content together
          <br />
          <br />
          We're adding <strong>new resources every week</strong> and constantly improving the platform based on your
          feedback.
        </>
      ),
    },
    {
      question: "Can I suggest a topic or resource?",
      answer:
        "We'd love that! Dilly Tally is built on feedback from real educators. If you'd like to request a resource, suggest a topic or even collaborate, reach out to us via the Contact page.",
    },
    {
      question: "Can I share Dilly Tally with other educators?",
      answer:
        "Yes! Please feel free to share the website with your colleagues, teaching groups or school leaders. You're also welcome to use our content in your lessons or tutoring sessions: just link back to us if sharing online.",
    },
  ]

  return (
    <Box sx={{ py: 10, backgroundColor: "#ffffff" }}>
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
              <AccordionDetails sx={{ backgroundColor: "#f8f9fa", borderTop: "1px solid #e9ecef" }}>
                <Typography sx={{ lineHeight: 1.8 }}>
                  {typeof faq.answer === "string" ? faq.answer : faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          </motion.div>
        ))}
      </Container>
    </Box>
  )
}

export default FAQSection
