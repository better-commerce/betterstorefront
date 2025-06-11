import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function LongDescription({ data, heading }: any) {
  const [expanded, setExpanded] = useState(false);

  // This is the raw HTML content you want to display
  const fullHTML = data;

  // Decide how many characters to show by default
  const MAX_CHAR_COUNT = 300;

  // Check if the description is longer than our cutoff
  const isOverflow = fullHTML?.length > MAX_CHAR_COUNT;

  // If we need to truncate, slice the string and add ellipsis
  const truncatedHTML = isOverflow
    ? fullHTML.slice(0, MAX_CHAR_COUNT).trim() + "..."
    : fullHTML;

  // Content to display depends on expanded state
  const displayHTML = expanded ? fullHTML : truncatedHTML;
  
  return (
    <div className="w-full">
    {heading && (
      <h2 className="font-semibold text-lg mb-0">{heading}</h2>
    )}
      {/* Render the HTML safely (with caution) */}
      <div
        className="text-sm text-gray-800 description-html"
        dangerouslySetInnerHTML={{ __html: displayHTML }}
      />

      {/* Show button only if there's an overflow */}
      {isOverflow && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center text-color-primary-blue text-sm mt-2 focus:outline-none"
        >
          {expanded ? (
            <ChevronUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 mr-1" />
          )}
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}
