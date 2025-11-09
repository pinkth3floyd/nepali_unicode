'use client';

import React, { useState, useRef, useCallback } from 'react';
import { NepaliConverter, NepaliConverterBuilder } from '@/lib/nepali-converter';

interface NepaliTextAreaProps {
  placeholder?: string;
  className?: string;
  rows?: number;
}

/**
 * React component for Nepali Unicode text input
 * Uses NepaliConverter with Builder pattern
 */
export default function NepaliTextArea({ 
  placeholder = 'Type in English (e.g., mero naam ram ho)...',
  className = '',
  rows = 10
}: NepaliTextAreaProps) {
  const [text, setText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Build converter using Builder pattern
  const converter = React.useMemo(() => {
    return new NepaliConverterBuilder()
      .withAutoConvertOnSpace(true)
      .withCaseSensitive(false)
      .withPreservePunctuation(true)
      .withCommonWords(true)
      .build();
  }, []);

  /**
   * Handle text change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    setCursorPosition(e.target.selectionStart);
  }, []);

  /**
   * Handle key press events
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === ' ' && !e.shiftKey) {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const currentPos = textarea.selectionStart;
      
      // Convert the word before space
      const result = converter.handleSpaceKey(text, currentPos);
      
      setText(result.convertedText);
      
      // Set cursor position after state update
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = result.newCursorPosition;
          textareaRef.current.selectionEnd = result.newCursorPosition;
        }
        setCursorPosition(result.newCursorPosition);
      }, 0);
    }
  }, [text, converter]);

  /**
   * Handle selection change to track cursor position
   */
  const handleSelect = useCallback((e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  }, []);

  return (
    <div className="w-full max-w-4xl">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full p-4 rounded-lg border-2 border-gray-300 
          focus:border-blue-500 focus:outline-none 
          text-lg font-nepali
          resize-y
          ${className}
        `}
        style={{
          fontFamily: "var(--font-nepali), 'Noto Sans Devanagari', 'Mangal', 'Kalimati', sans-serif"
        }}
      />
      <div className="mt-2 text-sm text-gray-600">
        <p>💡 Tip: Type in English and press space to convert to Nepali Unicode</p>
        <p className="mt-1">Example: Type "mero naam ram ho" and press space after each word</p>
      </div>
    </div>
  );
}

