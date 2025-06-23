import React, { useState, useEffect } from "react";
import "../styles/signup.css";

export const Signup = () => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "DILLY TALLY";
  
  useEffect(() => {
    const typeSpeed = 150; // Speed of typing (ms)
    const deleteSpeed = 100; // Speed of deleting (ms)
    const pauseTime = 2000; // Pause after complete text (ms)
    
    const animateText = () => {
      if (!isDeleting) {
        // Typing phase
        if (displayText.length < fullText.length) {
          setTimeout(() => {
            setDisplayText(fullText.substring(0, displayText.length + 1));
          }, typeSpeed);
        } else {
          // Text is complete, pause then start deleting
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        }
      } else {
        // Deleting phase
        if (displayText.length > 0) {
          setTimeout(() => {
            setDisplayText(fullText.substring(0, displayText.length - 1));
          }, deleteSpeed);
        } else {
          // Text is fully deleted, start typing again
          setIsDeleting(false);
        }
      }
    };
    
    animateText();
  }, [displayText, isDeleting, fullText]);

  return (
    <div className="s" data-model-id="187:680">
      <div className="frame-wrapper">
        <div className="frame">
          <div className="logo-section">
            <img
              className="image"
              alt="Image"
              src="https://c.animaapp.com/HmlEcmG7/img/image-27@2x.png"
            />
            <div className="typewriter-text">
              <div className="letters-container">
                {fullText.split('').map((letter, index) => (
                  <span 
                    key={index} 
                    className={`letter ${index < displayText.length ? 'visible' : 'invisible'}`}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </div>
              <span 
                className="cursor" 
                style={{left: `${displayText.length * 22}px`}}
              >
                |
              </span>
            </div>
          </div>

          <div className="div">
            <div className="div-wrapper">
              <div className="text-wrapper">Log In</div>
            </div>

            <div className="frame-2">
              <div className="text-wrapper-2">Sign Up</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};