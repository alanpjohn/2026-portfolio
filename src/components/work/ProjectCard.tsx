'use client';

import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faCode, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import type { WorkItem } from '@/types/work';

// Get icon based on work type
function getWorkIcon(type: string) {
  switch (type) {
    case 'project':
      return faTerminal;
    default:
      return faCode;
  }
}

interface ProjectCardProps {
  project: WorkItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const cardContent = (
    <div className="flex flex-col h-full">
      {/* Hover image that follows mouse */}
      {project.image && isHovering && (
        <div
          className="absolute pointer-events-none z-20 w-48 h-32 brutalist-border border-background bg-background overflow-hidden shadow-2xl"
          style={{
            left: mousePosition.x - 96,
            top: mousePosition.y - 64,
            transition: 'opacity 0.2s ease',
          }}
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="text-4xl mb-6 text-accent group-hover:text-foreground transition-colors">
        <FontAwesomeIcon icon={getWorkIcon(project.type)} />
      </div>
      <h4 className="font-display font-bold text-xl mb-4 uppercase">{project.title}</h4>
      <p className="mb-8 opacity-80 group-hover:opacity-100 flex-grow">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-6">
        {project.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="border-2 border-background px-2 py-0.5 text-xs font-mono font-bold uppercase"
          >
            {tag}
          </span>
        ))}
      </div>
      {project.url && (
        <div className="flex gap-4 mt-auto">
          <span className="font-mono text-sm font-bold border-b-2 border-accent group-hover:border-foreground">
            <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1" />
            VIEW REPO
          </span>
        </div>
      )}
    </div>
  );

  if (project.url) {
    return (
      <a
        ref={cardRef}
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="border-4 border-background p-6 hover:bg-accent hover:text-foreground transition-colors group relative overflow-hidden block cursor-pointer h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <div className="border-4 border-background p-6 hover:bg-accent hover:text-foreground transition-colors group relative overflow-hidden h-full">
      {cardContent}
    </div>
  );
}
