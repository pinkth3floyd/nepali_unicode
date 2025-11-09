#!/usr/bin/env python3
"""
Script to extract Nepali words and their transliterations from PDF files.
This can be used when you have direct access to the PDF file.
"""

import re
import sys
from pathlib import Path

def extract_nepali_words_from_text(text):
    """Extract all Nepali Unicode words from text."""
    # Nepali/Devanagari Unicode range: U+0900 to U+097F
    nepali_words = re.findall(r'[\u0900-\u097F]{2,}', text)
    return sorted(set(nepali_words))

def extract_transliteration_pairs(text):
    """Try to extract English-Nepali word pairs from dictionary format."""
    # Common dictionary patterns:
    # "word" : "नेपाली"
    # word - नेपाली
    # word = नेपाली
    patterns = [
        r'["\']([a-z]+)["\']\s*[:=]\s*["\']([\u0900-\u097F]+)["\']',
        r'([a-z]+)\s*[-=]\s*([\u0900-\u097F]+)',
        r'([a-z]+)\s+([\u0900-\u097F]+)',
    ]
    
    pairs = []
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        pairs.extend(matches)
    
    return pairs

def process_pdf(pdf_path):
    """Process PDF file and extract words."""
    try:
        # Try using pdftotext if available
        import subprocess
        result = subprocess.run(
            ['pdftotext', str(pdf_path), '-'],
            capture_output=True,
            text=True,
            encoding='utf-8',
            errors='ignore'
        )
        
        if result.returncode == 0:
            text = result.stdout
        else:
            print(f"Error: pdftotext failed. Trying alternative method...", file=sys.stderr)
            # Try PyPDF2 or pypdf
            try:
                import PyPDF2
                with open(pdf_path, 'rb') as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    text = ''
                    for page in pdf_reader.pages:
                        text += page.extract_text() + '\n'
            except ImportError:
                try:
                    import pypdf
                    with open(pdf_path, 'rb') as f:
                        pdf_reader = pypdf.PdfReader(f)
                        text = ''
                        for page in pdf_reader.pages:
                            text += page.extract_text() + '\n'
                except ImportError:
                    print("Error: Need pdftotext, PyPDF2, or pypdf to extract text", file=sys.stderr)
                    return None, None
    except Exception as e:
        print(f"Error processing PDF: {e}", file=sys.stderr)
        return None, None
    
    nepali_words = extract_nepali_words_from_text(text)
    translit_pairs = extract_transliteration_pairs(text)
    
    return nepali_words, translit_pairs

def generate_typescript_mapping(nepali_words, translit_pairs=None):
    """Generate TypeScript mapping code."""
    output = []
    output.append("    // Words extracted from PDF")
    
    # Use transliteration pairs if available
    if translit_pairs:
        for eng, nep in translit_pairs:
            output.append(f"    '{eng.lower()}': '{nep}',")
    else:
        # Generate basic transliterations (simplified)
        for nep in nepali_words:
            # Simple transliteration (this is a placeholder - real transliteration needs proper algorithm)
            translit = nep.lower().replace('ा', 'a').replace('ि', 'i').replace('ी', 'i')
            # This is very basic - in reality you'd need proper transliteration
            output.append(f"    // '{translit}': '{nep}',  // TODO: Add proper transliteration")
    
    return '\n'.join(output)

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 extract_pdf_words.py <pdf_file>")
        print("Example: python3 extract_pdf_words.py nepali_dictionary.pdf")
        sys.exit(1)
    
    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        print(f"Error: File not found: {pdf_path}", file=sys.stderr)
        sys.exit(1)
    
    print(f"Processing PDF: {pdf_path}", file=sys.stderr)
    nepali_words, translit_pairs = process_pdf(pdf_path)
    
    if nepali_words is None:
        sys.exit(1)
    
    print(f"Found {len(nepali_words)} unique Nepali words", file=sys.stderr)
    if translit_pairs:
        print(f"Found {len(translit_pairs)} transliteration pairs", file=sys.stderr)
    
    # Save words to file
    words_file = pdf_path.stem + '_words.txt'
    with open(words_file, 'w', encoding='utf-8') as f:
        for word in nepali_words:
            f.write(word + '\n')
    print(f"Saved words to: {words_file}", file=sys.stderr)
    
    # Generate TypeScript mapping
    ts_mapping = generate_typescript_mapping(nepali_words, translit_pairs)
    mapping_file = pdf_path.stem + '_mapping.txt'
    with open(mapping_file, 'w', encoding='utf-8') as f:
        f.write(ts_mapping)
    print(f"Saved TypeScript mapping to: {mapping_file}", file=sys.stderr)
    
    # Print sample
    print("\nSample words (first 20):", file=sys.stderr)
    for word in nepali_words[:20]:
        print(f"  {word}", file=sys.stderr)

if __name__ == '__main__':
    main()

