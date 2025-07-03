// conversationMemory.ts
// Advanced Conversation Memory System for Human-like Continuity
// This module maintains conversation context and user preferences for more natural interactions

export interface UserProfile {
  id: string;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'technical';
    responseLength: 'brief' | 'detailed' | 'comprehensive';
    interests: string[];
    previousTopics: string[];
  };
  conversationHistory: ConversationTurn[];
  emotionalState: string;
  lastInteraction: number;
}

export interface ConversationTurn {
  timestamp: number;
  userMessage: string;
  aiResponse: string;
  emotion: string;
  intent: string;
  topics: string[];
  satisfaction?: number; // 1-5 rating if provided
}

export interface ConversationContext {
  isReturningUser: boolean;
  previousTopics: string[];
  userPreferences: UserProfile['preferences'];
  conversationFlow: string;
  relationshipLevel: 'new' | 'familiar' | 'established';
}

export interface RepetitionAnalysis {
  isRepetitive: boolean;
  similarityScore: number;
  previousSimilarResponses: string[];
  suggestedVariation: string;
}

// Enhanced topic extraction patterns focused on NEX-DEVS services and allowed domains
const topicPatterns = {
  // NEX-DEVS specific services
  'nex-devs-services': /(\b(nex-devs|nexdevs|nex devs|services|team|about|contact|portfolio)\b)/i,
  'web-development': /(\b(website|web|development|frontend|backend|fullstack|react|nextjs|javascript|typescript|html|css|responsive|ui|ux)\b)/i,
  'ai-integration': /(\b(ai|artificial intelligence|chatbot|automation|machine learning|neural network|nlp|deep learning|ai integration)\b)/i,
  'mobile-development': /(\b(mobile|app|ios|android|react native|flutter|cross-platform)\b)/i,
  'database-solutions': /(\b(database|sql|mongodb|postgresql|mysql|data|api|backend|server)\b)/i,
  'cloud-deployment': /(\b(cloud|aws|azure|hosting|deployment|server|scalable|performance)\b)/i,
  'pricing-consultation': /(\b(price|cost|pricing|budget|quote|estimate|affordable|consultation|meeting)\b)/i,
  'technical-support': /(\b(help|support|problem|issue|bug|error|troubleshoot|debug)\b)/i,
  'programming-languages': /(\b(python|java|php|c#|cpp|golang|rust|swift|kotlin)\b)/i,
  'frameworks-tools': /(\b(framework|library|tool|git|github|docker|kubernetes|ci\/cd)\b)/i,
  'business-solutions': /(\b(business|enterprise|startup|custom|solution|integration|automation)\b)/i,
  'security-performance': /(\b(security|authentication|optimization|performance|seo|analytics)\b)/i,

  // Off-topic patterns for filtering
  'off-topic': /(\b(personal|relationship|dating|marriage|family|health|medical|doctor|therapy|depression|anxiety|movie|film|tv show|series|celebrity|music|song|album|game|gaming|sports|football|basketball|politics|political|government|election|vote|president|democrat|republican|liberal|conservative|life advice|career advice|relationship advice|what should i do|how to live|meaning of life|weather|food|recipe|cooking|travel|vacation|hobby|pet|animal|joke|funny|meme)\b)/i
};

// Memory storage (in production, this would be a database)
const userProfiles = new Map<string, UserProfile>();
const conversationSessions = new Map<string, ConversationTurn[]>();

// Performance optimization: Cache for conversation contexts and NLP analysis
const conversationContextCache = new Map<string, { context: ConversationContext; timestamp: number }>();
const nlpAnalysisCache = new Map<string, { analysis: any; timestamp: number }>();
const CONTEXT_CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache TTL
const NLP_CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache TTL for NLP analysis

// Generate user ID based on session/browser fingerprint
export const generateUserID = (): string => {
  if (typeof window !== 'undefined') {
    // Use a combination of factors for user identification
    const factors = [
      navigator.userAgent,
      screen.width,
      screen.height,
      new Date().getTimezoneOffset(),
      navigator.language
    ];
    
    // Simple hash function
    let hash = 0;
    const str = factors.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `user_${Math.abs(hash)}`;
  }
  
  return `user_${Date.now()}`;
};

// Enhanced topic extraction with domain restrictions for NEX-DEVS focus
export const extractTopics = (message: string): string[] => {
  const topics: string[] = [];
  const lowerMessage = message.toLowerCase();

  // Extract topics based on patterns, excluding off-topic
  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (topic !== 'off-topic' && pattern.test(lowerMessage)) {
      topics.push(topic);
    }
  }

  // Check for off-topic content
  if (topicPatterns['off-topic'].test(lowerMessage)) {
    // If it's off-topic and no relevant topics found, mark as off-topic
    if (topics.length === 0) {
      topics.push('off-topic');
    }
  }

  // If no specific topics found, check if it's at least tech-related
  const techRelatedPatterns = [
    /(\b(code|coding|programming|software|technology|tech|development|developer)\b)/gi,
    /(\b(algorithm|data structure|optimization|architecture|design pattern)\b)/gi,
    /(\b(api|rest|graphql|microservices|devops|agile|scrum)\b)/gi
  ];

  const isTechRelated = techRelatedPatterns.some(pattern => pattern.test(lowerMessage));

  if (topics.length === 0 && isTechRelated) {
    topics.push('general-tech');
  } else if (topics.length === 0) {
    topics.push('general');
  }

  return topics;
};

// Get or create user profile
export const getUserProfile = (userID: string): UserProfile => {
  if (!userProfiles.has(userID)) {
    const newProfile: UserProfile = {
      id: userID,
      preferences: {
        communicationStyle: 'casual',
        responseLength: 'brief',
        interests: [],
        previousTopics: []
      },
      conversationHistory: [],
      emotionalState: 'neutral',
      lastInteraction: Date.now()
    };
    userProfiles.set(userID, newProfile);
  }
  
  return userProfiles.get(userID)!;
};

// Update user profile based on interaction
export const updateUserProfile = (
  userID: string, 
  userMessage: string, 
  aiResponse: string, 
  emotion: string, 
  intent: string
): void => {
  const profile = getUserProfile(userID);
  const topics = extractTopics(userMessage);
  
  // Add to conversation history
  const turn: ConversationTurn = {
    timestamp: Date.now(),
    userMessage,
    aiResponse,
    emotion,
    intent,
    topics
  };
  
  profile.conversationHistory.push(turn);
  
  // Keep only last 20 turns for performance
  if (profile.conversationHistory.length > 20) {
    profile.conversationHistory = profile.conversationHistory.slice(-20);
  }
  
  // Update preferences based on patterns
  profile.preferences.previousTopics = [...new Set([...profile.preferences.previousTopics, ...topics])];
  profile.preferences.interests = [...new Set([...profile.preferences.interests, ...topics])];
  
  // Update emotional state
  profile.emotionalState = emotion;
  profile.lastInteraction = Date.now();
  
  // Adapt communication style based on user language
  if (/(\b(please|thank you|sir|madam|formal)\b)/i.test(userMessage)) {
    profile.preferences.communicationStyle = 'formal';
  } else if (/(\b(code|API|technical|programming|development)\b)/i.test(userMessage)) {
    profile.preferences.communicationStyle = 'technical';
  } else if (/(\b(hey|hi|cool|awesome|dude)\b)/i.test(userMessage)) {
    profile.preferences.communicationStyle = 'casual';
  }
  
  // Adapt response length preference
  if (userMessage.split(' ').length > 20) {
    profile.preferences.responseLength = 'detailed';
  } else if (userMessage.split(' ').length < 5) {
    profile.preferences.responseLength = 'brief';
  }
  
  userProfiles.set(userID, profile);
};

// Optimized conversation context generation with caching
export const generateConversationContext = (userID: string, currentMessage: string): ConversationContext => {
  // Create cache key based on user ID and message hash for performance
  const messageHash = currentMessage.length > 0 ? currentMessage.substring(0, 50) : 'initial';
  const cacheKey = `${userID}-${messageHash}`;

  // Check cache first
  const cached = conversationContextCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CONTEXT_CACHE_TTL) {
    return cached.context;
  }

  const profile = getUserProfile(userID);
  const isReturningUser = profile.conversationHistory.length > 0;
  const timeSinceLastInteraction = Date.now() - profile.lastInteraction;

  // Determine relationship level
  let relationshipLevel: 'new' | 'familiar' | 'established' = 'new';
  if (profile.conversationHistory.length > 10) {
    relationshipLevel = 'established';
  } else if (profile.conversationHistory.length > 3) {
    relationshipLevel = 'familiar';
  }

  // Analyze conversation flow
  let conversationFlow = 'initial';
  if (isReturningUser) {
    const lastTurn = profile.conversationHistory[profile.conversationHistory.length - 1];
    const currentTopics = extractTopics(currentMessage);
    const lastTopics = lastTurn?.topics || [];

    // Check if continuing same topic
    const topicOverlap = currentTopics.some(topic => lastTopics.includes(topic));
    if (topicOverlap) {
      conversationFlow = 'continuation';
    } else {
      conversationFlow = 'topic_change';
    }

    // Check if returning after a break
    if (timeSinceLastInteraction > 30 * 60 * 1000) { // 30 minutes
      conversationFlow = 'returning';
    }
  }

  const context: ConversationContext = {
    isReturningUser,
    previousTopics: profile.preferences.previousTopics,
    userPreferences: profile.preferences,
    conversationFlow,
    relationshipLevel
  };

  // Cache the result for performance
  conversationContextCache.set(cacheKey, {
    context,
    timestamp: Date.now()
  });

  return context;
};

