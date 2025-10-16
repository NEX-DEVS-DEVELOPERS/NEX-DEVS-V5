// Example usage of FloatingProjectsIndicator component

import FloatingProjectsIndicator from '@/frontend/components/FloatingProjectsIndicator'

// Basic usage - right side, purple theme
<FloatingProjectsIndicator />

// Left side with blue theme
<FloatingProjectsIndicator 
  position="left"
  theme="blue"
  offset={{ x: 32, y: 0 }}
/>

// Auto-hide on inactivity with green theme
<FloatingProjectsIndicator 
  position="right"
  theme="green"
  autoHide={true}
  hideOnMobile={true}
/>

// Custom styling with orange theme
<FloatingProjectsIndicator 
  position="right"
  theme="orange"
  offset={{ x: 16, y: 0 }}
  className="custom-indicator"
  showOnLoad={true}
/>

/* 
Component Features:
- ✅ Completely separate from page content
- ✅ Floating and sticky positioning 
- ✅ Smooth entering animation
- ✅ Multiple theme options (purple, blue, green, orange)
- ✅ Auto-hide on user inactivity (optional)
- ✅ Mobile responsive (can hide on mobile)
- ✅ Left or right positioning
- ✅ Custom offset positioning
- ✅ Hover effects and tooltips
- ✅ Smooth scroll to sections
- ✅ Real-time progress tracking
- ✅ Section detection with intersection observer
- ✅ Customizable appearance
*/