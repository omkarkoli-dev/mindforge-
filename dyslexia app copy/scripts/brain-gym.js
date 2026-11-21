/**
 * MINDFORGE - Brain Gym & Viva
 * Tab 3: Oral Assessment, Lateral Thinking Arena & Multisensory Sand Tracer
 * 
 * 1. 🗣️ "Teach the AI" (Oral Viva Mode):
 *    - Student explains topics verbally via microphone (or clicks sample spoken response).
 *    - Evaluated 100% on conceptual understanding, logic, and creative analogies.
 *    - Zero deductions for spelling, grammar, or accent.
 *    - Celebratory Concept Score /10, Strengths list, friendly Hinglish tip, and TTS audio playback.
 * 
 * 2. 🧩 "Fix the Broken System" (Lateral Thinking Arena):
 *    - Real-world visual engineering/design puzzles with visual SVG problem schematics.
 *    - speak their out-of-the-box passive mechanical fixes (Jugaad).
 *    - Awards Dyslexic Advantage Superpower Badges (3D Spatial Architect, Systems Innovator, etc.).
 * 
 * 3. ✍️ Multisensory Sand & Glow Letter Tracer:
 *    - Tackles mirror confusion: 'b' vs 'd' and 'p' vs 'q'.
 *    - Interactive visual "b-e-d Thumbs Trick" guide with speech playback.
 *    - HTML5 sand canvas with glowing particle stroke physics and tactile guidelines.
 *    - Phonetic sound and stroke rhyme audio recitation.
 *    - Tracing check celebration and particle sand wipe.
 * 
 * 4. 🏆 Superpower Trophy Wall:
 *    - Dynamic showcase of unlocked badges and viva scores saved in localStorage.
 */

