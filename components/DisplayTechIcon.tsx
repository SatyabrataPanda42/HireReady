'use client';

import React, { useState, useEffect } from 'react';
import { cn, getTechLogos } from '@/lib/utils';
import Image from 'next/image';

interface TechIconProps {
  techStack: string[];
}

const DisplayTechIcon = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<{ tech: string; url: string }[]>([]);

  useEffect(() => {
    const fetchTechIcons = async () => {
      try {
        const fetchedIcons = await getTechLogos(techStack);
        setTechIcons(fetchedIcons);
      } catch (error) {
        console.error("Error fetching tech icons:", error);
      }
    };

    fetchTechIcons();
  }, [techStack]);

  return (
    <div className='flex flex-row'>
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn('relative group bg-dark-300 rounded-full p-2 flex-center', index >= 1 && '-ml-3')}
        >
          <span className='tech-tooltip'>{tech}</span>
          <Image src={url} alt={tech} width={100} height={100} className='size-5' />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcon;
