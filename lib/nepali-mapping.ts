/**
 * Comprehensive Nepali transliteration mapping
 * Maps English/Roman characters to Nepali Unicode characters
 * Supports half letters (हालन्त) and complex consonant clusters
 */
export class NepaliMapping {
  // Halant (्) - used for half letters
  private static readonly HALANT = '्';

  // Vowels (स्वर) - standalone vowels
  private static readonly vowels: Record<string, string> = {
    'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'ii': 'ई',
    'u': 'उ', 'uu': 'ऊ', 'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
    'A': 'आ', 'I': 'ई', 'E': 'ए', 'O': 'ओ', 'U': 'ऊ'
  };

  // Base consonants (व्यञ्जन) - with inherent 'a' vowel
  private static readonly baseConsonants: Record<string, string> = {
    'k': 'क', 'kh': 'ख', 'g': 'ग', 'gh': 'घ', 'ng': 'ङ',
    'ch': 'च', 'chh': 'छ', 'j': 'ज', 'jh': 'झ', 'yn': 'ञ',
    't': 'त', 'th': 'थ', 'd': 'द', 'dh': 'ध', 'n': 'न',
    'T': 'ट', 'Th': 'ठ', 'D': 'ड', 'Dh': 'ढ', 'N': 'ण',
    'p': 'प', 'ph': 'फ', 'b': 'ब', 'bh': 'भ', 'm': 'म',
    'y': 'य', 'r': 'र', 'l': 'ल', 'w': 'व', 'v': 'व',
    'sh': 'श', 'Sh': 'ष', 's': 'स', 'h': 'ह'
  };

  // Half consonants (हालन्त) - consonants without inherent vowel
  private static readonly halfConsonants: Record<string, string> = {
    'k': 'क्', 'kh': 'ख्', 'g': 'ग्', 'gh': 'घ्', 'ng': 'ङ्',
    'ch': 'च्', 'chh': 'छ्', 'j': 'ज्', 'jh': 'झ्', 'yn': 'ञ्',
    't': 'त्', 'th': 'थ्', 'd': 'द्', 'dh': 'ध्', 'n': 'न्',
    'T': 'ट्', 'Th': 'ठ्', 'D': 'ड्', 'Dh': 'ढ्', 'N': 'ण्',
    'p': 'प्', 'ph': 'फ्', 'b': 'ब्', 'bh': 'भ्', 'm': 'म्',
    'y': 'य्', 'r': 'र्', 'l': 'ल्', 'w': 'व्', 'v': 'व्',
    'sh': 'श्', 'Sh': 'ष्', 's': 'स्', 'h': 'ह्'
  };

  // Matras (मात्रा) - vowel signs attached to consonants
  private static readonly matras: Record<string, string> = {
    'aa': 'ा', 'i': 'ि', 'ee': 'ी', 'ii': 'ी',
    'u': 'ु', 'uu': 'ू', 'e': 'े', 'ai': 'ै',
    'o': 'ो', 'au': 'ौ'
  };

