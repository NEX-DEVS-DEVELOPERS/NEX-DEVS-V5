import { TestimonialsSection } from '@/frontend/components/ui/testimonials-with-marquee'

const testimonials = [
  {
    author: {
      name: "Fatima Ahmed",
      handle: "@fatima_tech",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face"
    },
    text: "Using NEX-DEVS has transformed how we handle our website. The speed and accuracy are unprecedented.",
    href: "#"
  },
  {
    author: {
      name: "James Wilson",
      handle: "@jwilson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    text: "The integration is flawless. We've reduced our development time by 60% since implementing their solution.",
    href: "#"
  },
  {
    author: {
      name: "Zainab Khan",
      handle: "@zainabk",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
    },
    text: "Finally, a development team that actually understands our needs! The accuracy in implementation is impressive."
  },
  {
    author: {
      name: "Hassan Ali",
      handle: "@hassandev",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    },
    text: "NEX-DEVS delivered our project ahead of schedule and with exceptional quality. Highly recommended for any business."
  },
  {
    author: {
      name: "Sarah Johnson",
      handle: "@sarahj",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
    },
    text: "The team's attention to detail and technical expertise helped us launch our platform with zero issues."
  }
]

export default function ClientTestimonials() {
  return (
    <TestimonialsSection
      title="Trusted by businesses worldwide"
      description="Join hundreds of satisfied clients who are already building their digital future with NEX-DEVS"
      testimonials={testimonials}
    />
  )
} 