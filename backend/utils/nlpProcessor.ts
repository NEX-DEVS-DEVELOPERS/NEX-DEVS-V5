// nlpProcessor.ts
// Advanced NLP Processing for Human-like AI Responses
// This module handles natural language processing to make AI responses more conversational and human-like

// Enhanced emotion analysis with confidence scoring
export interface EmotionAnalysis {
  primary: string;
  secondary?: string;
  confidence: number; // 0-1 confidence score
  intensity: 'low' | 'medium' | 'high';
  emotionScores: Record<string, number>; // All emotion scores
}

// Advanced sentiment analysis
export interface SentimentAnalysis {
  polarity: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1 scale
  confidence: number; // 0-1 confidence score
  subjectivity: number; // 0-1 scale (0=objective, 1=subjective)
}

// Section context for website navigation awareness
export interface SectionContext {
  currentSection: string;
  previousSection?: string;
  timeSpent: number; // seconds in current section
  interactionCount: number; // interactions in this section
  relevantContent: string[]; // relevant content for this section
}

// Response quality metrics
export interface ResponseQuality {
  score: number; // 0-1 overall quality score
  relevance: number; // 0-1 relevance to query
  professionalism: number; // 0-1 professional tone score
  completeness: number; // 0-1 completeness score
  clarity: number; // 0-1 clarity score
  engagement: number; // 0-1 engagement level
}

export interface NLPContext {
  userEmotion: string;
  conversationTone: string;
  userIntent: string;
  complexity: string;
  urgency: string;
  personalityType: string;
  // Enhanced context fields
  emotionAnalysis: EmotionAnalysis;
  sentimentAnalysis: SentimentAnalysis;
  contextualRelevance: number; // 0-1 score for NEX-DEVS relevance
  sectionContext?: SectionContext;
}

export interface HumanizedResponse {
  processedPrompt: string;
  responseStyle: string;
  conversationalElements: string[];
  emotionalTone: string;
  // Enhanced response fields
  qualityScore: number; // 0-1 response quality score
  professionalismLevel: 'casual' | 'professional' | 'formal';
  responseLength: 'concise' | 'moderate' | 'detailed';
}

export interface ContentFilterResult {
  isAppropriate: boolean;
  flaggedCategories: string[];
  severity: 'low' | 'medium' | 'high';
  alternativeResponse?: string;
}

// Response variation tracking to prevent repetitive responses
export interface ResponseVariation {
  baseQuery: string;
  variations: string[];
  lastUsedIndex: number;
  usageCount: number;
  lastUsed: Date;
}

// Response template system for variation
export interface ResponseTemplate {
  id: string;
  category: string;
  templates: string[];
  placeholders: string[];
  priority: number;
}

