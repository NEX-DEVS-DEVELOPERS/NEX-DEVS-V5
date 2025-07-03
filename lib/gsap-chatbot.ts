'use client';

import { gsap } from 'gsap';

// Initialize GSAP for the chatbot animations
export const initializeChatbotAnimations = (chatbotRef: HTMLElement | null) => {
  if (!chatbotRef) return;

  // Forcefully set the chatbot's position to be sticky at the bottom-left corner.
  // This overrides any conflicting CSS rules with !important flags
  gsap.set(chatbotRef, {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    right: 'auto',
    top: 'auto',
    zIndex: 999999,
    transformOrigin: 'bottom left',
    clearProps: 'transform', // Clear any existing transforms
    force3D: true,
  });

  // Create a forceful floating effect for the entire chatbot container
  // Using a timeline for more complex animation
  const floatTimeline = gsap.timeline({
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });

  // Add floating animation with increased amplitude
  floatTimeline
    .to(chatbotRef, {
      y: '-=20px', // Increased floating distance for more noticeable effect
      duration: 1.5,
      ease: "sine.inOut",
      force3D: true, // Hardware acceleration
    })
    .to(chatbotRef, {
      y: '+=20px',
      duration: 1.5,
      ease: "sine.inOut",
      force3D: true,
    });
  
  // Add subtle rotation for enhanced floating feel
  gsap.to(chatbotRef, {
    rotation: 1, // Subtle rotation
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  
  // Make sure the animation is running
  floatTimeline.play();
  
  // Find and animate the chat button specifically if it exists
  const chatButton = chatbotRef.querySelector('button');
  if (chatButton) {
    animateChatButton(chatButton);
  }
};

// Special animation just for the chat button to make it more noticeable
export const animateChatButton = (buttonElement: HTMLElement | null) => {
  if (!buttonElement) return;
  
  // Clear any existing animations
  gsap.killTweensOf(buttonElement);
  
  // Create a more pronounced floating effect for the button
  const buttonTimeline = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.5,
  });
  
  buttonTimeline
    .to(buttonElement, {
      y: '-=10px',
      duration: 1,
      ease: "power1.inOut",
      force3D: true,
    })
    .to(buttonElement, {
      y: '+=10px',
      duration: 1,
      ease: "power1.inOut",
      force3D: true,
    })
    .to(buttonElement, {
      scale: 1.05,
      duration: 0.5,
      ease: "power1.inOut",
    })
    .to(buttonElement, {
      scale: 1,
      duration: 0.5,
      ease: "power1.inOut",
    });
  
  // Add a subtle glow effect
  gsap.to(buttonElement, {
    boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

// Animation for opening the chatbot
export const animateOpenChat = (chatElement: HTMLElement | null) => {
  if (!chatElement) return;
  
  gsap.fromTo(chatElement, 
    { 
      scale: 0.8, 
      opacity: 0 
    },
    {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(1.7)"
    }
  );
};

// Animation for closing the chatbot
export const animateCloseChat = (chatElement: HTMLElement | null) => {
  if (!chatElement) return;
  
  return gsap.to(chatElement, {
    scale: 0.8,
    opacity: 0,
    duration: 0.2,
    ease: "power2.in"
  });
};

// Animation for minimizing the chatbot
export const animateMinimize = (
  fullElement: HTMLElement | null, 
  minimizedElement: HTMLElement | null
) => {
  if (!fullElement || !minimizedElement) return;
  
  // Hide full chatbot
  gsap.to(fullElement, {
    scale: 0.9,
    opacity: 0,
    display: 'none',
    duration: 0.2,
    onComplete: () => {
      // Show minimized version
      gsap.fromTo(minimizedElement, 
        { scale: 0.8, opacity: 0, display: 'flex' },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
      
      // Find and animate the chat button in the minimized state
      const chatButton = minimizedElement.querySelector('button');
      if (chatButton) {
        animateChatButton(chatButton);
      }
    }
  });
};

// Animation for maximizing the chatbot
export const animateMaximize = (
  minimizedElement: HTMLElement | null, 
  fullElement: HTMLElement | null
) => {
  if (!minimizedElement || !fullElement) return;
  
  // Hide minimized version
  gsap.to(minimizedElement, {
    scale: 0.9,
    opacity: 0,
    display: 'none',
    duration: 0.2,
    onComplete: () => {
      // Show full chatbot
      gsap.fromTo(fullElement, 
        { scale: 0.9, opacity: 0, display: 'flex' },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  });
};

// Styles for the chatbot components
export const chatbotStyles = `
  .nexious-chatbot-container {
    position: fixed;
    bottom: 1.25rem;
    left: 1.25rem;
    z-index: 999999;
  }

  /* Special animation class for pulsing effect */
  .pulse-effect {
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(79, 70, 229, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(79, 70, 229, 0);
    }
  }

  /* Material design animation classes */
  .animate-material-slideIn {
    animation: material-slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  @keyframes material-slideIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .material-shadow {
    box-shadow: 
      0 1px 3px rgba(0,0,0,0.12), 
      0 1px 2px rgba(0,0,0,0.24);
  }

  .material-shadow-lg {
    box-shadow: 
      0 10px 20px rgba(0,0,0,0.19), 
      0 6px 6px rgba(0,0,0,0.23);
  }
  
  /* Sidebar position fixes */
  .chatbot-sidebar {
    position: absolute !important;
    right: 0 !important;
    left: auto !important;
    top: 0 !important;
    bottom: 0 !important;
    transform: translateX(100%) !important;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease !important;
  }
  
  .chatbot-sidebar.visible {
    transform: translateX(0) !important;
  }
`; 