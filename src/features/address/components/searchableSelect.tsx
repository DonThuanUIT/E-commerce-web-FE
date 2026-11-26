import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface OptionItem {
  code: string;
  name: string;
}

interface SearchableSelectProps {
  id: string;
  label: string;
  value: string;
  options: OptionItem[];
  placeholder: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

/**
 * Searchable dropdown selector for Province / District / Ward.
 */
export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  label,
  value,
  options,
  placeholder,
  disabled = false,
  error,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((opt) => opt.name.toLowerCase().includes(normalized));
  }, [options, query]);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => {
      if (!prev) setQuery('');
      return !prev;
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11px] font-semibold tracking-wider text-gray-700 uppercase"
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-left text-sm transition ${
          disabled
            ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : 'cursor-pointer border-gray-300 bg-white text-gray-900 hover:border-gray-400 focus:border-black focus:outline-none'
        } ${error ? 'border-rose-400' : ''}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1.5 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              autoFocus
              className="w-full text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <li className="px-3.5 py-2 text-xs text-gray-400">
                No matching results
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li key={opt.code}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(opt.name);
                      setIsOpen(false);
                    }}
                    className={`w-full px-3.5 py-2 text-left text-xs transition hover:bg-gray-100 cursor-pointer ${
                      value === opt.name
                        ? 'bg-gray-50 font-semibold text-black'
                        : 'text-gray-700'
                    }`}
                  >
                    {opt.name}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
};