  // Pre-defined consonant clusters (complex sounds)
  private static readonly consonantClusters: Record<string, string> = {
    // Common clusters
    'ksh': 'क्ष', 'ksha': 'क्ष', 'kshi': 'क्षि', 'kshu': 'क्षु', 'kshe': 'क्षे', 'ksho': 'क्षो',
    'tr': 'त्र', 'tra': 'त्र', 'tri': 'त्रि', 'tru': 'त्रु', 'tre': 'त्रे', 'tro': 'त्रो',
    'jny': 'ज्ञ', 'jnya': 'ज्ञ', 'jnyi': 'ज्ञि', 'jnyu': 'ज्ञु', 'jnye': 'ज्ञे', 'jnyo': 'ज्ञो',
    'kt': 'क्त', 'kta': 'क्त', 'kti': 'क्ति', 'ktu': 'क्तु', 'kte': 'क्ते', 'kto': 'क्तो',
    'st': 'स्त', 'sta': 'स्त', 'sti': 'स्ति', 'stu': 'स्तु', 'ste': 'स्ते', 'sto': 'स्तो',
    'str': 'स्त्र', 'stra': 'स्त्र', 'stri': 'स्त्रि', 'stru': 'स्त्रु', 'stre': 'स्त्रे', 'stro': 'स्त्रो',
    'nt': 'न्त', 'nta': 'न्त', 'nti': 'न्ति', 'ntu': 'न्तु', 'nte': 'न्ते', 'nto': 'न्तो',
    'nd': 'न्द', 'nda': 'न्द', 'ndi': 'न्दि', 'ndu': 'न्दु', 'nde': 'न्दे', 'ndo': 'न्दो',
    'mp': 'म्प', 'mpa': 'म्प', 'mpi': 'म्पि', 'mpu': 'म्पु', 'mpe': 'म्पे', 'mpo': 'म्पो',
    'mb': 'म्ब', 'mba': 'म्ब', 'mbi': 'म्बि', 'mbu': 'म्बु', 'mbe': 'म्बे', 'mbo': 'म्बो',
    'ng': 'ङ्ग', 'nga': 'ङ्ग', 'ngi': 'ङ्गि', 'ngu': 'ङ्गु', 'nge': 'ङ्गे', 'ngo': 'ङ्गो',
    'chh': 'छ', 'chha': 'छ', 'chhi': 'छि', 'chhu': 'छु', 'chhe': 'छे', 'chho': 'छो',
    'shch': 'श्च', 'shcha': 'श्च', 'shchi': 'श्चि', 'shchu': 'श्चु', 'shche': 'श्चे', 'shcho': 'श्चो',
    'shth': 'स्थ', 'shtha': 'स्थ', 'shthi': 'स्थि', 'shthu': 'स्थु', 'shthe': 'स्थे', 'shtho': 'स्थो',
    'shm': 'श्म', 'shma': 'श्म', 'shmi': 'श्मि', 'shmu': 'श्मु', 'shme': 'श्मे', 'shmo': 'श्मो',
    'shn': 'श्न', 'shna': 'श्न', 'shni': 'श्नि', 'shnu': 'श्नु', 'shne': 'श्ने', 'shno': 'श्नो',
    'shl': 'श्ल', 'shla': 'श्ल', 'shli': 'श्लि', 'shlu': 'श्लु', 'shle': 'श्ले', 'shlo': 'श्लो',
    'shv': 'श्व', 'shva': 'श्व', 'shvi': 'श्वि', 'shvu': 'श्वु', 'shve': 'श्वे', 'shvo': 'श्वो',
    'rth': 'र्थ', 'rtha': 'र्थ', 'rthi': 'र्थि', 'rthu': 'र्थु', 'rthe': 'र्थे', 'rtho': 'र्थो',
    'rdh': 'र्ध', 'rdha': 'र्ध', 'rdhi': 'र्धि', 'rdhu': 'र्धु', 'rdhe': 'र्धे', 'rdho': 'र्धो',
    'rsh': 'र्श', 'rsha': 'र्श', 'rshi': 'र्शि', 'rshu': 'र्शु', 'rshe': 'र्शे', 'rsho': 'र्शो',
    'rch': 'र्च', 'rcha': 'र्च', 'rchi': 'र्चि', 'rchu': 'र्चु', 'rche': 'र्चे', 'rcho': 'र्चो',
    'rgh': 'र्घ', 'rgha': 'र्घ', 'rghi': 'र्घि', 'rghu': 'र्घु', 'rghe': 'र्घे', 'rgho': 'र्घो',
    'rkh': 'र्ख', 'rkha': 'र्ख', 'rkhi': 'र्खि', 'rkhu': 'र्खु', 'rkhe': 'र्खे', 'rkho': 'र्खो',
    'rph': 'र्फ', 'rpha': 'र्फ', 'rphi': 'र्फि', 'rphu': 'र्फु', 'rphe': 'र्फे', 'rpho': 'र्फो',
    'rbh': 'र्भ', 'rbha': 'र्भ', 'rbhi': 'र्भि', 'rbhu': 'र्भु', 'rbhe': 'र्भे', 'rbho': 'र्भो',
    'rd': 'र्द', 'rda': 'र्द', 'rdi': 'र्दि', 'rdu': 'र्दु', 'rde': 'र्दे', 'rdo': 'र्दो',
    'rt': 'र्त', 'rta': 'र्त', 'rti': 'र्ति', 'rtu': 'र्तु', 'rte': 'र्ते', 'rto': 'र्तो',
    'rn': 'र्न', 'rna': 'र्न', 'rni': 'र्नि', 'rnu': 'र्नु', 'rne': 'र्ने', 'rno': 'र्नो',
    'rm': 'र्म', 'rma': 'र्म', 'rmi': 'र्मि', 'rmu': 'र्मु', 'rme': 'र्मे', 'rmo': 'र्मो',
    'rl': 'र्ल', 'rla': 'र्ल', 'rli': 'र्लि', 'rlu': 'र्लु', 'rle': 'र्ले', 'rlo': 'र्लो',
    'rv': 'र्व', 'rva': 'र्व', 'rvi': 'र्वि', 'rvu': 'र्वु', 'rve': 'र्वे', 'rvo': 'र्वो',
    'ry': 'र्य', 'rya': 'र्य', 'ryi': 'र्यि', 'ryu': 'र्यु', 'rye': 'र्ये', 'ryo': 'र्यो',
    'ly': 'ल्य', 'lya': 'ल्य', 'lyi': 'ल्यि', 'lyu': 'ल्यु', 'lye': 'ल्ये', 'lyo': 'ल्यो',
    'ny': 'न्य', 'nya': 'न्य', 'nyi': 'न्यि', 'nyu': 'न्यु', 'nye': 'न्ये', 'nyo': 'न्यो',
    'my': 'म्य', 'mya': 'म्य', 'myi': 'म्यि', 'myu': 'म्यु', 'mye': 'म्ये', 'myo': 'म्यो',
    'ty': 'त्य', 'tya': 'त्य', 'tyi': 'त्यि', 'tyu': 'त्यु', 'tye': 'त्ये', 'tyo': 'त्यो',
    'dy': 'द्य', 'dya': 'द्य', 'dyi': 'द्यि', 'dyu': 'द्यु', 'dye': 'द्ये', 'dyo': 'द्यो',
    'py': 'प्य', 'pya': 'प्य', 'pyi': 'प्यि', 'pyu': 'प्यु', 'pye': 'प्ये', 'pyo': 'प्यो',
    'by': 'ब्य', 'bya': 'ब्य', 'byi': 'ब्यि', 'byu': 'ब्यु', 'bye': 'ब्ये', 'byo': 'ब्यो',
    'ky': 'क्य', 'kya': 'क्य', 'kyi': 'क्यि', 'kyu': 'क्यु', 'kye': 'क्ये', 'kyo': 'क्यो',
    'gy': 'ग्य', 'gya': 'ग्य', 'gyi': 'ग्यि', 'gyu': 'ग्यु', 'gye': 'ग्ये', 'gyo': 'ग्यो',
    'hy': 'ह्य', 'hya': 'ह्य', 'hyi': 'ह्यि', 'hyu': 'ह्यु', 'hye': 'ह्ये', 'hyo': 'ह्यो',
    'sy': 'स्य', 'sya': 'स्य', 'syi': 'स्यि', 'syu': 'स्यु', 'sye': 'स्ये', 'syo': 'स्यो',
    'shy': 'श्य', 'shya': 'श्य', 'shyi': 'श्यि', 'shyu': 'श्यु', 'shye': 'श्ये', 'shyo': 'श्यो'
  };

