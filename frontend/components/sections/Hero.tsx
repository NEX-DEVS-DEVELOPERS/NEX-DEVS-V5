import HeroClient from '@/frontend/components/HeroClient';

// Static data that was previously in the client component
const expertise = [
    {
      title: "Website Development with Ai",
      description: "Full-stack development with modern AI technologies",
      imageUrl: "https://cdn1.vectorstock.com/i/1000x1000/62/55/web-developer-icon-on-white-background-flat-vector-19806255.jpg",
      isNew: false
    },
    {
      title: "WordPress & Shopify With Ai Agents",
      description: "E-commerce and CMS solutions with Ai agents Make sale upto 100x",
      imageUrl: "https://www.binstellar.com/wp-content/uploads/2024/03/Group-36629.png",
      isNew: false
    },
    {
      title: "UI/UX Design",
      description: "Figma & Framer expert",
      imageUrl: "data:image/png;base64,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",
      isNew: false
    },
    {
      title: "SEO & Content",
      description: "Strategic content & optimization& With Agents to work Automatically",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNEzlSETp19JIeAv_dyI5QIE_NF8sIflSVht5xx2D8_3t4aVeRLYyP7q7HaU2BgR34q3s&usqp=CAU",
      isNew: false
    },
    {
      title: "AI Chat Bot Integration",
      description: "Advanced AI chatbot solutions With Vector Database & Langchain",
      imageUrl: "https://www.shutterstock.com/image-vector/simple-chat-bot-logo-icon-600nw-2449965521.jpg",
      isNew: true
    },
    {
      title: "AI Business Integration",
      description: "Seamless AI business processes Powerfull Api and ai login with NLP for human type response",
      imageUrl: "https://as2.ftcdn.net/v2/jpg/09/88/50/11/1000_F_988501143_wJzQIHvY1B49pMp3QgiQDhtdfF3dU1Wv.jpg",
      isNew: true
    },
    {
      title: "AI Voice Assistant",
      description: "Ask AI voice-powered solutions Perfect for agentic Calls",
      imageUrl: "https://cdn.vectorstock.com/i/500p/44/19/support-chatbot-icon-smiling-robot-vector-38664419.jpg",
      isNew: true
    },
    {
      title: "MOBILE APP Development (Ai Based App)",
      description: "Cross-platform native mobile experiences",
      imageUrl: "https://thumbs.dreamstime.com/b/mobile-app-icon-set-ui-ux-design-smartphone-applications-android-ios-interface-illustrations-mobile-app-icon-set-ui-ux-design-369815182.jpg",
      isNew: true
    },
    {
      title: "Error Detection & Debugging",
      description: "Expert bug finding & rapid issue resolution",
      imageUrl: "https://cdn2.iconfinder.com/data/icons/seo-and-digital-marketing-6-1/48/257-512.png",
      isNew: false
    }
]

const funFacts = [
    { icon: "🧙‍♂️", title: "Code Wizard", fact: "I once debugged a production issue while sleeping! (In my dreams, of course)" },
    { icon: "🎮", title: "Gaming Dev", fact: "I love adding creative features to my projects for users to discover" },
    { icon: "☕", title: "Coffee Powered", fact: "My code runs on a special fuel: Coffee.parseInt('espresso')" },
    { icon: "🌙", title: "Night Owl", fact: "Best code commits happen at 3 AM when the bugs are sleeping" },
    { icon: "🎵", title: "Code & Music", fact: "I listen to lofi beats while coding. It's my debugging soundtrack!" }
]

