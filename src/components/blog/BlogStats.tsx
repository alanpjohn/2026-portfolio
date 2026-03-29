"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarCheck,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";
import { calculateBlogStats, formatTimeElapsed } from "@/lib/utils/blog-stats";
import type { BlogPost } from "@/types/blog";

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
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col @md:flex-row items-center justify-around">
      {/* Time since last post */}
      <div className="flex items-center gap-3 p-3 bg-accent/5 brutalist-border h-fit w-full @md:w-2/5 my-1">
        <FontAwesomeIcon
          icon={faClock}
          className="text-accent text-sm flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-xs font-mono uppercase text-foreground/50">
            Time since last post
          </p>
          <p className="font-mono text-sm font-bold">
            {formatTimeElapsed(
              timeElapsed.days,
              timeElapsed.hours,
              timeElapsed.minutes,
            )}
          </p>
        </div>
      </div>

      {/* Writing frequency */}
      <div className="flex items-center gap-3 p-3 bg-accent/5 brutalist-border w-full @md:w-2/5 my-1">
        <FontAwesomeIcon
          icon={faCalendarCheck}
          className="text-accent text-sm flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono uppercase text-foreground/50">
            Writing frequency
          </p>
          <p className="font-mono text-sm font-bold">
            {stats.frequency.label}
            {stats.meanDaysBetweenPosts > 0 && (
              <span className="text-xs ml-2 opacity-60">
                (~{Math.round(stats.meanDaysBetweenPosts)}d avg)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