  // Common words mapping for better accuracy
  private static readonly commonWords: Record<string, string> = {
    'mero': 'मेरो',
    'naam': 'नाम',
    'ram': 'राम',
    'ho': 'हो',
    'cha': 'छ',
    'huncha': 'हुन्छ',
    'hunchha': 'हुन्छ',
    'ma': 'म',
    'timro': 'तिम्रो',
    'hamro': 'हाम्रो',
    'tapainko': 'तपाईंको',
    'kasto': 'कस्तो',
    'kati': 'कति',
    'kaha': 'कहाँ',
    'kina': 'किन',
    'kinaa': 'किना',
    'kasari': 'कसरी',
    'ke': 'के',
    'ko': 'को',
    'ka': 'का',
    'ki': 'की',
    'ra': 'र',
    'ani': 'अनी',
    'tara': 'तर',
    'tyo': 'त्यो',
    'yo': 'यो',
    'uniharu': 'उनिहरू',
    'tiniharu': 'तिनिहरू',
    'yini': 'यिनी',
    'hami': 'हामी',
    'hajur': 'हजुर',
    'namaste': 'नमस्ते',
    'dhanyabad': 'धन्यवाद',
    'sukriya': 'सुक्रिया',
    'bholi': 'भोलि',
    'aaja': 'आज',
    'hijo': 'हिजो',
    'parsi': 'पर्सि',
    'bhaneko': 'भनेको',
    'bhancha': 'भन्छ',
    'garcha': 'गर्छ',
    'garchha': 'गर्छ',
    'hudaina': 'हुँदैन',
    'hudain': 'हुँदैन',
    'thiyo': 'थियो',
    'thiyen': 'थिएन',
    'hunchu': 'हुँछु',
    'hunchau': 'हुँछौ',
    'hunchan': 'हुँछन्',
    'garchu': 'गर्छु',
    'garchau': 'गर्छौ',
    'garchan': 'गर्छन्',
    'bhanchu': 'भन्छु',
    'bhanchau': 'भन्छौ',
    'bhanchan': 'भन्छन्'
  };

