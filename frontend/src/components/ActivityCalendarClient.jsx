"use client";

import { ActivityCalendar } from 'react-activity-calendar';
import { useMemo } from 'react';

export default function ActivityCalendarClient() {
  // Generate realistic looking mock data for the past 6 months
  const data = useMemo(() => {
    const today = new Date();
    const result = [];
    
    for (let i = 180; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // More activity recently, less in the past, some random gaps
      const isRecent = i < 30;
      const randomFactor = ((i * 7) % 10) / 10;
      
      let count = 0;
      if (randomFactor > 0.6) {
        count = (((i * 3) % 3) + 1);
        if (isRecent) count += (((i * 11) % 2));
      }

      result.push({
        date: date.toISOString().split('T')[0],
        count: count,
        level: Math.min(count, 4) // Activity level 0-4
      });
    }
    
    return result;
  }, []);

  const theme = {
    light: ['#1a1a1a', '#06b6d4'],
    dark: ['#1a1a1a', '#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'],
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar pb-2">
      <div className="min-w-[600px]">
        <ActivityCalendar 
          data={data} 
          theme={theme}
          colorScheme="dark"
          labels={{
            legend: {
              less: 'Less',
              more: 'More'
            },
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            totalCount: '{{count}} activities in the last 6 months'
          }}
          blockSize={12}
          blockRadius={2}
          blockMargin={4}
        />
      </div>
    </div>
  );
}