// Generate contextual greeting based on conversation history
export const generateContextualGreeting = (context: ConversationContext): string => {
  const greetings = {
    new: [
      "Hi there! I'm Nexious, your NEX-DEVS assistant.",
      "Hello! Welcome to NEX-DEVS. I'm here to help!",
      "Hey! I'm Nexious, ready to assist you with anything NEX-DEVS related."
    ],
    familiar: [
      "Good to see you again!",
      "Welcome back!",
      "Hey there! Nice to chat with you again.",
      "Hi! Ready to continue where we left off?"
    ],
    established: [
      "Always a pleasure chatting with you!",
      "Hey! How's your project coming along?",
      "Good to see you back! What can I help you with today?",
      "Hi there! Ready for another productive conversation?"
    ],
    returning: [
      "Welcome back! It's been a while.",
      "Hey! Good to see you again after some time.",
      "Hi there! Hope you've been well. What brings you back today?"
    ]
  };
  
  let greetingType = context.relationshipLevel;
  if (context.conversationFlow === 'returning') {
    greetingType = 'returning';
  }
  
  const options = greetings[greetingType] || greetings.new;
  return options[Math.floor(Math.random() * options.length)];
};

// Generate contextual references to previous conversations
export const generateContextualReferences = (context: ConversationContext, currentTopics: string[]): string[] => {
  const references: string[] = [];
  
  if (!context.isReturningUser) return references;
  
  // Reference previous topics if relevant
  const relevantPreviousTopics = context.previousTopics.filter(topic => 
    currentTopics.includes(topic) || currentTopics.includes('general')
  );
  
  if (relevantPreviousTopics.length > 0) {
    const topicReferences = {
      services: "As we discussed before about our services,",
      pricing: "Following up on our pricing conversation,",
      technical: "Building on our technical discussion,",
      process: "Continuing from our process chat,",
      team: "As I mentioned about our team,",
      portfolio: "Regarding our portfolio we talked about,"
    };
    
    for (const topic of relevantPreviousTopics.slice(0, 1)) { // Only reference one previous topic
      if (topicReferences[topic]) {
        references.push(topicReferences[topic]);
      }
    }
  }
  
  // Add relationship-building references
  if (context.relationshipLevel === 'established') {
    references.push("Based on our previous chats,");
  }
  
  return references;
};

