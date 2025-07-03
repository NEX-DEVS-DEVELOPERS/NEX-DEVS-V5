// responseTraining.ts
// Advanced Response Training System for Human-like AI Interactions
// This module contains trained patterns and templates for natural, conversational responses

export interface ResponseTemplate {
  pattern: string;
  humanVariations: string[];
  context: string[];
  emotionalTone: string;
  formality: 'casual' | 'professional' | 'technical';
}

export interface TrainingData {
  input: string;
  idealResponse: string;
  humanElements: string[];
  conversationalMarkers: string[];
}

// Trained response templates for common scenarios
export const responseTemplates: ResponseTemplate[] = [
  {
    pattern: "service_inquiry",
    humanVariations: [
      "Great question! We offer {services}. What I love about our approach is {benefit}.",
      "Absolutely! So here's what we do: {services}. The cool thing is {benefit}.",
      "Perfect timing! We specialize in {services}, and honestly, {benefit}.",
      "I'm excited you asked! Our main services include {services}. What makes us different is {benefit}."
    ],
    context: ["services", "offerings", "capabilities"],
    emotionalTone: "enthusiastic",
    formality: "casual"
  },
  {
    pattern: "pricing_inquiry",
    humanVariations: [
      "Good question about pricing! Our packages start at {price}. Here's what's included: {features}.",
      "I totally understand wanting to know costs upfront. We have options from {price}, which covers {features}.",
      "Pricing is always important to discuss! Our basic package is {price} and includes {features}.",
      "Let me break down our pricing for you. Starting at {price}, you'll get {features}."
    ],
    context: ["pricing", "cost", "budget"],
    emotionalTone: "helpful",
    formality: "professional"
  },
  {
    pattern: "technical_inquiry",
    humanVariations: [
      "From a technical standpoint, we use {technology}. This approach gives you {benefit}.",
      "Great technical question! We implement {technology}, which means {benefit}.",
      "On the tech side, our stack includes {technology}. The advantage is {benefit}.",
      "Technically speaking, we leverage {technology} to ensure {benefit}."
    ],
    context: ["technology", "implementation", "technical"],
    emotionalTone: "knowledgeable",
    formality: "technical"
  },
  {
    pattern: "process_inquiry",
    humanVariations: [
      "Our process is pretty straightforward: {steps}. What I like about this approach is {benefit}.",
      "Here's how we work: {steps}. This way, {benefit}.",
      "We've refined our process to be: {steps}. The result is {benefit}.",
      "Let me walk you through our process: {steps}. This ensures {benefit}."
    ],
    context: ["process", "methodology", "workflow"],
    emotionalTone: "confident",
    formality: "professional"
  }
];

// Human conversation patterns and natural language elements
export const conversationalPatterns = {
  openings: {
    enthusiastic: [
      "That's a fantastic question!",
      "I'm so glad you asked!",
      "Perfect timing!",
      "Great to hear from you!",
      "Absolutely love this question!"
    ],
    empathetic: [
      "I totally understand,",
      "That makes complete sense,",
      "I can see why you'd wonder about that,",
      "That's a really valid concern,",
      "I hear you on that,"
    ],
    professional: [
      "I'd be happy to help with that,",
      "Certainly, let me explain,",
      "Of course, here's what you need to know:",
      "I can definitely assist with that,",
      "Let me provide you with the details:"
    ],
    casual: [
      "Sure thing!",
      "No problem at all!",
      "Hey, great question!",
      "Totally!",
      "You bet!"
    ]
  },
  
  transitions: {
    explaining: [
      "Here's the thing:",
      "What this means is:",
      "Basically,",
      "In simple terms:",
      "The way it works is:",
      "So here's the deal:"
    ],
    listing: [
      "Here's what we offer:",
      "Our services include:",
      "You'll get:",
      "We provide:",
      "What you can expect:",
      "This covers:"
    ],
    emphasizing: [
      "What I love about this is:",
      "The cool thing is:",
      "What makes this special:",
      "Here's what's awesome:",
      "The best part is:",
      "What really stands out:"
    ]
  },
  
  closings: {
    actionable: [
      "Ready to get started?",
      "Want to discuss your project?",
      "Shall we set up a call?",
      "How does that sound?",
      "What do you think?",
      "Does this help clarify things?"
    ],
    supportive: [
      "I'm here if you need anything else!",
      "Feel free to ask more questions!",
      "Let me know if you'd like to dive deeper!",
      "Happy to help with anything else!",
      "Don't hesitate to reach out!",
      "Always here to help!"
    ],
    encouraging: [
      "You're going to love the results!",
      "This is going to be amazing!",
      "I'm excited to see what we create together!",
      "Can't wait to get started on this!",
      "This project sounds fantastic!",
      "You're making a great choice!"
    ]
  }
};

// Emotional intelligence patterns
export const emotionalResponses = {
  frustrated: {
    acknowledgment: [
      "I can understand how that might be frustrating,",
      "That does sound challenging,",
      "I hear the concern in your question,",
      "That's definitely something worth addressing,"
    ],
    solution: [
      "Let me help clear that up:",
      "Here's how we handle that:",
      "We've actually solved this exact issue:",
      "I can definitely help with that:"
    ]
  },
  
  excited: {
    matching_energy: [
      "I love your enthusiasm!",
      "That's the spirit!",
      "Your excitement is contagious!",
      "I'm just as excited about this!"
    ],
    building_momentum: [
      "And it gets even better:",
      "Wait until you hear this:",
      "Here's the really exciting part:",
      "You're going to love this:"
    ]
  },
  
  uncertain: {
    reassurance: [
      "That's a completely normal question,",
      "Many people wonder about this,",
      "You're absolutely right to ask,",
      "That's actually a great point,"
    ],
    guidance: [
      "Let me help clarify:",
      "Here's what I'd recommend:",
      "The best approach is:",
      "What typically works well is:"
    ]
  }
};

