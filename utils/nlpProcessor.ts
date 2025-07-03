// nlpProcessor.ts
// Advanced NLP Processing for Human-like AI Responses
// This module handles natural language processing to make AI responses more conversational and human-like

export interface NLPContext {
  userEmotion: string;
  conversationTone: string;
  userIntent: string;
  complexity: string;
  urgency: string;
  personalityType: string;
}

export interface HumanizedResponse {
  processedPrompt: string;
  responseStyle: string;
  conversationalElements: string[];
  emotionalTone: string;
}

export interface ContentFilterResult {
  isAppropriate: boolean;
  flaggedCategories: string[];
  severity: 'low' | 'medium' | 'high';
  alternativeResponse?: string;
}

// Content filtering patterns for inappropriate content detection
const inappropriateContentPatterns = {
  explicit: [
    /(\b(sex|sexual|porn|nude|naked|explicit)\b)/i,
    /(\b(adult content|nsfw|xxx)\b)/i
  ],
  violence: [
    /(\b(kill|murder|violence|harm|hurt|attack)\b)/i,
    /(\b(weapon|gun|knife|bomb)\b)/i
  ],
  harassment: [
    /(\b(hate|racist|discrimination|harassment)\b)/i,
    /(\b(stupid|idiot|moron|dumb)\b)/i
  ],
  illegal: [
    /(\b(drugs|illegal|hack|piracy|steal)\b)/i,
    /(\b(fraud|scam|cheat)\b)/i
  ],
  personal: [
    /(\b(personal info|address|phone|ssn|credit card)\b)/i,
    /(\b(password|login|account details)\b)/i
  ]
};

// Professional alternative responses for filtered content
const professionalAlternatives = {
  explicit: "I'm designed to provide professional assistance with web development and business services. I'd be happy to help you with questions about our services, pricing, or technical solutions.",
  violence: "I focus on helping with positive business solutions and web development services. Let me know how I can assist you with your project needs or technical questions.",
  harassment: "I'm here to provide helpful and respectful assistance. Please let me know how I can help you with our services or answer any technical questions you might have.",
  illegal: "I can only provide guidance on legitimate business practices and ethical web development solutions. I'd be glad to help you with proper implementation strategies or service inquiries.",
  personal: "For security reasons, I can't help with personal information requests. However, I'm here to assist with our web development services, pricing, or technical questions about our solutions.",
  general: "I'm designed to help with professional web development services and business solutions. Please feel free to ask about our services, pricing, or technical capabilities."
};

