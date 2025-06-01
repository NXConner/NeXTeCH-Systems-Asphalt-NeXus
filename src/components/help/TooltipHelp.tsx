import { useState } from 'react';

export default function TooltipHelp({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        aria-label="Help"
        className="rounded-full bg-blue-100 p-1 text-blue-600 ml-2"
        onMouseEnter={()=>setShow(true)}
        onMouseLeave={()=>setShow(false)}
        onFocus={()=>setShow(true)}
        onBlur={()=>setShow(false)}
      >
        ?
      </button>
      {show && (
        <span className="absolute left-full top-0 ml-2 bg-black text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
          {text}
        </span>
      )}
    </span>
  );
} 