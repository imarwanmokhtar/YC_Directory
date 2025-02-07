'use client';

import Ping from "@/components/Ping";
import { useEffect, useState } from "react";

const View = ({ id, initialViews = 0 }: { id: string; initialViews?: number }) => {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    const incrementView = async () => {
      try {
        const response = await fetch('/api/views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error('Failed to increment view:', error);
      }
    };

    incrementView();
  }, [id]);

  return (
    <div className="fixed bottom-4 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg z-50">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Ping />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          <span className="font-bold">{views}</span> views
        </p>
      </div>
    </div>
  );
};

export default View;