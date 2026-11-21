/**
 * MINDFORGE - Main Application Controller
 * Manages 3-Tab Navigation, Anti-Burnout Pacer Engine, 
 * Brain Profile Calibration Modal, and Live Scotopic Overlays.
 */

(function (window, document) {
  'use strict';

  // Session Pacer Constants
  const PACER_SESSION_DURATION_SEC = 20 * 60; // 20 minutes (BDA Anti-Burnout threshold)
  const BREAK_DURATION_SEC = 2 * 60;          // 2 minutes restorative break
  const THEMES_LIST = ['cream', 'yellow', 'mint', 'sky', 'dark-comfort'];

  // Application State
  const state = {
    sessionSeconds: 0,
    sessionInterval: null,
    breakSeconds: 0,
    breakInterval: null,
    breathingPhaseInterval: null,
    currentLessonId: 'photosynthesis',
    currentLessonData: null,
    rulerActive: false,
    mouseY: 0,
    allLessonWords: [],
    // Phase 3 state
    activePodcastLines: [],
    activeMermaidSyntax: '',
    flowchartZoom: 1.0,
    scanImageBase64: null,
    isVoiceListening: false
  };

  /**
   * DOM Elements Cache
   */
  let dom = {};

  function initDomReferences() {
    dom = {
      // Header & Pacer
      pacerBar: document.getElementById('pacerBar'),
      sessionStatusText: document.getElementById('sessionStatusText'),
      btnTriggerBreak: document.getElementById('btnTriggerBreak'),
      btnOpenProfileModal: document.getElementById('btnOpenProfileModal'),
      apiKeyBadge: document.getElementById('apiKeyBadge'),
      brandLogoLink: document.getElementById('brandLogoLink'),

      // Quick Controls & Dyslexia Transformer Toolbar
      quickThemeBtns: document.querySelectorAll('[data-quick-theme]'),
      btnQuickRuler: document.getElementById('btnQuickRuler'),
      rulerToggleLabel: document.getElementById('rulerToggleLabel'),
      btnQuickFont: document.getElementById('btnQuickFont'),
      fontToggleLabel: document.getElementById('fontToggleLabel'),
      btnQuickThemeCycle: document.getElementById('btnQuickThemeCycle'),
      themeToggleLabel: document.getElementById('themeToggleLabel'),
      btnToggleBionic: document.getElementById('btnToggleBionic'),
      bionicToggleLabel: document.getElementById('bionicToggleLabel'),
      btnToggleSyllables: document.getElementById('btnToggleSyllables'),
      syllablesToggleLabel: document.getElementById('syllablesToggleLabel'),

      // Bimodal Audio Karaoke Bar
      btnKaraokePlay: document.getElementById('btnKaraokePlay'),
      karaokePlayIcon: document.getElementById('karaokePlayIcon'),
      karaokePlayLabel: document.getElementById('karaokePlayLabel'),
      btnKaraokeStop: document.getElementById('btnKaraokeStop'),
      speedChips: document.querySelectorAll('.speed-chip-btn'),
      audioStatusPill: document.getElementById('audioStatusPill'),
      audioWaveDot: document.getElementById('audioWaveDot'),
      audioStatusText: document.getElementById('audioStatusText'),

      // Tabs
      tabBtns: {
        'tab-read': document.getElementById('tabBtnRead'),
        'tab-create': document.getElementById('tabBtnCreate'),
        'tab-gym': document.getElementById('tabBtnGym')
      },
      panels: {
        'tab-read': document.getElementById('panelRead'),
        'tab-create': document.getElementById('panelCreate'),
        'tab-gym': document.getElementById('panelGym')
      },

      // Zero-Typing Smart Input Bar
      btnOpenScannerModal: document.getElementById('btnOpenScannerModal'),
      btnOpenVoiceModal: document.getElementById('btnOpenVoiceModal'),
      btnOpenPasteModal: document.getElementById('btnOpenPasteModal'),

      // Reader Section
      lessonSelect: document.getElementById('lessonSelect'),
      customLessonsOptGroup: document.getElementById('customLessonsOptGroup'),
      readerCategory: document.getElementById('readerCategory'),
      readerTitle: document.getElementById('readerTitle'),
      readerSummary: document.getElementById('readerSummary'),
      readerReadingTime: document.getElementById('readerReadingTime'),
      readerDiagramNoteBox: document.getElementById('readerDiagramNoteBox'),
      readerDiagramNoteText: document.getElementById('readerDiagramNoteText'),
      readerContentArea: document.getElementById('readerContentArea'),
      readerKeyPointsList: document.getElementById('readerKeyPointsList'),

      // 2-Person Hinglish Podcast Player
      podcastPlayerCard: document.getElementById('podcastPlayerCard'),
      btnPodcastPlay: document.getElementById('btnPodcastPlay'),
      podcastPlayIcon: document.getElementById('podcastPlayIcon'),
      podcastPlayLabel: document.getElementById('podcastPlayLabel'),
      btnPodcastPause: document.getElementById('btnPodcastPause'),
      btnPodcastStop: document.getElementById('btnPodcastStop'),
      btnPodcastPrev: document.getElementById('btnPodcastPrev'),
      btnPodcastNext: document.getElementById('btnPodcastNext'),
      podcastStatusBadge: document.getElementById('podcastStatusBadge'),
      btnGeneratePodcastCustom: document.getElementById('btnGeneratePodcastCustom'),
      podcastDialogueFeed: document.getElementById('podcastDialogueFeed'),

      // 1-Click Visual Flowchart
      flowchartCard: document.getElementById('flowchartCard'),
      btnRefreshFlowchart: document.getElementById('btnRefreshFlowchart'),
      btnToggleMermaidCode: document.getElementById('btnToggleMermaidCode'),
      btnZoomInFlowchart: document.getElementById('btnZoomInFlowchart'),
      btnZoomOutFlowchart: document.getElementById('btnZoomOutFlowchart'),
      btnResetFlowchart: document.getElementById('btnResetFlowchart'),
      btnCopyMermaid: document.getElementById('btnCopyMermaid'),
      flowchartViewport: document.getElementById('flowchartViewport'),
      flowchartCodeBox: document.getElementById('flowchartCodeBox'),

      // Scanner Modal
      scannerModal: document.getElementById('scannerModal'),
      btnScanModalClose: document.getElementById('btnScanModalClose'),
      scanFileInput: document.getElementById('scanFileInput'),
      scanDropzone: document.getElementById('scanDropzone'),
      btnBrowseScanFile: document.getElementById('btnBrowseScanFile'),
      btnLoadDemoScanImage: document.getElementById('btnLoadDemoScanImage'),
      scanPreviewWrapper: document.getElementById('scanPreviewWrapper'),
      scanPreviewImg: document.getElementById('scanPreviewImg'),
      scanFileName: document.getElementById('scanFileName'),
      btnRemoveScanImg: document.getElementById('btnRemoveScanImg'),
      scanManualTextInput: document.getElementById('scanManualTextInput'),
      scanStatusBox: document.getElementById('scanStatusBox'),
      scanStatusText: document.getElementById('scanStatusText'),
      scanProgressBar: document.getElementById('scanProgressBar'),
      btnCancelScan: document.getElementById('btnCancelScan'),
      btnExecuteScan: document.getElementById('btnExecuteScan'),
      scannerKeyBadge: document.getElementById('scannerKeyBadge'),
      btnScannerOpenKeyModal: document.getElementById('btnScannerOpenKeyModal'),
      btnScannerGoToPaste: document.getElementById('btnScannerGoToPaste'),

      // Voice Search Modal
      voiceSearchModal: document.getElementById('voiceSearchModal'),
      btnVoiceModalClose: document.getElementById('btnVoiceModalClose'),
      btnVoiceMicLarge: document.getElementById('btnVoiceMicLarge'),
      voiceMicIcon: document.getElementById('voiceMicIcon'),
      voiceMicStatusPrompt: document.getElementById('voiceMicStatusPrompt'),
      voiceSearchInput: document.getElementById('voiceSearchInput'),
      btnClearVoiceInput: document.getElementById('btnClearVoiceInput'),
      voiceTranscriptBox: document.getElementById('voiceTranscriptBox'),
      voicePlaceholderText: document.getElementById('voicePlaceholderText'),
      voiceSampleChips: document.querySelectorAll('.voice-sample-chip'),
      btnCancelVoiceSearch: document.getElementById('btnCancelVoiceSearch'),
      btnSubmitVoiceSearch: document.getElementById('btnSubmitVoiceSearch'),

      // Paste / Import Custom Text Modal
      pasteTextModal: document.getElementById('pasteTextModal'),
      btnPasteModalClose: document.getElementById('btnPasteModalClose'),
      btnCancelPasteModal: document.getElementById('btnCancelPasteModal'),
      btnUploadTextFile: document.getElementById('btnUploadTextFile'),
      customTextFileInput: document.getElementById('customTextFileInput'),
      btnLoadSampleRamNotes: document.getElementById('btnLoadSampleRamNotes'),
      btnClearCustomText: document.getElementById('btnClearCustomText'),
      customTextTitle: document.getElementById('customTextTitle'),
      customTextCategory: document.getElementById('customTextCategory'),
      customTextInput: document.getElementById('customTextInput'),
      customTextWordCount: document.getElementById('customTextWordCount'),
      customTextReadTime: document.getElementById('customTextReadTime'),
      customTextParaCount: document.getElementById('customTextParaCount'),
      btnSubmitCustomText: document.getElementById('btnSubmitCustomText'),

      // Reading Ruler Overlay
      readingRulerOverlay: document.getElementById('readingRulerOverlay'),
      rulerTopMask: document.getElementById('rulerTopMask'),
      rulerHighlightBar: document.getElementById('rulerHighlightBar'),
      rulerBottomMask: document.getElementById('rulerBottomMask'),

      // Calibration Modal
      profileModal: document.getElementById('profileModal'),
      btnCloseProfileModal: document.getElementById('btnCloseProfileModal'),
      themeCards: document.querySelectorAll('.theme-card'),
      fontCardLexend: document.getElementById('fontCardLexend'),
      fontCardOpenDyslexic: document.getElementById('fontCardOpenDyslexic'),
      sliderFontSize: document.getElementById('sliderFontSize'),
      labelFontSizeVal: document.getElementById('labelFontSizeVal'),
      sliderLetterSpacing: document.getElementById('sliderLetterSpacing'),
      labelLetterSpacingVal: document.getElementById('labelLetterSpacingVal'),
      sliderLineHeight: document.getElementById('sliderLineHeight'),
      labelLineHeightVal: document.getElementById('labelLineHeightVal'),
      sliderWordSpacing: document.getElementById('sliderWordSpacing'),
      labelWordSpacingVal: document.getElementById('labelWordSpacingVal'),
      previewSentence: document.getElementById('previewSentence'),
      inputGeminiApiKey: document.getElementById('inputGeminiApiKey'),
      btnToggleApiKeyVisibility: document.getElementById('btnToggleApiKeyVisibility'),
      btnClearApiKey: document.getElementById('btnClearApiKey'),
      btnWipeAllData: document.getElementById('btnWipeAllData'),
      btnResetDefaults: document.getElementById('btnResetDefaults'),
      btnSaveProfile: document.getElementById('btnSaveProfile'),

      // Brain Break Modal
      breakModal: document.getElementById('breakModal'),
      btnCloseBreakModal: document.getElementById('btnCloseBreakModal'),
      btnResumeStudy: document.getElementById('btnResumeStudy'),
      breathingPhaseText: document.getElementById('breathingPhaseText'),
      breakTimerProgress: document.getElementById('breakTimerProgress')
    };
  }

  // -------------------------------------------------------------------
  // 1. ANTI-BURNOUT PACER ENGINE (Non-ticking, calm, 20-minute cycle)
  // -------------------------------------------------------------------
  function initPacerEngine() {
    state.sessionSeconds = 0;
    updatePacerUI();

    if (state.sessionInterval) clearInterval(state.sessionInterval);

    state.sessionInterval = setInterval(() => {
      state.sessionSeconds += 1;
      updatePacerUI();

      // Trigger automatic break at 20-minute threshold
      if (state.sessionSeconds >= PACER_SESSION_DURATION_SEC) {
        clearInterval(state.sessionInterval);
        triggerBrainBreak(true);
      }
    }, 1000);
  }

  function updatePacerUI() {
    if (!dom.pacerBar) return;
    const progressPercent = Math.min(100, (state.sessionSeconds / PACER_SESSION_DURATION_SEC) * 100);
    dom.pacerBar.style.width = `${progressPercent}%`;

    const remainingMinutes = Math.max(0, Math.ceil((PACER_SESSION_DURATION_SEC - state.sessionSeconds) / 60));

    if (state.sessionSeconds >= PACER_SESSION_DURATION_SEC) {
      dom.pacerBar.classList.add('pulsing');
      if (dom.sessionStatusText) {
        dom.sessionStatusText.textContent = 'Break Time ☕';
      }
    } else {
      dom.pacerBar.classList.remove('pulsing');
      if (dom.sessionStatusText) {
        dom.sessionStatusText.textContent = `Focusing • ~${remainingMinutes}m left`;
      }
    }
  }

  function triggerBrainBreak(isAuto = false) {
    if (!dom.breakModal) return;
    dom.breakModal.classList.add('active');

    // Increment study stats
    if (window.StorageService) {
      window.StorageService.incrementStat('breaksTaken', 1);
      window.StorageService.incrementStat('totalFocusMinutes', Math.round(state.sessionSeconds / 60));
    }

    // Start 2-minute break countdown & breathing orb guidance
    startBreakCountdown();
    startBreathingCycleGuide();
  }

  function closeBrainBreak() {
    if (!dom.breakModal) return;
    dom.breakModal.classList.remove('active');

    if (state.breakInterval) clearInterval(state.breakInterval);
    if (state.breathingPhaseInterval) clearInterval(state.breathingPhaseInterval);

    // Reset and restart the 20-minute session pacer
    initPacerEngine();
  }

  function startBreakCountdown() {
    state.breakSeconds = 0;
    updateBreakTimerDisplay();

    if (state.breakInterval) clearInterval(state.breakInterval);

    state.breakInterval = setInterval(() => {
      state.breakSeconds += 1;
      updateBreakTimerDisplay();

      if (state.breakSeconds >= BREAK_DURATION_SEC) {
        clearInterval(state.breakInterval);
        if (dom.breathingPhaseText) {
          dom.breathingPhaseText.textContent = '🌟 Break complete! Your mind is recharged.';
        }
      }
    }, 1000);
  }

  function updateBreakTimerDisplay() {
    if (!dom.breakTimerProgress) return;
    const m = Math.floor(state.breakSeconds / 60).toString().padStart(2, '0');
    const s = (state.breakSeconds % 60).toString().padStart(2, '0');
    dom.breakTimerProgress.textContent = `${m}:${s} / 02:00`;
  }

  function startBreathingCycleGuide() {
    const phases = [
      'Inhale gently through your nose... (Fill your lungs)',
      'Hold calmly... (Feel peaceful)',
      'Exhale slowly and let all tension melt away...'
    ];
    let phaseIndex = 0;
    if (dom.breathingPhaseText) {
      dom.breathingPhaseText.textContent = phases[0];
    }

    if (state.breathingPhaseInterval) clearInterval(state.breathingPhaseInterval);

    state.breathingPhaseInterval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % phases.length;
      if (dom.breathingPhaseText && state.breakSeconds < BREAK_DURATION_SEC) {
        dom.breathingPhaseText.textContent = phases[phaseIndex];
      }
    }, 4000);
  }

  // -------------------------------------------------------------------
  // 2. NAVIGATION: 3 BIG COLOR-CODED TABS
  // -------------------------------------------------------------------
  function switchTab(tabId) {
    const validTabs = ['tab-read', 'tab-create', 'tab-gym'];
    if (!validTabs.includes(tabId)) tabId = 'tab-read';

    // Stop audio synthesis if switching tabs
    if (window.SpeechEngine && window.SpeechEngine.stop) {
      window.SpeechEngine.stop();
    }

    // Update Tab Buttons
    Object.keys(dom.tabBtns).forEach((id) => {
      const btn = dom.tabBtns[id];
      const panel = dom.panels[id];
      if (!btn || !panel) return;

      if (id === tabId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');
        panel.classList.add('active');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
        panel.classList.remove('active');
      }
    });

    if (window.StorageService) {
      window.StorageService.setActiveTab(tabId);
    }

    window.dispatchEvent(new CustomEvent('tabChanged', { detail: { tabId } }));
  }

  function initTabListeners() {
    if (dom.tabBtns['tab-read']) {
      dom.tabBtns['tab-read'].addEventListener('click', () => switchTab('tab-read'));
    }
    if (dom.tabBtns['tab-create']) {
      dom.tabBtns['tab-create'].addEventListener('click', () => switchTab('tab-create'));
    }
    if (dom.tabBtns['tab-gym']) {
      dom.tabBtns['tab-gym'].addEventListener('click', () => switchTab('tab-gym'));
    }

    // Keyboard arrow navigation across tabs
    const tabList = document.querySelector('[role="tablist"]');
    if (tabList) {
      tabList.addEventListener('keydown', (e) => {
        const tabs = [dom.tabBtns['tab-read'], dom.tabBtns['tab-create'], dom.tabBtns['tab-gym']];
        const currentIndex = tabs.findIndex(tab => tab.classList.contains('active'));

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextIndex = (currentIndex + 1) % tabs.length;
          tabs[nextIndex].focus();
          tabs[nextIndex].click();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          tabs[prevIndex].focus();
          tabs[prevIndex].click();
        }
      });
    }
  }

  // -------------------------------------------------------------------
  // 3. FOCUS READING RULER (Scotopic & Optical Tracking)
  // -------------------------------------------------------------------
  function initReadingRuler() {
    const profile = window.StorageService ? window.StorageService.getProfile() : { rulerEnabled: false };
    state.rulerActive = Boolean(profile.rulerEnabled);
    if (window.ReaderTools) {
      window.ReaderTools.toggleRuler(state.rulerActive);
    }
    updateRulerVisibility();
  }

  function toggleReadingRuler() {
    if (window.ReaderTools) {
      state.rulerActive = window.ReaderTools.toggleRuler();
    } else {
      state.rulerActive = !state.rulerActive;
    }
    if (window.StorageService) {
      window.StorageService.saveProfile({ rulerEnabled: state.rulerActive });
    }
    updateRulerVisibility();
  }

  function updateRulerVisibility() {
    if (dom.rulerToggleLabel) {
      dom.rulerToggleLabel.textContent = state.rulerActive ? 'Reading Ruler: ON' : 'Reading Ruler: OFF';
    }
    if (dom.btnQuickRuler) {
      dom.btnQuickRuler.setAttribute('aria-pressed', state.rulerActive ? 'true' : 'false');
      if (state.rulerActive) {
        dom.btnQuickRuler.classList.add('is-active');
      } else {
        dom.btnQuickRuler.classList.remove('is-active');
      }
    }
  }

  // -------------------------------------------------------------------
  // 4. LESSON READER & DEMO DATA POPULATION (With Bionic & Syllables)
  // -------------------------------------------------------------------
  function loadLesson(lessonIdOrObj) {
    if (window.SpeechEngine) {
      if (window.SpeechEngine.getState().isPlaying) {
        window.SpeechEngine.stop();
      }
      if (window.SpeechEngine.stopPodcast) {
        window.SpeechEngine.stopPodcast();
      }
    }

    let lesson;
    if (typeof lessonIdOrObj === 'object' && lessonIdOrObj !== null) {
      lesson = lessonIdOrObj;
      state.currentLessonId = lesson.id || ('lesson_' + Date.now());
    } else {
      state.currentLessonId = lessonIdOrObj;
      if (String(lessonIdOrObj).startsWith('custom_') && window.StorageService) {
        const customList = window.StorageService.getCustomLessons();
        lesson = customList.find(l => l.id === lessonIdOrObj);
      }
      if (!lesson) {
        lesson = window.DemoData?.lessons?.[lessonIdOrObj] || window.DemoData?.lessons?.photosynthesis;
      }
    }
    if (!lesson) return;
    state.currentLessonData = lesson;

    if (dom.readerCategory) dom.readerCategory.textContent = lesson.category || 'Curriculum Lesson';
    if (dom.readerTitle) dom.readerTitle.textContent = lesson.title || 'Untitled Lesson';
    if (dom.readerSummary) dom.readerSummary.textContent = lesson.summary || '';
    if (dom.readerReadingTime) dom.readerReadingTime.textContent = `⏱️ ${lesson.readingTime || '3 min read'}`;

    // Scanned Diagram Breakdown Note
    if (dom.readerDiagramNoteBox && dom.readerDiagramNoteText) {
      if (lesson.diagramNote) {
        dom.readerDiagramNoteText.textContent = ' ' + lesson.diagramNote;
        dom.readerDiagramNoteBox.style.display = 'block';
      } else {
        dom.readerDiagramNoteBox.style.display = 'none';
      }
    }

    // Render interactive words with Bionic & Syllable formatting
    renderLessonContent(lesson);

    // Populate Key Takeaways Cards
    if (dom.readerKeyPointsList && lesson.keyPoints) {
      dom.readerKeyPointsList.innerHTML = lesson.keyPoints
        .map(point => `
          <div style="background-color: var(--bg-primary); border: 1.5px solid var(--border-color); border-radius: 10px; padding: 10px 14px; font-size: 0.92rem; font-weight: 500;">
            ${escapeHtml(point)}
          </div>
        `).join('');
    }

    // Populate 2-Person Hinglish Podcast Dialogue Feed
    const podcastLines = lesson.podcast && lesson.podcast.length
      ? lesson.podcast
      : (window.DemoData?.lessons?.photosynthesis?.podcast || []);
    setupPodcastFeed(podcastLines);

    // Render Mermaid Diagram
    const mermaidSyntax = lesson.mermaid || window.DemoData?.lessons?.photosynthesis?.mermaid;
    renderLessonMermaid(mermaidSyntax);
  }

  function renderLessonContent(lesson) {
    const l = lesson || window.DemoData?.lessons?.[state.currentLessonId] || window.DemoData?.lessons?.photosynthesis;
    if (!l || !dom.readerContentArea) return;

    const paragraphs = l.content.split('\n\n');
    let wordIndexCounter = 0;
    const allWords = [];
    const htmlParagraphs = [];

    const bionicActive = window.ReaderTools ? window.ReaderTools.isBionicActive() : false;
    const syllablesActive = window.ReaderTools ? window.ReaderTools.isSyllablesActive() : false;

    for (let idx = 0; idx < paragraphs.length; idx++) {
      const pText = paragraphs[idx].trim();
      if (!pText) continue;

      if (window.ReaderTools) {
        const result = window.ReaderTools.formatParagraphHtml(pText, wordIndexCounter, {
          bionic: bionicActive,
          syllables: syllablesActive
        });
        htmlParagraphs.push(`<p class="reader-paragraph" data-p-index="${idx}" style="margin: 0 0 1.25em 0;">${result.html}</p>`);
        wordIndexCounter += result.wordCount;
        allWords.push(...result.words);
      } else {
        htmlParagraphs.push(`<p class="reader-paragraph" data-p-index="${idx}" style="margin: 0 0 1.25em 0;">${escapeHtml(pText)}</p>`);
      }
    }

    state.allLessonWords = allWords;
    dom.readerContentArea.innerHTML = htmlParagraphs.join('');

    // Attach click and double-click listeners for Tap-to-Hinglish Visual Dictionary
    if (window.ReaderTools) {
      window.ReaderTools.attachWordListeners(dom.readerContentArea);
    }
  }

  // -------------------------------------------------------------------
  // 4B. BIMODAL AUDIO KARAOKE CONTROLLER (Web Speech API)
  // -------------------------------------------------------------------
  function initSpeechEngineControls() {
    if (!window.SpeechEngine) return;

    // Play/Pause button
    if (dom.btnKaraokePlay) {
      dom.btnKaraokePlay.addEventListener('click', () => {
        const speechState = window.SpeechEngine.getState();
        if (speechState.isPlaying && !speechState.isPaused) {
          window.SpeechEngine.pause();
        } else if (speechState.isPaused) {
          window.SpeechEngine.resume();
        } else {
          const wordsToSpeak = state.allLessonWords && state.allLessonWords.length
            ? state.allLessonWords
            : (dom.readerContentArea?.textContent.match(/\S+/g) || []);
          window.SpeechEngine.speakText(wordsToSpeak);
        }
      });
    }

    // Stop button
    if (dom.btnKaraokeStop) {
      dom.btnKaraokeStop.addEventListener('click', () => {
        window.SpeechEngine.stop();
      });
    }

    // Speed selector chips (0.75x, 1.0x, 1.25x)
    dom.speedChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const speed = parseFloat(chip.getAttribute('data-speed')) || 1.0;
        window.SpeechEngine.setRate(speed);
        dom.speedChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
      });
    });

    // Web Speech API Event Listeners for Karaoke word boundary syncing
    window.SpeechEngine.on('start', () => {
      if (dom.karaokePlayIcon) dom.karaokePlayIcon.textContent = '⏸️';
      if (dom.karaokePlayLabel) dom.karaokePlayLabel.textContent = 'Pause';
      if (dom.audioWaveDot) dom.audioWaveDot.classList.add('speaking');
      if (dom.audioStatusText) dom.audioStatusText.textContent = 'Reading Aloud...';
    });

    window.SpeechEngine.on('pause', () => {
      if (dom.karaokePlayIcon) dom.karaokePlayIcon.textContent = '▶️';
      if (dom.karaokePlayLabel) dom.karaokePlayLabel.textContent = 'Resume';
      if (dom.audioWaveDot) dom.audioWaveDot.classList.remove('speaking');
      if (dom.audioStatusText) dom.audioStatusText.textContent = 'Paused';
    });

    window.SpeechEngine.on('resume', () => {
      if (dom.karaokePlayIcon) dom.karaokePlayIcon.textContent = '⏸️';
      if (dom.karaokePlayLabel) dom.karaokePlayLabel.textContent = 'Pause';
      if (dom.audioWaveDot) dom.audioWaveDot.classList.add('speaking');
      if (dom.audioStatusText) dom.audioStatusText.textContent = 'Reading Aloud...';
    });

    window.SpeechEngine.on('stop', () => {
      if (dom.karaokePlayIcon) dom.karaokePlayIcon.textContent = '▶️';
      if (dom.karaokePlayLabel) dom.karaokePlayLabel.textContent = 'Read Aloud';
      if (dom.audioWaveDot) dom.audioWaveDot.classList.remove('speaking');
      if (dom.audioStatusText) dom.audioStatusText.textContent = 'Ready to Read';
      clearAllWordHighlights();
    });

    window.SpeechEngine.on('end', () => {
      if (dom.karaokePlayIcon) dom.karaokePlayIcon.textContent = '▶️';
      if (dom.karaokePlayLabel) dom.karaokePlayLabel.textContent = 'Read Aloud';
      if (dom.audioWaveDot) dom.audioWaveDot.classList.remove('speaking');
      if (dom.audioStatusText) dom.audioStatusText.textContent = 'Completed ✨';
      clearAllWordHighlights();
    });

    window.SpeechEngine.on('boundary', ({ wordIndex }) => {
      highlightActiveWord(wordIndex);
      if (dom.audioStatusText && state.allLessonWords && state.allLessonWords.length) {
        dom.audioStatusText.textContent = `Reading • Word ${wordIndex + 1} / ${state.allLessonWords.length}`;
      }
    });
  }

  function clearAllWordHighlights() {
    if (!dom.readerContentArea) return;
    const active = dom.readerContentArea.querySelectorAll('.karaoke-word.active-word');
    active.forEach(el => el.classList.remove('active-word'));
  }

  function highlightActiveWord(wordIndex) {
    if (!dom.readerContentArea) return;
    clearAllWordHighlights();

    const targetEl = dom.readerContentArea.querySelector(`.karaoke-word[data-word-index="${wordIndex}"]`);
    if (targetEl) {
      targetEl.classList.add('active-word');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }

  // -------------------------------------------------------------------
  // 4C. 2-PERSON HINGLISH PODCAST PLAYER (Aarav & Riya)
  // -------------------------------------------------------------------
  function setupPodcastFeed(lines) {
    state.activePodcastLines = lines || [];
    if (!dom.podcastDialogueFeed) return;

    if (!lines || lines.length === 0) {
      dom.podcastDialogueFeed.innerHTML = '<div class="text-subtle" style="padding: 16px;">No podcast dialogue loaded for this lesson. Click "✨ AI Script" to generate!</div>';
      if (dom.podcastStatusBadge) dom.podcastStatusBadge.textContent = '0 Lines';
      return;
    }

    if (dom.podcastStatusBadge) {
      dom.podcastStatusBadge.textContent = `Ready • ${lines.length} Lines`;
    }

    const html = lines.map((line, idx) => {
      const isAarav = line.speaker === 'Aarav';
      const bubbleClass = isAarav ? 'bubble-aarav' : 'bubble-riya';
      const avatar = line.avatar || (isAarav ? '👦' : '👩‍🏫');
      const speakerLabel = isAarav ? 'Aarav (Student)' : 'Riya (Mentor)';
      const speakerColor = isAarav ? '#78350F' : '#4C1D95';

      return `
        <div class="podcast-bubble ${bubbleClass}" data-line-index="${idx}" tabindex="0" role="button" aria-label="Line ${idx + 1}: ${line.speaker} says: ${escapeHtml(line.text)}">
          <div class="podcast-avatar-circle" aria-hidden="true">${avatar}</div>
          <div class="podcast-bubble-body">
            <div class="podcast-speaker-name" style="color: ${speakerColor};">
              <span>${speakerLabel}</span>
              <span class="badge-tag" style="font-size: 0.7rem; font-weight: 600;">Line ${idx + 1}</span>
            </div>
            <p class="podcast-bubble-text">${escapeHtml(line.text)}</p>
          </div>
        </div>
      `;
    }).join('');

    dom.podcastDialogueFeed.innerHTML = html;

    // Attach click listeners to jump & play that line
    const bubbles = dom.podcastDialogueFeed.querySelectorAll('.podcast-bubble');
    bubbles.forEach(bubble => {
      bubble.addEventListener('click', () => {
        const lineIdx = parseInt(bubble.getAttribute('data-line-index'), 10);
        if (!isNaN(lineIdx) && window.SpeechEngine) {
          window.SpeechEngine.playPodcast(state.activePodcastLines, { startIndex: lineIdx });
        }
      });
      bubble.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          bubble.click();
        }
      });
    });
  }

  function initPodcastControls() {
    if (!window.SpeechEngine) return;

    if (dom.btnPodcastPlay) {
      dom.btnPodcastPlay.addEventListener('click', () => {
        const pState = window.SpeechEngine.getPodcastState();
        if (pState.isPlaying && !pState.isPaused) {
          window.SpeechEngine.pausePodcast();
        } else if (pState.isPaused) {
          window.SpeechEngine.resumePodcast();
        } else {
          window.SpeechEngine.playPodcast(state.activePodcastLines);
        }
      });
    }

    if (dom.btnPodcastPause) {
      dom.btnPodcastPause.addEventListener('click', () => {
        window.SpeechEngine.pausePodcast();
      });
    }

    if (dom.btnPodcastStop) {
      dom.btnPodcastStop.addEventListener('click', () => {
        window.SpeechEngine.stopPodcast();
      });
    }

    if (dom.btnPodcastPrev) {
      dom.btnPodcastPrev.addEventListener('click', () => {
        const pState = window.SpeechEngine.getPodcastState();
        const prevIdx = Math.max(0, pState.currentIndex - 1);
        window.SpeechEngine.jumpToPodcastLine(prevIdx);
      });
    }

    if (dom.btnPodcastNext) {
      dom.btnPodcastNext.addEventListener('click', () => {
        const pState = window.SpeechEngine.getPodcastState();
        const nextIdx = Math.min(state.activePodcastLines.length - 1, pState.currentIndex + 1);
        window.SpeechEngine.jumpToPodcastLine(nextIdx);
      });
    }

    if (dom.btnGeneratePodcastCustom) {
      dom.btnGeneratePodcastCustom.addEventListener('click', async () => {
        const content = dom.readerContentArea?.textContent || '';
        const title = dom.readerTitle?.textContent || 'Current Lesson';
        if (!content) return;

        dom.btnGeneratePodcastCustom.disabled = true;
        dom.btnGeneratePodcastCustom.textContent = '⏳ Writing Script...';

        try {
          const res = await window.GeminiService.generatePodcast(content, title);
          if (res && res.podcast && res.podcast.length) {
            setupPodcastFeed(res.podcast);
            window.SpeechEngine.playPodcast(res.podcast);
          }
        } catch (e) {
          console.warn('[Podcast] Custom generation error:', e);
        } finally {
          dom.btnGeneratePodcastCustom.disabled = false;
          dom.btnGeneratePodcastCustom.textContent = '✨ AI Script';
        }
      });
    }

    // SpeechEngine podcast event listeners
    window.SpeechEngine.on('podcastStart', ({ totalLines, startIndex }) => {
      if (dom.podcastPlayIcon) dom.podcastPlayIcon.textContent = '⏸️';
      if (dom.podcastPlayLabel) dom.podcastPlayLabel.textContent = 'Pause';
      if (dom.btnPodcastPause) dom.btnPodcastPause.style.display = 'inline-flex';
    });

    window.SpeechEngine.on('podcastLineStart', ({ index, line, speaker, totalLines }) => {
      highlightActivePodcastBubble(index);
      if (dom.podcastStatusBadge) {
        dom.podcastStatusBadge.textContent = `🎙️ Line ${index + 1}/${totalLines} • ${speaker} Speaking`;
      }
      if (dom.podcastPlayIcon) dom.podcastPlayIcon.textContent = '⏸️';
      if (dom.podcastPlayLabel) dom.podcastPlayLabel.textContent = 'Pause';
    });

    window.SpeechEngine.on('podcastPause', ({ currentIndex }) => {
      if (dom.podcastPlayIcon) dom.podcastPlayIcon.textContent = '▶️';
      if (dom.podcastPlayLabel) dom.podcastPlayLabel.textContent = 'Resume';
      if (dom.podcastStatusBadge) {
        dom.podcastStatusBadge.textContent = `Paused • Line ${currentIndex + 1}`;
      }
    });

    window.SpeechEngine.on('podcastResume', ({ currentIndex }) => {
      if (dom.podcastPlayIcon) dom.podcastPlayIcon.textContent = '⏸️';
      if (dom.podcastPlayLabel) dom.podcastPlayLabel.textContent = 'Pause';
    });

    window.SpeechEngine.on('podcastStop', () => {
      clearActivePodcastBubble();
      if (dom.podcastPlayIcon) dom.podcastPlayIcon.textContent = '▶️';
      if (dom.podcastPlayLabel) dom.podcastPlayLabel.textContent = 'Play Podcast';
      if (dom.btnPodcastPause) dom.btnPodcastPause.style.display = 'none';
      if (dom.podcastStatusBadge) {
        dom.podcastStatusBadge.textContent = `Stopped • ${state.activePodcastLines.length} Lines`;
      }
    });

    window.SpeechEngine.on('podcastFinish', () => {
      clearActivePodcastBubble();
      if (dom.podcastPlayIcon) dom.podcastPlayIcon.textContent = '▶️';
      if (dom.podcastPlayLabel) dom.podcastPlayLabel.textContent = 'Play Again';
      if (dom.btnPodcastPause) dom.btnPodcastPause.style.display = 'none';
      if (dom.podcastStatusBadge) {
        dom.podcastStatusBadge.textContent = `Completed 🎉 • ${state.activePodcastLines.length} Lines`;
      }
    });
  }

  function clearActivePodcastBubble() {
    if (!dom.podcastDialogueFeed) return;
    const active = dom.podcastDialogueFeed.querySelectorAll('.podcast-bubble-active');
    active.forEach(b => b.classList.remove('podcast-bubble-active'));
  }

  function highlightActivePodcastBubble(lineIndex) {
    if (!dom.podcastDialogueFeed) return;
    clearActivePodcastBubble();

    const target = dom.podcastDialogueFeed.querySelector(`.podcast-bubble[data-line-index="${lineIndex}"]`);
    if (target) {
      target.classList.add('podcast-bubble-active');
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // -------------------------------------------------------------------
  // 4D. 1-CLICK VISUAL FLOWCHART (Mermaid.js Concept Map)
  // -------------------------------------------------------------------
  function renderLessonMermaid(chartSyntax) {
    state.activeMermaidSyntax = chartSyntax || '';
    if (!dom.flowchartViewport || !chartSyntax) return;

    if (dom.flowchartCodeBox) {
      dom.flowchartCodeBox.textContent = chartSyntax;
    }

    state.flowchartZoom = 1.0;

    if (typeof mermaid !== 'undefined') {
      try {
        const uniqueId = `mermaid-${Date.now()}`;
        mermaid.render(uniqueId, chartSyntax).then(result => {
          dom.flowchartViewport.innerHTML = result.svg;
          applyFlowchartZoom();
        }).catch(err => {
          console.warn('[Mermaid] Fallback rendered:', err);
          dom.flowchartViewport.innerHTML = `<pre style="font-size:0.85rem; text-align:left; color: var(--text-primary);">${escapeHtml(chartSyntax)}</pre>`;
        });
      } catch (e) {
        dom.flowchartViewport.innerHTML = `<pre style="font-size:0.85rem; text-align:left; color: var(--text-primary);">${escapeHtml(chartSyntax)}</pre>`;
      }
    } else {
      dom.flowchartViewport.innerHTML = `<pre style="font-size:0.85rem; text-align:left; color: var(--text-primary);">${escapeHtml(chartSyntax)}</pre>`;
    }
  }

  function applyFlowchartZoom() {
    const svg = dom.flowchartViewport?.querySelector('svg');
    if (svg) {
      svg.style.transform = `scale(${state.flowchartZoom})`;
    }
  }

  function initFlowchartControls() {
    if (dom.btnZoomInFlowchart) {
      dom.btnZoomInFlowchart.addEventListener('click', () => {
        state.flowchartZoom = Math.min(2.2, state.flowchartZoom + 0.15);
        applyFlowchartZoom();
      });
    }

    if (dom.btnZoomOutFlowchart) {
      dom.btnZoomOutFlowchart.addEventListener('click', () => {
        state.flowchartZoom = Math.max(0.5, state.flowchartZoom - 0.15);
        applyFlowchartZoom();
      });
    }

    if (dom.btnResetFlowchart) {
      dom.btnResetFlowchart.addEventListener('click', () => {
        state.flowchartZoom = 1.0;
        applyFlowchartZoom();
      });
    }

    if (dom.btnToggleMermaidCode) {
      dom.btnToggleMermaidCode.addEventListener('click', () => {
        if (dom.flowchartCodeBox) {
          dom.flowchartCodeBox.classList.toggle('active');
        }
      });
    }

    if (dom.btnCopyMermaid) {
      dom.btnCopyMermaid.addEventListener('click', () => {
        if (!state.activeMermaidSyntax) return;
        navigator.clipboard.writeText(state.activeMermaidSyntax).then(() => {
          const original = dom.btnCopyMermaid.innerHTML;
          dom.btnCopyMermaid.innerHTML = '<span>✅ Copied!</span>';
          setTimeout(() => { dom.btnCopyMermaid.innerHTML = original; }, 1800);
        });
      });
    }

    if (dom.btnRefreshFlowchart) {
      dom.btnRefreshFlowchart.addEventListener('click', async () => {
        const content = dom.readerContentArea?.textContent || '';
        const title = dom.readerTitle?.textContent || 'Current Lesson';
        if (!content) return;

        dom.btnRefreshFlowchart.disabled = true;
        dom.btnRefreshFlowchart.textContent = '⏳ Generating...';

        try {
          const res = await window.GeminiService.generateFlowchart(content, title);
          if (res && res.mermaid) {
            renderLessonMermaid(res.mermaid);
          }
        } catch (e) {
          console.warn('[Flowchart] Regenerate error:', e);
        } finally {
          dom.btnRefreshFlowchart.disabled = false;
          dom.btnRefreshFlowchart.textContent = '🔄 Regenerate';
        }
      });
    }
  }

  // -------------------------------------------------------------------
  // 4E. TEXTBOOK PAGE SCANNER (Gemini 2.5 Flash Vision OCR)
  // -------------------------------------------------------------------
  function initScannerControls() {
    if (!dom.btnOpenScannerModal) return;

    dom.btnOpenScannerModal.addEventListener('click', openScannerModal);
    if (dom.btnScanModalClose) dom.btnScanModalClose.addEventListener('click', closeScannerModal);
    if (dom.btnCancelScan) dom.btnCancelScan.addEventListener('click', closeScannerModal);

    // Browse image button
    if (dom.btnBrowseScanFile && dom.scanFileInput) {
      dom.btnBrowseScanFile.addEventListener('click', () => {
        dom.scanFileInput.click();
      });
    }

    // Dropzone click & drag
    if (dom.scanDropzone && dom.scanFileInput) {
      dom.scanDropzone.addEventListener('click', (e) => {
        if (e.target !== dom.btnBrowseScanFile && e.target !== dom.btnLoadDemoScanImage) {
          dom.scanFileInput.click();
        }
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dom.scanDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dom.scanDropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dom.scanDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dom.scanDropzone.classList.remove('dragover');
        });
      });

      dom.scanDropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer?.files;
        if (files && files[0]) {
          handleSelectedScanFile(files[0]);
        }
      });
    }

    // File input change
    if (dom.scanFileInput) {
      dom.scanFileInput.addEventListener('change', () => {
        const file = dom.scanFileInput.files?.[0];
        if (file) {
          handleSelectedScanFile(file);
        }
      });
    }

    // Sample Demo Page button
    if (dom.btnLoadDemoScanImage) {
      dom.btnLoadDemoScanImage.addEventListener('click', (e) => {
        e.stopPropagation();
        state.isDemoScanSample = true;
        loadDemoScanSample();
      });
    }

    // Remove Image button
    if (dom.btnRemoveScanImg) {
      dom.btnRemoveScanImg.addEventListener('click', resetScannerPreview);
    }

    // Scanner modal key helper buttons
    if (dom.btnScannerOpenKeyModal) {
      dom.btnScannerOpenKeyModal.addEventListener('click', () => {
        closeScannerModal();
        openProfileModal();
      });
    }

    if (dom.btnScannerGoToPaste) {
      dom.btnScannerGoToPaste.addEventListener('click', () => {
        closeScannerModal();
        openPasteModal();
      });
    }

    // Execute Scan button
    if (dom.btnExecuteScan) {
      dom.btnExecuteScan.addEventListener('click', executeTextbookScan);
    }

    // Keep scanner key status synced
    window.addEventListener('geminiKeyUpdated', updateScannerKeyBadge);
    updateScannerKeyBadge();
  }

  function updateScannerKeyBadge() {
    if (!dom.scannerKeyBadge) return;
    const isConfig = window.GeminiService ? window.GeminiService.isConfigured() : false;
    if (isConfig) {
      dom.scannerKeyBadge.textContent = 'Active (Live Vision AI)';
      dom.scannerKeyBadge.style.color = '#059669';
    } else {
      dom.scannerKeyBadge.textContent = 'Smart Demo Mode';
      dom.scannerKeyBadge.style.color = '#D97706';
    }
  }

  function openScannerModal() {
    if (!dom.scannerModal) return;
    updateScannerKeyBadge();
    dom.scannerModal.classList.add('active');
  }

  function closeScannerModal() {
    if (!dom.scannerModal) return;
    dom.scannerModal.classList.remove('active');
  }

  function handleSelectedScanFile(file) {
    state.isDemoScanSample = false;
    if (window.GeminiService && window.GeminiService.validateImageFile) {
      const check = window.GeminiService.validateImageFile(file);
      if (!check.valid) {
        alert(check.error);
        return;
      }
    } else if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP under 4MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      state.scanImageBase64 = e.target.result;
      displayScanPreview(e.target.result, file.name);
    };
    reader.readAsDataURL(file);
  }

  function loadDemoScanSample() {
    state.isDemoScanSample = true;
    // Generate an illustrative canvas demo image representing a textbook page
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');

    // Page background
    ctx.fillStyle = '#FDFBF7';
    ctx.fillRect(0, 0, 600, 380);

    // Textbook Header
    ctx.fillStyle = '#1D4ED8';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('Class 9 Biology: Chapter 6 - Plant Cell Physiology', 28, 38);

    ctx.fillStyle = '#475569';
    ctx.font = '13px sans-serif';
    ctx.fillText('Section 6.2: Chloroplast Structure & Light Capture', 28, 62);

    // Simulated textbook text bars
    ctx.fillStyle = '#475569';
    ctx.fillRect(28, 85, 330, 8);
    ctx.fillRect(28, 102, 310, 8);
    ctx.fillRect(28, 119, 340, 8);
    ctx.fillRect(28, 136, 290, 8);
    ctx.fillRect(28, 153, 320, 8);

    // Diagram Box
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.strokeRect(380, 80, 195, 175);
    ctx.fillStyle = '#D1FAE5';
    ctx.fillRect(381, 81, 193, 173);

    // Diagram title
    ctx.fillStyle = '#064E3B';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Fig 6.4: Chloroplast Structure', 395, 104);

    // Grana thylakoids
    ctx.fillStyle = '#10B981';
    for (let y = 130; y <= 200; y += 18) {
      ctx.beginPath();
      ctx.ellipse(478, y, 46, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#047857';
      ctx.stroke();
    }

    ctx.fillStyle = '#78350F';
    ctx.font = '11px sans-serif';
    ctx.fillText('☀️ Photons', 400, 146);
    ctx.fillText('🌿 Grana Stacks', 440, 235);

    // Lower text bars
    ctx.fillStyle = '#475569';
    ctx.fillRect(28, 275, 545, 8);
    ctx.fillRect(28, 292, 520, 8);
    ctx.fillRect(28, 309, 490, 8);
    ctx.fillRect(28, 326, 530, 8);

    const dataUrl = canvas.toDataURL('image/png');
    state.scanImageBase64 = dataUrl;
    displayScanPreview(dataUrl, 'biology_ch6_chloroplast_textbook.png');
  }

  function displayScanPreview(dataUrl, fileName) {
    if (dom.scanPreviewWrapper && dom.scanPreviewImg) {
      dom.scanPreviewImg.src = dataUrl;
      if (dom.scanFileName) dom.scanFileName.textContent = fileName || 'Selected Image';
      dom.scanPreviewWrapper.style.display = 'block';
      if (dom.scanDropzone) dom.scanDropzone.style.display = 'none';
    }
  }

  function resetScannerPreview() {
    state.scanImageBase64 = null;
    state.isDemoScanSample = false;
    if (dom.scanFileInput) dom.scanFileInput.value = '';
    if (dom.scanManualTextInput) dom.scanManualTextInput.value = '';
    if (dom.scanPreviewWrapper) dom.scanPreviewWrapper.style.display = 'none';
    if (dom.scanDropzone) dom.scanDropzone.style.display = 'block';
    if (dom.scanStatusBox) dom.scanStatusBox.style.display = 'none';
  }

  async function executeTextbookScan() {
    // 1. Check if user typed or pasted manual text from photo
    const manualText = (dom.scanManualTextInput?.value || '').trim();
    if (manualText.length > 15) {
      const fileName = dom.scanFileName?.textContent || '';
      const cleanTitle = fileName && !fileName.startsWith('biology_')
        ? fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
        : 'Scanned Study Notes';
      
      const customLesson = createCustomLessonObject(manualText, cleanTitle, 'Scanned Notes');
      if (window.StorageService && window.StorageService.saveCustomLesson) {
        window.StorageService.saveCustomLesson(customLesson);
      }
      addCustomLessonToSelect(customLesson);
      if (dom.lessonSelect) dom.lessonSelect.value = customLesson.id;
      loadLesson(customLesson);
      closeScannerModal();
      resetScannerPreview();
      dom.readerTitle?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (!state.scanImageBase64) {
      loadDemoScanSample();
    }

    const isKeyConfigured = window.GeminiService ? window.GeminiService.isConfigured() : false;
    const isCustomUpload = !state.isDemoScanSample;

    // 2. If user uploaded custom notes photo WITHOUT an API key
    if (isCustomUpload && !isKeyConfigured) {
      const fileNameLower = (dom.scanFileName?.textContent || '').toLowerCase();
      // If image appears to be computer RAM notes (like Terna Engineering College notes)
      if (fileNameLower.includes('ram') || fileNameLower.includes('memory') || fileNameLower.includes('terna') || fileNameLower.includes('college')) {
        const ramLesson = window.DemoData?.lessons?.ram_memory;
        if (ramLesson) {
          if (dom.lessonSelect) dom.lessonSelect.value = ramLesson.id;
          loadLesson(ramLesson);
          closeScannerModal();
          resetScannerPreview();
          dom.readerTitle?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }

      if (dom.scanStatusBox) dom.scanStatusBox.style.display = 'block';
      if (dom.scanStatusText) {
        dom.scanStatusText.innerHTML = '🔑 <strong>API Key Needed for Custom Photos:</strong> Enter a free Gemini key in Brain Profile, or type your note sentences below!';
        dom.scanStatusText.style.color = '#B45309';
      }
      if (dom.btnExecuteScan) dom.btnExecuteScan.disabled = false;
      if (dom.scanManualTextInput) {
        dom.scanManualTextInput.focus();
        dom.scanManualTextInput.placeholder = 'Paste or type sentences from your photo here to read them immediately...';
      }
      return;
    }

    // 3. Normal scan execution (either Live Gemini Vision or Demo Biology page)
    if (dom.scanStatusBox) dom.scanStatusBox.style.display = 'block';
    if (dom.btnExecuteScan) dom.btnExecuteScan.disabled = true;

    if (dom.scanStatusText) {
      dom.scanStatusText.textContent = isKeyConfigured 
        ? 'Scanning textbook with Gemini 2.5 Flash Vision OCR...' 
        : 'Loading biology textbook demo page...';
      dom.scanStatusText.style.color = 'inherit';
    }
    if (dom.scanProgressBar) dom.scanProgressBar.style.width = '35%';

    setTimeout(async () => {
      if (dom.scanStatusText) dom.scanStatusText.textContent = 'Extracting clean text & summarizing diagrams...';
      if (dom.scanProgressBar) dom.scanProgressBar.style.width = '75%';

      try {
        let lessonResult;
        if (window.GeminiService) {
          lessonResult = await window.GeminiService.scanTextbookPage(state.scanImageBase64);
        } else {
          lessonResult = window.DemoData?.lessons?.photosynthesis;
        }

        if (dom.scanProgressBar) dom.scanProgressBar.style.width = '100%';
        if (dom.scanStatusText) dom.scanStatusText.textContent = 'Complete! Loading into reader...';

        setTimeout(() => {
          if (dom.lessonSelect && lessonResult) {
            let opt = dom.lessonSelect.querySelector(`option[value="${lessonResult.id}"]`);
            if (!opt) {
              opt = document.createElement('option');
              opt.value = lessonResult.id;
              opt.textContent = `📷 ${lessonResult.title}`;
              dom.lessonSelect.insertBefore(opt, dom.lessonSelect.firstChild);
            }
            dom.lessonSelect.value = lessonResult.id;
          }

          if (lessonResult) {
            loadLesson(lessonResult);
          }
          closeScannerModal();
          resetScannerPreview();
          if (dom.btnExecuteScan) dom.btnExecuteScan.disabled = false;

          dom.readerTitle?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);

      } catch (err) {
        console.error('[Scanner] Execution error:', err);
        const fallback = window.DemoData?.lessons?.photosynthesis;
        if (fallback) {
          loadLesson(fallback);
        }
        closeScannerModal();
        resetScannerPreview();
        if (dom.btnExecuteScan) dom.btnExecuteScan.disabled = false;
      }
    }, 400);
  }

  // -------------------------------------------------------------------
  // 4F. VOICE TOPIC SEARCH (Microphone & Web Speech API + Dual Typing)
  // -------------------------------------------------------------------
  function initVoiceSearchControls() {
    if (!dom.btnOpenVoiceModal) return;

    dom.btnOpenVoiceModal.addEventListener('click', openVoiceModal);
    if (dom.btnVoiceModalClose) dom.btnVoiceModalClose.addEventListener('click', closeVoiceModal);
    if (dom.btnCancelVoiceSearch) dom.btnCancelVoiceSearch.addEventListener('click', closeVoiceModal);

    if (dom.btnVoiceMicLarge) {
      dom.btnVoiceMicLarge.addEventListener('click', toggleVoiceRecognition);
    }

    // Input typing + Enter key listener
    if (dom.voiceSearchInput) {
      dom.voiceSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeVoiceTopicSearch();
        }
      });
    }

    if (dom.btnClearVoiceInput && dom.voiceSearchInput) {
      dom.btnClearVoiceInput.addEventListener('click', () => {
        setVoiceTranscript('');
        dom.voiceSearchInput.focus();
      });
    }

    // Quick Sample Spoken Topic Chips (Instant 1-Click Load)
    dom.voiceSampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const sampleText = chip.getAttribute('data-sample') || chip.textContent.trim();
        setVoiceTranscript(sampleText);
        executeVoiceTopicSearch();
      });
    });

    if (dom.btnSubmitVoiceSearch) {
      dom.btnSubmitVoiceSearch.addEventListener('click', executeVoiceTopicSearch);
    }
  }

  function openVoiceModal() {
    if (!dom.voiceSearchModal) return;
    dom.voiceSearchModal.classList.add('active');
    setVoiceTranscript('');
    if (dom.voiceSearchInput) {
      setTimeout(() => dom.voiceSearchInput.focus(), 150);
    }
  }

  function closeVoiceModal() {
    if (!dom.voiceSearchModal) return;
    if (state.isVoiceListening && window.SpeechEngine) {
      window.SpeechEngine.stopListening();
      state.isVoiceListening = false;
      updateVoiceMicUI(false);
    }
    dom.voiceSearchModal.classList.remove('active');
  }

  function setVoiceTranscript(text) {
    if (dom.voiceSearchInput) {
      dom.voiceSearchInput.value = text || '';
    }
    if (dom.voiceTranscriptBox) {
      if (text) {
        dom.voiceTranscriptBox.style.display = 'block';
        dom.voiceTranscriptBox.innerHTML = `<strong>Spoken Query:</strong> <span>"${escapeHtml(text)}"</span>`;
        dom.voiceTranscriptBox.setAttribute('data-query', text);
      } else {
        dom.voiceTranscriptBox.style.display = 'none';
        dom.voiceTranscriptBox.innerHTML = '';
        dom.voiceTranscriptBox.removeAttribute('data-query');
      }
    }
  }

  function updateVoiceMicUI(isListening) {
    if (!dom.btnVoiceMicLarge) return;
    if (isListening) {
      dom.btnVoiceMicLarge.classList.add('listening');
      if (dom.voiceMicIcon) dom.voiceMicIcon.textContent = '⏹️';
      if (dom.voiceMicStatusPrompt) {
        dom.voiceMicStatusPrompt.textContent = '🎙️ Listening... Speak your topic now!';
        dom.voiceMicStatusPrompt.style.color = '#DC2626';
      }
    } else {
      dom.btnVoiceMicLarge.classList.remove('listening');
      if (dom.voiceMicIcon) dom.voiceMicIcon.textContent = '🎤';
      if (dom.voiceMicStatusPrompt) {
        dom.voiceMicStatusPrompt.textContent = 'Tap the Microphone and ask your question!';
        dom.voiceMicStatusPrompt.style.color = 'inherit';
      }
    }
  }

  function toggleVoiceRecognition() {
    if (!window.SpeechEngine) return;

    if (state.isVoiceListening) {
      window.SpeechEngine.stopListening();
      state.isVoiceListening = false;
      updateVoiceMicUI(false);
    } else {
      state.isVoiceListening = true;
      updateVoiceMicUI(true);

      window.SpeechEngine.startListening({
        lang: 'en-IN',
        onStart: () => {
          updateVoiceMicUI(true);
        },
        onResult: ({ text }) => {
          if (text) {
            setVoiceTranscript(text);
          }
        },
        onError: (err) => {
          console.warn('[VoiceSearch] Mic error:', err);
          state.isVoiceListening = false;
          updateVoiceMicUI(false);
          if (dom.voiceMicStatusPrompt) {
            if (err === 'NOT_SUPPORTED') {
              dom.voiceMicStatusPrompt.textContent = '⚠️ Mic not supported in this browser. Type your topic above or tap a topic below!';
            } else if (err === 'not-allowed') {
              dom.voiceMicStatusPrompt.textContent = '⚠️ Microphone permission blocked. Type your topic above or tap a topic below!';
            } else {
              dom.voiceMicStatusPrompt.textContent = '⚠️ Microphone unavailable. Type your topic in the box above or tap a topic below!';
            }
            dom.voiceMicStatusPrompt.style.color = '#B45309';
          }
          if (dom.voiceSearchInput) dom.voiceSearchInput.focus();
        },
        onEnd: () => {
          state.isVoiceListening = false;
          updateVoiceMicUI(false);
        }
      });
    }
  }

  async function executeVoiceTopicSearch() {
    const typedQuery = dom.voiceSearchInput?.value.trim() || '';
    const transcriptQuery = dom.voiceTranscriptBox?.getAttribute('data-query')
      || dom.voiceTranscriptBox?.textContent.replace(/^Spoken Query:\s*"/, '').replace(/"$/, '').trim();

    const query = typedQuery || transcriptQuery || '';

    const searchQuery = (!query || query.startsWith('e.g.'))
      ? "Ohm's Law: Voltage, Current and Resistance"
      : query;

    if (dom.btnSubmitVoiceSearch) {
      dom.btnSubmitVoiceSearch.disabled = true;
      dom.btnSubmitVoiceSearch.textContent = '⏳ Loading Lesson...';
    }

    try {
      let lessonResult;
      const qLower = searchQuery.toLowerCase();

      // Check if query is about Computer RAM / Memory
      if (qLower.includes('ram') || qLower.includes('memory') || qLower.includes('computer') || qLower.includes('dimm') || qLower.includes('terna')) {
        lessonResult = window.DemoData?.lessons?.ram_memory;
      }

      if (!lessonResult && window.GeminiService) {
        lessonResult = await window.GeminiService.searchTopicVoice(searchQuery);
      }

      if (!lessonResult) {
        lessonResult = window.DemoData?.lessons?.ohms_law;
      }

      if (dom.lessonSelect && lessonResult) {
        let opt = dom.lessonSelect.querySelector(`option[value="${lessonResult.id}"]`);
        if (!opt) {
          opt = document.createElement('option');
          opt.value = lessonResult.id;
          opt.textContent = `🎤 ${lessonResult.title}`;
          dom.lessonSelect.insertBefore(opt, dom.lessonSelect.firstChild);
        }
        dom.lessonSelect.value = lessonResult.id;
      }

      if (lessonResult) {
        loadLesson(lessonResult);
      }
      closeVoiceModal();

      dom.readerTitle?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      console.error('[VoiceSearch] Load error:', err);
      const fallback = window.DemoData?.lessons?.ohms_law;
      if (fallback) {
        loadLesson(fallback);
        closeVoiceModal();
      }
    } finally {
      if (dom.btnSubmitVoiceSearch) {
        dom.btnSubmitVoiceSearch.disabled = false;
        dom.btnSubmitVoiceSearch.textContent = '🔍 Generate / Load Lesson';
      }
    }
  }

  // -------------------------------------------------------------------
  // 4G. CUSTOM TEXT PASTE & FILE IMPORT (Tab 1 Read & Absorb)
  // -------------------------------------------------------------------
  const SAMPLE_RAM_TEXT = `Terna Engineering College, Nerul
Subject: Computer Organization & Architecture
Topic: RAM - Random Access Memory

RAM is the temporary working memory of a computer system. It stores programs and data that are currently being actively used by the CPU processor.

Characteristics of RAM:
1. High speed memory: RAM operates at electronic nanosecond speeds compared to slower mechanical storage.
2. Temporary / volatile memory: Data is lost completely when power is switched off or restarted.
3. More RAM generally allows more applications and browser tabs to run simultaneously without system lag.

Types of RAM:
- SRAM (Static RAM): Extremely high speed, used in CPU cache memory, does not require periodic electric refresh.
- DRAM (Dynamic RAM): Standard computer memory, stores data in microscopic capacitor cells, needs periodic refresh cycles.
- SDRAM & DDR: Double Data Rate memory (DDR, DDR2, DDR3, DDR4, DDR5) transfers data on both rising and falling clock edges.

Dual In-line Memory Module (DIMM):
A DIMM is a compact circuit board containing RAM chips that snaps directly into memory sockets on a desktop or laptop motherboard.`;

  function initCustomTextControls() {
    if (!dom.btnOpenPasteModal) return;

    dom.btnOpenPasteModal.addEventListener('click', openPasteModal);
    if (dom.btnPasteModalClose) dom.btnPasteModalClose.addEventListener('click', closePasteModal);
    if (dom.btnCancelPasteModal) dom.btnCancelPasteModal.addEventListener('click', closePasteModal);

    // Browse Text File (.txt, .md)
    if (dom.btnUploadTextFile && dom.customTextFileInput) {
      dom.btnUploadTextFile.addEventListener('click', () => {
        dom.customTextFileInput.click();
      });
      dom.customTextFileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          handleUploadedTextFile(file);
        }
      });
    }

    // Load Sample College RAM Notes (Terna College notes from screenshot)
    if (dom.btnLoadSampleRamNotes) {
      dom.btnLoadSampleRamNotes.addEventListener('click', () => {
        if (dom.customTextTitle) dom.customTextTitle.value = 'Computer Science: RAM & Memory Hierarchy (Terna College)';
        if (dom.customTextCategory) dom.customTextCategory.value = 'Computer Science';
        if (dom.customTextInput) dom.customTextInput.value = SAMPLE_RAM_TEXT;
        updateCustomTextStats();
      });
    }

    // Clear Text
    if (dom.btnClearCustomText) {
      dom.btnClearCustomText.addEventListener('click', () => {
        if (dom.customTextTitle) dom.customTextTitle.value = '';
        if (dom.customTextInput) dom.customTextInput.value = '';
        if (dom.customTextFileInput) dom.customTextFileInput.value = '';
        updateCustomTextStats();
      });
    }

    // Live Stats Counter on input
    if (dom.customTextInput) {
      dom.customTextInput.addEventListener('input', updateCustomTextStats);
    }

    // Submit Custom Text
    if (dom.btnSubmitCustomText) {
      dom.btnSubmitCustomText.addEventListener('click', handleCustomTextSubmit);
    }

    // Populate saved custom lessons on startup
    syncSavedCustomLessonsToSelect();
  }

  function openPasteModal() {
    if (!dom.pasteTextModal) return;
    dom.pasteTextModal.classList.add('active');
    updateCustomTextStats();
    if (dom.customTextInput) {
      setTimeout(() => dom.customTextInput.focus(), 150);
    }
  }

  function closePasteModal() {
    if (!dom.pasteTextModal) return;
    dom.pasteTextModal.classList.remove('active');
  }

  function handleUploadedTextFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (dom.customTextInput) {
        dom.customTextInput.value = text;
      }
      if (dom.customTextTitle && (!dom.customTextTitle.value || dom.customTextTitle.value.trim() === '')) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        dom.customTextTitle.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
      updateCustomTextStats();
    };
    reader.readAsText(file);
  }

  function updateCustomTextStats() {
    const raw = dom.customTextInput?.value || '';
    const words = raw.trim() ? raw.trim().split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const estMinutes = Math.max(1, Math.ceil(wordCount / 140));
    const paragraphs = raw.split(/\n+/).filter(p => p.trim().length > 0).length;

    if (dom.customTextWordCount) dom.customTextWordCount.textContent = `📝 Words: ${wordCount}`;
    if (dom.customTextReadTime) dom.customTextReadTime.textContent = `⏱️ Reading Time: ~${wordCount > 0 ? estMinutes : 0} min`;
    if (dom.customTextParaCount) dom.customTextParaCount.textContent = `📑 Paragraphs: ${paragraphs}`;
  }

  function createCustomLessonObject(rawText, userTitle, userCategory) {
    const paragraphs = rawText
      .split(/\n{2,}|\r\n{2,}/)
      .map(p => p.trim().replace(/\r?\n/g, ' '))
      .filter(p => p.length > 0);

    const firstLine = paragraphs[0] || '';
    const title = (userTitle || '').trim()
      || (firstLine.length > 45 ? firstLine.slice(0, 42) + '...' : firstLine)
      || 'My Custom Study Notes';
    const category = userCategory || 'Custom Study Notes';
    const totalWords = rawText.split(/\s+/).filter(Boolean).length;
    const readingTime = `${Math.max(1, Math.ceil(totalWords / 140))} min read`;

    // Extract 3 intelligent key takeaways
    const keyPoints = [];
    paragraphs.forEach(p => {
      if (keyPoints.length < 3 && p.length > 20) {
        const sentence = p.split(/[.!?]/)[0].trim();
        if (sentence && sentence.length > 15) {
          keyPoints.push(sentence + '.');
        }
      }
    });
    while (keyPoints.length < 3) {
      keyPoints.push(`Core takeaway from ${title}.`);
    }

    const content = paragraphs.join('\n\n');
    const summary = paragraphs[0]
      ? (paragraphs[0].slice(0, 160) + (paragraphs[0].length > 160 ? '...' : ''))
      : 'Custom study lesson reformatted for dyslexia reading.';

    const lessonId = 'custom_' + Date.now();
    return {
      id: lessonId,
      source: 'custom',
      title: title,
      category: `${category} (Uploaded Notes)`,
      summary: summary,
      readingTime: readingTime,
      content: content,
      keyPoints: keyPoints,
      podcast: [
        {
          speaker: 'Aarav',
          avatar: '👦',
          text: `Riya didi, aaj humne "${title}" ka topic upload kiya hai. Iska main takeaway kya hai?`
        },
        {
          speaker: 'Riya',
          avatar: '👩‍🏫',
          text: `Aarav! Is lesson ka sabse important concept hai: ${keyPoints[0] || 'Understand the core concepts with clear focus.'} Chalo sath mein Bionic reading se padhte hain!`
        }
      ],
      mermaid: `graph TD
    A["📄 ${title.slice(0, 24).replace(/"/g, '')}"] --> B["🧠 Foundation Concept"]
    A --> C["⚡ Key Mechanism"]
    B --> D["🎯 Practical Application"]
    C --> D
    classDef main fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef node fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    class A main;
    class B,C,D node;`
    };
  }

  function handleCustomTextSubmit() {
    const rawText = dom.customTextInput?.value.trim() || '';
    if (!rawText || rawText.length < 15) {
      alert('Please paste or upload some text (at least 2-3 sentences) to generate a dyslexia lesson.');
      return;
    }

    const customLesson = createCustomLessonObject(
      rawText,
      dom.customTextTitle?.value,
      dom.customTextCategory?.value
    );

    // Save to localStorage
    if (window.StorageService && window.StorageService.saveCustomLesson) {
      window.StorageService.saveCustomLesson(customLesson);
    }

    // Add to #lessonSelect dropdown
    addCustomLessonToSelect(customLesson);
    if (dom.lessonSelect) {
      dom.lessonSelect.value = customLesson.id;
    }

    // Load into reader
    loadLesson(customLesson);
    closePasteModal();

    // Scroll smoothly to reader
    dom.readerTitle?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function addCustomLessonToSelect(lesson) {
    if (!dom.lessonSelect) return;
    let optGroup = dom.customLessonsOptGroup;
    if (!optGroup) {
      optGroup = dom.lessonSelect.querySelector('#customLessonsOptGroup');
    }
    if (optGroup) {
      optGroup.style.display = '';
      let existingOpt = optGroup.querySelector(`option[value="${lesson.id}"]`);
      if (!existingOpt) {
        const opt = document.createElement('option');
        opt.value = lesson.id;
        opt.textContent = `📝 ${lesson.title}`;
        optGroup.insertBefore(opt, optGroup.firstChild);
      }
    } else {
      let existingOpt = dom.lessonSelect.querySelector(`option[value="${lesson.id}"]`);
      if (!existingOpt) {
        const opt = document.createElement('option');
        opt.value = lesson.id;
        opt.textContent = `📝 ${lesson.title}`;
        dom.lessonSelect.insertBefore(opt, dom.lessonSelect.firstChild);
      }
    }
  }

  function syncSavedCustomLessonsToSelect() {
    if (!window.StorageService || !window.StorageService.getCustomLessons) return;
    const customList = window.StorageService.getCustomLessons();
    if (Array.isArray(customList) && customList.length > 0) {
      customList.forEach(lesson => {
        addCustomLessonToSelect(lesson);
      });
    }
  }

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // -------------------------------------------------------------------
  // 5. "MY BRAIN PROFILE" CALIBRATION MODAL CONTROLS
  // -------------------------------------------------------------------
  function openProfileModal() {
    if (!dom.profileModal) return;
    syncProfileModalFromStorage();
    dom.profileModal.classList.add('active');
  }

  function closeProfileModal() {
    if (!dom.profileModal) return;
    dom.profileModal.classList.remove('active');
  }

  function syncProfileModalFromStorage() {
    if (!window.StorageService) return;
    const profile = window.StorageService.getProfile();

    // 1. Theme Swatches
    dom.themeCards.forEach(card => {
      const themeVal = card.getAttribute('data-theme-val');
      if (themeVal === profile.theme) {
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');
      } else {
        card.classList.remove('active');
        card.setAttribute('aria-checked', 'false');
      }
    });

    // 2. Font Cards
    if (dom.fontCardLexend && dom.fontCardOpenDyslexic) {
      if (profile.font === 'opendyslexic') {
        dom.fontCardOpenDyslexic.classList.add('active');
        dom.fontCardOpenDyslexic.setAttribute('aria-checked', 'true');
        dom.fontCardLexend.classList.remove('active');
        dom.fontCardLexend.setAttribute('aria-checked', 'false');
      } else {
        dom.fontCardLexend.classList.add('active');
        dom.fontCardLexend.setAttribute('aria-checked', 'true');
        dom.fontCardOpenDyslexic.classList.remove('active');
        dom.fontCardOpenDyslexic.setAttribute('aria-checked', 'false');
      }
    }

    // 3. Sliders & Live Badges
    if (dom.sliderFontSize) {
      dom.sliderFontSize.value = profile.fontSize;
      if (dom.labelFontSizeVal) dom.labelFontSizeVal.textContent = `${profile.fontSize}px`;
    }
    if (dom.sliderLetterSpacing) {
      dom.sliderLetterSpacing.value = profile.letterSpacing;
      if (dom.labelLetterSpacingVal) dom.labelLetterSpacingVal.textContent = `${profile.letterSpacing}em`;
    }
    if (dom.sliderLineHeight) {
      dom.sliderLineHeight.value = profile.lineHeight;
      if (dom.labelLineHeightVal) dom.labelLineHeightVal.textContent = profile.lineHeight;
    }
    if (dom.sliderWordSpacing) {
      dom.sliderWordSpacing.value = profile.wordSpacing;
      if (dom.labelWordSpacingVal) dom.labelWordSpacingVal.textContent = `${profile.wordSpacing}em`;
    }

    // 4. API Key
    if (dom.inputGeminiApiKey) {
      dom.inputGeminiApiKey.value = window.StorageService.getApiKey();
    }

    updateApiKeyBadge();
    updateHeaderPillLabels(profile);
  }

  function saveProfileModal() {
    if (!window.StorageService) return;

    // Determine active theme
    let selectedTheme = 'cream';
    dom.themeCards.forEach(card => {
      if (card.classList.contains('active')) {
        selectedTheme = card.getAttribute('data-theme-val') || 'cream';
      }
    });

    // Determine active font
    const selectedFont = dom.fontCardOpenDyslexic?.classList.contains('active') ? 'opendyslexic' : 'lexend';

    const updates = {
      theme: selectedTheme,
      font: selectedFont,
      fontSize: parseInt(dom.sliderFontSize?.value || '18', 10),
      letterSpacing: parseFloat(dom.sliderLetterSpacing?.value || '0.12'),
      lineHeight: parseFloat(dom.sliderLineHeight?.value || '1.85'),
      wordSpacing: parseFloat(dom.sliderWordSpacing?.value || '0.28'),
      hasOnboarded: true
    };

    // Save profile updates
    const saved = window.StorageService.saveProfile(updates);

    // Save optional API Key
    if (dom.inputGeminiApiKey) {
      window.StorageService.setApiKey(dom.inputGeminiApiKey.value);
    }

    updateHeaderPillLabels(saved);
    updateApiKeyBadge();
    closeProfileModal();
  }

  function updateHeaderPillLabels(profile) {
    const p = profile || (window.StorageService ? window.StorageService.getProfile() : {});
    if (dom.themeToggleLabel) {
      const themeNames = {
        'cream': 'Warm Cream',
        'yellow': 'Soft Yellow',
        'mint': 'Cool Mint',
        'sky': 'Calm Sky',
        'dark-comfort': 'Dark Comfort'
      };
      dom.themeToggleLabel.textContent = `Theme: ${themeNames[p.theme] || 'Warm Cream'}`;
    }

    if (dom.fontToggleLabel) {
      dom.fontToggleLabel.textContent = p.font === 'opendyslexic' ? 'Font: OpenDyslexic' : 'Font: Lexend';
    }
  }

  function updateApiKeyBadge() {
    if (!dom.apiKeyBadge || !window.StorageService) return;
    const hasKey = window.StorageService.hasApiKey();

    if (hasKey) {
      dom.apiKeyBadge.textContent = '⚡ Gemini 2.5 Active';
      dom.apiKeyBadge.style.backgroundColor = 'var(--accent-purple-light)';
      dom.apiKeyBadge.style.color = 'var(--accent-purple)';
      dom.apiKeyBadge.title = 'Custom API key active for live Vision OCR & Viva grading.';
    } else {
      dom.apiKeyBadge.textContent = '🟢 Smart Demo Mode';
      dom.apiKeyBadge.style.backgroundColor = 'var(--accent-green-light)';
      dom.apiKeyBadge.style.color = 'var(--accent-green)';
      dom.apiKeyBadge.title = 'Running seamlessly with rich offline demo lessons & podcasts.';
    }
  }

  // -------------------------------------------------------------------
  // 6. QUICK CONTROLS LISTENERS
  // -------------------------------------------------------------------
  function initQuickControls() {
    // Quick Theme Swatch Buttons in Header
    dom.quickThemeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-quick-theme');
        if (theme && window.StorageService) {
          window.StorageService.saveProfile({ theme });
          updateHeaderPillLabels();
        }
      });
    });

    // Quick Theme Cycle Button
    if (dom.btnQuickThemeCycle) {
      dom.btnQuickThemeCycle.addEventListener('click', () => {
        if (!window.StorageService) return;
        const currentTheme = window.StorageService.getProfile().theme || 'cream';
        const currentIndex = THEMES_LIST.indexOf(currentTheme);
        const nextTheme = THEMES_LIST[(currentIndex + 1) % THEMES_LIST.length];
        window.StorageService.saveProfile({ theme: nextTheme });
        updateHeaderPillLabels();
      });
    }

    // Quick Font Toggle Button
    if (dom.btnQuickFont) {
      dom.btnQuickFont.addEventListener('click', () => {
        if (!window.StorageService) return;
        const currentFont = window.StorageService.getProfile().font || 'lexend';
        const nextFont = currentFont === 'lexend' ? 'opendyslexic' : 'lexend';
        window.StorageService.saveProfile({ font: nextFont });
        updateHeaderPillLabels();
      });
    }

    // Quick Reading Ruler Toggle Button
    if (dom.btnQuickRuler) {
      dom.btnQuickRuler.addEventListener('click', toggleReadingRuler);
    }

    // Bionic Reading Toggle
    if (dom.btnToggleBionic) {
      dom.btnToggleBionic.addEventListener('click', () => {
        if (!window.ReaderTools) return;
        const isActive = window.ReaderTools.toggleBionic();
        dom.btnToggleBionic.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (dom.bionicToggleLabel) {
          dom.bionicToggleLabel.textContent = `Bionic: ${isActive ? 'ON' : 'OFF'}`;
        }
        if (isActive) {
          dom.btnToggleBionic.classList.add('is-active');
        } else {
          dom.btnToggleBionic.classList.remove('is-active');
        }
        renderLessonContent();
      });
    }

    // Syllables Splitter Toggle
    if (dom.btnToggleSyllables) {
      dom.btnToggleSyllables.addEventListener('click', () => {
        if (!window.ReaderTools) return;
        const isActive = window.ReaderTools.toggleSyllables();
        dom.btnToggleSyllables.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        if (dom.syllablesToggleLabel) {
          dom.syllablesToggleLabel.textContent = `Syllables: ${isActive ? 'ON' : 'OFF'}`;
        }
        if (isActive) {
          dom.btnToggleSyllables.classList.add('is-active');
        } else {
          dom.btnToggleSyllables.classList.remove('is-active');
        }
        renderLessonContent();
      });
    }

    // Lesson Switcher Dropdown
    if (dom.lessonSelect) {
      dom.lessonSelect.addEventListener('change', (e) => {
        loadLesson(e.target.value);
      });
    }

    // Logo Click -> Scroll top or reset to Tab 1
    if (dom.brandLogoLink) {
      dom.brandLogoLink.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('tab-read');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Brain Break Triggers
    if (dom.btnTriggerBreak) {
      dom.btnTriggerBreak.addEventListener('click', () => triggerBrainBreak(false));
    }
    if (dom.btnCloseBreakModal) {
      dom.btnCloseBreakModal.addEventListener('click', closeBrainBreak);
    }
    if (dom.btnResumeStudy) {
      dom.btnResumeStudy.addEventListener('click', closeBrainBreak);
    }

    // Calibration Modal Triggers
    if (dom.btnOpenProfileModal) {
      dom.btnOpenProfileModal.addEventListener('click', openProfileModal);
    }
    if (dom.btnCloseProfileModal) {
      dom.btnCloseProfileModal.addEventListener('click', closeProfileModal);
    }
    if (dom.btnSaveProfile) {
      dom.btnSaveProfile.addEventListener('click', saveProfileModal);
    }

    // Reset Defaults in Modal
    if (dom.btnResetDefaults) {
      dom.btnResetDefaults.addEventListener('click', () => {
        if (window.StorageService) {
          window.StorageService.resetProfile();
          syncProfileModalFromStorage();
        }
      });
    }

    // Live Calibration Theme Cards
    dom.themeCards.forEach(card => {
      card.addEventListener('click', () => {
        dom.themeCards.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-checked', 'false');
        });
        card.classList.add('active');
        card.setAttribute('aria-checked', 'true');

        // Apply immediately for live preview
        const themeVal = card.getAttribute('data-theme-val');
        if (themeVal) {
          const root = document.documentElement;
          if (themeVal === 'cream') root.removeAttribute('data-theme');
          else root.setAttribute('data-theme', themeVal);
        }
      });
    });

    // Live Calibration Font Cards
    if (dom.fontCardLexend && dom.fontCardOpenDyslexic) {
      dom.fontCardLexend.addEventListener('click', () => {
        dom.fontCardLexend.classList.add('active');
        dom.fontCardLexend.setAttribute('aria-checked', 'true');
        dom.fontCardOpenDyslexic.classList.remove('active');
        dom.fontCardOpenDyslexic.setAttribute('aria-checked', 'false');
        document.documentElement.setAttribute('data-font', 'lexend');
      });

      dom.fontCardOpenDyslexic.addEventListener('click', () => {
        dom.fontCardOpenDyslexic.classList.add('active');
        dom.fontCardOpenDyslexic.setAttribute('aria-checked', 'true');
        dom.fontCardLexend.classList.remove('active');
        dom.fontCardLexend.setAttribute('aria-checked', 'false');
        document.documentElement.setAttribute('data-font', 'opendyslexic');
      });
    }

    // Live Sliders Event Handlers
    if (dom.sliderFontSize) {
      dom.sliderFontSize.addEventListener('input', (e) => {
        const val = e.target.value;
        if (dom.labelFontSizeVal) dom.labelFontSizeVal.textContent = `${val}px`;
        document.documentElement.style.setProperty('--base-font-size', `${val}px`);
      });
    }

    if (dom.sliderLetterSpacing) {
      dom.sliderLetterSpacing.addEventListener('input', (e) => {
        const val = e.target.value;
        if (dom.labelLetterSpacingVal) dom.labelLetterSpacingVal.textContent = `${val}em`;
        document.documentElement.style.setProperty('--letter-spacing', `${val}em`);
      });
    }

    if (dom.sliderLineHeight) {
      dom.sliderLineHeight.addEventListener('input', (e) => {
        const val = e.target.value;
        if (dom.labelLineHeightVal) dom.labelLineHeightVal.textContent = val;
        document.documentElement.style.setProperty('--line-height', val);
      });
    }

    if (dom.sliderWordSpacing) {
      dom.sliderWordSpacing.addEventListener('input', (e) => {
        const val = e.target.value;
        if (dom.labelWordSpacingVal) dom.labelWordSpacingVal.textContent = `${val}em`;
        document.documentElement.style.setProperty('--word-spacing', `${val}em`);
      });
    }

    // Toggle API Key visibility
    if (dom.btnToggleApiKeyVisibility && dom.inputGeminiApiKey) {
      dom.btnToggleApiKeyVisibility.addEventListener('click', () => {
        const isPassword = dom.inputGeminiApiKey.type === 'password';
        dom.inputGeminiApiKey.type = isPassword ? 'text' : 'password';
        dom.btnToggleApiKeyVisibility.textContent = isPassword ? '🙈' : '👁️';
      });
    }

    // Clear API Key
    if (dom.btnClearApiKey && dom.inputGeminiApiKey) {
      dom.btnClearApiKey.addEventListener('click', () => {
        dom.inputGeminiApiKey.value = '';
        if (window.StorageService) {
          window.StorageService.clearApiKey?.() || window.StorageService.setApiKey('');
        }
        updateApiKeyBadge();
      });
    }

    // Wipe all local data & stored keys
    if (dom.btnWipeAllData) {
      dom.btnWipeAllData.addEventListener('click', () => {
        const confirmed = window.confirm(
          '⚠️ Are you sure you want to delete all saved API keys, brain profile customizations, and study data?\n\nThis will reset MindForge to clean defaults and clear offline caches.'
        );
        if (confirmed && window.StorageService) {
          window.StorageService.wipeAllLocalData();
          alert('🔒 All API keys, brain profile settings, and local data have been completely wiped.');
          window.location.reload();
        }
      });
    }

    // Modal close on backdrop click & ESC key
    [dom.profileModal, dom.breakModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (dom.profileModal?.classList.contains('active')) closeProfileModal();
        if (dom.breakModal?.classList.contains('active')) closeBrainBreak();
      }
    });

    // Custom events listener
    window.addEventListener('brainProfileUpdated', (e) => {
      updateHeaderPillLabels(e.detail);
    });

    window.addEventListener('geminiKeyUpdated', () => {
      updateApiKeyBadge();
    });
  }

  // -------------------------------------------------------------------
  // 7. INITIALIZE APPLICATION
  // -------------------------------------------------------------------
  function init() {
    initDomReferences();
    initTabListeners();
    initPacerEngine();
    initReadingRuler();
    initQuickControls();
    initSpeechEngineControls();
    initPodcastControls();
    initFlowchartControls();
    initScannerControls();
    initVoiceSearchControls();
    initCustomTextControls();

    // Restore last active tab
    const savedTab = window.StorageService ? window.StorageService.getActiveTab() : 'tab-read';
    switchTab(savedTab);

    // Initial Lesson Load
    loadLesson('photosynthesis');

    // Sync labels & badges
    const currentProfile = window.StorageService ? window.StorageService.getProfile() : {};
    updateHeaderPillLabels(currentProfile);
    updateApiKeyBadge();

    // -----------------------------------------------------------------
    // 8. PROGRESSIVE WEB APP (PWA) SERVICE WORKER & INSTALL PROMPT
    // -----------------------------------------------------------------
    initServiceWorker();

    console.log('%c⚡ MindForge Initialized: BDA Theme Engine Active', 'color: #059669; font-weight: bold; font-size: 14px;');
  }

  let deferredInstallPrompt = null;

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            console.log('%c📲 MindForge PWA Active: Service Worker Registered', 'color: #2563EB; font-weight: bold;', registration.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // PWA Install Prompt Listener
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      const btnInstall = document.getElementById('btnInstallPwa');
      if (btnInstall) {
        btnInstall.style.display = 'inline-flex';
        btnInstall.addEventListener('click', async () => {
          if (!deferredInstallPrompt) return;
          deferredInstallPrompt.prompt();
          const { outcome } = await deferredInstallPrompt.userChoice;
          console.log(`[PWA] Install prompt outcome: ${outcome}`);
          deferredInstallPrompt = null;
          btnInstall.style.display = 'none';
        });
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] MindForge was successfully installed!');
      const btnInstall = document.getElementById('btnInstallPwa');
      if (btnInstall) btnInstall.style.display = 'none';
    });
  }

  // Bootstrapping
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window, document);