// Emotion detection patterns
const emotionPatterns = {
  excited: [
    /(!{2,})|(\b(amazing|awesome|fantastic|incredible|wow|great)\b)/i,
    /(\b(love|excited|thrilled|pumped)\b)/i
  ],
  frustrated: [
    /(\b(frustrated|annoyed|stuck|confused|help|urgent)\b)/i,
    /(\?{2,})|(\b(why|how come|what's wrong)\b)/i
  ],
  curious: [
    /(\b(wondering|curious|interested|tell me|explain|how|what|why)\b)/i,
    /(\?)/
  ],
  professional: [
    /(\b(business|company|enterprise|professional|corporate)\b)/i,
    /(\b(proposal|quote|estimate|consultation)\b)/i
  ],
  casual: [
    /(\b(hey|hi|hello|sup|yo)\b)/i,
    /(\b(cool|nice|sweet|dope)\b)/i
  ],
  urgent: [
    /(\b(urgent|asap|quickly|fast|immediately|rush)\b)/i,
    /(!{1,})/
  ]
};

// Intent classification patterns
const intentPatterns = {
  inquiry: [
    /(\b(what|how|when|where|why|which|who)\b)/i,
    /(\b(tell me|explain|describe|show me)\b)/i
  ],
  request: [
    /(\b(can you|could you|would you|please|help me)\b)/i,
    /(\b(need|want|looking for|require)\b)/i
  ],
  comparison: [
    /(\b(vs|versus|compare|difference|better|best)\b)/i,
    /(\b(which is|what's the difference)\b)/i
  ],
  pricing: [
    /(\b(cost|price|pricing|expensive|cheap|budget|afford)\b)/i,
    /(\b(how much|what does it cost)\b)/i
  ],
  technical: [
    /(\b(code|programming|development|technical|API|database)\b)/i,
    /(\b(implement|integrate|build|create)\b)/i
  ]
};

// Conversational elements for human-like responses
const conversationalElements = {
  openings: {
    excited: ["Absolutely!", "That's fantastic!", "Great question!", "I'm excited to help!"],
    professional: ["Certainly,", "Of course,", "I'd be happy to help,", "Let me explain,"],
    casual: ["Sure thing!", "No problem!", "Hey there!", "Totally!"],
    empathetic: ["I understand,", "That makes sense,", "I can see why you'd ask,", "Good point,"]
  },
  transitions: {
    explaining: ["Here's the thing:", "What this means is:", "In simple terms:", "Basically,"],
    listing: ["Here's what we offer:", "Our services include:", "You'll get:", "We provide:"],
    concluding: ["Bottom line:", "In summary:", "The key takeaway:", "What this means for you:"]
  },
  closings: {
    helpful: ["Hope this helps!", "Let me know if you need anything else!", "Feel free to ask more questions!"],
    actionable: ["Ready to get started?", "Want to discuss your project?", "Shall we set up a call?"],
    professional: ["I'm here if you need further assistance.", "Please don't hesitate to reach out.", "Looking forward to helping you."]
  }
};

// Personality adaptation patterns
const personalityTypes = {
  analytical: {
    style: "data-driven, structured, logical",
    elements: ["Based on our experience,", "The data shows,", "Statistically speaking,", "Our track record indicates,"]
  },
  creative: {
    style: "imaginative, inspiring, visionary",
    elements: ["Imagine this:", "Picture this scenario:", "Here's a creative approach:", "Think of it this way:"]
  },
  practical: {
    style: "straightforward, solution-focused, efficient",
    elements: ["Here's what works:", "The practical approach is:", "Simply put:", "The most effective way is:"]
  },
  relationship: {
    style: "warm, personal, collaborative",
    elements: ["We'd love to work with you,", "Together, we can", "Our team is passionate about", "We understand your needs,"]
  }
};

// Detect user emotion from input
export const detectEmotion = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  for (const [emotion, patterns] of Object.entries(emotionPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        return emotion;
      }
    }
  }
  
  return 'neutral';
};

// Detect user intent
export const detectIntent = (userInput: string): string => {
  const input = userInput.toLowerCase();
  
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        return intent;
      }
    }
  }
  
  return 'general';
};

// Analyze conversation complexity
export const analyzeComplexity = (userInput: string): string => {
  const wordCount = userInput.split(' ').length;
  const technicalTerms = /(\b(API|database|framework|architecture|deployment|integration|optimization)\b)/gi;
  const hasTechnicalTerms = technicalTerms.test(userInput);
  
  if (wordCount > 20 || hasTechnicalTerms) return 'complex';
  if (wordCount > 10) return 'moderate';
  return 'simple';
};

// Detect urgency level
export const detectUrgency = (userInput: string): string => {
  const urgentPatterns = [
    /(\b(urgent|asap|quickly|fast|immediately|rush|deadline)\b)/i,
    /(!{2,})/,
    /(\b(need now|right away|today)\b)/i
  ];
  
  for (const pattern of urgentPatterns) {
    if (pattern.test(userInput)) {
      return 'high';
    }
  }
  
  return 'normal';
};

