# FloatingProjectsIndicator Component

A highly customizable, floating indicator component for project pages that provides navigation and progress tracking functionality.

## Features

- 🎯 **Floating & Sticky** - Positioned independently from page content
- 🎨 **Multiple Themes** - Purple, Blue, Green, Orange color schemes
- 📱 **Mobile Responsive** - Optional mobile hiding
- 🎭 **Auto-Hide** - Automatic hiding on user inactivity
- 🧭 **Smart Navigation** - Smooth scroll to sections with visual feedback
- 📊 **Progress Tracking** - Real-time scroll progress with percentage
- 🎪 **Rich Animations** - Smooth enter/exit and hover effects
- 🎛️ **Highly Configurable** - Extensive customization options

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes |
| `position` | `'right' \| 'left'` | `'right'` | Side positioning |
| `offset` | `{ x?: number, y?: number }` | `{ x: 24, y: 0 }` | Positioning offset |
| `showOnLoad` | `boolean` | `true` | Show immediately on load |
| `hideOnMobile` | `boolean` | `false` | Hide on mobile devices |
| `autoHide` | `boolean` | `false` | Auto-hide on inactivity |
| `theme` | `'purple' \| 'blue' \| 'green' \| 'orange'` | `'purple'` | Color theme |

## Usage Examples

### Basic Usage
```tsx
import FloatingProjectsIndicator from '../components/FloatingProjectsIndicator'

<FloatingProjectsIndicator />
```

### Advanced Configuration
```tsx
<FloatingProjectsIndicator 
  position="left"
  theme="blue"
  offset={{ x: 32, y: 0 }}
  autoHide={true}
  hideOnMobile={true}
/>
```

## Required HTML Structure

The component expects HTML elements with specific IDs for section tracking:

```html
<div id="nex-webs-specialty">NEX-WEBS SPECIALITY</div>
<div id="mobile-showcase">Mobile Applications</div>
<div id="newly-added">Recently Launched</div>
<div id="ai-solutions">AI Solutions</div>
<div id="advanced-ai">Advanced AI</div>
<div id="automation-workflows">AI Automation</div>
<div id="featured-automations">Featured Work</div>
<div id="end">Complete</div>
```

## Styling

The component uses Tailwind CSS with dynamic classes. Ensure your build process includes the necessary classes:

- Theme colors: `purple-400`, `blue-400`, `green-400`, `orange-400`
- Background utilities: `bg-black/95`, `backdrop-blur-md`
- Border utilities: `border-{color}-500/50`
- Shadow utilities: `shadow-{color}-500/25`

## Dependencies

- React 18+
- Framer Motion
- Tailwind CSS

## Browser Support

- Modern browsers with CSS backdrop-filter support
- Intersection Observer API support
- ES6+ JavaScript features

## Performance

- Optimized with `useCallback` and `useRef`
- Efficient intersection observer usage
- Minimal re-renders with proper dependency arrays
- GPU-accelerated animations with `transform`

## Accessibility

- Keyboard navigable
- Screen reader friendly
- Reduced motion support
- ARIA labels for interactive elements