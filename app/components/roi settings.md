🧠 NEX-DEVS ROI Section UI Implementation (Frontend PRD)
Goal

Enhance the ROI Section UI to look professional, responsive, and intuitive:

New ROI cards should appear horizontally.

Add smooth scroll + indicator dots/arrows.

Right section should look minimal, clean, and data-focused.

Keep theme consistent with NEX-DEVS dark + purple style.

Step-by-Step UI Implementation
Step 1: ROI Section Container Setup

Create a flex container for ROI cards:

<section className="roi-section flex flex-col md:flex-row justify-between items-center w-full px-6 py-12">


On desktop: cards align horizontally.

On mobile: fallback to vertical scroll.

Step 2: Horizontal Scroll Wrapper

Wrap all ROI cards in a horizontal scroll container:

<div className="roi-cards-container flex overflow-x-auto gap-6 snap-x snap-mandatory scroll-smooth hide-scrollbar">
    {/* ROI Cards dynamically loaded here */}
</div>


Add a custom scrollbar (or hide it with CSS):

.hide-scrollbar::-webkit-scrollbar {
    display: none;
}


Each card should have:

<div className="roi-card snap-center min-w-[300px] md:min-w-[400px] bg-[#0b0b0f] border border-[#2b2b36] rounded-2xl p-6 shadow-md transition-all hover:scale-[1.02] duration-300">
    {/* Card content */}
</div>

Step 3: Add Scroll Controls

Add left/right arrow buttons for smoother navigation:

<button className="scroll-left absolute left-2 top-1/2 -translate-y-1/2 bg-[#1a1a23] hover:bg-[#272738] p-3 rounded-full shadow-lg">
    <ChevronLeft />
</button>
<button className="scroll-right absolute right-2 top-1/2 -translate-y-1/2 bg-[#1a1a23] hover:bg-[#272738] p-3 rounded-full shadow-lg">
    <ChevronRight />
</button>


On click: scroll container by +400px or -400px.

Step 4: ROI Card Layout

Each card should include:

Card Image or Video

Title & Description

ROI % Value

Performance Bar

Impact Status (e.g. Improving / Stable)

Example:

<div className="roi-card">
    <video src={videoUrl} controls className="rounded-xl w-full h-[200px] object-cover" />
    <h3 className="text-xl font-semibold mt-4 text-white">{title}</h3>
    <p className="text-sm text-gray-400 mt-2">{description}</p>
    <div className="flex items-center justify-between mt-4">
        <span className="text-purple-400 text-lg font-bold">{impactValue}%</span>
        <span className="text-sm text-gray-500">{impactStatus}</span>
    </div>
    <div className="w-full bg-[#1c1c25] h-2 rounded-full mt-2">
        <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${impactValue}%` }}></div>
    </div>
</div>

Step 5: Optimize the Right Section

Replace the existing right section with a more interactive summary panel:

<div className="roi-summary bg-[#0f0f18] rounded-2xl p-6 border border-[#242434] shadow-lg flex flex-col gap-4 w-full md:w-[350px]">
  <h2 className="text-2xl font-semibold text-white">ROI Performance Summary</h2>
  <p className="text-gray-400 text-sm">
      Track the live impact of your AI optimization results below.
  </p>

  <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="p-3 rounded-xl bg-[#1a1a24] text-center">
          <h4 className="text-purple-400 text-lg font-bold">+{averageROI}%</h4>
          <p className="text-xs text-gray-400">Avg. ROI</p>
      </div>
      <div className="p-3 rounded-xl bg-[#1a1a24] text-center">
          <h4 className="text-green-400 text-lg font-bold">{improvementRate}%</h4>
          <p className="text-xs text-gray-400">Improvement</p>
      </div>
  </div>

  <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-md">
      Generate ROI Report
  </button>
</div>

Step 6: Responsive & Animation Polish

Use Framer Motion for smooth entrance animations:

import { motion } from "framer-motion";

<motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    {/* ROI Card */}
</motion.div>


Ensure all cards auto-wrap horizontally on smaller screens.

Add swipe support on touch devices.

Step 7: Final Integration

On ROI addition (from admin panel), new card auto-renders horizontally via dynamic data mapping:

{roiData.map((item) => (
    <ROICard key={item.id} {...item} />
))}


Add loader or empty-state UI if no ROI is available:

<p className="text-gray-500 text-center mt-6">No ROI data yet — add one from the admin panel!</p>

Step 8: Testing & UX Validation

✅ Test on all devices (mobile/tablet/desktop)
✅ Ensure horizontal scroll works smoothly
✅ Check all video/images load correctly
✅ Validate performance metrics display properly

Bonus Add-ons (Optional Enhancements)

Add carousel pagination dots.

Add hover effect that zooms ROI card slightly.

Include mini charts (using Recharts or Chart.js) to show trend visuals.

Add “Compare ROI” modal with stats when two cards selected.