// Enhanced content filtering function with domain restrictions
export const filterInappropriateContent = (userInput: string): ContentFilterResult => {
  const input = userInput.toLowerCase();
  const flaggedCategories: string[] = [];
  let severity: 'low' | 'medium' | 'high' = 'low';

  // First check for inappropriate content
  for (const [category, patterns] of Object.entries(inappropriateContentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(input)) {
        flaggedCategories.push(category);

        // Determine severity based on category
        if (category === 'explicit' || category === 'violence') {
          severity = 'high';
        } else if (category === 'harassment' || category === 'illegal') {
          severity = 'medium';
        }
        break; // Only flag once per category
      }
    }
  }

  // Enhanced domain restriction check - only allow specific topics
  const allowedTopics = [
    // NEX-DEVS services and business
    /(\b(nex-devs|nexdevs|nex devs|services|pricing|portfolio|projects|team|about|contact|consultation|quote|estimate)\b)/i,

    // Technology and coding
    /(\b(web development|website|app|application|programming|coding|software|development|tech|technology|framework|library|api|database|frontend|backend|fullstack)\b)/i,

    // AI and machine learning
    /(\b(ai|artificial intelligence|machine learning|ml|chatbot|automation|neural network|deep learning|nlp|natural language)\b)/i,

    // Programming languages and tools
    /(\b(javascript|typescript|react|nextjs|node|python|java|html|css|sql|mongodb|postgresql|git|github|docker|aws|cloud)\b)/i,

    // General tech concepts
    /(\b(algorithm|data structure|optimization|performance|security|authentication|deployment|hosting|domain|server|client)\b)/i,

    // Business and project related
    /(\b(business|startup|project|solution|integration|custom|enterprise|scalable|responsive|mobile|desktop)\b)/i
  ];

  const isTopicAllowed = allowedTopics.some(pattern => pattern.test(input));

  // Check for off-topic content that should be redirected
  const offTopicPatterns = [
    // Personal life, relationships, health
    /(\b(personal|relationship|dating|marriage|family|health|medical|doctor|therapy|depression|anxiety)\b)/i,

    // Entertainment and media
    /(\b(movie|film|tv show|series|celebrity|music|song|album|game|gaming|sports|football|basketball)\b)/i,

    // Politics and controversial topics
    /(\b(politics|political|government|election|vote|president|democrat|republican|liberal|conservative)\b)/i,

    // General life advice
    /(\b(life advice|career advice|relationship advice|what should i do|how to live|meaning of life)\b)/i,

    // Random questions
    /(\b(weather|food|recipe|cooking|travel|vacation|hobby|pet|animal|joke|funny|meme)\b)/i
  ];

  const isOffTopic = offTopicPatterns.some(pattern => pattern.test(input));

  // If content is off-topic and not about allowed topics, flag it
  if (isOffTopic && !isTopicAllowed) {
    flaggedCategories.push('off-topic');
    severity = 'medium';
  }

  const isAppropriate = flaggedCategories.length === 0;

  // Generate alternative response if content is inappropriate or off-topic
  let alternativeResponse: string | undefined;
  if (!isAppropriate) {
    const primaryCategory = flaggedCategories[0];
    if (primaryCategory === 'off-topic') {
      alternativeResponse = "I'm specifically designed to help with NEX-DEVS services, web development, AI integration, and programming-related questions. I'd be happy to assist you with topics like our development services, pricing, technical solutions, or any coding and AI-related inquiries. How can I help you with your development needs?";
    } else {
      alternativeResponse = professionalAlternatives[primaryCategory] || professionalAlternatives.general;
    }
  }

  return {
    isAppropriate,
    flaggedCategories,
    severity,
    alternativeResponse
  };
};

// Determine personality type based on input
export const determinePersonalityType = (userInput: string): string => {
  const input = userInput.toLowerCase();

  if (/(\b(data|statistics|numbers|metrics|analysis|research)\b)/.test(input)) {
    return 'analytical';
  }
  if (/(\b(creative|design|innovative|unique|artistic)\b)/.test(input)) {
    return 'creative';
  }
  if (/(\b(simple|straightforward|efficient|practical|direct)\b)/.test(input)) {
    return 'practical';
  }
  if (/(\b(team|together|partnership|relationship|collaborate)\b)/.test(input)) {
    return 'relationship';
  }

  return 'practical'; // Default to practical
};

// Generate NLP context from user input
export const generateNLPContext = (userInput: string): NLPContext => {
  return {
    userEmotion: detectEmotion(userInput),
    conversationTone: detectEmotion(userInput) === 'professional' ? 'formal' : 'casual',
    userIntent: detectIntent(userInput),
    complexity: analyzeComplexity(userInput),
    urgency: detectUrgency(userInput),
    personalityType: determinePersonalityType(userInput)
  };
};

