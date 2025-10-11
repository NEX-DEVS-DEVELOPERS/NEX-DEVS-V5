
This version is optimized for
* **NeonDB (PostgreSQL)**
* **Homepage-only rendering**
* **Admin control panel management**
* **Scalable frontend + backend integration**

---

# 🧠 PRD FILE – ROI Section (Homepage Only)

## 📌 Overview

**Feature Name:** ROI Section
**Page Location:** Homepage (below Hero or About section)
**Goal:** Display a modern, visually appealing ROI section showing measurable returns clients achieve through NEX-DEVS’ AI solutions.

**Primary Objective:**
Increase conversions by visually proving client success metrics.

---

## ⚙️ 1. Functional Scope

### ✅ Display

* Appears **only on the homepage**.
* Dynamically rendered from **NeonDB** data.
* Includes:

  * 1 Main Video (autoplay muted)
  * 2 Supporting Images below video
  * Heading + Description
  * ROI Cards (3–6)
  * CTA Button: “Get Your ROI Plan”

### 🧩 Section Layout

| Area         | Elements               | Description                                                         |
| ------------ | ---------------------- | ------------------------------------------------------------------- |
| Left Column  | Video + Two Images     | Video auto-plays silently; two images show below with hover effects |
| Right Column | Text + ROI Cards + CTA | Main heading, description, cards grid, and CTA button               |

---

## 🧱 2. Database (NeonDB PostgreSQL)

### **Table: roi_section**

```sql
CREATE TABLE roi_section (
    id SERIAL PRIMARY KEY,
    main_heading VARCHAR(255) NOT NULL,
    sub_heading TEXT,
    video_url VARCHAR(255),
    image_one VARCHAR(255),
    image_two VARCHAR(255),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Table: roi_cards**

```sql
CREATE TABLE roi_cards (
    id SERIAL PRIMARY KEY,
    roi_section_id INT REFERENCES roi_section(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    value VARCHAR(50) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🖥️ 3. Admin Panel Features

**Panel Path:** `/admin/roi-section`

### Admin Capabilities

* **Video Upload:** Upload or replace ROI section video
* **Images Upload:** Upload two supporting images
* **Text Control:** Edit main heading & subtext
* **ROI Cards CRUD:** Add, edit, or delete cards

  * Fields: `title`, `value`, `description`, `icon_url`
* **Preview Section:** Live preview before publish
* **Publish Toggle:** Show/Hide ROI section on homepage

---

## 🔌 4. API Endpoints

| Endpoint                           | Method | Description                        |
| ---------------------------------- | ------ | ---------------------------------- |
| `/api/roi-section`                 | GET    | Fetch ROI section + cards (public) |
| `/api/admin/roi-section`           | POST   | Create/Update section (admin only) |
| `/api/admin/roi-section/cards`     | POST   | Add new ROI card                   |
| `/api/admin/roi-section/cards/:id` | PUT    | Update ROI card                    |
| `/api/admin/roi-section/cards/:id` | DELETE | Delete ROI card                    |

**Auth:**
Admin endpoints require **JWT authentication**.

---

## 🎨 5. Frontend Design Guidelines

**Theme:**

* Minimal, AI-futuristic with gradient accents (`#00C2FF → #8F00FF`)
* Background: Dark or glassmorphism effect
* Responsive for desktop, tablet, and mobile

**Animations:**

* Fade-in on scroll (Framer Motion / GSAP)
* Count-up effect on ROI values
* Image hover: zoom + gradient overlay

**Grid Layout:**

* Left: Media (video + 2 images)
* Right: Text + Cards Grid (2 columns desktop → 1 column mobile)

**CTA Button:**

* “Get Your ROI Plan” → Redirects to Contact Form or Modal Lead Form

---

## ⚙️ 6. Example API Response

```json
{
  "id": 1,
  "main_heading": "See the Real ROI of AI Integration",
  "sub_heading": "Our clients achieve measurable growth through AI-driven automation and data intelligence.",
  "video_url": "/uploads/roi/roi-video.mp4",
  "image_one": "/uploads/roi/img1.jpg",
  "image_two": "/uploads/roi/img2.jpg",
  "cards": [
    {
      "id": 1,
      "title": "Revenue Growth",
      "value": "+210%",
      "description": "Average client revenue increase after AI system integration.",
      "icon_url": "/icons/revenue.svg"
    },
    {
      "id": 2,
      "title": "Time Saved",
      "value": "40+ hours/month",
      "description": "Automation eliminated repetitive tasks across departments.",
      "icon_url": "/icons/time.svg"
    }
  ]
}
```

---

## 🔒 7. Security & Performance

* **Auth:** JWT for admin actions
* **Validation:** File type/size & text sanitization
* **Optimization:**

  * Lazy-load video
  * Compress images
  * Cache GET route (Next.js ISR or Redis)
* **Error Handling:** Graceful fallback if no data found

---

## 🧠 8. Data Flow

1. **Admin uploads content** → NeonDB stores it
2. **Frontend fetches** from `/api/roi-section`
3. **Homepage** renders section dynamically if `is_published = TRUE`
4. **Updates** auto-reflect after API response refresh

---

## ✅ 9. Acceptance Criteria

* Section visible **only on homepage**
* Fully responsive
* Admin can manage all content (video, text, images, cards)
* Dynamic data served from NeonDB
* API secure with JWT
* ROI data cached for performance

---

## 🧩 10. Optional Enhancements

* ROI calculator (user inputs revenue → shows potential gains)
* Animated chart (Chart.js / Recharts)
* Testimonials below ROI section
* “ROI Case Study” link button to separate page

---

Would you like me to now convert this Markdown PRD into a **JSON PRD version** formatted exactly like your **Shopify AI Agent PRD** (so your automation agent can implement it directly in n8n)?
That JSON will include exact *steps, table schema creation commands, API setup tasks, and UI build flow*.
