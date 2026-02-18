'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { calculateBlogStats, formatTimeElapsed } from '@/lib/utils/blog-stats';
import type { BlogPost } from '@/types/blog';

interface BlogStatsProps {
  posts: BlogPost[];
}

export function BlogStats({ posts }: BlogStatsProps) {
  const stats = calculateBlogStats(posts);
  const [timeElapsed, setTimeElapsed] = useState({
    days: stats.timeSinceLastPost.days,
    hours: stats.timeSinceLastPost.hours,
    minutes: stats.timeSinceLastPost.minutes,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => {
        let newMinutes = prev.minutes + 1;
        let newHours = prev.hours;
        let newDays = prev.days;

        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }

        if (newHours >= 24) {
          newHours = 0;
          newDays += 1;
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
        };
      });
    }, 60000); // Update every minute instead of every second

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 p-4 rounded-lg bg-muted/50 border">
      {/* Row 1: Clock Icon */}
      <div className="flex items-center justify-center">
        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-accent" />
      </div>
      
      {/* Row 1: Time Text */}
      <p className="text-sm text-muted-foreground flex items-center">
        <span className="font-medium">Time since last post:</span>{' '}
        <span className="font-mono text-foreground ml-1">
          {formatTimeElapsed(timeElapsed.days, timeElapsed.hours, timeElapsed.minutes)}
        </span>
      </p>
      
      {/* Row 2: Tilde Icon */}
      <div className="flex items-center justify-center">
        <span className="text-accent">~</span>
      </div>
      
      {/* Row 2: Frequency Text */}
      <p className="text-sm text-muted-foreground flex items-center flex-wrap">
        <span className="font-medium">Writing frequency:</span>{' '}
        <span className="text-foreground">{stats.frequency.label}</span>
        {stats.meanDaysBetweenPosts > 0 && (
          <span className="text-xs ml-2 opacity-60">
            (avg. {Math.round(stats.meanDaysBetweenPosts)} days apart)
          </span>
        )}
      </p>
    </div>
  );
}