// Generate personalized response elements
export const generatePersonalizedElements = (context: ConversationContext): string[] => {
  const elements: string[] = [];
  
  // Add style-specific elements
  switch (context.userPreferences.communicationStyle) {
    case 'formal':
      elements.push("I'd be pleased to assist you with");
      break;
    case 'technical':
      elements.push("From a technical perspective,");
      break;
    case 'casual':
      elements.push("So here's the deal:");
      break;
  }
  
  // Add relationship-specific elements
  switch (context.relationshipLevel) {
    case 'established':
      elements.push("As you know,", "Like we've discussed,");
      break;
    case 'familiar':
      elements.push("As I mentioned before,", "Building on our last chat,");
      break;
  }
  
  return elements;
};

// Analyze response for repetition and suggest variations
export const analyzeResponseRepetition = (userID: string, proposedResponse: string, currentUserMessage: string): RepetitionAnalysis => {
  const profile = getUserProfile(userID);
  const recentResponses = profile.conversationHistory.slice(-5); // Check last 5 responses

  let similarityScore = 0;
  const similarResponses: string[] = [];

  // Simple similarity check based on common words and phrases
  const proposedWords = proposedResponse.toLowerCase().split(/\s+/).filter(word => word.length > 3);

  for (const turn of recentResponses) {
    const responseWords = turn.aiResponse.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    const commonWords = proposedWords.filter(word => responseWords.includes(word));
    const similarity = commonWords.length / Math.max(proposedWords.length, responseWords.length);

    if (similarity > 0.4) { // 40% similarity threshold
      similarityScore = Math.max(similarityScore, similarity);
      similarResponses.push(turn.aiResponse);
    }
  }

  const isRepetitive = similarityScore > 0.5; // 50% threshold for repetition

  // Generate variation suggestions if repetitive
  let suggestedVariation = proposedResponse;
  if (isRepetitive) {
    const variations = [
      "Let me approach this differently:",
      "Here's another way to look at it:",
      "To add to what I mentioned before:",
      "Building on our previous discussion:",
      "From a different angle:",
      "Additionally, I should mention:"
    ];

    const variation = variations[Math.floor(Math.random() * variations.length)];
    suggestedVariation = `${variation} ${proposedResponse}`;
  }

  return {
    isRepetitive,
    similarityScore,
    previousSimilarResponses: similarResponses,
    suggestedVariation
  };
};

