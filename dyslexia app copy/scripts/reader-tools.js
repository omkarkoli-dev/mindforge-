/**
 * MINDFORGE - Reader Tools
 * Implements:
 * 1. Bionic Reading (bolding the first 40% of each word)
 * 2. Syllable Splitter (middle dots · into words with 7+ letters)
 * 3. Interactive Focus Reading Ruler (tracks mouse & touch Y-coordinates)
 * 4. Tap-to-Hinglish Visual Dictionary Popup (syllables, Hinglish, emoji, slow audio)
 */

(function (window, document) {
  'use strict';

  // State
  const state = {
    bionicActive: false,
    syllablesActive: false,
    rulerActive: false,
    currentWordList: [],
    activeDictWord: null
  };

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Common English prefixes and suffixes for algorithmic syllabification
  const PREFIXES = [
    'anti', 'auto', 'bio', 'chlor', 'circum', 'de', 'dis', 'extra', 'hyper', 'inter',
    'intra', 'micro', 'mid', 'multi', 'non', 'over', 'para', 'photo', 'poly', 'post',
    'pre', 'pro', 'pseudo', 'retro', 'semi', 'sub', 'super', 'tele', 'trans', 'ultra',
    'under', 'uni'
  ];

  const SUFFIXES = [
    'able', 'ible', 'action', 'al', 'ance', 'ence', 'ate', 'ation', 'dom', 'ed', 'en',
    'er', 'est', 'ful', 'hood', 'ic', 'ical', 'ing', 'ion', 'ish', 'ism', 'ist', 'ity',
    'ive', 'ize', 'less', 'logy', 'ly', 'ment', 'ness', 'ous', 'ship', 'sion', 'tion',
    'ty', 'ward', 'wise'
  ];

  /**
   * Helper: check if a character is a vowel
   */
  function isVowel(c) {
    return 'aeiouyAEIOUY'.indexOf(c) !== -1;
  }

  /**
   * Algorithmic Syllable Splitter for English words
   * Splits words into phonetic chunks using vowel-consonant boundary rules
   */
  function algorithmicSyllabify(word) {
    if (!word || word.length < 5) return [word];

    const clean = word.toLowerCase();
    const chunks = [];
    let remaining = word;
    let cleanRem = clean;

    // 1. Check known prefixes
    for (const p of PREFIXES) {
      if (cleanRem.startsWith(p) && cleanRem.length - p.length >= 3) {
        chunks.push(remaining.slice(0, p.length));
        remaining = remaining.slice(p.length);
        cleanRem = cleanRem.slice(p.length);
        break;
      }
    }

    // 2. Check known suffixes
    let suffixChunk = '';
    for (const s of SUFFIXES) {
      if (cleanRem.endsWith(s) && cleanRem.length - s.length >= 3) {
        suffixChunk = remaining.slice(remaining.length - s.length);
        remaining = remaining.slice(0, remaining.length - s.length);
        cleanRem = cleanRem.slice(0, cleanRem.length - s.length);
        break;
      }
    }

    // 3. Syllabify core root by vowel-consonant transitions
    if (remaining.length > 0) {
      let currentChunk = '';
      for (let i = 0; i < remaining.length; i++) {
        currentChunk += remaining[i];
        const nextChar = remaining[i + 1];
        const afterNext = remaining[i + 2];

        if (nextChar && afterNext) {
          const cCurrVowel = isVowel(remaining[i]);
          const cNextVowel = isVowel(nextChar);
          const cAfterVowel = isVowel(afterNext);

          // Double consonant split (e.g. rub-ber, let-ter, hap-py)
          if (!cCurrVowel && !cNextVowel && remaining[i].toLowerCase() === nextChar.toLowerCase()) {
            chunks.push(currentChunk);
            currentChunk = '';
          }
          // Vowel - Consonant - Vowel split (e.g. o-pen, ba-by)
          else if (cCurrVowel && !cNextVowel && cAfterVowel && currentChunk.length >= 2) {
            chunks.push(currentChunk);
            currentChunk = '';
          }
          // Consonant cluster split (e.g. cos-mic, sys-tem)
          else if (!cCurrVowel && !cNextVowel && cAfterVowel && currentChunk.length >= 3) {
            chunks.push(currentChunk);
            currentChunk = '';
          }
        }
      }
      if (currentChunk) {
        chunks.push(currentChunk);
      }
    }

    if (suffixChunk) {
      chunks.push(suffixChunk);
    }

    return chunks.length > 1 ? chunks : [word];
  }

  /**
   * Syllable Splitter: inserts middle dot '·' into words with 7+ letters
   * @param {string} rawWord 
   * @returns {string} word formatted with middle dots
   */
  function splitSyllables(rawWord) {
    if (!rawWord) return '';

    // Strip punctuation for checking
    const match = rawWord.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9'-]+)([^a-zA-Z0-9]*)$/);
    if (!match) return rawWord;

    const leadingPunct = match[1];
    const coreWord = match[2];
    const trailingPunct = match[3];

    // PLAN.md: Only split words with 7 or more letters
    if (coreWord.length < 7) {
      return rawWord;
    }

    const lower = coreWord.toLowerCase();

    // Check if word has pre-defined syllables in DEMO_DATA dictionary
    const dict = window.DemoData?.dictionary;
    if (dict && dict[lower] && dict[lower].syllables) {
      // e.g. "Pho · to · syn · the · sis" -> "Pho·to·syn·the·sis"
      const formatted = dict[lower].syllables.replace(/\s*·\s*/g, '·');
      return `${leadingPunct}${formatted}${trailingPunct}`;
    }

    // Algorithmic syllabification
    const chunks = algorithmicSyllabify(coreWord);
    if (chunks.length > 1) {
      return `${leadingPunct}${chunks.join('·')}${trailingPunct}`;
    }

    return rawWord;
  }

  /**
   * Bionic Reading: bold the first ~40% of characters in a word
   * Provides optical visual anchors for rapid saccadic eye movement
   * @param {string} rawWord 
   * @returns {string} HTML with first 40% bolded in <b class="bionic-lead">
   */
  function applyBionicToWord(rawWord) {
    if (!rawWord) return '';

    const match = rawWord.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9'·-]+)([^a-zA-Z0-9]*)$/);
    if (!match) return rawWord;

    const leadingPunct = match[1];
    const coreWord = match[2];
    const trailingPunct = match[3];

    // Filter out syllable dots when measuring length
    const letterCount = coreWord.replace(/·/g, '').length;
    if (letterCount <= 1) {
      return `<b class="bionic-lead">${leadingPunct}${coreWord}</b>${trailingPunct}`;
    }

    // First 40% formula: Math.ceil(len * 0.4)
    const boldLetterCount = letterCount <= 3 ? 1 : (letterCount <= 5 ? 2 : Math.ceil(letterCount * 0.4));

    let lettersSeen = 0;
    let splitIdx = 0;

    for (let i = 0; i < coreWord.length; i++) {
      if (coreWord[i] !== '·') {
        lettersSeen++;
      }
      if (lettersSeen === boldLetterCount) {
        splitIdx = i + 1;
        break;
      }
    }

    const boldPart = coreWord.slice(0, splitIdx);
    const restPart = coreWord.slice(splitIdx);

    return `${leadingPunct}<b class="bionic-lead">${boldPart}</b>${restPart}${trailingPunct}`;
  }

  /**
   * Transforms a single word according to active Bionic & Syllable toggles
   */
  function transformWord(rawWord, options = {}) {
    let result = rawWord;

    // Apply syllable split first if enabled
    if (options.syllables) {
      result = splitSyllables(result);
    }

    // Apply bionic reading if enabled
    if (options.bionic) {
      result = applyBionicToWord(result);
    }

    return result;
  }

  /**
   * Clean word helper for dictionary lookups
   */
  function getCleanWord(word) {
    return word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  /**
   * Format full text or paragraph into interactive span words
   * Each word has class `karaoke-word` and `reader-word`
   * with `data-word-index` and `data-clean-word`
   */
  function formatParagraphHtml(paragraphText, startingWordIndex = 0, options = {}) {
    if (!paragraphText) return { html: '', wordCount: 0, words: [] };

    const tokens = paragraphText.split(/(\s+)/);
    let wordIndex = startingWordIndex;
    const extractedWords = [];
    const htmlChunks = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      // Check if whitespace
      if (/^\s+$/.test(token)) {
        htmlChunks.push(token);
      } else if (token) {
        const clean = getCleanWord(token);
        extractedWords.push(token);

        const transformed = transformWord(token, options);
        htmlChunks.push(
          `<span class="karaoke-word reader-word" data-word-index="${wordIndex}" data-clean-word="${clean}" tabindex="0" role="button" aria-label="${clean}: Tap for Hinglish visual dictionary">${transformed}</span>`
        );
        wordIndex++;
      }
    }

    return {
      html: htmlChunks.join(''),
      wordCount: extractedWords.length,
      words: extractedWords
    };
  }

  /**
   * Tap-to-Hinglish Visual Dictionary Engine
   */
  const VisualDictionary = {
    modalEl: null,
    wordTitleEl: null,
    emojiEl: null,
    phoneticEl: null,
    syllablesWrapEl: null,
    hinglishTextEl: null,
    englishTextEl: null,
    exampleBoxEl: null,
    btnHearWordEl: null,
    btnCloseEl: null,

    init() {
      this.modalEl = document.getElementById('dictModal');
      this.wordTitleEl = document.getElementById('dictWordTitle');
      this.emojiEl = document.getElementById('dictEmoji');
      this.phoneticEl = document.getElementById('dictPhonetic');
      this.syllablesWrapEl = document.getElementById('dictSyllablesWrap');
      this.hinglishTextEl = document.getElementById('dictHinglishText');
      this.englishTextEl = document.getElementById('dictEnglishText');
      this.exampleBoxEl = document.getElementById('dictExampleBox');
      this.btnHearWordEl = document.getElementById('btnDictHearWord');
      this.btnCloseEl = document.getElementById('btnDictClose');

      if (this.btnCloseEl) {
        this.btnCloseEl.addEventListener('click', () => this.close());
      }

      if (this.btnHearWordEl) {
        this.btnHearWordEl.addEventListener('click', () => {
          if (state.activeDictWord && window.SpeechEngine) {
            window.SpeechEngine.speakWord(state.activeDictWord, { rate: 0.75 });
          }
        });
      }

      // Close on backdrop click
      if (this.modalEl) {
        this.modalEl.addEventListener('click', (e) => {
          if (e.target === this.modalEl) {
            this.close();
          }
        });
      }
    },

    open(rawWord) {
      if (!rawWord) return;
      const clean = getCleanWord(rawWord);
      if (!clean) return;

      state.activeDictWord = clean;
      const dictData = window.DemoData?.dictionary || {};
      const entry = dictData[clean];

      if (!this.modalEl) this.init();

      let displayWord = entry?.word || (rawWord.charAt(0).toUpperCase() + rawWord.slice(1).toLowerCase());
      let emoji = entry?.emoji || '💡';
      let phonetic = entry?.phonetic || clean;
      let syllablesStr = entry?.syllables || algorithmicSyllabify(clean).join(' · ');
      let hinglish = entry?.hinglish || `Yeh shabd textbook mein is concept ko samajhne ke liye mahatvapurna hai. Iska ucharan aur spelling chunks mein yaad karein.`;
      let english = entry?.simpleEnglish || `A key curriculum word in this lesson.`;
      let example = entry?.exampleSentence || `Understanding "${displayWord}" helps master this topic!`;

      // Populate elements
      if (this.wordTitleEl) this.wordTitleEl.textContent = displayWord;
      if (this.emojiEl) this.emojiEl.textContent = emoji;
      if (this.phoneticEl) this.phoneticEl.textContent = `🗣️ /${phonetic}/`;

      // Render Syllable Chunks
      if (this.syllablesWrapEl) {
        const syllableParts = syllablesStr.split(/\s*·\s*/);
        this.syllablesWrapEl.innerHTML = syllableParts
          .map(part => `<span class="dict-syllable-chunk">${escapeHtml(part)}</span>`)
          .join('<span style="color:var(--accent-blue);font-weight:700;">·</span>');
      }

      if (this.hinglishTextEl) this.hinglishTextEl.textContent = hinglish;
      if (this.englishTextEl) this.englishTextEl.textContent = english;
      if (this.exampleBoxEl) {
        this.exampleBoxEl.innerHTML = `<strong>Example:</strong> <em>"${escapeHtml(example)}"</em>`;
      }

      if (this.modalEl) {
        this.modalEl.classList.add('active');
        this.modalEl.setAttribute('aria-hidden', 'false');
      }
    },

    close() {
      if (this.modalEl) {
        this.modalEl.classList.remove('active');
        this.modalEl.setAttribute('aria-hidden', 'true');
      }
      state.activeDictWord = null;
    }
  };

  /**
   * Focus Reading Ruler Engine
   */
  const ReadingRuler = {
    overlayEl: null,
    topMaskEl: null,
    highlightBarEl: null,
    bottomMaskEl: null,
    barHeight: 52, // Optimal height for 1-2 lines of text

    init() {
      this.overlayEl = document.getElementById('readingRulerOverlay');
      this.topMaskEl = document.getElementById('rulerTopMask');
      this.highlightBarEl = document.getElementById('rulerHighlightBar');
      this.bottomMaskEl = document.getElementById('rulerBottomMask');

      window.addEventListener('mousemove', (e) => {
        if (!state.rulerActive) return;
        this.position(e.clientY);
      });

      window.addEventListener('touchmove', (e) => {
        if (!state.rulerActive || !e.touches[0]) return;
        this.position(e.touches[0].clientY);
      }, { passive: true });
    },

    toggle(force) {
      state.rulerActive = typeof force === 'boolean' ? force : !state.rulerActive;
      if (this.overlayEl) {
        if (state.rulerActive) {
          this.overlayEl.classList.add('active');
          this.position(window.innerHeight / 2);
        } else {
          this.overlayEl.classList.remove('active');
        }
      }
      return state.rulerActive;
    },

    position(clientY) {
      if (!this.topMaskEl || !this.highlightBarEl || !this.bottomMaskEl) return;
      const topHeight = Math.max(0, clientY - (this.barHeight / 2));
      const bottomHeight = Math.max(0, window.innerHeight - (clientY + this.barHeight / 2));

      this.topMaskEl.style.height = `${topHeight}px`;
      this.highlightBarEl.style.top = `${topHeight}px`;
      this.highlightBarEl.style.height = `${this.barHeight}px`;
      this.bottomMaskEl.style.height = `${bottomHeight}px`;
    },

    isActive() {
      return state.rulerActive;
    }
  };

  /**
   * Public ReaderTools API
   */
  const ReaderTools = {
    splitSyllables,
    applyBionicToWord,
    transformWord,
    formatParagraphHtml,

    // Toggles
    isBionicActive: () => state.bionicActive,
    setBionic: (active) => { state.bionicActive = Boolean(active); },
    toggleBionic: () => { state.bionicActive = !state.bionicActive; return state.bionicActive; },

    isSyllablesActive: () => state.syllablesActive,
    setSyllables: (active) => { state.syllablesActive = Boolean(active); },
    toggleSyllables: () => { state.syllablesActive = !state.syllablesActive; return state.syllablesActive; },

    // Ruler
    ruler: ReadingRuler,
    toggleRuler: (force) => ReadingRuler.toggle(force),
    isRulerActive: () => ReadingRuler.isActive(),

    // Visual Dictionary
    dictionary: VisualDictionary,
    openDictionary: (word) => VisualDictionary.open(word),
    closeDictionary: () => VisualDictionary.close(),

    /**
     * Attach interactive word events to a container (Click / Double Click / Keydown)
     */
    attachWordListeners(container) {
      if (!container) return;

      const handleWordAction = (target) => {
        const wordEl = target.closest('.reader-word');
        if (!wordEl) return;

        const cleanWord = wordEl.getAttribute('data-clean-word') || wordEl.textContent.trim();
        if (cleanWord) {
          VisualDictionary.open(cleanWord);
        }
      };

      // Click or double click to open Tap-to-Hinglish Visual Dictionary
      container.addEventListener('click', (e) => {
        handleWordAction(e.target);
      });

      container.addEventListener('dblclick', (e) => {
        handleWordAction(e.target);
      });

      container.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const wordEl = e.target.closest('.reader-word');
          if (wordEl) {
            e.preventDefault();
            handleWordAction(wordEl);
          }
        }
      });
    },

    init() {
      ReadingRuler.init();
      VisualDictionary.init();
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ReaderTools.init());
  } else {
    ReaderTools.init();
  }

  window.ReaderTools = ReaderTools;
})(window, document);
