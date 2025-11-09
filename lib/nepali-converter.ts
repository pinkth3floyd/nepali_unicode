import { NepaliMapping } from './nepali-mapping';

/**
 * Configuration interface for NepaliConverter
 */
export interface NepaliConverterConfig {
  autoConvertOnSpace: boolean;
  caseSensitive: boolean;
  preservePunctuation: boolean;
  enableCommonWords: boolean;
}

/**
 * Builder class for NepaliConverter configuration
 * Implements Builder pattern
 */
export class NepaliConverterBuilder {
  private config: NepaliConverterConfig = {
    autoConvertOnSpace: true,
    caseSensitive: false,
    preservePunctuation: true,
    enableCommonWords: true
  };

  /**
   * Enable/disable auto-conversion on space key press
   */
  withAutoConvertOnSpace(enabled: boolean): this {
    this.config.autoConvertOnSpace = enabled;
    return this;
  }

  /**
   * Enable/disable case sensitivity
   */
  withCaseSensitive(enabled: boolean): this {
    this.config.caseSensitive = enabled;
    return this;
  }

  /**
   * Enable/disable punctuation preservation
   */
  withPreservePunctuation(enabled: boolean): this {
    this.config.preservePunctuation = enabled;
    return this;
  }

  /**
   * Enable/disable common words mapping
   */
  withCommonWords(enabled: boolean): this {
    this.config.enableCommonWords = enabled;
    return this;
  }

  /**
   * Build and return the NepaliConverter instance
   */
  build(): NepaliConverter {
    return new NepaliConverter(this.config);
  }

  /**
   * Get the current configuration
   */
  getConfig(): NepaliConverterConfig {
    return { ...this.config };
  }
}

/**
 * Token types for parsing
 */
enum TokenType {
  VOWEL,
  CONSONANT,
  CONSONANT_CLUSTER,
  PUNCTUATION,
  SPACE,
  UNKNOWN
}

/**
 * Token structure
 */
interface Token {
  type: TokenType;
  value: string;
  start: number;
  end: number;
}

/**
 * Main NepaliConverter class
 * Handles conversion from English/Roman script to Nepali Unicode
 * Supports half letters (हालन्त) and complex consonant clusters
 */
export class NepaliConverter {
  private config: NepaliConverterConfig;
  private mapping: Record<string, string>;
  private commonWords: Record<string, string>;
  private consonantClusters: Record<string, string>;
  private baseConsonants: Record<string, string>;
  private halfConsonants: Record<string, string>;
  private vowels: Record<string, string>;
  private matras: Record<string, string>;

  constructor(config: NepaliConverterConfig) {
    this.config = config;
    this.mapping = NepaliMapping.getMapping();
    this.commonWords = NepaliMapping.getCommonWords();
    this.consonantClusters = NepaliMapping.getConsonantClusters();
    this.baseConsonants = NepaliMapping.getBaseConsonants();
    this.halfConsonants = NepaliMapping.getHalfConsonants();
    this.vowels = NepaliMapping.getVowels();
    this.matras = NepaliMapping.getMatras();
  }

  /**
   * Convert a single word from English to Nepali
   */
  convertWord(word: string): string {
    if (!word || word.trim().length === 0) {
      return word;
    }

    const cleanWord = word.trim().toLowerCase();
    
    // Check common words first if enabled
    if (this.config.enableCommonWords && this.commonWords[cleanWord]) {
      return this.commonWords[cleanWord];
    }

    // Convert using advanced transliteration
    return this.convertAdvanced(cleanWord);
  }

