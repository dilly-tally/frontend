import React, { useState } from "react";
import { Box, ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { AuthProvider, useAuth } from "../context/AuthContext";
import ScrollHeader from "../components/Header/ScrollHeader";
import HeroSection from "../components/Hero/HeroSection";
import BelowHeroSection from "../components/Sections/BelowHeroSection";
import WhyChooseUsSection from "../components/Sections/WhyChooseUsSection";
import FeaturesSection from "../components/Sections/FeaturesSection";
import FeedbackSection from "../components/Sections/FeedbackSection";
import FAQSection from "../components/Sections/FAQSection";
import ContactSection from "../components/Sections/ContactSection";
import AuthModal from "../components/Auth/AuthModal";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50",
    },
    secondary: {
      main: "#FFC107",
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          height: '100%',
          overflow: 'visible',
        },
        body: {
          height: '100%',
          overflow: 'visible',
          margin: 0,
          padding: 0,
        },
        '#root': {
          height: '100%',
          overflow: 'visible',
        },
      },
    },
  },
});

const LandingPageContent = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  // If user is authenticated, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #4CAF50, #45a049)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
                "100%": { transform: "scale(1)" },
              },
            }}
          >
            <Box
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              DT
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'visible',
        '& *': {
          boxSizing: 'border-box',
        },
      }}
    >
      <ScrollHeader onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} />
      <HeroSection />
      <BelowHeroSection />
      <WhyChooseUsSection />
      <FeaturesSection />
      <FeedbackSection />
      <FAQSection />
      <ContactSection />

      <AuthModal open={authModalOpen} onClose={handleCloseAuthModal} mode={authMode} />
    </Box>
  );
};

const LandingPage = () => {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'visible',
        isolation: 'isolate', // Creates a new stacking context
        '& *': {
          boxSizing: 'border-box',
        },
        // Reset any potential conflicting styles
        margin: 0,
        padding: 0,
        background: 'transparent',
        // Override any global styles that might interfere
        '& .MuiBox-root': {
          position: 'relative',
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <LandingPageContent />
        </AuthProvider>
      </ThemeProvider>
    </Box>
  );
};

export default LandingPage;