import { Audiowide, VT323 } from 'next/font/google';

export const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

// Predefined font styles for consistent usage
export const fontStyles = {
  // Heading styles using Audiowide
  headings: {
    h1: `${audiowide.className} text-3xl md:text-5xl lg:text-6xl font-bold`,
    h2: `${audiowide.className} text-2xl md:text-4xl font-bold`,
    h3: `${audiowide.className} text-xl md:text-3xl font-bold`,
    h4: `${audiowide.className} text-lg md:text-2xl font-bold`,
    sectionTitle: `${audiowide.className} text-2xl md:text-3xl font-bold`,
    cardTitle: `${audiowide.className} text-xl font-bold`,
    gradientTitle: `${audiowide.className} font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400`,
  },
  
  // Text styles using VT323
  text: {
    body: `${vt323.className}`,
    description: `${vt323.className} text-gray-400`,
    highlight: `${vt323.className} text-purple-300`,
    small: `${vt323.className} text-sm`,
    label: `${vt323.className} font-medium`,
  },
  
  // Combined styles for specific use cases
  components: {
    card: {
      title: `${audiowide.className} text-xl font-bold mb-2`,
      description: `${vt323.className} text-gray-400`,
    },
    hero: {
      title: `${audiowide.className} text-4xl md:text-6xl font-bold`,
      subtitle: `${vt323.className} text-xl text-gray-300`,
    },
    section: {
      title: `${audiowide.className} text-2xl md:text-4xl font-bold mb-4`,
      description: `${vt323.className} text-gray-400 max-w-2xl mx-auto`,
    },
    button: {
      primary: `${audiowide.className} font-medium`,
      secondary: `${vt323.className} font-medium`,
    }
  }
};

// Default font size for VT323
export const vt323DefaultSize = { fontSize: '16px' };

// Helper function to apply VT323 with default size
export const getVT323Style = (additionalClasses = '') => ({
  className: `${vt323.className} ${additionalClasses}`,
  style: vt323DefaultSize
});

// Helper function to apply Audiowide
export const getAudiowideStyle = (additionalClasses = '') => ({
  className: `${audiowide.className} ${additionalClasses}`
});

// CSS variables for global usage
export const fontVariables = [audiowide.variable, vt323.variable].join(' '); 