// Enhanced conversation context with repetition awareness
export const generateEnhancedConversationContext = (userID: string, currentMessage: string, proposedResponse?: string): ConversationContext & { repetitionAnalysis?: RepetitionAnalysis } => {
  const baseContext = generateConversationContext(userID, currentMessage);

  if (proposedResponse) {
    const repetitionAnalysis = analyzeResponseRepetition(userID, proposedResponse, currentMessage);
    return {
      ...baseContext,
      repetitionAnalysis
    };
  }

  return baseContext;
};

// Generate contextually aware and non-repetitive response elements
export const generateContextualResponseElements = (context: ConversationContext, userMessage: string): string[] => {
  const elements: string[] = [];

  // Add conversation flow specific elements
  switch (context.conversationFlow) {
    case 'continuation':
      elements.push("Continuing our discussion,", "Building on that,", "To expand on this topic,");
      break;
    case 'topic_change':
      elements.push("Switching gears,", "On a different note,", "Moving to your new question,");
      break;
    case 'returning':
      elements.push("Welcome back!", "Good to see you again,", "Picking up where we left off,");
      break;
    default:
      elements.push("Let me help you with that,", "Here's what I can tell you,", "Great question!");
  }

  // Add relationship-specific elements
  if (context.relationshipLevel === 'established') {
    elements.push("As we've discussed before,", "You know how we've talked about,", "Like I mentioned in our previous chats,");
  } else if (context.relationshipLevel === 'familiar') {
    elements.push("As I mentioned earlier,", "Building on our last conversation,", "Following up on what we discussed,");
  }

  return elements;
};

// Clean up old conversation data and caches (call periodically)
export const cleanupOldConversations = (): void => {
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const now = Date.now();

  // Clean up old user profiles
  for (const [userID, profile] of userProfiles.entries()) {
    if (profile.lastInteraction < oneWeekAgo) {
      userProfiles.delete(userID);
    }
  }

  // Clean up expired cache entries for performance
  for (const [key, cached] of conversationContextCache.entries()) {
    if ((now - cached.timestamp) > CONTEXT_CACHE_TTL) {
      conversationContextCache.delete(key);
    }
  }

  for (const [key, cached] of nlpAnalysisCache.entries()) {
    if ((now - cached.timestamp) > NLP_CACHE_TTL) {
      nlpAnalysisCache.delete(key);
    }
  }

  console.log(`🧹 NEXIOUS: Cleaned up conversation data and caches`);
};

export default {
  generateUserID,
  getUserProfile,
  updateUserProfile,
  generateConversationContext,
  generateContextualGreeting,
  generateContextualReferences,
  generatePersonalizedElements,
  extractTopics,
  cleanupOldConversations,
  analyzeResponseRepetition,
  generateEnhancedConversationContext,
  generateContextualResponseElements
};
