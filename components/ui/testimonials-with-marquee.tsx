import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className 
}: TestimonialsSectionProps) {
  return (
    <section className={cn(
      "bg-black text-white relative",
      "py-8 sm:py-16 md:py-20 px-0",
      className
    )}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="neural-connection absolute top-1/4 left-1/3 w-[300px] h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-blue-500/0 neural-pulse"></div>
        <div className="neural-connection absolute top-1/3 right-1/4 w-[200px] h-[1px] bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-purple-500/0 neural-pulse-alt"></div>
        <div className="neural-connection absolute bottom-1/3 left-1/4 w-[250px] h-[1px] bg-gradient-to-r from-indigo-500/0 via-indigo-500/40 to-purple-500/0 neural-pulse"></div>
        
        <div className="neural-node absolute top-[20%] left-[10%] w-3 h-3 bg-purple-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[30%] left-[25%] w-2 h-2 bg-blue-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[60%] left-[15%] w-3 h-3 bg-indigo-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[70%] left-[35%] w-2 h-2 bg-purple-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[40%] right-[20%] w-3 h-3 bg-blue-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[25%] right-[30%] w-2 h-2 bg-indigo-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[75%] right-[15%] w-3 h-3 bg-purple-500/40 rounded-full glow-effect"></div>
        <div className="neural-node absolute top-[55%] right-[25%] w-2 h-2 bg-blue-500/40 rounded-full glow-effect"></div>
      </div>

      <div className="mx-auto flex max-w-container flex-col items-center gap-3 text-center sm:gap-10 relative z-10">
        <div className="flex flex-col items-center gap-3 px-4 sm:gap-5">
          <h2 className="max-w-[720px] text-3xl font-bold leading-tight sm:text-5xl sm:leading-tight">
            {title.split(' ').map((word, i) => 
              i === 1 ? (
                <span key={i} className="relative inline-block mx-2">
                  <span className="relative z-10 bg-white text-black px-3 py-1 rounded-lg">
                    {word}
                  </span>
                </span>
              ) : (
                <span key={i} className="mx-1">{word}</span>
              )
            )}
          </h2>
          <p className="text-md max-w-[600px] font-medium text-gray-400 sm:text-xl">
            {description}
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:120s] sm:[--duration:60s] [--duration-mobile:180s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]"
                 style={{
                   willChange: 'transform',
                   backfaceVisibility: 'hidden',
                   transform: 'translate3d(0, 0, 0)'
                 }}>
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-black sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-black sm:block" />
        </div>
      </div>

      <style jsx>{`
        @keyframes neural-pulse {
          0% { opacity: 0.2; transform: scaleX(0.95); }
          50% { opacity: 0.5; transform: scaleX(1.05); }
          100% { opacity: 0.2; transform: scaleX(0.95); }
        }
        
        @keyframes neural-pulse-alt {
          0% { opacity: 0.1; transform: scaleX(1.05); }
          50% { opacity: 0.4; transform: scaleX(0.95); }
          100% { opacity: 0.1; transform: scaleX(1.05); }
        }
        
        @keyframes node-pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.5); opacity: 0.8; }
        }
        
        .neural-pulse {
          animation: neural-pulse 4s infinite ease-in-out;
        }
        
        .neural-pulse-alt {
          animation: neural-pulse-alt 5s infinite ease-in-out;
        }
        
        .glow-effect {
          animation: node-pulse 4s infinite ease-in-out;
          box-shadow: 0 0 10px currentColor;
        }
        
        .glow-effect:nth-child(odd) {
          animation-delay: 1s;
        }
        
        .glow-effect:nth-child(3n) {
          animation-delay: 2s;
        }
        
        .glow-effect:nth-child(3n+1) {
          animation-delay: 3s;
        }
      `}</style>
    </section>
  )
} 