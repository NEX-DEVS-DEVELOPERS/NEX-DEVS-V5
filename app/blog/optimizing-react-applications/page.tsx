import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Optimizing React Applications for Performance | Your Name',
  description: 'Discover practical techniques to improve the performance of your React applications and deliver better user experiences.',
  openGraph: {
    title: 'Optimizing React Applications for Performance',
    description: 'Discover practical techniques to improve the performance of your React applications and deliver better user experiences.',
    type: 'article',
    publishedTime: '2024-02-25T00:00:00.000Z',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Optimizing React Applications for Performance',
      datePublished: '2024-02-25T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'Your Name',
      },
    }),
  },
};

export default function ReactPerformanceBlogPost() {
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
            <span className="bg-purple-500/10 px-3 py-1 rounded-full">Performance</span>
            <span>•</span>
            <span>February 25, 2024</span>
            <span>•</span>
            <span>9 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Optimizing React Applications for Performance
          </h1>
          <p className="text-gray-400 text-lg">
            Discover practical techniques to improve the performance of your React applications and deliver better user experiences.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {[
              'Code Splitting and Lazy Loading',
              'Memory Management',
              'React Hooks Optimization',
              'State Management',
              'Rendering Optimization',
              'Monitoring Tools',
              'Network Performance',
              'Real-world Case Studies'
            ].map((item, index) => (
              <li key={index}>
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-400 hover:text-purple-300 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-purple max-w-none space-y-12">
          {/* Code Splitting Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="code-splitting-and-lazy-loading" className="text-2xl font-bold text-white mb-4">
              Code Splitting and Lazy Loading
            </h2>
            <p className="text-gray-300 mb-6">
              Implement efficient code splitting strategies to reduce initial bundle size and improve load times.
            </p>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10 mb-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Route-based Code Splitting</h3>
              <pre className="text-purple-300">
                <code>{`// Next.js Dynamic Import
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// React Router with lazy loading
const Dashboard = lazy(() => import('./routes/Dashboard'));
const Settings = lazy(() => import('./routes/Settings'));

function App() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`}</code>
              </pre>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Component-level Code Splitting</h3>
              <pre className="text-purple-300">
                <code>{`// Lazy load heavy components
const LazyChart = lazy(() => import('./components/Chart'));
const LazyDataGrid = lazy(() => import('./components/DataGrid'));

function Dashboard() {
  return (
    <div>
      <Suspense fallback={<ChartSkeleton />}>
        <LazyChart data={chartData} />
      </Suspense>
      <Suspense fallback={<GridSkeleton />}>
        <LazyDataGrid items={gridItems} />
      </Suspense>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Memory Management */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="memory-management" className="text-2xl font-bold text-white mb-4">
              Memory Management and Leak Prevention
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10 mb-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Event Listener Cleanup</h3>
              <pre className="text-purple-300">
                <code>{`function EventComponent() {
  useEffect(() => {
    const handleScroll = () => {
      // Handle scroll event
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div>Event Handler Component</div>;
}`}</code>
              </pre>
            </div>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">WebSocket and Subscription Management</h3>
              <pre className="text-purple-300">
                <code>{`function LiveDataComponent() {
  useEffect(() => {
    const ws = new WebSocket('wss://api.example.com');
    const subscription = new Subscription();
    
    ws.onmessage = (event) => {
      // Handle message
    };
    
    return () => {
      ws.close();
      subscription.unsubscribe();
    };
  }, []);

  return <div>Live Data Stream</div>;
}`}</code>
              </pre>
            </div>
          </section>

          {/* React Hooks Optimization */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="react-hooks-optimization" className="text-2xl font-bold text-white mb-4">
              React Hooks Optimization
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10 mb-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">useMemo and useCallback</h3>
              <pre className="text-purple-300">
                <code>{`function ExpensiveComponent({ data, onItemSelect }) {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: expensiveOperation(item)
    }));
  }, [data]);

  // Memoize callbacks
  const handleSelect = useCallback((item) => {
    onItemSelect(item.id);
  }, [onItemSelect]);

  return (
    <div>
      {processedData.map(item => (
        <Item 
          key={item.id}
          data={item}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* State Management */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="state-management" className="text-2xl font-bold text-white mb-4">
              Efficient State Management
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">State Splitting and Context Optimization</h3>
              <pre className="text-purple-300">
                <code>{`// Split context by domain
const UserContext = createContext(null);
const ThemeContext = createContext(null);
const SettingsContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <SettingsContext.Provider value={{ settings, setSettings }}>
          <AppContent />
        </SettingsContext.Provider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Rendering Optimization */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="rendering-optimization" className="text-2xl font-bold text-white mb-4">
              Rendering Performance
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Virtual List Implementation</h3>
              <pre className="text-purple-300">
                <code>{`function VirtualList({ items, rowHeight, visibleRows }) {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(
    startIndex + visibleRows,
    items.length
  );

  const visibleItems = items.slice(startIndex, endIndex);
  
  return (
    <div 
      style={{ height: items.length * rowHeight }}
      onScroll={(e) => setScrollTop(e.target.scrollTop)}
    >
      <div style={{ 
        transform: \`translateY(\${startIndex * rowHeight}px)\`
      }}>
        {visibleItems.map(item => (
          <ListItem 
            key={item.id}
            data={item}
            height={rowHeight}
          />
        ))}
      </div>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </section>

          {/* Network Performance */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="network-performance" className="text-2xl font-bold text-white mb-4">
              Network Performance Optimization
            </h2>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Data Fetching and Caching</h3>
              <pre className="text-purple-300">
                <code>{`// Using React Query for efficient data fetching
function UserProfile({ userId }) {
  const { data, isLoading, error } = useQuery(
    ['user', userId],
    () => fetchUserData(userId),
    {
      staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache persists for 30 minutes
      retry: 3,
      onError: (error) => {
        console.error('Failed to fetch user:', error);
      }
    }
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return <UserProfileContent user={data} />;
}`}</code>
              </pre>
            </div>
          </section>

          {/* Real-world Case Studies */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="real-world-case-studies" className="text-2xl font-bold text-white mb-4">
              Real-world Performance Case Studies
            </h2>
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Case Study 1: Large Data Grid</h3>
                <p className="text-gray-300">
                  How we optimized a data grid component handling 10,000+ rows with virtual scrolling, 
                  windowing, and efficient sorting/filtering mechanisms.
                </p>
                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• Implemented row virtualization</li>
                  <li>• Used web workers for sorting</li>
                  <li>• Implemented column-level memoization</li>
                  <li>• Optimized render cycles</li>
                </ul>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Case Study 2: Real-time Dashboard</h3>
                <p className="text-gray-300">
                  Optimization techniques used in a real-time dashboard processing thousands of updates per second.
                </p>
                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• Implemented data buffering</li>
                  <li>• Used RAF for smooth updates</li>
                  <li>• Optimized WebSocket connections</li>
                  <li>• Implemented efficient data structures</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mt-12">
          <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-300 mb-2">
                Written by a performance optimization expert with years of experience in building and optimizing large-scale React applications. Dedicated to helping developers create faster, more efficient web applications.
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