  /**
   * Get halant character
   */
  static getHalant(): string {
    return this.HALANT;
  }

  /**
   * Get the complete mapping dictionary
   */
  static getMapping(): Record<string, string> {
    return {
      ...this.vowels,
      ...this.baseConsonants,
      ...this.consonantClusters,
      ...this.commonWords
    };
  }

  /**
   * Get vowels mapping
   */
  static getVowels(): Record<string, string> {
    return this.vowels;
  }

  /**
   * Get base consonants mapping
   */
  static getBaseConsonants(): Record<string, string> {
    return this.baseConsonants;
  }

  /**
   * Get half consonants mapping
   */
  static getHalfConsonants(): Record<string, string> {
    return this.halfConsonants;
  }

  /**
   * Get matras mapping
   */
  static getMatras(): Record<string, string> {
    return this.matras;
  }

  /**
   * Get consonant clusters mapping
   */
  static getConsonantClusters(): Record<string, string> {
    return this.consonantClusters;
  }

  /**
   * Get common words mapping
   */
  static getCommonWords(): Record<string, string> {
    return this.commonWords;
  }

  /**
   * Check if a character is a vowel
   */
  static isVowel(char: string): boolean {
    return char in this.vowels;
  }

  /**
   * Check if a character sequence is a consonant
   */
  static isConsonant(seq: string): boolean {
    return seq in this.baseConsonants;
  }

  /**
   * Get base consonant (without halant)
   */
  static getBaseConsonant(consonant: string): string | null {
    return this.baseConsonants[consonant] || null;
  }

  /**
   * Get half consonant (with halant)
   */
  static getHalfConsonant(consonant: string): string | null {
    return this.halfConsonants[consonant] || null;
  }
}
