'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAdvancedIntersectionObserver } from '@/frontend/hooks/useAdvancedIntersectionObserver'
import Head from 'next/head';
import { audiowide, vt323 } from '@/frontend/utils/fonts';

interface TeamMember {
    id: number
    name: string
    title: string
    bio?: string
    image_url: string
    skills: string[]
    is_leader: boolean
    socialLinks: {
      github?: string
      linkedin?: string
      twitter?: string
      dribbble?: string
      website?: string
    }
  }

const TeamMemberCard = ({ member }: { member: TeamMember }) => {
  const [setRef, isIntersecting] = useAdvancedIntersectionObserver({ threshold: 0.5 });

  return (
    <>
        <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        </Head>
        <div className="relative mt-8 pt-2">
            <div className="absolute top-0 left-4 -translate-y-full bg-black px-3 py-1 z-10 rounded-t-md border-t border-l border-r border-purple-500/20">
                <span 
                    className={`text-sm font-semibold uppercase text-purple-400 tracking-[0.2em] ${audiowide.className}`}
                >
                    {member.is_leader ? 'NEX-DEVS' : 'NEX-DEVS Teammate'}
                </span>
            </div>
            <div ref={setRef} className="relative group overflow-hidden rounded-xl aspect-[4/3] border border-white/10 bg-black/30 shadow-xl">
                {/* Subtle neutral glow on hover (no purple) */}
                <div className="pointer-events-none absolute -inset-1 rounded-xl bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-500"></div>
                
                {/* Image */}
                <Image
                    src={member.image_url}
                    alt={member.name}
                    width={1920}
                    height={1080}
                    className="absolute inset-0 object-cover w-full h-full filter blur-[10px] group-hover:blur-0 transition-[filter,transform,opacity] duration-700 ease-out will-change-transform"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMjAyMDMwIi8+PC9zdmc+"
                    priority
                    quality={100}
                />

                {/* Details Overlay */}
                <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0">
                        <h3 className={`text-xl font-bold ${audiowide.className}`}>{member.name}</h3>
                        <p className={`text-purple-300 text-sm mb-3 ${vt323.className}`}>{member.title}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {member.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-full">{skill}</span>
                            ))}
                            {member.skills.length > 3 && (
                                <span className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded-full">+{member.skills.length - 3} more</span>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            {member.socialLinks?.github && <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">GitHub</a>}
                            {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default TeamMemberCard; 