// Select appropriate conversational elements
export const selectConversationalElements = (context: NLPContext): string[] => {
  const elements: string[] = [];
  
  // Select opening based on emotion and tone
  const openingCategory = context.userEmotion === 'professional' ? 'professional' : 
                         context.userEmotion === 'excited' ? 'excited' :
                         context.userEmotion === 'frustrated' ? 'empathetic' : 'casual';
  
  const openings = conversationalElements.openings[openingCategory] || conversationalElements.openings.professional;
  elements.push(openings[Math.floor(Math.random() * openings.length)]);
  
  // Add personality-specific elements
  const personality = personalityTypes[context.personalityType];
  if (personality) {
    const personalityElement = personality.elements[Math.floor(Math.random() * personality.elements.length)];
    elements.push(personalityElement);
  }
  
  return elements;
};

// Generate humanized response configuration
export const humanizeResponse = (userInput: string, systemPrompt: string): HumanizedResponse => {
  const context = generateNLPContext(userInput);
  const conversationalElements = selectConversationalElements(context);
  
  // Create enhanced system prompt with NLP context
  const nlpEnhancedPrompt = `${systemPrompt}

**HUMAN-LIKE RESPONSE GUIDELINES:**
- User Emotion: ${context.userEmotion}
- Conversation Tone: ${context.conversationTone}
- User Intent: ${context.userIntent}
- Complexity Level: ${context.complexity}
- Urgency: ${context.urgency}
- Personality Match: ${context.personalityType}

**CONVERSATIONAL STYLE:**
${context.conversationTone === 'formal' ? 
  '- Use professional but warm language\n- Be respectful and authoritative\n- Include "I" statements for personal touch' :
  '- Use friendly, approachable language\n- Be conversational and relatable\n- Include casual connectors like "So," "Well," "Actually,"'
}

**RESPONSE STRUCTURE:**
1. Start with: "${conversationalElements[0]}"
2. ${context.personalityType === 'analytical' ? 'Provide data-driven insights' :
     context.personalityType === 'creative' ? 'Use imaginative language and examples' :
     context.personalityType === 'practical' ? 'Focus on practical solutions' :
     'Emphasize collaboration and partnership'}
3. ${context.urgency === 'high' ? 'Address urgency and provide immediate next steps' : 'Provide comprehensive but concise information'}
4. End with a ${context.userIntent === 'inquiry' ? 'helpful follow-up question' : 'clear call-to-action'}

**HUMAN ELEMENTS TO INCLUDE:**
- Use contractions (we're, you'll, it's) for natural flow
- Include empathy markers ("I understand," "That makes sense")
- Add personal touches ("In my experience," "We've found that")
- Use conversational connectors ("So," "Well," "Actually," "By the way")
- Include gentle humor when appropriate (but stay professional)
- Show enthusiasm for helping ("I'd love to help," "Excited to work with you")

Remember: Sound like a knowledgeable friend, not a robot. Be helpful, genuine, and personable while maintaining professionalism.`;

  return {
    processedPrompt: nlpEnhancedPrompt,
    responseStyle: `${context.conversationTone}_${context.personalityType}`,
    conversationalElements,
    emotionalTone: context.userEmotion
  };
};

// Post-process AI response to add human touches
export const addHumanTouches = (aiResponse: string, context: NLPContext): string => {
  let humanizedResponse = aiResponse;
  
  // Add conversational connectors
  const connectors = ["Well,", "So,", "Actually,", "You know,", "Here's the thing:"];
  if (Math.random() > 0.7 && context.conversationTone === 'casual') {
    const connector = connectors[Math.floor(Math.random() * connectors.length)];
    humanizedResponse = `${connector} ${humanizedResponse}`;
  }
  
  // Add empathy markers for frustrated users
  if (context.userEmotion === 'frustrated') {
    const empathyMarkers = ["I totally understand,", "I can see why that's confusing,", "That's a great question,"];
    const marker = empathyMarkers[Math.floor(Math.random() * empathyMarkers.length)];
    humanizedResponse = `${marker} ${humanizedResponse}`;
  }
  
  // Add enthusiasm for excited users
  if (context.userEmotion === 'excited') {
    humanizedResponse = humanizedResponse.replace(/\.$/, '! 🚀');
  }
  
  // Add urgency acknowledgment
  if (context.urgency === 'high') {
    humanizedResponse = `I understand this is urgent. ${humanizedResponse}`;
  }
  
  return humanizedResponse;
};

export default {
  generateNLPContext,
  humanizeResponse,
  addHumanTouches,
  detectEmotion,
  detectIntent,
  analyzeComplexity,
  filterInappropriateContent
};