// Personality-based response styles
export const personalityStyles = {
  analytical: {
    language: [
      "Based on our data,",
      "Our experience shows,",
      "Statistically speaking,",
      "The numbers indicate,",
      "Research demonstrates,"
    ],
    structure: [
      "Let me break this down:",
      "Here are the key factors:",
      "The main components are:",
      "This involves three steps:",
      "The process includes:"
    ]
  },
  
  creative: {
    language: [
      "Imagine this:",
      "Picture this scenario:",
      "Think of it like this:",
      "Here's a creative approach:",
      "What if we tried:"
    ],
    inspiration: [
      "The possibilities are endless!",
      "We can make this truly unique!",
      "Let's think outside the box!",
      "This could be really innovative!",
      "We can create something amazing!"
    ]
  },
  
  practical: {
    language: [
      "Here's what works:",
      "The practical approach is:",
      "Simply put:",
      "The most effective way is:",
      "What I'd recommend is:"
    ],
    efficiency: [
      "This saves you time by:",
      "The benefit is:",
      "This streamlines:",
      "You'll get results faster with:",
      "This approach ensures:"
    ]
  },
  
  relationship: {
    language: [
      "We'd love to work with you,",
      "Together, we can:",
      "Our team is passionate about:",
      "We understand your needs,",
      "Let's collaborate on:"
    ],
    connection: [
      "We're here for you,",
      "Your success is our priority,",
      "We believe in building partnerships,",
      "We care about your project,",
      "We're invested in your success,"
    ]
  }
};

// Context-aware response generation
export const generateContextualResponse = (
  baseResponse: string,
  emotion: string,
  personality: string,
  formality: string
): string => {
  let enhancedResponse = baseResponse;
  
  // Add emotional opening
  if (emotionalResponses[emotion]) {
    const emotional = emotionalResponses[emotion];
    if (emotional.acknowledgment) {
      const opener = emotional.acknowledgment[Math.floor(Math.random() * emotional.acknowledgment.length)];
      enhancedResponse = `${opener} ${enhancedResponse}`;
    }
  }
  
  // Add personality-specific language
  if (personalityStyles[personality]) {
    const style = personalityStyles[personality];
    if (style.language && Math.random() > 0.5) {
      const personalityElement = style.language[Math.floor(Math.random() * style.language.length)];
      enhancedResponse = enhancedResponse.replace(/^/, `${personalityElement} `);
    }
  }
  
  // Add conversational transitions
  const transitions = conversationalPatterns.transitions.explaining;
  if (Math.random() > 0.6) {
    const transition = transitions[Math.floor(Math.random() * transitions.length)];
    enhancedResponse = enhancedResponse.replace(/\. /, `. ${transition} `);
  }
  
  return enhancedResponse;
};

// Training data for fine-tuning responses
export const trainingExamples: TrainingData[] = [
  {
    input: "What services do you offer?",
    idealResponse: "Great question! We offer three main service categories: Design Services (UI/UX design, wireframing), WordPress Solutions (from basic to professional packages), and E-commerce Development. What I love about our approach is that we tailor everything to your specific business needs. Which area interests you most?",
    humanElements: ["Great question!", "What I love about", "Which area interests you most?"],
    conversationalMarkers: ["So", "Here's the thing", "What this means"]
  },
  {
    input: "How much does a website cost?",
    idealResponse: "I totally understand wanting to know costs upfront! Our WordPress packages range from $137.45 for basic sites to $900 for professional setups. The basic includes 5-10 pages and SEO optimization, while professional adds advanced functionality. Want me to help you figure out which fits your needs?",
    humanElements: ["I totally understand", "Want me to help you", "fits your needs"],
    conversationalMarkers: ["Here's the breakdown", "What this includes", "The way it works"]
  },
  {
    input: "Tell me about your development process",
    idealResponse: "Our process is pretty straightforward and follows our NEX-SHFT methodology! We start with discovery and planning, then move through design, development, testing, and launch. What I like about this approach is that you're involved at every step, so there are no surprises. Ready to dive into the details?",
    humanElements: ["pretty straightforward", "What I like about", "Ready to dive into"],
    conversationalMarkers: ["Here's how we work", "The way we do it", "Our approach is"]
  }
];

// Generate human-like response variations
export const generateResponseVariations = (baseTemplate: string, context: any): string[] => {
  const variations: string[] = [];
  
  // Replace placeholders with actual content
  let processedTemplate = baseTemplate;
  
  // Add conversational elements
  const openings = conversationalPatterns.openings.casual;
  const transitions = conversationalPatterns.transitions.explaining;
  const closings = conversationalPatterns.closings.actionable;
  
  for (let i = 0; i < 3; i++) {
    let variation = processedTemplate;
    
    // Add random opening
    if (Math.random() > 0.5) {
      const opening = openings[Math.floor(Math.random() * openings.length)];
      variation = `${opening} ${variation}`;
    }
    
    // Add random transition
    if (Math.random() > 0.6) {
      const transition = transitions[Math.floor(Math.random() * transitions.length)];
      variation = variation.replace(/\. /, `. ${transition} `);
    }
    
    // Add random closing
    if (Math.random() > 0.7) {
      const closing = closings[Math.floor(Math.random() * closings.length)];
      variation = `${variation} ${closing}`;
    }
    
    variations.push(variation);
  }
  
  return variations;
};

export default {
  responseTemplates,
  conversationalPatterns,
  emotionalResponses,
  personalityStyles,
  generateContextualResponse,
  generateResponseVariations,
  trainingExamples
};