// Advanced content filtering with machine learning-like scoring
export interface AdvancedFilterResult extends ContentFilterResult {
  confidenceScore: number; // 0-1 confidence in filtering decision
  contextualRelevance: number; // 0-1 relevance to NEX-DEVS domain
  suggestedRedirect?: string; // Suggested page or topic to redirect to
  filteringReason: string; // Detailed reason for filtering
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

// Response variation storage
let responseVariations: ResponseVariation[] = [];

// Response templates for common queries with variations
const responseTemplates: ResponseTemplate[] = [
  {
    id: 'pricing_inquiry',
    category: 'pricing',
    templates: [
      "Our pricing varies by service complexity. {service} starts at {price}. {additional_info}",
      "We offer competitive rates for {service} beginning at {price}. {additional_info}",
      "For {service}, our pricing starts from {price}. {additional_info}",
      "The cost for {service} begins at {price}. {additional_info}"
    ],
    placeholders: ['service', 'price', 'additional_info'],
    priority: 9
  },
  {
    id: 'service_inquiry',
    category: 'services',
    templates: [
      "We specialize in {service_list}. Our expertise includes {technologies}.",
      "Our core services include {service_list}, utilizing {technologies}.",
      "We offer comprehensive {service_list} with modern {technologies}.",
      "Our team provides {service_list} using cutting-edge {technologies}."
    ],
    placeholders: ['service_list', 'technologies'],
    priority: 8
  },
  {
    id: 'contact_inquiry',
    category: 'contact',
    templates: [
      "You can reach us at {email} or {phone}. We typically respond within {response_time}.",
      "Feel free to contact us via {email} or call {phone}. Our response time is usually {response_time}.",
      "Get in touch through {email} or {phone}. We'll get back to you within {response_time}.",
      "Contact us at {email} or {phone}. Expect a response within {response_time}."
    ],
    placeholders: ['email', 'phone', 'response_time'],
    priority: 7
  }
];

// Professional alternative responses for filtered content with variations
const professionalAlternatives: Record<string, string[]> = {
  explicit: [
    "I'm designed to provide professional assistance with web development and business services. I'd be happy to help you with questions about our services, pricing, or technical solutions.",
    "I focus on professional web development topics. Let me help you with our services, pricing information, or technical questions instead.",
    "I'm here to assist with business and technical matters. How can I help you with our web development services or project needs?"
  ],
  violence: [
    "I focus on helping with positive business solutions and web development services. Let me know how I can assist you with your project needs or technical questions.",
    "I'm designed to help with constructive business solutions. What web development or technical questions can I assist you with?",
    "Let's focus on positive business outcomes. How can I help you with our development services or technical solutions?"
  ],
  harassment: [
    "I'm here to provide helpful and respectful assistance. Please let me know how I can help you with our services or answer any technical questions you might have.",
    "I maintain a professional and respectful environment. How can I assist you with our web development services or technical inquiries?",
    "Let's keep our conversation professional and helpful. What questions do you have about our services or technical capabilities?"
  ],
  illegal: [
    "I can only provide guidance on legitimate business practices and ethical web development solutions. I'd be glad to help you with proper implementation strategies or service inquiries.",
    "I focus on ethical business practices and legitimate development solutions. How can I assist you with proper web development strategies?",
    "I provide guidance on lawful business practices only. Let me help you with ethical development solutions and service inquiries."
  ],
  personal: [
    "For security reasons, I can't help with personal information requests. However, I'm here to assist with our web development services, pricing, or technical questions about our solutions.",
    "I don't handle personal information for security purposes. I'd be happy to help with our services, pricing, or technical questions instead.",
    "Personal information requests aren't something I can assist with. Let me help you with our web development services or technical solutions."
  ],
  'off-topic': [
    "I'm specifically designed to help with NEX-DEVS services, web development, AI integration, and programming-related questions. I'd be happy to assist you with topics like our development services, pricing, technical solutions, or any coding and AI-related inquiries. How can I help you with your development needs?",
    "I specialize in NEX-DEVS services and web development topics. I can help with our services, pricing, technical solutions, or programming questions. What development needs can I assist you with?",
    "My expertise is in NEX-DEVS services, web development, and technology topics. I'd love to help you with our development services, pricing information, or technical questions. What can I assist you with today?"
  ],
  general: [
    "I'm designed to help with professional web development services and business solutions. Please feel free to ask about our services, pricing, or technical capabilities.",
    "I specialize in web development services and business solutions. How can I assist you with our services, pricing, or technical questions?",
    "I'm here to help with professional development services and business needs. What questions do you have about our services or technical capabilities?"
  ]
};

// Enhanced emotion detection patterns with scoring weights
const emotionPatterns = {
  excited: {
    patterns: [
      { regex: /(!{2,})|(\b(amazing|awesome|fantastic|incredible|wow|great)\b)/i, weight: 0.8 },
      { regex: /(\b(love|excited|thrilled|pumped)\b)/i, weight: 0.9 },
      { regex: /(\b(perfect|excellent|outstanding|brilliant)\b)/i, weight: 0.7 }
    ],
    baseScore: 0.1
  },
  frustrated: {
    patterns: [
      { regex: /(\b(frustrated|annoyed|stuck|confused|help|urgent)\b)/i, weight: 0.8 },
      { regex: /(\?{2,})|(\b(why|how come|what's wrong)\b)/i, weight: 0.6 },
      { regex: /(\b(problem|issue|error|broken|not working)\b)/i, weight: 0.7 }
    ],
    baseScore: 0.1
  },
  curious: {
    patterns: [
      { regex: /(\b(wondering|curious|interested|tell me|explain|how|what|why)\b)/i, weight: 0.7 },
      { regex: /(\?)/g, weight: 0.3 },
      { regex: /(\b(learn|understand|know more|details)\b)/i, weight: 0.6 }
    ],
    baseScore: 0.2
  },
  professional: {
    patterns: [
      { regex: /(\b(business|company|enterprise|professional|corporate)\b)/i, weight: 0.8 },
      { regex: /(\b(proposal|quote|estimate|consultation)\b)/i, weight: 0.9 },
      { regex: /(\b(requirements|specifications|timeline|budget)\b)/i, weight: 0.7 }
    ],
    baseScore: 0.1
  },
  casual: {
    patterns: [
      { regex: /(\b(hey|hi|hello|sup|yo)\b)/i, weight: 0.6 },
      { regex: /(\b(cool|nice|sweet|dope)\b)/i, weight: 0.5 },
      { regex: /(\b(thanks|thx|appreciate)\b)/i, weight: 0.4 }
    ],
    baseScore: 0.3
  },
  urgent: {
    patterns: [
      { regex: /(\b(urgent|asap|quickly|fast|immediately|rush)\b)/i, weight: 0.9 },
      { regex: /(!{1,})/g, weight: 0.4 },
      { regex: /(\b(deadline|time sensitive|priority)\b)/i, weight: 0.8 }
    ],
    baseScore: 0.1
  },
  satisfied: {
    patterns: [
      { regex: /(\b(good|fine|okay|alright|satisfied)\b)/i, weight: 0.6 },
      { regex: /(\b(thank you|thanks|appreciate)\b)/i, weight: 0.7 }
    ],
    baseScore: 0.2
  },
  concerned: {
    patterns: [
      { regex: /(\b(worried|concerned|anxious|unsure)\b)/i, weight: 0.8 },
      { regex: /(\b(doubt|hesitant|uncertain)\b)/i, weight: 0.7 }
    ],
    baseScore: 0.1
  }
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
const personalityTypes: Record<string, { style: string; elements: string[] }> = {
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

// Enhanced emotion detection with confidence scoring
export const detectEmotionWithConfidence = (userInput: string): EmotionAnalysis => {
  const input = userInput.toLowerCase();
  const emotionScores: Record<string, number> = {};

  // Calculate scores for each emotion
  for (const [emotion, config] of Object.entries(emotionPatterns)) {
    let score = config.baseScore;

    for (const patternConfig of config.patterns) {
      const matches = input.match(patternConfig.regex);
      if (matches) {
        score += patternConfig.weight * (matches.length / 10); // Normalize by match count
      }
    }

    emotionScores[emotion] = Math.min(score, 1.0); // Cap at 1.0
  }

  // Find primary and secondary emotions
  const sortedEmotions = Object.entries(emotionScores)
    .sort(([, a], [, b]) => b - a);

  const primary = sortedEmotions[0]?.[0] || 'neutral';
  const primaryScore = sortedEmotions[0]?.[1] || 0;
  const secondary = sortedEmotions[1]?.[0];
  const secondaryScore = sortedEmotions[1]?.[1] || 0;

  // Determine intensity based on score
  let intensity: 'low' | 'medium' | 'high' = 'low';
  if (primaryScore > 0.7) intensity = 'high';
  else if (primaryScore > 0.4) intensity = 'medium';

  return {
    primary,
    secondary: secondaryScore > 0.3 ? secondary : undefined,
    confidence: primaryScore,
    intensity,
    emotionScores
  };
};

// Backward compatibility function
export const detectEmotion = (userInput: string): string => {
  return detectEmotionWithConfidence(userInput).primary;
};

// Advanced sentiment analysis
export const analyzeSentiment = (userInput: string): SentimentAnalysis => {
  const input = userInput.toLowerCase();

  // Positive sentiment patterns
  const positivePatterns = [
    { regex: /(\b(good|great|excellent|amazing|awesome|fantastic|wonderful|perfect|love|like|happy|pleased|satisfied)\b)/gi, weight: 0.8 },
    { regex: /(\b(yes|sure|absolutely|definitely|certainly|of course)\b)/gi, weight: 0.6 },
    { regex: /(\b(thank|thanks|appreciate|grateful)\b)/gi, weight: 0.7 },
    { regex: /(!)/g, weight: 0.2 }
  ];

  // Negative sentiment patterns
  const negativePatterns = [
    { regex: /(\b(bad|terrible|awful|horrible|hate|dislike|frustrated|annoyed|disappointed|upset)\b)/gi, weight: 0.8 },
    { regex: /(\b(no|not|never|can't|won't|don't|doesn't)\b)/gi, weight: 0.4 },
    { regex: /(\b(problem|issue|error|wrong|broken|failed)\b)/gi, weight: 0.6 },
    { regex: /(\?{2,})/g, weight: 0.3 }
  ];

  // Calculate sentiment scores
  let positiveScore = 0;
  let negativeScore = 0;

  positivePatterns.forEach(({ regex, weight }) => {
    const matches = input.match(regex);
    if (matches) positiveScore += matches.length * weight;
  });

  negativePatterns.forEach(({ regex, weight }) => {
    const matches = input.match(regex);
    if (matches) negativeScore += matches.length * weight;
  });

  // Normalize scores
  const totalScore = positiveScore + negativeScore;
  const normalizedPositive = totalScore > 0 ? positiveScore / totalScore : 0;
  const normalizedNegative = totalScore > 0 ? negativeScore / totalScore : 0;

  // Calculate final polarity score (-1 to 1)
  const score = normalizedPositive - normalizedNegative;

  // Determine polarity
  let polarity: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (score > 0.2) polarity = 'positive';
  else if (score < -0.2) polarity = 'negative';

  // Calculate confidence and subjectivity
  const confidence = Math.abs(score);
  const subjectivity = Math.min((positiveScore + negativeScore) / 10, 1);

  return {
    polarity,
    score,
    confidence,
    subjectivity
  };
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

// =============================================================================
// RESPONSE VARIATION SYSTEM - PREVENTS REPETITIVE RESPONSES
// =============================================================================

// Create a hash for query similarity detection
const createQueryHash = (query: string): string => {
  const normalized = query.toLowerCase().replace(/[^\w\s]/g, '').trim();
  const words = normalized.split(/\s+/).sort();
  return words.join('_');
};

// Get varied response for similar queries
export const getVariedResponse = (query: string, baseResponse: string): string => {
  const queryHash = createQueryHash(query);

  // Find existing variation entry
  let variation = responseVariations.find(v => v.baseQuery === queryHash);

  if (!variation) {
    // Create new variation entry
    variation = {
      baseQuery: queryHash,
      variations: [baseResponse],
      lastUsedIndex: 0,
      usageCount: 1,
      lastUsed: new Date()
    };
    responseVariations.push(variation);
    return baseResponse;
  }

  // If we have multiple variations, rotate through them
  if (variation.variations.length > 1) {
    variation.lastUsedIndex = (variation.lastUsedIndex + 1) % variation.variations.length;
    variation.usageCount++;
    variation.lastUsed = new Date();
    return variation.variations[variation.lastUsedIndex];
  }

  // If only one variation exists, try to generate alternatives
  const alternatives = generateResponseAlternatives(baseResponse);
  if (alternatives.length > 0) {
    variation.variations.push(...alternatives);
    variation.lastUsedIndex = 1; // Use first alternative
    variation.usageCount++;
    variation.lastUsed = new Date();
    return variation.variations[1];
  }

  return baseResponse;
};

// Generate alternative phrasings for responses
const generateResponseAlternatives = (originalResponse: string): string[] => {
  const alternatives: string[] = [];

  // Simple synonym replacements for common words
  const synonymMap: Record<string, string[]> = {
    'help': ['assist', 'support', 'aid'],
    'provide': ['offer', 'deliver', 'supply'],
    'services': ['solutions', 'offerings', 'capabilities'],
    'excellent': ['outstanding', 'exceptional', 'superior'],
    'great': ['fantastic', 'wonderful', 'amazing'],
    'happy': ['pleased', 'delighted', 'glad'],
    'certainly': ['absolutely', 'definitely', 'of course'],
    'questions': ['inquiries', 'queries', 'concerns']
  };

  // Create variations by replacing synonyms
  let variation1 = originalResponse;
  let variation2 = originalResponse;

  Object.entries(synonymMap).forEach(([word, synonyms]) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(variation1)) {
      variation1 = variation1.replace(regex, synonyms[0]);
    }
    if (regex.test(variation2) && synonyms.length > 1) {
      variation2 = variation2.replace(regex, synonyms[1]);
    }
  });

  // Add variations if they're different from original
  if (variation1 !== originalResponse) alternatives.push(variation1);
  if (variation2 !== originalResponse && variation2 !== variation1) alternatives.push(variation2);

  return alternatives;
};

// Get professional alternative with variation
export const getVariedProfessionalAlternative = (category: string): string => {
  const alternatives = professionalAlternatives[category] || professionalAlternatives.general;
  const randomIndex = Math.floor(Math.random() * alternatives.length);
  return alternatives[randomIndex];
};

// Clean up old response variations (call periodically)
export const cleanupResponseVariations = (): void => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  responseVariations = responseVariations.filter(variation =>
    variation.lastUsed > thirtyDaysAgo || variation.usageCount > 5
  );
};

// Get response variation statistics
export const getResponseVariationStats = () => {
  return {
    totalVariations: responseVariations.length,
    averageUsage: responseVariations.reduce((sum, v) => sum + v.usageCount, 0) / responseVariations.length,
    mostUsedQuery: responseVariations.reduce((max, v) => v.usageCount > max.usageCount ? v : max, responseVariations[0]),
    recentActivity: responseVariations.filter(v =>
      v.lastUsed > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };
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
    alternativeResponse = getVariedProfessionalAlternative(primaryCategory);
  }

  return {
    isAppropriate,
    flaggedCategories,
    severity,
    alternativeResponse
  };
};

// Advanced content filtering with enhanced AI-like decision making
export const advancedContentFilter = (userInput: string): AdvancedFilterResult => {
  const basicFilter = filterInappropriateContent(userInput);
  const contextualRelevance = analyzeContextualRelevance(userInput);

  // Calculate confidence score based on multiple factors
  let confidenceScore = 0.5; // Base confidence

  // Increase confidence for clear violations
  if (basicFilter.flaggedCategories.length > 0) {
    confidenceScore += 0.3;
    if (basicFilter.severity === 'high') confidenceScore += 0.2;
  }

  // Increase confidence for clear off-topic content
  if (contextualRelevance < 0.2) {
    confidenceScore += 0.2;
  }

  // Decrease confidence for borderline cases
  if (contextualRelevance > 0.3 && contextualRelevance < 0.7) {
    confidenceScore -= 0.1;
  }

  confidenceScore = Math.min(Math.max(confidenceScore, 0), 1);

  // Determine suggested redirect based on content analysis
  let suggestedRedirect: string | undefined;
  const input = userInput.toLowerCase();

  if (/\b(price|cost|pricing|budget|afford)\b/i.test(input)) {
    suggestedRedirect = '/pricing';
  } else if (/\b(service|what.*do|offer|capability)\b/i.test(input)) {
    suggestedRedirect = '/services';
  } else if (/\b(portfolio|project|work|example)\b/i.test(input)) {
    suggestedRedirect = '/portfolio';
  } else if (/\b(about|team|founder|ali|company)\b/i.test(input)) {
    suggestedRedirect = '/about';
  } else if (/\b(contact|reach|email|phone|consultation)\b/i.test(input)) {
    suggestedRedirect = '/contact';
  }

  // Generate detailed filtering reason
  let filteringReason = 'Content is appropriate for NEX-DEVS services';
  if (!basicFilter.isAppropriate) {
    if (basicFilter.flaggedCategories.includes('off-topic')) {
      filteringReason = `Content is off-topic (relevance score: ${contextualRelevance.toFixed(2)}). Focus should be on web development, AI integration, or programming topics.`;
    } else {
      filteringReason = `Content flagged for: ${basicFilter.flaggedCategories.join(', ')}. Severity: ${basicFilter.severity}.`;
    }
  }

  return {
    ...basicFilter,
    confidenceScore,
    contextualRelevance,
    suggestedRedirect,
    filteringReason
  };
};

// Analyze contextual relevance to NEX-DEVS services
export const analyzeContextualRelevance = (userInput: string): number => {
  const input = userInput.toLowerCase();
  let relevanceScore = 0;

  // High relevance patterns (core services)
  const highRelevancePatterns = [
    /(\b(nex-devs|nexdevs|web development|website|app development|programming|coding)\b)/gi,
    /(\b(react|nextjs|javascript|typescript|nodejs|database|api)\b)/gi,
    /(\b(pricing|cost|quote|estimate|consultation|project)\b)/gi,
    /(\b(portfolio|services|team|about|contact)\b)/gi
  ];

  // Medium relevance patterns (related topics)
  const mediumRelevancePatterns = [
    /(\b(technology|software|development|design|frontend|backend)\b)/gi,
    /(\b(business|startup|company|enterprise|solution)\b)/gi,
    /(\b(ai|artificial intelligence|chatbot|automation)\b)/gi,
    /(\b(mobile|responsive|user experience|ui|ux)\b)/gi
  ];

  // Low relevance patterns (tangentially related)
  const lowRelevancePatterns = [
    /(\b(computer|internet|online|digital|tech)\b)/gi,
    /(\b(help|support|assistance|guidance)\b)/gi
  ];

  // Calculate relevance score
  highRelevancePatterns.forEach(pattern => {
    const matches = input.match(pattern);
    if (matches) relevanceScore += matches.length * 0.8;
  });

  mediumRelevancePatterns.forEach(pattern => {
    const matches = input.match(pattern);
    if (matches) relevanceScore += matches.length * 0.5;
  });

  lowRelevancePatterns.forEach(pattern => {
    const matches = input.match(pattern);
    if (matches) relevanceScore += matches.length * 0.2;
  });

  // Normalize to 0-1 scale
  return Math.min(relevanceScore / 5, 1.0);
};

// Section-aware data collection
export const detectSectionContext = (userInput: string, currentUrl?: string): SectionContext => {
  const input = userInput.toLowerCase();
  let currentSection = 'general';
  const relevantContent: string[] = [];

  // Detect section based on keywords and URL
  if (currentUrl) {
    if (currentUrl.includes('/services') || /(\b(services|what do you offer|what can you do)\b)/i.test(input)) {
      currentSection = 'services';
      relevantContent.push('Web Development Services', 'Custom Applications', 'E-commerce Solutions');
    } else if (currentUrl.includes('/pricing') || /(\b(pricing|cost|price|how much|budget)\b)/i.test(input)) {
      currentSection = 'pricing';
      relevantContent.push('Service Packages', 'Custom Quotes', 'Payment Options');
    } else if (currentUrl.includes('/portfolio') || /(\b(portfolio|projects|work|examples)\b)/i.test(input)) {
      currentSection = 'portfolio';
      relevantContent.push('Previous Projects', 'Case Studies', 'Client Testimonials');
    } else if (currentUrl.includes('/about') || /(\b(about|team|who|founder|ali)\b)/i.test(input)) {
      currentSection = 'about';
      relevantContent.push('Company Information', 'Team Details', 'Experience');
    } else if (currentUrl.includes('/contact') || /(\b(contact|reach|email|phone)\b)/i.test(input)) {
      currentSection = 'contact';
      relevantContent.push('Contact Information', 'Consultation Booking', 'Response Times');
    }
  }

  return {
    currentSection,
    timeSpent: 0, // This would be tracked by the frontend
    interactionCount: 1,
    relevantContent
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

// Enhanced response quality validation
export const validateResponseQuality = (response: string, userInput: string): ResponseQuality => {
  const responseLength = response.length;
  const inputLength = userInput.length;

  // Relevance score based on keyword matching
  const inputKeywords: string[] = userInput.toLowerCase().match(/\b\w+\b/g) || [];
  const responseKeywords: string[] = response.toLowerCase().match(/\b\w+\b/g) || [];
  const commonKeywords = inputKeywords.filter((word: string) => responseKeywords.includes(word));
  const relevance = Math.min(commonKeywords.length / Math.max(inputKeywords.length, 1), 1);

  // Professionalism score based on language patterns
  const professionalPatterns = [
    /(\b(certainly|absolutely|professional|service|solution|assistance)\b)/gi,
    /(\b(we|our|I'd|I'll|let me|happy to)\b)/gi
  ];
  let professionalismScore = 0;
  professionalPatterns.forEach(pattern => {
    const matches = response.match(pattern);
    if (matches) professionalismScore += matches.length * 0.1;
  });
  const professionalism = Math.min(professionalismScore, 1);

  // Completeness based on response length relative to input complexity
  const expectedLength = Math.max(inputLength * 2, 100);
  const completeness = Math.min(responseLength / expectedLength, 1);

  // Clarity based on sentence structure and readability
  const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  const clarity = Math.max(0, 1 - (avgSentenceLength - 100) / 200); // Optimal around 100 chars

  // Engagement based on conversational elements
  const engagementPatterns = [
    /(\b(exciting|amazing|great|wonderful|fantastic)\b)/gi,
    /(\?|!)/g,
    /(\b(you|your|we|us|together)\b)/gi
  ];
  let engagementScore = 0;
  engagementPatterns.forEach(pattern => {
    const matches = response.match(pattern);
    if (matches) engagementScore += matches.length * 0.05;
  });
  const engagement = Math.min(engagementScore, 1);

  // Overall quality score (weighted average)
  const score = (relevance * 0.3 + professionalism * 0.2 + completeness * 0.2 + clarity * 0.15 + engagement * 0.15);

  return {
    score,
    relevance,
    professionalism,
    completeness,
    clarity,
    engagement
  };
};

// Generate enhanced NLP context from user input
export const generateNLPContext = (userInput: string, currentUrl?: string): NLPContext => {
  const emotionAnalysis = detectEmotionWithConfidence(userInput);
  const sentimentAnalysis = analyzeSentiment(userInput);
  const contextualRelevance = analyzeContextualRelevance(userInput);
  const sectionContext = detectSectionContext(userInput, currentUrl);

  return {
    userEmotion: emotionAnalysis.primary,
    conversationTone: emotionAnalysis.primary === 'professional' ? 'formal' : 'casual',
    userIntent: detectIntent(userInput),
    complexity: analyzeComplexity(userInput),
    urgency: detectUrgency(userInput),
    personalityType: determinePersonalityType(userInput),
    emotionAnalysis,
    sentimentAnalysis,
    contextualRelevance,
    sectionContext
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

  // Determine response characteristics
  const qualityScore = context.contextualRelevance * 0.6 + context.emotionAnalysis.confidence * 0.4;

  let professionalismLevel: 'casual' | 'professional' | 'formal' = 'professional';
  if (context.conversationTone === 'formal') professionalismLevel = 'formal';
  else if (context.userEmotion === 'casual') professionalismLevel = 'casual';

  let responseLength: 'concise' | 'moderate' | 'detailed' = 'moderate';
  if (context.complexity === 'simple') responseLength = 'concise';
  else if (context.complexity === 'complex') responseLength = 'detailed';

  return {
    processedPrompt: nlpEnhancedPrompt,
    responseStyle: `${context.conversationTone}_${context.personalityType}`,
    conversationalElements,
    emotionalTone: context.userEmotion,
    qualityScore,
    professionalismLevel,
    responseLength
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

// Intelligent response cleaning for professional presentation
export const cleanResponse = (response: string, context: NLPContext): string => {
  let cleanedResponse = response;

  // Remove redundant phrases
  const redundantPhrases = [
    /(\b(as I mentioned|like I said|as stated|as discussed)\b)/gi,
    /(\b(obviously|clearly|of course|naturally)\b)/gi,
    /(\b(um|uh|well|so|like)\b\s*,?\s*)/gi
  ];

  redundantPhrases.forEach(pattern => {
    cleanedResponse = cleanedResponse.replace(pattern, '');
  });

  // Ensure professional tone for business contexts
  if (context.contextualRelevance > 0.7) {
    cleanedResponse = cleanedResponse.replace(/\b(awesome|cool|sweet|dope)\b/gi, 'excellent');
    cleanedResponse = cleanedResponse.replace(/\b(yeah|yep|yup)\b/gi, 'yes');
    cleanedResponse = cleanedResponse.replace(/\b(nope|nah)\b/gi, 'no');
  }

  // Clean up spacing and punctuation
  cleanedResponse = cleanedResponse.replace(/\s+/g, ' '); // Multiple spaces to single
  cleanedResponse = cleanedResponse.replace(/\s+([,.!?])/g, '$1'); // Space before punctuation
  cleanedResponse = cleanedResponse.replace(/([.!?])\s*([a-z])/g, '$1 $2'); // Proper sentence spacing

  // Ensure proper capitalization
  cleanedResponse = cleanedResponse.replace(/(^|\. )([a-z])/g, (_, prefix, letter) =>
    prefix + letter.toUpperCase()
  );

  return cleanedResponse.trim();
};

// Contextual response filtering to prevent over-sharing
export const filterContextualResponse = (response: string, userInput: string, context: NLPContext): string => {
  // If user asks unrelated questions, redirect to relevant services
  if (context.contextualRelevance < 0.3) {
    const redirectResponse = `I'm specifically designed to help with NEX-DEVS services and web development solutions. While I can't assist with "${userInput.substring(0, 50)}${userInput.length > 50 ? '...' : ''}", I'd be happy to help you with:

• Web development services and pricing
• Technical solutions and implementation
• Project consultation and planning
• AI integration and chatbot development

What specific development needs can I help you with today?`;

    return redirectResponse;
  }

  // For relevant queries, ensure response stays focused on NEX-DEVS services
  if (context.contextualRelevance > 0.5 && context.contextualRelevance < 0.8) {
    // Add a gentle redirect at the end
    const focusedEnding = "\n\nIs there anything specific about our NEX-DEVS services or development solutions I can help clarify for you?";
    return response + focusedEnding;
  }

  return response;
};

export default {
  generateNLPContext,
  humanizeResponse,
  addHumanTouches,
  detectEmotion,
  detectEmotionWithConfidence,
  analyzeSentiment,
  detectIntent,
  analyzeComplexity,
  analyzeContextualRelevance,
  detectSectionContext,
  validateResponseQuality,
  cleanResponse,
  filterContextualResponse,
  filterInappropriateContent,
  // New enhanced functions
  getVariedResponse,
  getVariedProfessionalAlternative,
  advancedContentFilter,
  cleanupResponseVariations,
  getResponseVariationStats
};
