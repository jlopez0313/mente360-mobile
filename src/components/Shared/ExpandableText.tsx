import React, { useState, useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLines?: 1 | 2 | 3 | 4;
  className?: string;
}

export const ExpandableText: React.FC<ExpandableTextProps> = ({ 
  text, 
  maxLines = 2, 
  className 
}) => {
  const [expandido, setExpandido] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current && !expandido) {
        const isTruncated = textRef.current.scrollHeight > textRef.current.clientHeight;
        setCanExpand(isTruncated);
      }
    };

    // Initial check
    checkTruncation();
    
    // Check on resize
    const observer = new ResizeObserver(checkTruncation);
    if (textRef.current) observer.observe(textRef.current);
    
    return () => observer.disconnect();
  }, [text, maxLines, expandido]);

  const lineClampClass = {
    1: "line-clamp-1",
    2: "line-clamp-2",
    3: "line-clamp-3",
    4: "line-clamp-4",
  }[maxLines];

  return (
    <div className="flex flex-col">
      <p
        ref={textRef}
        className={cn(
          "text-sm text-muted-foreground mb-0",
          !expandido ? lineClampClass : "line-clamp-none",
          className
        )}
      >
        {text}
      </p>
      {canExpand && (
        <button
          className="text-sm text-primary underline hover:opacity-80 transition self-start mt-1"
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Leer menos" : "Leer más"}
        </button>
      )}
    </div>
  );
};