const aiSkills = [
    {
      category: "Enterprise AI Partnerships",
      skills: [
        { name: "OPENAI", level: 95, icon: "https://w7.pngwing.com/pngs/704/673/png-transparent-openai-chatgpt-logo.png", description: "O4 mini,O3-PRO,GPT 4.5 & DALL-E integration specialist" },
        { name: "ANTHROPIC", level: 92, icon: "https://img.icons8.com/?size=100&id=H5H0mqCCr5AV&format=png&color=000000", description: "Claude 4 Sonnet- 4-Opus implementation" },
        { name: "GOOGLE AI", level: 89, icon: "https://img.icons8.com/?size=100&id=rnK88i9FvAFO&format=png&color=000000", description: "Gemini2.5Pro & PaLM API expert" },
        { name: "MISTRAL AI", level: 91, icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/light/mistral-color.png", description: "Mistral Large deployment" },
        { name: "GROK AI", level: 88, icon: "https://img.icons8.com/?size=100&id=USGXKHXKl9X7&format=png&color=000000", description: "GROK3,GROK4,Real-time market analysis" },
        { name: "DEEPSEEK", level: 90, icon: "https://img.icons8.com/?size=100&id=YWOidjGxCpFW&format=png&color=000000", description: "DEEPSEEK R1, Code & chat implementation" },
        { name: "META AI", level: 87, icon: "https://img.icons8.com/?size=100&id=PvvcWRWxRKSR&format=png&color=000000", description: "Llama 2 & Code Llama expert" },
        { name: "PERPLEXITY", level: 89, icon: "https://img.icons8.com/?size=100&id=5WrDC03cg9ua&format=png&color=000000", description: "AI-powered search & research" },
        { name: "COHERE", level: 86, icon: "https://images.seeklogo.com/logo-png/51/2/cohere-logo-png_seeklogo-513871.png", description: "Command & Embed API specialist" },
        { name: "NVIDIA", level: 93, icon: "https://w7.pngwing.com/pngs/728/156/png-transparent-nvidia-flat-brand-logo-icon-thumbnail.png", description: "GPU acceleration & AI compute" },
        { name: "STABILITY AI", level: 88, icon: "https://www.arm.com/-/media/global/Why%20Arm/partner/Partner%20Ecosystem/catalog/stability-ai-/Logo_Black_Red_Dot.png?rev=8e4eac6c7a3c4e649deca9b821b388c8&revision=8e4eac6c-7a3c-4e64-9dec-a9b821b388c8", description: "Stable Diffusion & image generation" },
        { name: "INFLECTION AI", level: 87, icon: "https://media.licdn.com/dms/image/sync/v2/D4D27AQFjYf-pxIJPew/articleshare-shrink_800/articleshare-shrink_800/0/1732629799492?e=2147483647&v=beta&t=9RREaMKqZvaJuf6FmMHTyDKM4g6pn_5VGPks8cesURw", description: "Pi personal AI assistant" },
        { name: "RUNWAY ML", level: 89, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDXIK2WqGiQST-IzoCfRsLUP5IrFPBnCTEnA&s", description: "Gen-2 video generation models" },
        { name: "MANUS AI", level: 86, icon: "https://play-lh.googleusercontent.com/7RIeDBEnjVVn3d1yr441p7u0BK9eT8E6P9i__XYTcJAzOe7sqVgJp7pmlypqY9NBqjI" , description:"Advanced AI orchestration platform" },
        { name: "KIMI", level: 85, icon: "https://images.seeklogo.com/logo-png/61/2/kimi-logo-png_seeklogo-611650.png", description: "Contextual knowledge assistant" },
        { name: "QWEN", level: 87, icon: "https://opencv.org/wp-content/uploads/2025/01/MIhJKlK5yVR3axxgE7_gHL-rsKjliShJKd3asUqg5KDdEsdOGut-9mCW4Ti1x7i2y8zCkxeZHQFR00sQg6BfYA.png", description: "Alibaba's multilingual LLM" }
      ]
    },
    {
      category: "AI AUTOMATION TOOLS",
      skills: [
        { name: "N8N", level: 96, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp6N3WMrTL7TngeitkbvpSLQm0UwZt-NLCcapwG2jQhETkGCmr1QebGii7Ni4BuMIY1Qg&usqp=CAU", description: "Enterprise workflow automation" },
        { name: "MAKE.COM", level: 94, icon: "https://cdn.freelogovectors.net/wp-content/uploads/2023/11/make-logo-freelogovectors.net_.png", description: "Advanced integrated workflows" },
        { name: "ZAPIER", level: 93, icon: "https://w7.pngwing.com/pngs/84/464/png-transparent-zapier-logo-world-wide-web-product-mobile-app-automation-text-orange-logo-thumbnail.png", description: "App integration specialist" },
        { name: "MICROSOFT POWER AUTOMATE", level: 92, icon: "https://store-images.s-microsoft.com/image/apps.24143.13592668300764735.55b49f05-a58f-437f-95f4-f51ea7542976.f30e5790-6318-41e4-86ef-6b813b3b2a17", description: "Enterprise RPA solutions" },
        { name: "WORKATO", level: 91, icon: "https://upload.wikimedia.org/wikipedia/en/9/97/Workato-logo.png", description: "Enterprise integration platform" },
        { name: "TRAY.IO", level: 90, icon: "https://logowik.com/content/uploads/images/trayio5490.jpg", description: "Advanced API integrations" },
        { name: "UIPATH", level: 89, icon: "https://seekvectors.com/files/download/Ui%20path-02.png", description: "Robotic process automation" },
        { name: "AUTOMATE.IO", level: 88, icon: "https://images.seeklogo.com/logo-png/48/2/automate-logo-png_seeklogo-485541.png", description: "Business workflow automation" },
        { name: "ACTIVECAMPAIGN", level: 87, icon: "https://images.seeklogo.com/logo-png/42/1/activecampaign-logo-png_seeklogo-428040.png", description: "Marketing automation expert" },
        { name: "APPSMITH", level: 86, icon: "https://pbs.twimg.com/profile_images/1303358775693197312/MP67Vhnv_400x400.png", description: "Low-code automation platform" }
      ]
    },
    {
      category: "LLM Expertise & Deployment",
      skills: [
        { name: "OLLAMA", level: 94, icon: "https://images.seeklogo.com/logo-png/59/2/ollama-logo-png_seeklogo-593420.png", description: "Local LLM deployment & optimization" },
        { name: "OPENROUTER", level: 92, icon: "https://images.seeklogo.com/logo-png/61/2/openrouter-logo-png_seeklogo-611674.png", description: "Multi-model routing & fallbacks" },
        { name: "HUGGING FACE", level: 90, icon: "https://w7.pngwing.com/pngs/839/288/png-transparent-hugging-face-favicon-logo-tech-companies-thumbnail.png", description: "Model fine-tuning & hosting" },
        { name: "REPLICATE", level: 88, icon: "https://logowik.com/content/uploads/images/replicate-ai23359.logowik.com.webp", description: "Cloud inference & model serving" },
        { name: "TOGETHER AI", level: 89, icon: "https://images.seeklogo.com/logo-png/61/2/together-ai-logo-png_seeklogo-611707.png", description: "Enterprise LLM infrastructure" },
        { name: "PERPLEXITY AI", level: 87, icon: "https://images.seeklogo.com/logo-png/61/1/perplexity-ai-icon-black-logo-png_seeklogo-611679.png", description: "Search-augmented generation" }
      ]
    },
    {
      category: "AI Integration Technologies",
      skills: [
        { name: "LANGCHAIN", level: 94, icon: "https://images.seeklogo.com/logo-png/61/1/langchain-icon-logo-png_seeklogo-611655.png", description: "Advanced agent frameworks" },
        { name: "LLAMAINDEX", level: 91, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStMP8S3VbNCqOQd7QQQcbvC_FLa1HlftCiJw&s", description: "RAG & knowledge retrieval" },
        { name: "VECTOR DATABASES", level: 93, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1NBqWpaa16OzPpnT_I8SGoHcqWB0LPIBvWbu6uqUbSooO6XPh8FQHErDm9y2ZV2eUtyM&usqp=CAU", description: "Pinecone, Chroma, Weaviate" },
        { name: "LANGFLOW-Ai", level: 89, icon: "https://pbs.twimg.com/profile_images/1906737039724400640/aUuTetdY_400x400.jpg", description: " Multimodal embedding for AI." },
        { name: "LANGSMITH", level: 88, icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langsmith-color.png", description: "LLM app observability platform" },
        { name: "FLOWISE", level: 86, icon: "https://docs.flowiseai.com/~gitbook/image?url=https%3A%2F%2F4068692976-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FUiD7nOmFRK805sNuiieJ%252Fuploads%252FXxve37yNH63uTNoBYJ1Y%252FFlowise%2520Cropped%2520White%2520High%2520Res.png%3Falt%3Dmedia%26token%3De022b6af-b237-4724-9e4c-7b895cc3cdbe&width=768&dpr=4&quality=100&sign=8f7e6694&sv=2", description: "Visual LLM workflow builder" },
        { name: "SEMANTIC KERNEL", level: 85, icon: "https://devblogs.microsoft.com/semantic-kernel/wp-content/uploads/sites/78/2024/03/Large_SK_Logo.png", description: "Microsoft's AI orchestration" }
      ]
    },
    {
      category: "AI VOICE AGENTS",
      skills: [
        { name: "ELEVEN LABS", level: 95, icon: "https://www.drupal.org/files/project-images/elevenlabs.png", description: "Realistic voice synthesis & cloning" },
        { name: "GOOGLE SPEECH", level: 93, icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS53Dp2fSoxMy2QZZJSw-BRl6Elna-20PeTmw&s", description: "Advanced speech recognition & TTS" },
        { name: "PLAY.HT", level: 91, icon: "https://www.traineasy.com/wp-content/uploads/2024/12/playCube-DarkMode.svg", description: "AI voice generation platform" },
        { name: "RESEMBLE AI", level: 89, icon: "https://pbs.twimg.com/profile_images/1496504056436727818/Flpn3gIT_400x400.jpg", description: "Voice cloning & emotion control" },
        { name: "WELLSAID LABS", level: 90, icon: "https://www.fahimai.com/wp-content/uploads/2024/09/CTA-22.png", description: "Enterprise voice production" },
        { name: "MURF AI", level: 88, icon: "https://mma.prnewswire.com/media/2561848/Murf_AI_Logo.jpg?p=facebook", description: "Studio-quality voice generation" },
        { name: "COQUI AI", level: 87, icon: "https://docs.coqui.ai/en/dev/_static/logo.png", description: "Open-source TTS solutions" }
      ]
    },
    {
      category: "AI Training & Optimization",
      skills: [
        { name: "MODEL FINE-TUNING", level: 90, icon: "⚙️", description: "Custom model adaptation" },
        { name: "PROMPT ENGINEERING", level: 93, icon: "✨", description: "Advanced prompt techniques" },
        { name: "INFERENCE OPTIMIZATION", level: 91, icon: "⚡", description: "Latency & throughput tuning" },
        { name: "QUANTIZATION", level: 87, icon: "📉", description: "Model size & performance balancing" }
      ]
    },
    {
      category: "Enterprise AI Solutions",
      skills: [
        { name: "MULTI-AGENT SYSTEMS", level: 92, icon: "👥", description: "Collaborative AI workflows" },
        { name: "CUSTOM AI WORKFLOWS", level: 89, icon: "🔧", description: "Business process integration" },
        { name: "REAL-TIME PROCESSING", level: 91, icon: "⏱️", description: "Streaming & event processing" },
        { name: "AI SECURITY & PRIVACY", level: 94, icon: "🔐", description: "Enterprise-grade safeguards" }
      ]
    }
]

const workProcess = [
    { step: "01", title: "AI-Powered Discovery", description: "Using NLP to analyze requirements and generate optimal tech stack recommendations", icon: "🧠", aiFeature: "Semantic Analysis" },
    { step: "02", title: "Design & Architecture", description: "Creating scalable solutions with AI-assisted architecture pattern recommendations", icon: "⚡", aiFeature: "Pattern Recognition" },
    { step: "03", title: "AI-Enhanced Development", description: "Leveraging LLM pair programming and automated code quality checks", icon: "🛠️", aiFeature: "Code Generation" },
    { step: "04", title: "Intelligent Testing", description: "Automated test generation and predictive bug detection using machine learning", icon: "🔍", aiFeature: "Anomaly Detection" },
    { step: "05", title: "Smart Deployment", description: "Continuous optimization with AI-powered performance monitoring and enhancement", icon: "🚀", aiFeature: "Predictive Scaling" }
]

export default function Hero() {
  return (
    <HeroClient 
      expertise={expertise}
      funFacts={funFacts}
      aiSkills={aiSkills}
      workProcess={workProcess}
    />
  );
}
