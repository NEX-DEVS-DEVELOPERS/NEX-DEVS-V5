import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Creating Stunning Animations with Framer Motion | Your Name',
  description: 'A comprehensive guide to implementing beautiful and performant animations in React applications using Framer Motion, covering basic to advanced concepts.',
  openGraph: {
    title: 'Creating Stunning Animations with Framer Motion',
    description: 'A comprehensive guide to implementing beautiful and performant animations in React applications using Framer Motion, covering basic to advanced concepts.',
    type: 'article',
    publishedTime: '2024-03-01T00:00:00.000Z',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Creating Stunning Animations with Framer Motion',
      datePublished: '2024-03-01T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'Your Name',
      },
    }),
  },
};

export default function FramerMotionBlogPost() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Enhanced purple glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
      
      <article className="relative px-6 py-24 mx-auto max-w-4xl">
        {/* Back button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mb-12">
          <div className="flex items-center gap-4 text-sm text-purple-400 mb-4">
            <span className="bg-purple-500/10 px-3 py-1 rounded-full">Animation</span>
            <span>•</span>
            <span>March 1, 2024</span>
            <span>•</span>
            <span>7 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Creating Stunning Animations with Framer Motion
          </h1>
          <p className="text-gray-400 text-lg">
            Learn how to implement beautiful and performant animations in your React applications using Framer Motion.
          </p>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-purple max-w-none space-y-12">
          {/* Introduction Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Introduction to Framer Motion
            </h2>
            <p className="text-gray-300">
              Framer Motion is a powerful animation library for React that simplifies the process of creating fluid, interactive animations. It provides a declarative API that makes complex animations accessible while maintaining high performance.
            </p>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10 mt-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Key Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Spring animations with natural movement</li>
                <li>• Gesture recognition and handling</li>
                <li>• Layout animations and shared layout animations</li>
                <li>• SVG path animations</li>
                <li>• Server-side rendering support</li>
              </ul>
            </div>
          </section>

          {/* Getting Started Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Getting Started with Framer Motion
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Installation</h3>
              <pre className="text-purple-300">
                <code>{`npm install framer-motion
# or
yarn add framer-motion`}</code>
              </pre>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10 mt-4">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Basic Animation Example</h3>
              <pre className="text-purple-300">
                <code>{`import { motion } from 'framer-motion';

function AnimatedComponent() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      Hello, Animation!
    </motion.div>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Animation Variants Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Working with Animation Variants
            </h2>
            <p className="text-gray-300 mb-4">
              Variants allow you to define reusable animation states and orchestrate complex animations across multiple components.
            </p>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <pre className="text-purple-300">
                <code>{`const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
};

function AnimatedList() {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.content}
        </motion.li>
      ))}
    </motion.ul>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Gesture Interactions - Enhanced */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Advanced Gesture Interactions
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Drag with Constraints</h3>
                <pre className="text-purple-300">
                  <code>{`function DraggableCard() {
  const constraintsRef = useRef(null);
  
  return (
    <motion.div ref={constraintsRef} className="container">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        whileDrag={{ scale: 1.1 }}
        className="card"
      />
    </motion.div>
  );
}`}</code>
                </pre>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Advanced Pan Gestures</h3>
                <pre className="text-purple-300">
                  <code>{`function SwipeableCard() {
  const [position, setPosition] = useState(0);
  
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, { offset, velocity }) => {
        const swipe = Math.abs(velocity.x) * offset.x;
        if (swipe < -10000) {
          setPosition(-200);
        } else if (swipe > 10000) {
          setPosition(200);
        }
      }}
    />
  );
}`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Performance Optimization - Enhanced */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Advanced Performance Optimization
            </h2>
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Layout Animations</h3>
                <pre className="text-purple-300">
                  <code>{`function OptimizedList() {
  return (
    <motion.div
      layout // Enable layout animations
      transition={{
        layout: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
    >
      {/* Content */}
    </motion.div>
  );
}`}</code>
                </pre>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Performance Tips</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Use transform instead of width/height for animations</li>
                  <li>• Implement will-change for heavy animations</li>
                  <li>• Use layoutId for shared element transitions</li>
                  <li>• Implement useReducedMotion hook for accessibility</li>
                  <li>• Utilize AnimatePresence for mount/unmount animations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Advanced Concepts */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-4">
              Advanced Animation Concepts
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Custom Animation Controls</h3>
              <pre className="text-purple-300">
                <code>{`function ControlledAnimation() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      scale: [1, 2, 2, 1, 1],
      rotate: [0, 0, 270, 270, 0],
      borderRadius: ["20%", "20%", "50%", "50%", "20%"],
    });
  }, []);

  return (
    <motion.div
      animate={controls}
      transition={{
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.2, 0.5, 0.8, 1],
      }}
    />
  );
}`}</code>
              </pre>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mt-12">
          <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-300 mb-2">
                Written by an animation specialist with a deep understanding of Framer Motion and React animation principles. Focused on creating smooth, performant animations that enhance user experience.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  GitHub
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
} 
