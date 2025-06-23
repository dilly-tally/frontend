import React, { useState, useEffect } from "react";
import "../styles/signup.css";

// Component for the floating math topics
const Component = ({ className, text = "Geometry", divClassName }) => {
  return (
    <div className={`component ${className}`}>
      <div className={`geometry ${divClassName}`}>{text}</div>
    </div>
  );
};

export const Signup = () => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "DILLY TALLY";
  
  useEffect(() => {
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;
    
    const animateText = () => {
      if (!isDeleting) {
        if (displayText.length < fullText.length) {
          setTimeout(() => {
            setDisplayText(fullText.substring(0, displayText.length + 1));
          }, typeSpeed);
        } else {
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseTime);
        }
      } else {
        if (displayText.length > 0) {
          setTimeout(() => {
            setDisplayText(fullText.substring(0, displayText.length - 1));
          }, deleteSpeed);
        } else {
          setIsDeleting(false);
        }
      }
    };
    
    animateText();
  }, [displayText, isDeleting, fullText]);

  return (
    <div className="s" data-model-id="187:680">
      <div className="overlap-wrapper">
        <div className="overlap">
          {/* Floating Math Topics */}
          <div className="frame">
            <Component className="component-4" />
            <Component
              className="component-instance"
              text="a²-b²= (a-b)(a+b)"
            />
            <Component className="component-4-instance" text="Area of Cone" />
            <Component
              className="component-2"
              divClassName="design-component-instance-node"
              text="a²-b²= (a-b)(a+b)"
            />
            <Component
              className="component-3"
              divClassName="component-5"
              text="Area of Cone"
            />
            <Component
              className="component-6"
              divClassName="component-7"
              text="1/2*(B₁+B₂)*H"
            />
            <Component
              className="component-8"
              divClassName="component-9"
              text="sin(90°−x) = cos x"
            />
            <Component className="component-10" text="HCF, LCM" />
            <Component
              className="component-11"
              divClassName="component-12"
              text="Algebra"
            />
            <Component
              className="component-13"
              divClassName="component-14"
              text="BODMAS"
            />
            <Component
              className="component-15"
              divClassName="component-16"
              text="Boolean Algebra"
            />
          </div>

          {/* Main Content */}
          <div className="div">
            {/* Header Section with Logo and Buttons */}
            <div className="header-section">
              <div className="logo-section">
                <img
                  className="image"
                  alt="Dilly Tally Logo"
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

              <div className="button-section">
                <div className="div-wrapper">
                  <div className="text-wrapper">Log In</div>
                </div>
                <div className="frame-2">
                  <div className="text-wrapper-2">Sign Up</div>
                </div>
              </div>
            </div>

            {/* Main Title Section */}
            <div className="group">
              <p className="simplified-teaching">
                <span className="text-wrapper-title">Simplified</span>
                <span className="span">&nbsp;</span>
                <span className="text-wrapper-highlight">Teaching</span>
              </p>
              <p className="inspiring-learning">
                <span className="text-wrapper-title">Inspiring</span>
                <span className="span">&nbsp;</span>
                <span className="text-wrapper-highlight">Learning</span>
              </p>
            </div>

            {/* Character Section */}
            <div className="character">
              <div className="overlap-group">
                <img
                  className="img"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector.svg"
                />
                <img
                  className="img-2"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-1.svg"
                />
                <img
                  className="img"
                  alt="Group"
                  src="https://c.animaapp.com/QrIfCiyh/img/group@2x.png"
                />
                <img
                  className="img-2"
                  alt="Group"
                  src="https://c.animaapp.com/QrIfCiyh/img/group-1@2x.png"
                />
                <img
                  className="vector"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-2.svg"
                />
                <img
                  className="vector"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-3.svg"
                />
                <img
                  className="vector-2"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-4.svg"
                />
                <img
                  className="vector-3"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-5.svg"
                />
                <img
                  className="vector-3"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-6.svg"
                />
                <img
                  className="vector-4"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-7.svg"
                />
                <img
                  className="vector-5"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-8.svg"
                />
                <img
                  className="vector-5"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-9.svg"
                />
                <img
                  className="vector-6"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-10.svg"
                />
                <img
                  className="vector-7"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-11.svg"
                />
                <img
                  className="vector-8"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-12.svg"
                />
                <img
                  className="vector-8"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-13.svg"
                />
                <img
                  className="vector-7"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-14.svg"
                />
                <img
                  className="vector-9"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-15.svg"
                />
                <img
                  className="vector-9"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-16.svg"
                />
                <img
                  className="group-2"
                  alt="Group"
                  src="https://c.animaapp.com/QrIfCiyh/img/group-2@2x.png"
                />
                <img
                  className="vector-10"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-17.svg"
                />
                <img
                  className="vector-10"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-18.svg"
                />
                <img
                  className="vector-11"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-19.svg"
                />
                <img
                  className="vector-11"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-20.svg"
                />
                <img
                  className="vector-12"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-21.svg"
                />
                <img
                  className="vector-12"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-22.svg"
                />
                <img
                  className="vector-13"
                  alt="Vector"
                  src="https://c.animaapp.com/QrIfCiyh/img/vector-23.svg"
                />
              </div>
            </div>

            {/* Blackboard and Teacher Section */}
            <div className="overlap-2">
              <div className="blackboard">
                <div className="overlap-3">
                  <img
                    className="vector-14"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-24.svg"
                  />
                  <img
                    className="vector-15"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-25.svg"
                  />
                  <img
                    className="group-3"
                    alt="Group"
                    src="https://c.animaapp.com/QrIfCiyh/img/group-3@2x.png"
                  />
                  <img
                    className="vector-16"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-26.svg"
                  />
                  <img
                    className="vector-16"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-27.svg"
                  />
                  <img
                    className="vector-17"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-28.svg"
                  />
                  <img
                    className="vector-17"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-29.svg"
                  />
                  <img
                    className="vector-18"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-30.svg"
                  />
                  <img
                    className="vector-19"
                    alt="Vector"
                    src="https://c.animaapp.com/QrIfCiyh/img/vector-31.svg"
                  />
                  <img
                    className="group-4"
                    alt="Group"
                    src="https://c.animaapp.com/QrIfCiyh/img/group-4@2x.png"
                  />
                </div>
              </div>
              <img
                className="character-2"
                alt="Character"
                src="https://c.animaapp.com/QrIfCiyh/img/character-2@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};