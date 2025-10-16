// Define the review interfaces
export interface Review {
  name: string;
  role: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PlanReview extends Review {
  projectType?: string;
  successMetrics?: Array<{ label: string; value: string }>;
}

// Export the reviews with proper typing
export const saasReviews: Review[] = [
  {
    name: "David Chen",
    role: "CTO, TechFlow Solutions",
    rating: 5,
    comment: "The AI integration in our SAAS product has revolutionized our business operations. Exceptional work!",
    date: "2024-03-15"
  },
  {
    name: "Sarah Williams",
    role: "Product Manager, DataSmart",
    rating: 5,
    comment: "Their expertise in building scalable SAAS architecture is unmatched. Our platform's performance improved significantly.",
    date: "2024-03-10"
  },
  {
    name: "Michael Roberts",
    role: "CEO, AI Ventures",
    rating: 5,
    comment: "The predictive analytics engine they built has given us a competitive edge in the market.",
    date: "2024-03-05"
  }
];

export const carouselReviews: Review[] = [
  {
    name: "AHMAD JAVEED",
    role: "CEO, Tech Solutions",
    rating: 5,
    comment: "Exceptional development service! The attention to detail and professional approach exceeded our expectations.",
    date: "2024-03-01"
  },
  // Add more carousel reviews here
];

export const planReviews: PlanReview[] = [
  {
    name: "David Chen",
    role: "CTO, TechFlow Solutions",
    rating: 5,
    comment: "The AI integration in our SAAS product has revolutionized our business operations.",
    date: "2024-03-15",
    projectType: "MODERN AI BASED SAAS PRODUCT",
    successMetrics: [
      { label: "Performance Improvement", value: "40%" },
      { label: "Cost Reduction", value: "35%" }
    ]
  },
  // Add more plan reviews here
]; 
