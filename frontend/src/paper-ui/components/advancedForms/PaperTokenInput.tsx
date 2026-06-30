import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/paper-ui/utils";
import { SketchBorder } from "@/paper-ui/core";
import { X, Search } from "lucide-react";

export interface Token {
  id: string;
  label: string;
}

export interface PaperTokenInputProps extends React.HTMLAttributes<HTMLDivElement> {
  tokens: Token[];
  selectedTokens: Token[];
  onChangeSelected: (tokens: Token[]) => void;
  label?: string;
  error?: string;
  hint?: string;
}

export const PaperTokenInput = React.forwardRef<HTMLDivElement, PaperTokenInputProps>(
  function PaperTokenInput({ tokens, selectedTokens, onChangeSelected, label, error, hint, className, ...props }, ref) {
    const [focused, setFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredTokens = tokens.filter(t => 
      !selectedTokens.find(st => st.id === t.id) && 
      t.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && inputValue === "" && selectedTokens.length > 0) {
        onChangeSelected(selectedTokens.slice(0, -1));
      }
    };

    const addToken = (token: Token) => {
      onChangeSelected([...selectedTokens, token]);
      setInputValue("");
      setIsOpen(false);
    };

    const removeToken = (idToRemove: string) => {
      onChangeSelected(selectedTokens.filter(t => t.id !== idToRemove));
    };

    return (
      <div ref={containerRef} className={cn("flex flex-col gap-1.5 w-full relative", className)} {...props}>
        {label && (
          <label className="font-architect text-[13px] text-ink-muted">
            {label}
          </label>
        )}
        <div className={cn("relative flex flex-wrap items-center gap-2 px-3 py-2 min-h-[44px]")} onClick={() => setIsOpen(true)}>
          <SketchBorder
            fill="#fffdf9"
            stroke={error ? "#9f3a36" : focused ? "#262320" : "#9c9484"}
            strokeWidth={focused ? 1.8 : 1.5}
            roughness={1.1}
            shadow={0}
          />
          
          <div className="relative z-[1] flex flex-wrap gap-2 w-full items-center">
            <Search size={16} className="text-ink-muted shrink-0" />
            {selectedTokens.map((token) => (
              <span key={token.id} className="relative inline-flex items-center gap-1 px-2 py-0.5 text-sm font-architect text-ink">
                <SketchBorder
                  fill="#c7d2fe"
                  stroke="#262320"
                  strokeWidth={1}
                  roughness={1.5}
                  shadow={0}
                  className="-z-10"
                />
                {token.label}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeToken(token.id); }}
                  className="hover:text-danger focus:outline-none"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => { setFocused(true); setIsOpen(true); }}
              onBlur={() => setFocused(false)}
              className="flex-1 min-w-[80px] border-none bg-transparent font-architect text-[15px] text-ink placeholder:text-ink-muted/60 focus:outline-none"
              placeholder="Search..."
            />
          </div>
        </div>

        {isOpen && filteredTokens.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 p-2 bg-[#fffdf9] max-h-64 overflow-y-auto">
            <SketchBorder
              fill="#fffdf9"
              stroke="#9c9484"
              strokeWidth={1.5}
              roughness={1.1}
              shadow={0}
            />
            <div className="relative z-10 flex flex-col">
              {filteredTokens.map(token => (
                <button
                  key={token.id}
                  onClick={() => addToken(token)}
                  className="text-left px-3 py-2 font-architect hover:bg-ink/5 rounded-md"
                >
                  {token.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="font-kalam text-[12px] text-danger">{error}</p>
        )}
        {hint && !error && (
          <p className="font-kalam text-[12px] text-ink-muted/70">{hint}</p>
        )}
      </div>
    );
  }
);