(function (window, document) {
  'use strict';

  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // State Management
  const state = {
    // Sub-Arena Navigation
    activeSubArena: 'viva', // 'viva' | 'lateral' | 'tracer' | 'trophies'

    // Oral Viva State
    activeVivaIndex: 0,
    isRecordingViva: false,
    vivaRecognition: null,
    vivaTranscript: '',
    activeVivaResult: null,
    isPlayingVivaAudio: false,

    // Lateral Thinking State
    activeLateralIndex: 0,
    isRecordingLateral: false,
    lateralRecognition: null,
    lateralTranscript: '',
    activeLateralResult: null,
    isPlayingLateralAudio: false,

    // Sand & Glow Letter Tracer State
    activeLetter: 'b',
    activeTrickMode: 'bd', // 'bd' | 'pq'
    glowColor: '#F59E0B',  // Golden Sand default
    strokeWidth: 12,
    isTracing: false,
    lastX: 0,
    lastY: 0,
    tracedStrokeCount: 0,
    tracedLetters: new Set(),
    particles: [],
    animationFrameId: null,
    isPlayingTrickAudio: false,
    isPlayingRhymeAudio: false
  };

  // DOM Elements Cache
  let dom = {};

  function cacheDom() {
    dom = {
      // Top Header & Sub-Nav
      btnQuickTrophyWall: document.getElementById('btnQuickTrophyWall'),
      quickTrophyCountLabel: document.getElementById('quickTrophyCountLabel'),
      subtabViva: document.getElementById('subtabGymViva'),
      subtabLateral: document.getElementById('subtabGymLateral'),
      subtabTracer: document.getElementById('subtabGymTracer'),
      subtabTrophies: document.getElementById('subtabGymTrophies'),
      panelViva: document.getElementById('panelGymViva'),
      panelLateral: document.getElementById('panelGymLateral'),
      panelTracer: document.getElementById('panelGymTracer'),
      panelTrophies: document.getElementById('panelGymTrophies'),

      // Oral Viva Elements
      vivaTopicGrid: document.getElementById('vivaTopicGrid'),
      vivaActiveTopicTitle: document.getElementById('vivaActiveTopicTitle'),
      vivaActivePromptText: document.getElementById('vivaActivePromptText'),
      btnGymVivaMic: document.getElementById('btnGymVivaMic'),
      gymVivaMicIcon: document.getElementById('gymVivaMicIcon'),
      gymVivaMicLabel: document.getElementById('gymVivaMicLabel'),
      gymVivaMicDot: document.getElementById('gymVivaMicDot'),
      gymVivaVoiceStatus: document.getElementById('gymVivaVoiceStatus'),
      gymVivaWordCount: document.getElementById('gymVivaWordCount'),
      gymVivaTranscript: document.getElementById('gymVivaTranscript'),
      btnGymVivaLoadSample: document.getElementById('btnGymVivaLoadSample'),
      btnGymVivaClear: document.getElementById('btnGymVivaClear'),
      btnGymVivaSubmit: document.getElementById('btnGymVivaSubmit'),
      gymVivaLoading: document.getElementById('gymVivaLoading'),
      gymVivaResultCard: document.getElementById('gymVivaResultCard'),
      gymVivaScoreVal: document.getElementById('gymVivaScoreVal'),
      gymVivaEvalHeading: document.getElementById('gymVivaEvalHeading'),
      btnGymVivaPlayAudio: document.getElementById('btnGymVivaPlayAudio'),
      gymVivaAudioIcon: document.getElementById('gymVivaAudioIcon'),
      gymVivaAudioLabel: document.getElementById('gymVivaAudioLabel'),
      gymVivaStrengthsList: document.getElementById('gymVivaStrengthsList'),
      gymVivaTipBox: document.getElementById('gymVivaTipBox'),
      btnGymVivaNextTopic: document.getElementById('btnGymVivaNextTopic'),

      // Lateral Thinking Elements
      lateralChallengeSelector: document.getElementById('lateralChallengeSelector'),
      lateralActiveBadgeTag: document.getElementById('lateralActiveBadgeTag'),
      lateralActiveTitle: document.getElementById('lateralActiveTitle'),
      lateralActiveScenario: document.getElementById('lateralActiveScenario'),
      lateralActiveChallenge: document.getElementById('lateralActiveChallenge'),
      lateralSchematicViewport: document.getElementById('lateralSchematicViewport'),
      btnGymLateralMic: document.getElementById('btnGymLateralMic'),
      gymLateralMicIcon: document.getElementById('gymLateralMicIcon'),
      gymLateralMicLabel: document.getElementById('gymLateralMicLabel'),
      gymLateralMicDot: document.getElementById('gymLateralMicDot'),
      gymLateralVoiceStatus: document.getElementById('gymLateralVoiceStatus'),
      gymLateralWordCount: document.getElementById('gymLateralWordCount'),
      gymLateralTranscript: document.getElementById('gymLateralTranscript'),
      btnGymLateralLoadSample: document.getElementById('btnGymLateralLoadSample'),
      btnGymLateralClear: document.getElementById('btnGymLateralClear'),
      btnGymLateralSubmit: document.getElementById('btnGymLateralSubmit'),
      gymLateralLoading: document.getElementById('gymLateralLoading'),
      gymLateralResultCard: document.getElementById('gymLateralResultCard'),
      gymLateralBadgeIcon: document.getElementById('gymLateralBadgeIcon'),
      gymLateralBadgeTitle: document.getElementById('gymLateralBadgeTitle'),
      gymLateralWhyItWorks: document.getElementById('gymLateralWhyItWorks'),
      btnGymLateralPlayAudio: document.getElementById('btnGymLateralPlayAudio'),
      gymLateralAudioIcon: document.getElementById('gymLateralAudioIcon'),
      gymLateralAudioLabel: document.getElementById('gymLateralAudioLabel'),

      // Multisensory Letter Tracer Elements
      btnTrickModeBD: document.getElementById('btnTrickModeBD'),
      btnTrickModePQ: document.getElementById('btnTrickModePQ'),
      bedTrickTitle: document.getElementById('bedTrickTitle'),
      bedTrickSubtitle: document.getElementById('bedTrickSubtitle'),
      bedVisualDiagram: document.getElementById('bedVisualDiagram'),
      bedLeftHandBox: document.getElementById('bedLeftHandBox'),
      bedLeftEmoji: document.getElementById('bedLeftEmoji'),
      bedLeftLetter: document.getElementById('bedLeftLetter'),
      bedLeftLabel: document.getElementById('bedLeftLabel'),
      bedMiddleMattress: document.getElementById('bedMiddleMattress'),
      bedRightHandBox: document.getElementById('bedRightHandBox'),
      bedRightEmoji: document.getElementById('bedRightEmoji'),
      bedRightLetter: document.getElementById('bedRightLetter'),
      bedRightLabel: document.getElementById('bedRightLabel'),
      bedTrickRuleText: document.getElementById('bedTrickRuleText'),
      btnPlayBedStoryAudio: document.getElementById('btnPlayBedStoryAudio'),
      tracerLetterBtns: document.querySelectorAll('.tracer-letter-btn[data-letter]'),
      tracerActiveLetterBadge: document.getElementById('tracerActiveLetterBadge'),
      tracerActiveWordEmoji: document.getElementById('tracerActiveWordEmoji'),
      tracerActiveRhyme: document.getElementById('tracerActiveRhyme'),
      btnTracerSpeakRhyme: document.getElementById('btnTracerSpeakRhyme'),
      sandColorBtns: document.querySelectorAll('.sand-color-btn[data-glow]'),
      btnSandStrokeMed: document.getElementById('btnSandStrokeMed'),
      btnSandStrokeBold: document.getElementById('btnSandStrokeBold'),
      btnSandClear: document.getElementById('btnSandClear'),
      btnSandCheckTrace: document.getElementById('btnSandCheckTrace'),
      sandCanvas: document.getElementById('sandCanvas'),
      sandCanvasContainer: document.getElementById('sandCanvasContainer'),
      sandStencilHint: document.getElementById('sandStencilHint'),
      sandStrokeCountText: document.getElementById('sandStrokeCountText'),
      tracerGuideTitle: document.getElementById('tracerGuideTitle'),
      tracerGuideStepsList: document.getElementById('tracerGuideStepsList'),

      // Trophy Wall Elements
      trophyVivaCount: document.getElementById('trophyVivaCount'),
      trophyBadgeCount: document.getElementById('trophyBadgeCount'),
      trophyLetterMastery: document.getElementById('trophyLetterMastery'),
      trophyGridContainer: document.getElementById('trophyGridContainer')
    };
  }

  // ===================================================================
  // 1. SUB-ARENA NAVIGATION
  // ===================================================================
  function switchSubArena(arenaId) {
    const validArenas = ['viva', 'lateral', 'tracer', 'trophies'];
    if (!validArenas.includes(arenaId)) arenaId = 'viva';
    state.activeSubArena = arenaId;

    // Stop ongoing audio synthesis
    if (window.SpeechEngine && window.SpeechEngine.stop) {
      window.SpeechEngine.stop();
    }

    // Update Tab Buttons
    if (dom.subtabViva) dom.subtabViva.classList.toggle('active', arenaId === 'viva');
    if (dom.subtabLateral) dom.subtabLateral.classList.toggle('active', arenaId === 'lateral');
    if (dom.subtabTracer) dom.subtabTracer.classList.toggle('active', arenaId === 'tracer');
    if (dom.subtabTrophies) dom.subtabTrophies.classList.toggle('active', arenaId === 'trophies');

    // Update Panels
    if (dom.panelViva) dom.panelViva.classList.toggle('active', arenaId === 'viva');
    if (dom.panelLateral) dom.panelLateral.classList.toggle('active', arenaId === 'lateral');
    if (dom.panelTracer) dom.panelTracer.classList.toggle('active', arenaId === 'tracer');
    if (dom.panelTrophies) dom.panelTrophies.classList.toggle('active', arenaId === 'trophies');

    if (arenaId === 'tracer') {
      setTimeout(() => {
        resizeAndInitSandCanvas();
      }, 50);
    } else if (arenaId === 'trophies') {
      renderTrophyWall();
    }
  }

  function initSubNavListeners() {
    if (dom.subtabViva) dom.subtabViva.addEventListener('click', () => switchSubArena('viva'));
    if (dom.subtabLateral) dom.subtabLateral.addEventListener('click', () => switchSubArena('lateral'));
    if (dom.subtabTracer) dom.subtabTracer.addEventListener('click', () => switchSubArena('tracer'));
    if (dom.subtabTrophies) dom.subtabTrophies.addEventListener('click', () => switchSubArena('trophies'));
    if (dom.btnQuickTrophyWall) dom.btnQuickTrophyWall.addEventListener('click', () => switchSubArena('trophies'));
  }

  // ===================================================================
  // 2. ORAL VIVA ("Teach the AI") ENGINE
  // ===================================================================
  function getVivaTopicsList() {
    return window.DemoData?.vivaTopics || [];
  }

  function renderVivaTopics() {
    if (!dom.vivaTopicGrid) return;
    const topics = getVivaTopicsList();
    dom.vivaTopicGrid.innerHTML = '';

    topics.forEach((topic, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `viva-topic-chip ${idx === state.activeVivaIndex ? 'active' : ''}`;
      chip.setAttribute('role', 'radio');
      chip.setAttribute('aria-checked', idx === state.activeVivaIndex ? 'true' : 'false');
      chip.innerHTML = `
        <span class="viva-chip-title">${escapeHtml(topic.title)}</span>
        <span class="viva-chip-cat">📚 ${escapeHtml(topic.category)} • Concept Viva</span>
      `;
      chip.addEventListener('click', () => selectVivaTopic(idx));
      dom.vivaTopicGrid.appendChild(chip);
    });

    selectVivaTopic(state.activeVivaIndex, false);
  }

  function selectVivaTopic(index, resetTranscript = true) {
    const topics = getVivaTopicsList();
    if (index < 0 || index >= topics.length) index = 0;
    state.activeVivaIndex = index;

    // Update active chip classes
    const chips = dom.vivaTopicGrid ? dom.vivaTopicGrid.querySelectorAll('.viva-topic-chip') : [];
    chips.forEach((c, i) => {
      c.classList.toggle('active', i === index);
      c.setAttribute('aria-checked', i === index ? 'true' : 'false');
    });

    const activeTopic = topics[index];
    if (activeTopic) {
      if (dom.vivaActiveTopicTitle) {
        dom.vivaActiveTopicTitle.textContent = activeTopic.title;
      }
      if (dom.vivaActivePromptText) {
        dom.vivaActivePromptText.textContent = activeTopic.prompt;
      }
    }

    if (resetTranscript) {
      if (dom.gymVivaTranscript) dom.gymVivaTranscript.value = '';
      state.vivaTranscript = '';
      updateVivaWordCount();
      if (dom.gymVivaResultCard) dom.gymVivaResultCard.classList.remove('active');
    }
  }

  function updateVivaWordCount() {
    const text = (dom.gymVivaTranscript ? dom.gymVivaTranscript.value : '').trim();
    const count = text ? text.split(/\s+/).length : 0;
    if (dom.gymVivaWordCount) {
      dom.gymVivaWordCount.textContent = `${count} words`;
    }
  }

  // Voice Speech Recognition for Viva
  function toggleVivaRecording() {
    if (state.isRecordingViva) {
      stopVivaRecording();
    } else {
      startVivaRecording();
    }
  }

  function startVivaRecording() {
    stopVivaRecording();

    if (!window.SpeechEngine || !window.SpeechEngine.startListening) {
      if (dom.gymVivaVoiceStatus) {
        dom.gymVivaVoiceStatus.textContent = 'Speech recognition not supported in this browser. Please type or click Sample.';
      }
      return;
    }

    state.isRecordingViva = true;
    updateVivaMicUI(true);

    const initialText = (dom.gymVivaTranscript ? dom.gymVivaTranscript.value : '').trim();

    state.vivaRecognition = window.SpeechEngine.startListening({
      lang: 'en-IN',
      continuous: true,
      onStart: () => {
        if (dom.gymVivaVoiceStatus) {
          dom.gymVivaVoiceStatus.textContent = 'Listening live... Explain your concept naturally in Hinglish or English!';
        }
      },
      onResult: (result) => {
        const spoken = result.text;
        const full = initialText ? `${initialText} ${spoken}` : spoken;
        if (dom.gymVivaTranscript) {
          dom.gymVivaTranscript.value = full;
          state.vivaTranscript = full;
        }
        updateVivaWordCount();
      },
      onError: (err) => {
        console.warn('[BrainGym Viva] Voice recognition error:', err);
        stopVivaRecording();
        if (dom.gymVivaVoiceStatus) {
          dom.gymVivaVoiceStatus.textContent = 'Microphone paused. Click again to continue speaking.';
        }
      },
      onEnd: () => {
        if (state.isRecordingViva) {
          stopVivaRecording();
        }
      }
    });
  }

  function stopVivaRecording() {
    state.isRecordingViva = false;
    updateVivaMicUI(false);

    if (window.SpeechEngine && window.SpeechEngine.stopListening) {
      window.SpeechEngine.stopListening();
    }
    state.vivaRecognition = null;
    if (dom.gymVivaVoiceStatus) {
      dom.gymVivaVoiceStatus.textContent = 'Microphone ready • Speak naturally in Hinglish or English';
    }
  }

  function updateVivaMicUI(isRecording) {
    if (dom.btnGymVivaMic) {
      dom.btnGymVivaMic.classList.toggle('recording', isRecording);
      dom.btnGymVivaMic.setAttribute('aria-pressed', isRecording ? 'true' : 'false');
    }
    if (dom.gymVivaMicIcon) {
      dom.gymVivaMicIcon.textContent = isRecording ? '⏹️' : '🎤';
    }
    if (dom.gymVivaMicLabel) {
      dom.gymVivaMicLabel.textContent = isRecording ? 'Stop Recording' : 'Start Speaking Your Viva';
    }
    if (dom.gymVivaMicDot) {
      dom.gymVivaMicDot.style.display = isRecording ? 'inline-block' : 'none';
    }
  }

  function loadVivaSampleSpeech() {
    const topics = getVivaTopicsList();
    const topic = topics[state.activeVivaIndex];
    if (topic && topic.demoStudentSpeech) {
      if (dom.gymVivaTranscript) {
        dom.gymVivaTranscript.value = topic.demoStudentSpeech;
        state.vivaTranscript = topic.demoStudentSpeech;
      }
      updateVivaWordCount();
      if (dom.gymVivaVoiceStatus) {
        dom.gymVivaVoiceStatus.textContent = 'Sample student explanation loaded in Hinglish. Click Evaluate!';
      }
    }
  }

  function clearVivaTranscript() {
    if (dom.gymVivaTranscript) {
      dom.gymVivaTranscript.value = '';
      state.vivaTranscript = '';
    }
    updateVivaWordCount();
    if (dom.gymVivaResultCard) {
      dom.gymVivaResultCard.classList.remove('active');
    }
  }

  // Viva Evaluation Action
  async function submitVivaEvaluation() {
    stopVivaRecording();
    const text = (dom.gymVivaTranscript ? dom.gymVivaTranscript.value : '').trim();
    if (!text || text.length < 5) {
      alert('Please speak or type your explanation first (or click "Sample Spoken Response") before evaluating!');
      return;
    }

    const topics = getVivaTopicsList();
    const activeTopic = topics[state.activeVivaIndex] || {
      id: 'viva-custom',
      title: 'Custom Concept Viva',
      prompt: 'Explain the concept simply in your own words.'
    };

    if (dom.gymVivaLoading) dom.gymVivaLoading.style.display = 'block';
    if (dom.gymVivaResultCard) dom.gymVivaResultCard.classList.remove('active');

    try {
      let evaluation = null;
      if (window.GeminiService && window.GeminiService.evaluateOralViva) {
        evaluation = await window.GeminiService.evaluateOralViva(activeTopic, text);
      } else {
        evaluation = activeTopic.evaluation || {
          score: 10,
          strengths: ['Great conceptual grasp of the core mechanism.'],
          missingPiece: 'Connect to another real-world machine!',
          audioFeedback: 'Shaabaash! Conceptual understanding 10 out of 10!'
        };
      }

      state.activeVivaResult = evaluation;
      renderVivaResult(activeTopic, evaluation);

      // Save to StorageService
      if (window.StorageService && window.StorageService.saveVivaResult) {
        window.StorageService.saveVivaResult({
          topicId: activeTopic.id,
          topicTitle: activeTopic.title,
          score: evaluation.score,
          audioFeedback: evaluation.audioFeedback
        });
      }

      // If high score, award Concept Master badge
      if (evaluation.score >= 9 && window.StorageService && window.StorageService.awardBadge) {
        window.StorageService.awardBadge({
          id: 'badge-viva-master',
          title: 'Oral Viva Concept Master 🗣️',
          category: 'Oral Assessment',
          description: 'Achieved 9.5+ score on verbal conceptual explanations with zero spelling deductions.'
        });
      }

      updateQuickTrophyBadgeCount();
    } catch (err) {
      console.error('[BrainGym] Error evaluating oral viva:', err);
      alert('Evaluation error. Please try again.');
    } finally {
      if (dom.gymVivaLoading) dom.gymVivaLoading.style.display = 'none';
    }
  }

  function renderVivaResult(topic, evalData) {
    if (!dom.gymVivaResultCard) return;

    if (dom.gymVivaScoreVal) {
      dom.gymVivaScoreVal.textContent = evalData.score;
    }

    if (dom.gymVivaEvalHeading) {
      dom.gymVivaEvalHeading.textContent = evalData.score >= 9.5
        ? 'Outstanding Conceptual Mastery! 🌟'
        : 'Solid Concept Understanding! 👏';
    }

    // Render Strengths
    if (dom.gymVivaStrengthsList) {
      dom.gymVivaStrengthsList.innerHTML = '';
      (evalData.strengths || []).forEach(st => {
        const item = document.createElement('div');
        item.className = 'viva-strength-item';
        item.innerHTML = `<span>✅</span><span>${escapeHtml(st)}</span>`;
        dom.gymVivaStrengthsList.appendChild(item);
      });
    }

    // Render Missing Piece Tip
    if (dom.gymVivaTipBox) {
      dom.gymVivaTipBox.innerHTML = `
        <strong>💡 Pro-Tip:</strong> ${escapeHtml(evalData.missingPiece || 'Keep connecting concepts with vivid visual analogies!')}
      `;
    }

    dom.gymVivaResultCard.classList.add('active');
    dom.gymVivaResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function playVivaAudioFeedback() {
    if (!state.activeVivaResult || !state.activeVivaResult.audioFeedback) return;

    if (window.SpeechEngine) {
      if (state.isPlayingVivaAudio) {
        window.SpeechEngine.stop();
        state.isPlayingVivaAudio = false;
        updateVivaAudioButton(false);
      } else {
        state.isPlayingVivaAudio = true;
        updateVivaAudioButton(true);

        window.SpeechEngine.speakText(state.activeVivaResult.audioFeedback, {
          rate: 1.0,
          pitch: 1.05,
          onEnd: () => {
            state.isPlayingVivaAudio = false;
            updateVivaAudioButton(false);
          },
          onError: () => {
            state.isPlayingVivaAudio = false;
            updateVivaAudioButton(false);
          }
        });
      }
    }
  }

  function updateVivaAudioButton(isPlaying) {
    if (dom.gymVivaAudioIcon) dom.gymVivaAudioIcon.textContent = isPlaying ? '⏹️' : '🔊';
    if (dom.gymVivaAudioLabel) dom.gymVivaAudioLabel.textContent = isPlaying ? 'Stop Audio' : 'Listen to Audio Feedback';
  }

  function nextVivaTopic() {
    const topics = getVivaTopicsList();
    const nextIdx = (state.activeVivaIndex + 1) % topics.length;
    selectVivaTopic(nextIdx, true);
  }

  function initVivaControls() {
    renderVivaTopics();

    if (dom.btnGymVivaMic) dom.btnGymVivaMic.addEventListener('click', toggleVivaRecording);
    if (dom.btnGymVivaLoadSample) dom.btnGymVivaLoadSample.addEventListener('click', loadVivaSampleSpeech);
    if (dom.btnGymVivaClear) dom.btnGymVivaClear.addEventListener('click', clearVivaTranscript);
    if (dom.btnGymVivaSubmit) dom.btnGymVivaSubmit.addEventListener('click', submitVivaEvaluation);
    if (dom.btnGymVivaPlayAudio) dom.btnGymVivaPlayAudio.addEventListener('click', playVivaAudioFeedback);
    if (dom.btnGymVivaNextTopic) dom.btnGymVivaNextTopic.addEventListener('click', nextVivaTopic);

    if (dom.gymVivaTranscript) {
      dom.gymVivaTranscript.addEventListener('input', () => {
        state.vivaTranscript = dom.gymVivaTranscript.value;
        updateVivaWordCount();
      });
    }
  }

  // ===================================================================
  // 3. LATERAL THINKING ARENA ("Fix the Broken System")
  // ===================================================================
  function getLateralChallengesList() {
    return window.DemoData?.lateralChallenges || [];
  }

  function renderLateralChallenges() {
    if (!dom.lateralChallengeSelector) return;
    const challenges = getLateralChallengesList();
    dom.lateralChallengeSelector.innerHTML = '';

    challenges.forEach((ch, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `lateral-tab-btn ${idx === state.activeLateralIndex ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', idx === state.activeLateralIndex ? 'true' : 'false');
      btn.innerHTML = `<span>${escapeHtml(ch.title)}</span>`;
      btn.addEventListener('click', () => selectLateralChallenge(idx));
      dom.lateralChallengeSelector.appendChild(btn);
    });

    selectLateralChallenge(state.activeLateralIndex, false);
  }

  function selectLateralChallenge(index, resetTranscript = true) {
    const challenges = getLateralChallengesList();
    if (index < 0 || index >= challenges.length) index = 0;
    state.activeLateralIndex = index;

    const btns = dom.lateralChallengeSelector ? dom.lateralChallengeSelector.querySelectorAll('.lateral-tab-btn') : [];
    btns.forEach((b, i) => {
      b.classList.toggle('active', i === index);
      b.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });

    const activeCh = challenges[index];
    if (activeCh) {
      if (dom.lateralActiveBadgeTag) dom.lateralActiveBadgeTag.textContent = `Superpower Target: ${activeCh.badgeAwarded}`;
      if (dom.lateralActiveTitle) dom.lateralActiveTitle.textContent = activeCh.title;
      if (dom.lateralActiveScenario) dom.lateralActiveScenario.textContent = activeCh.scenario;
      if (dom.lateralActiveChallenge) dom.lateralActiveChallenge.textContent = activeCh.challenge;

      renderBrokenSystemSchematic(activeCh.id);
    }

    if (resetTranscript) {
      if (dom.gymLateralTranscript) dom.gymLateralTranscript.value = '';
      state.lateralTranscript = '';
      updateLateralWordCount();
      if (dom.gymLateralResultCard) dom.gymLateralResultCard.classList.remove('active');
    }
  }

  function updateLateralWordCount() {
    const text = (dom.gymLateralTranscript ? dom.gymLateralTranscript.value : '').trim();
    const count = text ? text.split(/\s+/).length : 0;
    if (dom.gymLateralWordCount) {
      dom.gymLateralWordCount.textContent = `${count} words`;
    }
  }

  // Dynamic Broken System Visual Schematic (SVG Diagrams)
  function renderBrokenSystemSchematic(challengeId) {
    if (!dom.lateralSchematicViewport) return;

    if (challengeId === 'monsoon-drain') {
      dom.lateralSchematicViewport.innerHTML = `
        <svg class="lateral-schematic-svg" viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Blocked Courtyard Drain Schematic">
          <!-- Background Courtyard Ground -->
          <rect x="0" y="0" width="600" height="240" fill="#F8FAFC" />
          <rect x="20" y="150" width="560" height="80" fill="#E2E8F0" rx="8" />
          <text x="35" y="175" fill="#475569" font-size="12" font-weight="700">COURTYARD PAVEMENT</text>
          
          <!-- Flooded Muddy Water -->
          <rect x="20" y="110" width="560" height="40" fill="#93C5FD" opacity="0.6" rx="4" />
          <text x="35" y="135" fill="#1E3A8A" font-size="13" font-weight="700">🌊 FLOODED RAINWATER (Depth: 15cm)</text>

          <!-- Flat Ground Drain -->
          <rect x="240" y="150" width="120" height="70" fill="#334155" rx="4" />
          <line x1="260" y1="150" x2="260" y2="220" stroke="#94A3B8" stroke-width="3" />
          <line x1="280" y1="150" x2="280" y2="220" stroke="#94A3B8" stroke-width="3" />
          <line x1="300" y1="150" x2="300" y2="220" stroke="#94A3B8" stroke-width="3" />
          <line x1="320" y1="150" x2="320" y2="220" stroke="#94A3B8" stroke-width="3" />
          <line x1="340" y1="150" x2="340" y2="220" stroke="#94A3B8" stroke-width="3" />

          <!-- Leaves Clogging the Flat Mesh -->
          <ellipse cx="280" cy="148" rx="22" ry="10" fill="#B45309" />
          <ellipse cx="320" cy="146" rx="25" ry="12" fill="#D97706" />
          <ellipse cx="300" cy="142" rx="30" ry="14" fill="#92400E" />
          <text x="255" y="132" fill="#B91C1C" font-size="12" font-weight="800">⚠️ CLOGGED MESH</text>

          <!-- Lateral Fix Hint Arrow -->
          <path d="M 400 90 Q 430 50 480 70" fill="none" stroke="#2563EB" stroke-width="2.5" stroke-dasharray="4,4" />
          <text x="420" y="40" fill="#2563EB" font-size="12" font-weight="700">💡 Spatial Fix: Inverted 3D Cone Cage?</text>
          <text x="420" y="58" fill="#475569" font-size="11">Water flows in sides even if base is buried!</text>
        </svg>
      `;
    } else if (challengeId === 'desert-cooler') {
      dom.lateralSchematicViewport.innerHTML = `
        <svg class="lateral-schematic-svg" viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Desert Cooler Splatter Schematic">
          <rect x="0" y="0" width="600" height="240" fill="#F8FAFC" />
          <!-- Desert Cooler Box -->
          <rect x="80" y="30" width="220" height="180" fill="#E2E8F0" stroke="#475569" stroke-width="3" rx="10" />
          <text x="95" y="60" fill="#1E293B" font-size="14" font-weight="700">DESERT COOLER TANK</text>
          
          <!-- Water Fan & Grass Pad -->
          <rect x="250" y="70" width="40" height="120" fill="#FDE68A" stroke="#D97706" stroke-width="2" />
          <text x="140" y="140" fill="#2563EB" font-size="28">🌀</text>

          <!-- Water Splattering Outward -->
          <path d="M 290 80 L 390 50" stroke="#3B82F6" stroke-width="2" stroke-dasharray="3,3" />
          <path d="M 290 120 L 420 120" stroke="#3B82F6" stroke-width="2" stroke-dasharray="3,3" />
          <path d="M 290 160 L 380 200" stroke="#3B82F6" stroke-width="2" stroke-dasharray="3,3" />
          <text x="435" y="125" fill="#DC2626" font-size="13" font-weight="800">💦 Splatter Waste!</text>

          <!-- Eco Baffle Solution Box -->
          <rect x="360" y="150" width="220" height="70" fill="#FEF3C7" stroke="#D97706" rx="8" />
          <text x="375" y="175" fill="#92400E" font-size="12" font-weight="700">🛠️ Jugaad Micro-Troughs?</text>
          <text x="375" y="195" fill="#78350F" font-size="11">Recycled perforated tubes drip evenly via gravity</text>
        </svg>
      `;
    } else {
      // Heavy backpack stair climber
      dom.lateralSchematicViewport.innerHTML = `
        <svg class="lateral-schematic-svg" viewBox="0 0 600 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Backpack Stairs Schematic">
          <rect x="0" y="0" width="600" height="240" fill="#F8FAFC" />
          <!-- Concrete Stairs -->
          <path d="M 40 220 L 160 220 L 160 160 L 280 160 L 280 100 L 400 100 L 400 40 L 560 40" fill="none" stroke="#64748B" stroke-width="6" />
          <text x="50" y="210" fill="#64748B" font-size="12" font-weight="700">STEP 1</text>
          <text x="170" y="150" fill="#64748B" font-size="12" font-weight="700">STEP 2</text>
          <text x="290" y="90" fill="#64748B" font-size="12" font-weight="700">STEP 3</text>

          <!-- Heavy Bag Jammed on Lip -->
          <rect x="180" y="80" width="70" height="90" fill="#7C3AED" rx="8" />
          <circle cx="175" cy="165" r="14" fill="#1E293B" stroke="#DC2626" stroke-width="3" />
          <text x="110" y="115" fill="#DC2626" font-size="12" font-weight="800">⛔ WHEEL JAM</text>

          <!-- Spatial 3-Wheel Tri-Star Solution -->
          <rect x="360" y="150" width="220" height="70" fill="#DBEAFE" stroke="#2563EB" rx="8" />
          <text x="375" y="175" fill="#1E3A8A" font-size="12" font-weight="700">⚙️ Tri-Star Wheel Cluster?</text>
          <text x="375" y="195" fill="#1E40AF" font-size="11">3 rotating wheels pivot smoothly over step edges!</text>
        </svg>
      `;
    }
  }

  // Voice recording for Lateral Thinking
  function toggleLateralRecording() {
    if (state.isRecordingLateral) {
      stopLateralRecording();
    } else {
      startLateralRecording();
    }
  }

  function startLateralRecording() {
    stopLateralRecording();

    if (!window.SpeechEngine || !window.SpeechEngine.startListening) {
      if (dom.gymLateralVoiceStatus) {
        dom.gymLateralVoiceStatus.textContent = 'Voice recognition not available. Please type or click Sample.';
      }
      return;
    }

    state.isRecordingLateral = true;
    updateLateralMicUI(true);

    const initialText = (dom.gymLateralTranscript ? dom.gymLateralTranscript.value : '').trim();

    state.lateralRecognition = window.SpeechEngine.startListening({
      lang: 'en-IN',
      continuous: true,
      onStart: () => {
        if (dom.gymLateralVoiceStatus) {
          dom.gymLateralVoiceStatus.textContent = 'Listening live... Speak your creative spatial fix in Hinglish or English!';
        }
      },
      onResult: (result) => {
        const spoken = result.text;
        const full = initialText ? `${initialText} ${spoken}` : spoken;
        if (dom.gymLateralTranscript) {
          dom.gymLateralTranscript.value = full;
          state.lateralTranscript = full;
        }
        updateLateralWordCount();
      },
      onError: (err) => {
        console.warn('[BrainGym Lateral] Voice error:', err);
        stopLateralRecording();
      },
      onEnd: () => {
        if (state.isRecordingLateral) {
          stopLateralRecording();
        }
      }
    });
  }

  function stopLateralRecording() {
    state.isRecordingLateral = false;
    updateLateralMicUI(false);

    if (window.SpeechEngine && window.SpeechEngine.stopListening) {
      window.SpeechEngine.stopListening();
    }
    state.lateralRecognition = null;
    if (dom.gymLateralVoiceStatus) {
      dom.gymLateralVoiceStatus.textContent = 'Microphone ready • Speak in Hinglish or English';
    }
  }

  function updateLateralMicUI(isRecording) {
    if (dom.btnGymLateralMic) {
      dom.btnGymLateralMic.classList.toggle('recording', isRecording);
      dom.btnGymLateralMic.setAttribute('aria-pressed', isRecording ? 'true' : 'false');
    }
    if (dom.gymLateralMicIcon) {
      dom.gymLateralMicIcon.textContent = isRecording ? '⏹️' : '🎤';
    }
    if (dom.gymLateralMicLabel) {
      dom.gymLateralMicLabel.textContent = isRecording ? 'Stop Recording' : 'Speak Your Ingenious Fix';
    }
    if (dom.gymLateralMicDot) {
      dom.gymLateralMicDot.style.display = isRecording ? 'inline-block' : 'none';
    }
  }

  function loadLateralSampleSolution() {
    const challenges = getLateralChallengesList();
    const ch = challenges[state.activeLateralIndex];
    if (ch && ch.demoSolution) {
      if (dom.gymLateralTranscript) {
        dom.gymLateralTranscript.value = ch.demoSolution;
        state.lateralTranscript = ch.demoSolution;
      }
      updateLateralWordCount();
      if (dom.gymLateralVoiceStatus) {
        dom.gymLateralVoiceStatus.textContent = 'Sample out-of-the-box solution loaded. Click Submit to claim badge!';
      }
    }
  }

  function clearLateralTranscript() {
    if (dom.gymLateralTranscript) {
      dom.gymLateralTranscript.value = '';
      state.lateralTranscript = '';
    }
    updateLateralWordCount();
    if (dom.gymLateralResultCard) dom.gymLateralResultCard.classList.remove('active');
  }

  async function submitLateralSolution() {
    stopLateralRecording();
    const text = (dom.gymLateralTranscript ? dom.gymLateralTranscript.value : '').trim();
    if (!text || text.length < 5) {
      alert('Please explain your mechanical solution first (or click "Sample Out-of-the-Box Solution") before submitting!');
      return;
    }

    const challenges = getLateralChallengesList();
    const activeCh = challenges[state.activeLateralIndex] || {
      id: 'lateral-default',
      title: 'Lateral Engineering Challenge',
      scenario: 'Passive mechanical fix scenario',
      challenge: 'Design a creative workaround using everyday items',
      badgeAwarded: '3D Spatial Architect 🏆'
    };

    if (dom.gymLateralLoading) dom.gymLateralLoading.style.display = 'block';
    if (dom.gymLateralResultCard) dom.gymLateralResultCard.classList.remove('active');

    try {
      let result = null;
      if (window.GeminiService && window.GeminiService.evaluateLateralChallenge) {
        result = await window.GeminiService.evaluateLateralChallenge(activeCh, text);
      } else {
        result = {
          badgeAwarded: activeCh.badgeAwarded || '3D Spatial Architect 🏆',
          whyItWorks: activeCh.demoSolution || 'Solves the blockage by reorienting geometry passively.',
          audioFeedback: 'Zabardast! Aapka spatial engineering solution bilkul out-of-the-box hai!'
        };
      }

      state.activeLateralResult = result;
      renderLateralBadgeAward(result);

      // Save badge to StorageService
      if (window.StorageService && window.StorageService.awardBadge) {
        window.StorageService.awardBadge({
          id: `badge-${activeCh.id}`,
          title: result.badgeAwarded,
          challengeTitle: activeCh.title,
          description: result.whyItWorks
        });
      }

      updateQuickTrophyBadgeCount();
    } catch (err) {
      console.error('[BrainGym] Lateral solution evaluation error:', err);
      alert('Evaluation error. Please try again.');
    } finally {
      if (dom.gymLateralLoading) dom.gymLateralLoading.style.display = 'none';
    }
  }

  function renderLateralBadgeAward(result) {
    if (!dom.gymLateralResultCard) return;

    if (dom.gymLateralBadgeTitle) {
      dom.gymLateralBadgeTitle.textContent = result.badgeAwarded;
    }

    if (dom.gymLateralWhyItWorks) {
      dom.gymLateralWhyItWorks.textContent = result.whyItWorks;
    }

    dom.gymLateralResultCard.classList.add('active');
    dom.gymLateralResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function playLateralAudioFeedback() {
    if (!state.activeLateralResult || !state.activeLateralResult.audioFeedback) return;

    if (window.SpeechEngine) {
      if (state.isPlayingLateralAudio) {
        window.SpeechEngine.stop();
        state.isPlayingLateralAudio = false;
        updateLateralAudioButton(false);
      } else {
        state.isPlayingLateralAudio = true;
        updateLateralAudioButton(true);

        window.SpeechEngine.speakText(state.activeLateralResult.audioFeedback, {
          rate: 1.0,
          pitch: 1.05,
          onEnd: () => {
            state.isPlayingLateralAudio = false;
            updateLateralAudioButton(false);
          },
          onError: () => {
            state.isPlayingLateralAudio = false;
            updateLateralAudioButton(false);
          }
        });
      }
    }
  }

  function updateLateralAudioButton(isPlaying) {
    if (dom.gymLateralAudioIcon) dom.gymLateralAudioIcon.textContent = isPlaying ? '⏹️' : '🔊';
    if (dom.gymLateralAudioLabel) dom.gymLateralAudioLabel.textContent = isPlaying ? 'Stop Audio' : 'Listen to Engineering Review';
  }

  function initLateralControls() {
    renderLateralChallenges();

    if (dom.btnGymLateralMic) dom.btnGymLateralMic.addEventListener('click', toggleLateralRecording);
    if (dom.btnGymLateralLoadSample) dom.btnGymLateralLoadSample.addEventListener('click', loadLateralSampleSolution);
    if (dom.btnGymLateralClear) dom.btnGymLateralClear.addEventListener('click', clearLateralTranscript);
    if (dom.btnGymLateralSubmit) dom.btnGymLateralSubmit.addEventListener('click', submitLateralSolution);
    if (dom.btnGymLateralPlayAudio) dom.btnGymLateralPlayAudio.addEventListener('click', playLateralAudioFeedback);

    if (dom.gymLateralTranscript) {
      dom.gymLateralTranscript.addEventListener('input', () => {
        state.lateralTranscript = dom.gymLateralTranscript.value;
        updateLateralWordCount();
      });
    }
  }

  // ===================================================================
  // 4. MULTISENSORY SAND & GLOW LETTER TRACER ENGINE
  // ===================================================================
  let sandCtx = null;

  function getTracerLettersData() {
    return window.DemoData?.tracerLetters || {
      b: {
        letter: 'b',
        pair: 'd',
        sound: '/b/',
        word: 'bat',
        emoji: '🦇',
        color: '#2563EB',
        strokeRhyme: 'Line down from sky to grass, bounce up and loop around to the right for bat!',
        phoneticAudio: 'b... /b/... Bat! Left hand thumb up is b.',
        guideSteps: [
          '1. Start at the top sky line. Draw straight down to the grass line.',
          '2. Bounce back up to the middle dotted line.',
          '3. Curve around to the right to close the round belly.'
        ]
      },
      d: {
        letter: 'd',
        pair: 'b',
        sound: '/d/',
        word: 'door',
        emoji: '🚪',
        color: '#059669',
        strokeRhyme: 'Curve around first like letter c, then tall line down from sky to grass for door!',
        phoneticAudio: 'd... /d/... Door! Right hand thumb up is d.',
        guideSteps: [
          '1. Start at the middle dotted line. Curve around left like a "c".',
          '2. Go straight up to the sky line.',
          '3. Draw straight down to the grass line.'
        ]
      },
      p: {
        letter: 'p',
        pair: 'q',
        sound: '/p/',
        word: 'pan',
        emoji: '🍳',
        color: '#D97706',
        strokeRhyme: 'Dive down deep under the water, swim back up and loop around to the right for pan!',
        phoneticAudio: 'p... /p/... Pan! Left hand thumb down is p.',
        guideSteps: [
          '1. Start at the middle line. Draw straight down deep past the grass line.',
          '2. Trace back up to the middle line.',
          '3. Curve around to the right and close at the grass line.'
        ]
      },
      q: {
        letter: 'q',
        pair: 'p',
        sound: '/q/',
        word: 'queen',
        emoji: '👑',
        color: '#7C3AED',
        strokeRhyme: 'Curve around like a circle, dive down deep and flick your tail to the right for queen!',
        phoneticAudio: 'kw... /kw/... Queen! Right hand thumb down is q.',
        guideSteps: [
          '1. Start at the middle line. Curve around to the left to form a circle.',
          '2. Draw straight down deep into the water.',
          '3. Give a sharp flick to the right.'
        ]
      }
    };
  }

  function getBedTrickGuide() {
    return window.DemoData?.bedTrickGuide || {
      bd: {
        title: 'The "b - e - d" Bed Thumbs Trick',
        subtitle: 'Never confuse b and d again!',
        rule: 'Make two fists with thumbs up in front of your chest. Left hand is b (the headboard). Body is e (the mattress). Right hand is d (the footboard). They spell b - e - d from left to right!',
        speech: 'Make two fists and put your thumbs up. Your left hand makes the letter b, like the head of a bed. Your right hand makes the letter d, like the foot of a bed. Together they spell b-e-d, bed!'
      },
      pq: {
        title: 'The "p - q" Thumbs Down Trick',
        subtitle: 'Master the descending twins p and q!',
        rule: 'Point both thumbs down in front of you. Your left hand thumb down forms p (loop on the right). Your right hand thumb down forms q (loop on the left, tail flick to the right)!',
        speech: 'Point both thumbs down. Left hand pointing down is p, with its belly facing right. Right hand pointing down is q, with its belly facing left and tail flicking right!'
      }
    };
  }

  // "b-e-d Thumbs Trick" Visual Guide Switcher
  function setBedTrickMode(mode) {
    state.activeTrickMode = mode;
    const guides = getBedTrickGuide();
    const g = guides[mode] || guides.bd;

    if (dom.btnTrickModeBD) {
      dom.btnTrickModeBD.classList.toggle('active', mode === 'bd');
      dom.btnTrickModeBD.setAttribute('aria-pressed', mode === 'bd' ? 'true' : 'false');
    }
    if (dom.btnTrickModePQ) {
      dom.btnTrickModePQ.classList.toggle('active', mode === 'pq');
      dom.btnTrickModePQ.setAttribute('aria-pressed', mode === 'pq' ? 'true' : 'false');
    }

    if (dom.bedTrickTitle) dom.bedTrickTitle.textContent = g.title;
    if (dom.bedTrickSubtitle) dom.bedTrickSubtitle.textContent = g.subtitle;
    if (dom.bedTrickRuleText) dom.bedTrickRuleText.textContent = g.rule;

    if (mode === 'bd') {
      if (dom.bedLeftEmoji) dom.bedLeftEmoji.textContent = '👍';
      if (dom.bedLeftLetter) {
        dom.bedLeftLetter.textContent = 'b';
        dom.bedLeftLetter.style.color = 'var(--accent-blue)';
      }
      if (dom.bedLeftLabel) dom.bedLeftLabel.textContent = 'Headboard (Left)';

      if (dom.bedMiddleMattress) dom.bedMiddleMattress.style.display = 'flex';

      if (dom.bedRightEmoji) dom.bedRightEmoji.textContent = '👍';
      if (dom.bedRightLetter) {
        dom.bedRightLetter.textContent = 'd';
        dom.bedRightLetter.style.color = 'var(--accent-green)';
      }
      if (dom.bedRightLabel) dom.bedRightLabel.textContent = 'Footboard (Right)';

      selectTracerLetter('b', false);
    } else {
      if (dom.bedLeftEmoji) dom.bedLeftEmoji.textContent = '👎';
      if (dom.bedLeftLetter) {
        dom.bedLeftLetter.textContent = 'p';
        dom.bedLeftLetter.style.color = 'var(--accent-amber)';
      }
      if (dom.bedLeftLabel) dom.bedLeftLabel.textContent = 'Loop on Right (Left)';

      if (dom.bedMiddleMattress) dom.bedMiddleMattress.style.display = 'none';

      if (dom.bedRightEmoji) dom.bedRightEmoji.textContent = '👎';
      if (dom.bedRightLetter) {
        dom.bedRightLetter.textContent = 'q';
        dom.bedRightLetter.style.color = 'var(--accent-purple)';
      }
      if (dom.bedRightLabel) dom.bedRightLabel.textContent = 'Flick on Right (Right)';

      selectTracerLetter('p', false);
    }
  }

  function playBedTrickAudio() {
    const guides = getBedTrickGuide();
    const g = guides[state.activeTrickMode] || guides.bd;
    if (g && window.SpeechEngine) {
      window.SpeechEngine.speakText(g.speech, {
        rate: 0.95,
        pitch: 1.05
      });
    }
  }

  // Letter Selection & Stencil Switcher
  function selectTracerLetter(letter, speak = true) {
    const lettersData = getTracerLettersData();
    if (!lettersData[letter]) letter = 'b';
    state.activeLetter = letter;

    // Update letter buttons
    if (dom.tracerLetterBtns) {
      dom.tracerLetterBtns.forEach(btn => {
        const isSelected = btn.dataset.letter === letter;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });
    }

    const data = lettersData[letter];
    if (data) {
      if (dom.tracerActiveLetterBadge) {
        dom.tracerActiveLetterBadge.textContent = `Letter ${data.letter} • Sound: ${data.sound}`;
      }
      if (dom.tracerActiveWordEmoji) {
        dom.tracerActiveWordEmoji.textContent = `${data.emoji} ${data.word.toUpperCase()}`;
      }
      if (dom.tracerActiveRhyme) {
        dom.tracerActiveRhyme.textContent = `"${data.strokeRhyme}"`;
      }
      if (dom.tracerGuideTitle) {
        dom.tracerGuideTitle.textContent = `Step-by-Step Stroke Order for '${data.letter}':`;
      }
      if (dom.tracerGuideStepsList) {
        dom.tracerGuideStepsList.innerHTML = '';
        (data.guideSteps || []).forEach(step => {
          const p = document.createElement('div');
          p.style.cssText = 'font-size: 0.92rem; line-height: 1.6; color: var(--text-primary); display: flex; align-items: flex-start; gap: 8px;';
          p.innerHTML = `<span style="color: var(--accent-blue); font-weight: 700;">•</span><span>${escapeHtml(step)}</span>`;
          dom.tracerGuideStepsList.appendChild(p);
        });
      }

      // Redraw clean stencil
      clearSandCanvas();

      if (speak && window.SpeechEngine) {
        speakTracerRhyme();
      }
    }
  }

  function speakTracerRhyme() {
    const lettersData = getTracerLettersData();
    const data = lettersData[state.activeLetter];
    if (data && window.SpeechEngine) {
      window.SpeechEngine.speakText(data.phoneticAudio || data.strokeRhyme, {
        rate: 0.9,
        pitch: 1.1
      });
    }
  }

  // -----------------------------------------------------------------
  // SAND CANVAS & GLOWING PARTICLE STROKE ENGINE
  // -----------------------------------------------------------------
  function initSandCanvas() {
    if (!dom.sandCanvas) return;
    sandCtx = dom.sandCanvas.getContext('2d');
    if (!sandCtx) return;

    dom.sandCanvas.width = 760;
    dom.sandCanvas.height = 420;

    initSandEvents();
    startParticleAnimationLoop();
    clearSandCanvas();
  }

  function resizeAndInitSandCanvas() {
    if (!dom.sandCanvas) return;
    if (!sandCtx) {
      initSandCanvas();
    } else {
      drawLetterStencil(state.activeLetter);
    }
  }

  function getCanvasCoords(e) {
    if (!dom.sandCanvas) return { x: 0, y: 0 };
    const rect = dom.sandCanvas.getBoundingClientRect();
    const scaleX = dom.sandCanvas.width / rect.width;
    const scaleY = dom.sandCanvas.height / rect.height;

    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function initSandEvents() {
    const canvas = dom.sandCanvas;
    if (!canvas) return;

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startSandStroke(getCanvasCoords(e));
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isTracing) return;
      e.preventDefault();
      continueSandStroke(getCanvasCoords(e));
    });

    window.addEventListener('mouseup', () => {
      if (state.isTracing) endSandStroke();
    });

    // Touch Events
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startSandStroke(getCanvasCoords(e));
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (!state.isTracing) return;
      e.preventDefault();
      continueSandStroke(getCanvasCoords(e));
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
      if (state.isTracing) endSandStroke();
    });
  }

  function startSandStroke(pos) {
    state.isTracing = true;
    state.lastX = pos.x;
    state.lastY = pos.y;
    spawnSandParticles(pos.x, pos.y, 12);
  }

  function continueSandStroke(pos) {
    if (!sandCtx || !state.isTracing) return;

    // Draw glowing stroke line
    sandCtx.save();
    sandCtx.beginPath();
    sandCtx.moveTo(state.lastX, state.lastY);
    sandCtx.lineTo(pos.x, pos.y);
    sandCtx.lineCap = 'round';
    sandCtx.lineJoin = 'round';
    sandCtx.lineWidth = state.strokeWidth;
    sandCtx.strokeStyle = state.glowColor;
    sandCtx.shadowColor = state.glowColor;
    sandCtx.shadowBlur = 16;
    sandCtx.stroke();
    sandCtx.restore();

    // Spawn trailing sparkling sand particles along the stroke vector
    const dx = pos.x - state.lastX;
    const dy = pos.y - state.lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const stepCount = Math.max(1, Math.floor(dist / 6));

    for (let i = 0; i < stepCount; i++) {
      const interpX = state.lastX + (dx * (i / stepCount));
      const interpY = state.lastY + (dy * (i / stepCount));
      spawnSandParticles(interpX, interpY, 2);
    }

    state.lastX = pos.x;
    state.lastY = pos.y;
    state.tracedStrokeCount++;
  }

  function endSandStroke() {
    state.isTracing = false;
    state.tracedLetters.add(state.activeLetter);
    if (dom.sandStrokeCountText) {
      dom.sandStrokeCountText.textContent = `Strokes traced: ${state.tracedStrokeCount}`;
    }
    updateQuickTrophyBadgeCount();
  }

  // Sparkling Sand Particle System
  function spawnSandParticles(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.5;
      state.particles.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        alpha: 1.0,
        color: state.glowColor,
        life: 0,
        maxLife: Math.floor(Math.random() * 25 + 20)
      });
    }

    // Limit particles array to 250 for silky smooth performance
    if (state.particles.length > 250) {
      state.particles.splice(0, state.particles.length - 250);
    }
  }

  function startParticleAnimationLoop() {
    if (state.animationFrameId) cancelAnimationFrame(state.animationFrameId);

    function loop() {
      renderActiveParticles();
      state.animationFrameId = requestAnimationFrame(loop);
    }
    loop();
  }

  function renderActiveParticles() {
    if (!sandCtx || state.particles.length === 0) return;

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.life++;
      p.alpha = 1.0 - (p.life / p.maxLife);

      if (p.life >= p.maxLife || p.alpha <= 0) {
        state.particles.splice(i, 1);
        continue;
      }

      sandCtx.save();
      sandCtx.beginPath();
      sandCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      sandCtx.fillStyle = p.color;
      sandCtx.globalAlpha = p.alpha;
      sandCtx.shadowColor = p.color;
      sandCtx.shadowBlur = 8;
      sandCtx.fill();
      sandCtx.restore();
    }
  }

  // Draw Stencil Guidelines & Letter Stencil Outline
  function clearSandCanvas() {
    if (!sandCtx || !dom.sandCanvas) return;
    const w = dom.sandCanvas.width;
    const h = dom.sandCanvas.height;

    // Tactile Sand Base Fill
    sandCtx.fillStyle = '#161D2E';
    sandCtx.fillRect(0, 0, w, h);

    // Fine Tactile Sand Texture Noise
    sandCtx.save();
    sandCtx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h;
      sandCtx.fillRect(rx, ry, 1.5, 1.5);
    }
    sandCtx.restore();

    // 4 Handwriting Guidelines: Sky (y=80), Midline (y=190), Grass (y=300), Descender (y=380)
    drawHandwritingGuidelines(w);

    // Draw Stencil Outline for selected letter
    drawLetterStencil(state.activeLetter);

    state.particles = [];
  }

  function drawHandwritingGuidelines(w) {
    if (!sandCtx) return;

    sandCtx.save();
    sandCtx.lineWidth = 1.5;

    // 1. Sky Line (Top) - Cyan dashed
    sandCtx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
    sandCtx.setLineDash([8, 8]);
    sandCtx.beginPath();
    sandCtx.moveTo(40, 80);
    sandCtx.lineTo(w - 40, 80);
    sandCtx.stroke();

    // 2. Midline (Belt) - Amber dashed
    sandCtx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
    sandCtx.setLineDash([6, 6]);
    sandCtx.beginPath();
    sandCtx.moveTo(40, 190);
    sandCtx.lineTo(w - 40, 190);
    sandCtx.stroke();

    // 3. Grass Line (Base) - Green solid
    sandCtx.strokeStyle = 'rgba(52, 211, 153, 0.65)';
    sandCtx.setLineDash([]);
    sandCtx.beginPath();
    sandCtx.moveTo(40, 300);
    sandCtx.lineTo(w - 40, 300);
    sandCtx.stroke();

    // 4. Descender / Water Line (Bottom) - Purple dashed
    sandCtx.strokeStyle = 'rgba(167, 139, 250, 0.4)';
    sandCtx.setLineDash([8, 8]);
    sandCtx.beginPath();
    sandCtx.moveTo(40, 380);
    sandCtx.lineTo(w - 40, 380);
    sandCtx.stroke();

    // Labels
    sandCtx.font = '11px sans-serif';
    sandCtx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    sandCtx.fillText('☁️ Sky Line', 45, 74);
    sandCtx.fillText('· · · Midline', 45, 184);
    sandCtx.fillText('🌱 Grass Base', 45, 294);
    sandCtx.fillText('🌊 Water/Descender', 45, 374);

    sandCtx.restore();
  }

  function drawLetterStencil(letter) {
    if (!sandCtx || !dom.sandCanvas) return;
    const cx = dom.sandCanvas.width / 2;

    sandCtx.save();
    sandCtx.lineWidth = 26;
    sandCtx.lineCap = 'round';
    sandCtx.lineJoin = 'round';
    sandCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)'; // Subtle guide groove

    if (letter === 'b') {
      // 'b': Stem down (x=cx-60, y=80 -> 300), then belly loop to the right (center=(cx, 245), r=55)
      sandCtx.beginPath();
      sandCtx.moveTo(cx - 60, 80);
      sandCtx.lineTo(cx - 60, 300);
      sandCtx.stroke();

      sandCtx.beginPath();
      sandCtx.arc(cx - 5, 245, 55, -Math.PI / 2, Math.PI / 2, false);
      sandCtx.stroke();

      // Guide indicators
      drawStartCircle(cx - 60, 80, '1 ⬇️');
      drawStartCircle(cx - 60, 245, '2 🔄');
    } else if (letter === 'd') {
      // 'd': Belly curve on the left (center=(cx-5, 245), r=55), then tall stem down (x=cx+50, y=80 -> 300)
      sandCtx.beginPath();
      sandCtx.arc(cx - 5, 245, 55, Math.PI / 2, -Math.PI / 2, false);
      sandCtx.stroke();

      sandCtx.beginPath();
      sandCtx.moveTo(cx + 50, 80);
      sandCtx.lineTo(cx + 50, 300);
      sandCtx.stroke();

      // Guide indicators
      drawStartCircle(cx + 40, 195, '1 ↺');
      drawStartCircle(cx + 50, 80, '2 ⬇️');
    } else if (letter === 'p') {
      // 'p': Descender stem down (x=cx-60, y=190 -> 380), then belly loop to the right (center=(cx-5, 245), r=55)
      sandCtx.beginPath();
      sandCtx.moveTo(cx - 60, 190);
      sandCtx.lineTo(cx - 60, 380);
      sandCtx.stroke();

      sandCtx.beginPath();
      sandCtx.arc(cx - 5, 245, 55, -Math.PI / 2, Math.PI / 2, false);
      sandCtx.stroke();

      // Guide indicators
      drawStartCircle(cx - 60, 190, '1 ⬇️');
      drawStartCircle(cx - 60, 245, '2 🔄');
    } else {
      // 'q': Belly circle on the left, then descender stem down (x=cx+50, y=190 -> 380) with right tail flick
      sandCtx.beginPath();
      sandCtx.arc(cx - 5, 245, 55, 0, Math.PI * 2, false);
      sandCtx.stroke();

      sandCtx.beginPath();
      sandCtx.moveTo(cx + 50, 190);
      sandCtx.lineTo(cx + 50, 380);
      sandCtx.lineTo(cx + 70, 365); // Tail flick
      sandCtx.stroke();

      // Guide indicators
      drawStartCircle(cx + 40, 195, '1 ↺');
      drawStartCircle(cx + 50, 190, '2 ⬇️');
    }

    sandCtx.restore();
  }

  function drawStartCircle(x, y, label) {
    if (!sandCtx) return;
    sandCtx.save();
    sandCtx.beginPath();
    sandCtx.arc(x, y, 14, 0, Math.PI * 2);
    sandCtx.fillStyle = '#059669';
    sandCtx.shadowColor = '#10B981';
    sandCtx.shadowBlur = 8;
    sandCtx.fill();

    sandCtx.fillStyle = '#F8FAFC';
    sandCtx.font = 'bold 11px sans-serif';
    sandCtx.textAlign = 'center';
    sandCtx.textBaseline = 'middle';
    sandCtx.fillText(label, x, y);
    sandCtx.restore();
  }

  function checkSandTracing() {
    if (state.tracedStrokeCount < 10) {
      alert(`Keep tracing letter '${state.activeLetter}' in the sand! Follow the guide line and feel the glowing particle trail.`);
      return;
    }

    // Burst celebration particles
    for (let i = 0; i < 40; i++) {
      spawnSandParticles(
        dom.sandCanvas.width / 2 + (Math.random() - 0.5) * 200,
        dom.sandCanvas.height / 2 + (Math.random() - 0.5) * 150,
        3
      );
    }

    state.tracedLetters.add(state.activeLetter);

    // Award badge if mastered both b and d
    if (state.tracedLetters.has('b') && state.tracedLetters.has('d') && window.StorageService && window.StorageService.awardBadge) {
      window.StorageService.awardBadge({
        id: 'badge-mirror-bd',
        title: 'Mirror Master: b & d Conquered ✍️',
        category: 'Multisensory Tracing',
        description: 'Successfully mastered letter orientation and orientation mnemonics for b vs d.'
      });
    }

    // Award badge if mastered both p and q
    if (state.tracedLetters.has('p') && state.tracedLetters.has('q') && window.StorageService && window.StorageService.awardBadge) {
      window.StorageService.awardBadge({
        id: 'badge-mirror-pq',
        title: 'Mirror Master: p & q Conquered 👑',
        category: 'Multisensory Tracing',
        description: 'Successfully mastered descending letter orientation for p vs q.'
      });
    }

    updateQuickTrophyBadgeCount();

    if (window.SpeechEngine) {
      window.SpeechEngine.speakText(`Shaabaash! You traced letter ${state.activeLetter} beautifully with the sand glow!`, {
        rate: 1.0,
        pitch: 1.15
      });
    }
  }

  function initTracerControls() {
    // Bed Trick Switcher
    if (dom.btnTrickModeBD) dom.btnTrickModeBD.addEventListener('click', () => setBedTrickMode('bd'));
    if (dom.btnTrickModePQ) dom.btnTrickModePQ.addEventListener('click', () => setBedTrickMode('pq'));
    if (dom.btnPlayBedStoryAudio) dom.btnPlayBedStoryAudio.addEventListener('click', playBedTrickAudio);

    // Letter buttons
    if (dom.tracerLetterBtns) {
      dom.tracerLetterBtns.forEach(btn => {
        btn.addEventListener('click', () => selectTracerLetter(btn.dataset.letter, true));
      });
    }

    // Rhyme button
    if (dom.btnTracerSpeakRhyme) dom.btnTracerSpeakRhyme.addEventListener('click', speakTracerRhyme);

    // Glow Swatches
    if (dom.sandColorBtns) {
      dom.sandColorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          dom.sandColorBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.glowColor = btn.dataset.glow || '#F59E0B';
        });
      });
    }

    // Stroke width buttons
    if (dom.btnSandStrokeMed) {
      dom.btnSandStrokeMed.addEventListener('click', () => {
        dom.btnSandStrokeMed.classList.add('active');
        if (dom.btnSandStrokeBold) dom.btnSandStrokeBold.classList.remove('active');
        state.strokeWidth = 10;
      });
    }
    if (dom.btnSandStrokeBold) {
      dom.btnSandStrokeBold.addEventListener('click', () => {
        dom.btnSandStrokeBold.classList.add('active');
        if (dom.btnSandStrokeMed) dom.btnSandStrokeMed.classList.remove('active');
        state.strokeWidth = 18;
      });
    }

    // Canvas actions
    if (dom.btnSandClear) dom.btnSandClear.addEventListener('click', clearSandCanvas);
    if (dom.btnSandCheckTrace) dom.btnSandCheckTrace.addEventListener('click', checkSandTracing);

    setBedTrickMode('bd');
  }

  // ===================================================================
  // 5. TROPHY WALL & SUPERPOWER BADGES
  // ===================================================================
  const ALL_SUPERPOWER_BADGES = [
    {
      id: 'badge-monsoon-drain',
      title: '3D Spatial Architect 🏆',
      icon: '🏆',
      category: 'Lateral Engineering',
      desc: 'Designed a 3D raised cage diversion for blocked municipal storm drains.'
    },
    {
      id: 'badge-desert-cooler',
      title: 'Jugaad Systems Innovator 🛠️',
      icon: '🛠️',
      category: 'Passive Systems',
      desc: 'Engineered zero-electricity capillary drip troughs for desert coolers.'
    },
    {
      id: 'badge-heavy-bag-climber',
      title: 'Mechanical Systems Genius ⚙️',
      icon: '⚙️',
      category: 'Mechanics',
      desc: 'Invented tri-star rotating wheel cluster for staircase heavy load transport.'
    },
    {
      id: 'badge-viva-master',
      title: 'Oral Viva Concept Master 🗣️',
      icon: '🗣️',
      category: 'Oral Assessment',
      desc: 'Scored 9.5+ on verbal conceptual explanation without spelling friction.'
    },
    {
      id: 'badge-mirror-bd',
      title: 'Mirror Master: b & d Conquered ✍️',
      icon: '✍️',
      category: 'Multisensory Tracing',
      desc: 'Overcame b vs d mirror invariance using the tactile b-e-d Thumbs Trick.'
    },
    {
      id: 'badge-mirror-pq',
      title: 'Mirror Master: p & q Conquered 👑',
      icon: '👑',
      category: 'Multisensory Tracing',
      desc: 'Mastered descending letter orientation for p and q in glowing sand.'
    }
  ];

  function renderTrophyWall() {
    const unlockedBadges = window.StorageService ? window.StorageService.getBadges() : [];
    const vivasHistory = window.StorageService ? window.StorageService.getVivaHistory() : [];

    if (dom.trophyVivaCount) {
      dom.trophyVivaCount.textContent = vivasHistory.length;
    }

    if (dom.trophyBadgeCount) {
      dom.trophyBadgeCount.textContent = `${unlockedBadges.length} / ${ALL_SUPERPOWER_BADGES.length}`;
    }

    if (dom.trophyLetterMastery) {
      dom.trophyLetterMastery.textContent = `${state.tracedLetters.size} / 4`;
    }

    if (dom.trophyGridContainer) {
      dom.trophyGridContainer.innerHTML = '';

      ALL_SUPERPOWER_BADGES.forEach(badgeDef => {
        const isUnlocked = unlockedBadges.some(b => b.id === badgeDef.id || b.title === badgeDef.title);
        const card = document.createElement('div');
        card.className = `trophy-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.innerHTML = `
          <div class="trophy-badge-icon">${badgeDef.icon}</div>
          <div>
            <div style="font-weight: 700; font-size: 1rem; color: var(--text-primary); margin-bottom: 2px;">
              ${escapeHtml(badgeDef.title)}
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; color: ${isUnlocked ? 'var(--accent-amber)' : 'var(--text-muted)'}; margin-bottom: 4px;">
              ${isUnlocked ? '⭐ Unlocked & Active' : '🔒 Locked (Complete Challenge)'}
            </div>
            <div style="font-size: 0.84rem; line-height: 1.5; color: var(--text-muted);">
              ${escapeHtml(badgeDef.desc)}
            </div>
          </div>
        `;
        dom.trophyGridContainer.appendChild(card);
      });
    }

    updateQuickTrophyBadgeCount();
  }

  function updateQuickTrophyBadgeCount() {
    const unlocked = window.StorageService ? window.StorageService.getBadges() : [];
    if (dom.quickTrophyCountLabel) {
      dom.quickTrophyCountLabel.textContent = `${unlocked.length} Badges Unlocked`;
    }
  }

  // ===================================================================
  // 6. INITIALIZATION & PUBLIC API
  // ===================================================================
  function init() {
    cacheDom();
    initSubNavListeners();
    initVivaControls();
    initLateralControls();
    initTracerControls();
    updateQuickTrophyBadgeCount();

    // Listen for badge award events across tabs
    window.addEventListener('superpowerBadgeAwarded', () => {
      updateQuickTrophyBadgeCount();
      if (state.activeSubArena === 'trophies') renderTrophyWall();
    });

    // Listen for tab switch to gym
    window.addEventListener('tabChanged', (e) => {
      if (e.detail && e.detail.tabId === 'tab-gym') {
        updateQuickTrophyBadgeCount();
        if (state.activeSubArena === 'tracer') {
          setTimeout(() => resizeAndInitSandCanvas(), 50);
        } else if (state.activeSubArena === 'trophies') {
          renderTrophyWall();
        }
      }
    });

    console.log('%c⚡ MindForge Brain Gym Active: Oral Viva, Lateral IQ & Sand Tracer Ready', 'color: #6D28D9; font-weight: bold;');
  }

  const BrainGym = {
    init,
    switchSubArena,
    selectVivaTopic,
    selectLateralChallenge,
    selectTracerLetter,
    getBadges: () => (window.StorageService ? window.StorageService.getBadges() : [])
  };

  // Expose globally
  window.BrainGym = BrainGym;

  // Bootstrapping
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BrainGym.init());
  } else {
    BrainGym.init();
  }

})(window, document);
