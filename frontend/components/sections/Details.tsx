import Image from 'next/image'

export default function Details() {
  return (
    <section className="w-full bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column - Image */}
          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/about-image.webp" // Add a professional image here
              alt="Professional workspace"
              fill
              className="object-cover"
            />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-6">
            <div className="inline-block bg-white text-black px-4 py-1 rounded-md">
              ABOUT NEX-WEBS
            </div>
            <h2 className="text-4xl font-bold">
              We Transform Digital Presence Into Powerful Results
            </h2>
            <p className="text-gray-400 text-lg">
              At NEX-WEBS, we specialize in creating comprehensive digital marketing solutions 
              that drive real business growth. Our team of experts combines creativity with 
              data-driven strategies to deliver exceptional results.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white">250+</h3>
                <p className="text-gray-400">Projects Completed</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white">95%</h3>
                <p className="text-gray-400">Client Satisfaction</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white">10+</h3>
                <p className="text-gray-400">Years Experience</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-white">50+</h3>
                <p className="text-gray-400">Team Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 