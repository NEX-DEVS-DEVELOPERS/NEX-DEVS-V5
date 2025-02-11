import Image from 'next/image'
import Link from 'next/link'

export default function Work() {
  const projects = [
    {
      title: "E-commerce Growth Strategy",
      category: "Digital Marketing",
      image: "/work-1.webp",
      link: "/work/ecommerce"
    },
    {
      title: "Brand Identity Revolution",
      category: "Brand Strategy",
      image: "/work-2.webp",
      link: "/work/brand"
    },
    {
      title: "Social Media Expansion",
      category: "Social Media",
      image: "/work-3.webp",
      link: "/work/social"
    }
  ]

  return (
    <section className="w-full bg-black text-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="space-y-4 mb-12">
          <div className="inline-block bg-white text-black px-4 py-1 rounded-md">
            OUR WORK
          </div>
          <h2 className="text-4xl font-bold">Featured Projects</h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Explore our portfolio of successful digital transformations and marketing campaigns.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link href={project.link} key={index} className="group">
              <div className="space-y-4">
                <div className="relative h-[300px] overflow-hidden rounded-lg">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-gray-400">{project.category}</span>
                  <h3 className="text-xl font-bold group-hover:text-gray-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            href="/work" 
            className="inline-block border border-white px-8 py-3 rounded-full font-medium hover:bg-white hover:text-black transition-colors"
          >
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
} 