
import React from 'react';

export const BrainIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v1.2a1 1 0 0 0 1 1h.3a1 1 0 0 0 .9-.6l.2-1a2.5 2.5 0 0 1 2.5-2.1c.9 0 1.7.5 2.1 1.3" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v1.2a1 1 0 0 1-1 1h-.3a1 1 0 0 1-.9-.6l-.2-1a2.5 2.5 0 0 0-2.5-2.1c-.9 0-1.7.5-2.1 1.3" />
    <path d="M4.2 9.5A2.5 2.5 0 0 0 2 12c0 1.4.9 2.5 2.2 2.5h1.1a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1H4.2z" />
    <path d="M19.8 9.5A2.5 2.5 0 0 1 22 12c0 1.4-.9 2.5-2.2 2.5h-1.1a1 1 0 0 1-1-1V12a1 1 0 0 1 1-1h1.1z" />
    <path d="M12 14.5a2.5 2.5 0 0 1-2.5-2.2V11a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.2a2.5 2.5 0 0 1-2.5 2.3z" />
    <path d="M6.3 18.2A2.5 2.5 0 0 1 4.2 21c-1.2 0-2.2-1.1-2.2-2.5v-1.1a1 1 0 0 1 1-1h1.2a2.5 2.5 0 0 1 2.1 2.8z" />
    <path d="M17.7 18.2A2.5 2.5 0 0 0 19.8 21c1.2 0 2.2-1.1 2.2-2.5v-1.1a1 1 0 0 0-1-1h-1.2a2.5 2.5 0 0 0-2.1 2.8z" />
  </svg>
);

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

export const SendIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);
