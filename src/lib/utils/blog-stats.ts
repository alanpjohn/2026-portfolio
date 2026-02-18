import type { BlogPost } from '@/types/blog';

export interface BlogStats {
  lastPost: BlogPost | null;
  timeSinceLastPost: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMilliseconds: number;
  };
  meanDaysBetweenPosts: number;
  frequency: {
    value: number;
    unit: 'month' | 'months';
    label: string;
  };
}

export function calculateBlogStats(posts: BlogPost[]): BlogStats {
  if (posts.length === 0) {
    return {
      lastPost: null,
      timeSinceLastPost: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMilliseconds: 0,
      },
      meanDaysBetweenPosts: 0,
      frequency: {
        value: 0,
        unit: 'months',
        label: 'No posts yet',
      },
    };
  }

  // Get the most recent post
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
  const lastPost = sortedPosts[0];

  // Calculate time since last post (assuming published at 00:00:00)
  const lastPostDate = new Date(lastPost.date);
  lastPostDate.setHours(0, 0, 0, 0);
  const now = new Date();
  const diffMs = now.getTime() - lastPostDate.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  // Calculate mean time between posts
  let meanDaysBetweenPosts = 0;
  if (sortedPosts.length > 1) {
    const intervals: number[] = [];
    for (let i = 0; i < sortedPosts.length - 1; i++) {
      const current = new Date(sortedPosts[i].date);
      const next = new Date(sortedPosts[i + 1].date);
      const diffDays =
        (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(diffDays);
    }
    meanDaysBetweenPosts =
      intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
  }

  // Calculate frequency
  let frequency: BlogStats['frequency'];
  if (meanDaysBetweenPosts === 0) {
    frequency = {
      value: 0,
      unit: 'months',
      label: 'No posts yet',
    };
  } else if (meanDaysBetweenPosts > 30) {
    const months = Math.round(meanDaysBetweenPosts / 30);
    frequency = {
      value: months,
      unit: months === 1 ? 'month' : 'months',
      label: `once in ${months} ${months === 1 ? 'month' : 'months'}`,
    };
  } else {
    const postsPerMonth = Math.round(30 / meanDaysBetweenPosts);
    frequency = {
      value: postsPerMonth,
      unit: 'month',
      label: `${postsPerMonth} in one month`,
    };
  }

  return {
    lastPost,
    timeSinceLastPost: {
      days,
      hours,
      minutes,
      seconds,
      totalMilliseconds: diffMs,
    },
    meanDaysBetweenPosts,
    frequency,
  };
}

export function formatTimeElapsed(days: number, hours: number, minutes: number): string {
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0 || days > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  return parts.join(' ');
}