  /**
   * Advanced conversion algorithm that handles half letters and complex clusters
   */
  private convertAdvanced(text: string): string {
    if (!text) return '';

    let result = '';
    let i = 0;

    while (i < text.length) {
      // Try to match longest patterns first (4 chars, 3 chars, 2 chars, 1 char)
      let matched = false;

      // Try 4-character sequences (for complex clusters)
      if (i + 4 <= text.length) {
        const fourChar = text.substring(i, i + 4);
        if (this.consonantClusters[fourChar] || this.mapping[fourChar]) {
          result += this.consonantClusters[fourChar] || this.mapping[fourChar];
          i += 4;
          matched = true;
        }
      }

      // Try 3-character sequences
      if (!matched && i + 3 <= text.length) {
        const threeChar = text.substring(i, i + 3);
        if (this.consonantClusters[threeChar] || this.mapping[threeChar]) {
          result += this.consonantClusters[threeChar] || this.mapping[threeChar];
          i += 3;
          matched = true;
        }
      }

      // Try 2-character sequences
      if (!matched && i + 2 <= text.length) {
        const twoChar = text.substring(i, i + 2);
        
        // Check if it's a consonant cluster
        if (this.consonantClusters[twoChar]) {
          result += this.consonantClusters[twoChar];
          i += 2;
          matched = true;
        }
        // Check if it's a vowel or consonant combination
        else if (this.mapping[twoChar]) {
          result += this.mapping[twoChar];
          i += 2;
          matched = true;
        }
        // Check if it's consonant + consonant (half letter case)
        else if (this.baseConsonants[twoChar[0]] && this.baseConsonants[twoChar[1]]) {
          // First consonant should be half, second with inherent 'a'
          const firstHalf = this.halfConsonants[twoChar[0]];
          const secondBase = this.baseConsonants[twoChar[1]];
          if (firstHalf && secondBase) {
            result += firstHalf + secondBase;
            i += 2;
            matched = true;
          }
        }
      }

      // Try single character
      if (!matched) {
        const singleChar = text[i];
        const nextChar = i + 1 < text.length ? text[i + 1] : null;
        const nextTwoChar = i + 2 < text.length ? text.substring(i + 1, i + 3) : null;

        // Check if it's a vowel
        if (this.vowels[singleChar]) {
          result += this.vowels[singleChar];
          i++;
          matched = true;
        }
        // Check if it's a consonant
        else if (this.baseConsonants[singleChar]) {
          // Check if next character is a consonant (without vowel) - need half letter
          if (nextChar && this.isConsonantChar(nextChar) && !this.isVowelChar(nextChar)) {
            // Check if next two chars form a vowel (like 'aa', 'ee', etc.)
            if (nextTwoChar && this.matras[nextTwoChar]) {
              // Consonant + vowel matra
              result += this.baseConsonants[singleChar] + this.matras[nextTwoChar];
              i += 3;
            }
            // Check if next char is a vowel
            else if (nextChar && this.matras[nextChar]) {
              // Consonant + vowel matra
              result += this.baseConsonants[singleChar] + this.matras[nextChar];
              i += 2;
            }
            // Next is consonant - use half letter
            else {
              const halfConsonant = this.halfConsonants[singleChar];
              if (halfConsonant) {
                result += halfConsonant;
                i++;
              } else {
                result += this.baseConsonants[singleChar];
                i++;
              }
            }
            matched = true;
          }
          // Check if next character is a vowel
          else if (nextChar && this.matras[nextChar]) {
            result += this.baseConsonants[singleChar] + this.matras[nextChar];
            i += 2;
            matched = true;
          }
          // Check if next two chars form a vowel
          else if (nextTwoChar && this.matras[nextTwoChar]) {
            result += this.baseConsonants[singleChar] + this.matras[nextTwoChar];
            i += 3;
            matched = true;
          }
          // Standalone consonant with inherent 'a'
          else {
            result += this.baseConsonants[singleChar];
            i++;
            matched = true;
          }
        }
        // Unknown character - preserve it
        else {
          result += singleChar;
          i++;
        }
      }
    }

    return result;
  }

  /**
   * Check if character is a consonant
   */
  private isConsonantChar(char: string): boolean {
    return char in this.baseConsonants || /^[kghcjtdnpbmyrlwvsh]$/i.test(char);
  }

  /**
   * Check if character is a vowel
   */
  private isVowelChar(char: string): boolean {
    return char in this.vowels || /^[aeiou]$/i.test(char);
  }

  /**
   * Convert a full sentence or text
   */
  convertText(text: string): string {
    if (!text || text.trim().length === 0) {
      return text;
    }

    // Split by spaces and punctuation
    const words = this.splitText(text);
    const convertedWords = words.map(word => {
      // Check if it's a word (contains letters)
      if (/[a-zA-Z]/.test(word)) {
        return this.convertWord(word);
      }
      // Preserve punctuation and spaces
      return word;
    });

    return convertedWords.join('');
  }

  /**
   * Split text into words while preserving punctuation
   */
  private splitText(text: string): string[] {
    const words: string[] = [];
    let currentWord = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      
      if (char === ' ' || /[.,!?;:()\[\]{}'"]/.test(char)) {
        if (currentWord) {
          words.push(currentWord);
          currentWord = '';
        }
        words.push(char);
      } else {
        currentWord += char;
      }
    }

    if (currentWord) {
      words.push(currentWord);
    }

    return words;
  }

  /**
   * Handle space key press - convert the word before cursor
   */
  handleSpaceKey(text: string, cursorPosition: number): { convertedText: string; newCursorPosition: number } {
    if (!this.config.autoConvertOnSpace) {
      return { convertedText: text, newCursorPosition: cursorPosition };
    }

    // Find the word before the cursor
    const beforeCursor = text.substring(0, cursorPosition);
    const afterCursor = text.substring(cursorPosition);

    // Extract the last word
    const lastWordMatch = beforeCursor.match(/(\w+)\s*$/);
    
    if (lastWordMatch) {
      const lastWord = lastWordMatch[1];
      const wordStart = beforeCursor.lastIndexOf(lastWord);
      const beforeWord = beforeCursor.substring(0, wordStart);
      const convertedWord = this.convertWord(lastWord);
      
      const newText = beforeWord + convertedWord + ' ' + afterCursor;
      const newCursorPos = beforeWord.length + convertedWord.length + 1;
      
      return { convertedText: newText, newCursorPosition: newCursorPos };
    }

    // If no word found, just add space
    return { convertedText: text + ' ', newCursorPosition: cursorPosition + 1 };
  }

  /**
   * Get current configuration
   */
  getConfig(): NepaliConverterConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<NepaliConverterConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
