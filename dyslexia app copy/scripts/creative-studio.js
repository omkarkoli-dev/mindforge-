/**
 * MINDFORGE - Creative Studio ("Think & Create" Multimodal Upper Hand Studio)
 * 
 * Implements:
 * 1. Interactive HTML5 <canvas> Whiteboard:
 *    - Freehand pen, 6 dyslexia-safe high-contrast colors, stroke widths (2, 4, 8)
 *    - Shape tools: Box (rectangle), Circle (ellipse), Arrow (directional flow)
 *    - Eraser, Undo/Redo history stack (up to 25 states), and Clear Canvas
 *    - Subtle spatial grid pattern toggle & PNG download
 *    - Complete "Smart Rainwater Harvester" demo schematic drawing engine
 * 
 * 2. Simultaneous Voice Ideation:
 *    - webkitSpeechRecognition / SpeechRecognition continuous listener
 *    - Live speech streaming directly into an editable transcript box
 *    - Real-time word counter and quick concept tags
 *    - "💡 Sample: Smart Rainwater Harvester Idea" 1-click demo filler
 * 
 * 3. Multimodal Masterpiece Generator:
 *    - Combines canvas.toDataURL('image/png') + spoken transcript
 *    - Sends to Gemini 2.5 Flash Multimodal API (with seamless offline DemoData fallback)
 *    - Synthesizes 3 structured sub-tabs:
 *      1. 📝 Academic Project Report / School Essay
 *      2. 🎯 Key Conceptual Bullet Points & Scientific Principles
 *      3. 🚀 Real-World Engineering Upgrade Ideas
 * 
 * 4. Audio Playback & Utilities:
 *    - 🔊 "Read My Generated Essay" using SpeechEngine TTS
 *    - 📋 "Copy Text" to clipboard
 *    - 💾 "Save to Brain Notes"
 */

(function (window, document) {
  'use strict';

  // Internal Studio State
  const state = {
    // Whiteboard Canvas
    isDrawing: false,
    currentTool: 'pen', // 'pen' | 'rect' | 'circle' | 'arrow' | 'eraser'
    currentColor: '#1E293B',
    currentStrokeWidth: 4,
    startX: 0,
    startY: 0,
    snapshot: null,
    history: [],
    historyIndex: -1,
    maxHistory: 25,
    hasDrawn: false,

    // Voice Ideation
    isListening: false,
    recognition: null,
    transcriptText: '',

    // Masterpiece Result
    activeMasterpiece: null,
    isGenerating: false,
    isReadingEssay: false,
    activeSubtab: 'essay' // 'essay' | 'bullets' | 'upgrades'
  };

  // DOM Elements Cache
  let dom = {};

  /**
   * Cache all relevant DOM elements for Tab 2
   */
  function cacheDom() {
    dom = {
      // Whiteboard Elements
      canvas: document.getElementById('studioCanvas'),
      canvasWrapper: document.getElementById('canvasWrapper'),
      canvasEmptyHint: document.getElementById('canvasEmptyHint'),
      toolBtns: document.querySelectorAll('.canvas-tool-btn[data-tool]'),
      colorBtns: document.querySelectorAll('.color-swatch-btn'),
      strokeBtns: document.querySelectorAll('.stroke-chip-btn'),
      btnUndo: document.getElementById('btnUndoCanvas'),
      btnRedo: document.getElementById('btnRedoCanvas'),
      btnToggleGrid: document.getElementById('btnToggleGrid'),
      btnClearCanvas: document.getElementById('btnClearCanvasOnly'),
      btnDownloadSketch: document.getElementById('btnDownloadSketch'),

      // Voice Ideation Elements
      btnVoiceToggle: document.getElementById('btnStudioVoiceToggle'),
      studioMicIcon: document.getElementById('studioMicIcon'),
      studioMicLabel: document.getElementById('studioMicLabel'),
      studioMicDot: document.getElementById('studioMicDot'),
      studioVoiceStatus: document.getElementById('studioVoiceStatus'),
      studioTranscript: document.getElementById('studioVoiceTranscript'),
      studioWordCount: document.getElementById('studioTranscriptWordCount'),
      conceptChips: document.querySelectorAll('.concept-chip'),

      // Top Header & Reset Actions
      btnLoadDemo: document.getElementById('btnLoadStudioDemo'),
      btnClearAll: document.getElementById('btnClearStudioAll'),

      // Masterpiece Trigger & Progress
      btnGenerateMasterpiece: document.getElementById('btnGenerateMasterpiece'),
      masterpieceProgress: document.getElementById('masterpieceProgress'),
      masterpieceProgressText: document.getElementById('masterpieceProgressText'),

      // Masterpiece Results Display
      masterpieceResultSection: document.getElementById('masterpieceResultSection'),
      masterpieceSourceBadge: document.getElementById('masterpieceSourceBadge'),
      masterpieceTitle: document.getElementById('masterpieceTitle'),
      btnReadMasterpiece: document.getElementById('btnReadMasterpiece'),
      readMasterpieceIcon: document.getElementById('readMasterpieceIcon'),
      readMasterpieceLabel: document.getElementById('readMasterpieceLabel'),
      btnCopyMasterpiece: document.getElementById('btnCopyMasterpiece'),
      copyMasterpieceLabel: document.getElementById('copyMasterpieceLabel'),
      btnSaveMasterpiece: document.getElementById('btnSaveMasterpiece'),
      saveMasterpieceLabel: document.getElementById('saveMasterpieceLabel'),

      // Subtabs
      subtabBtnEssay: document.getElementById('subtabBtnEssay'),
      subtabBtnBullets: document.getElementById('subtabBtnBullets'),
      subtabBtnUpgrades: document.getElementById('subtabBtnUpgrades'),
      panelEssay: document.getElementById('panelMasterpieceEssay'),
      panelBullets: document.getElementById('panelMasterpieceBullets'),
      panelUpgrades: document.getElementById('panelMasterpieceUpgrades'),
      masterpieceEssayBody: document.getElementById('masterpieceEssayBody'),
      masterpieceBulletsGrid: document.getElementById('masterpieceBulletsGrid'),
      masterpieceUpgradesGrid: document.getElementById('masterpieceUpgradesGrid')
    };
  }

  // ===================================================================
  // 1. WHITEBOARD CANVAS ENGINE
  // ===================================================================
  let ctx = null;

  function initCanvas() {
    if (!dom.canvas) return;
    ctx = dom.canvas.getContext('2d');
    if (!ctx) return;

    // Fixed internal coordinate system for razor-sharp rendering & 1:1 undo/redo
    dom.canvas.width = 800;
    dom.canvas.height = 480;

    // Save initial blank state
    saveCanvasState();

    // Attach Pointer / Mouse / Touch events with passive prevention
    dom.canvas.addEventListener('pointerdown', handlePointerDown);
    dom.canvas.addEventListener('pointermove', handlePointerMove);
    dom.canvas.addEventListener('pointerup', handlePointerUp);
    dom.canvas.addEventListener('pointercancel', handlePointerUp);
    dom.canvas.addEventListener('pointerleave', handlePointerLeave);

    // Toolbar Tools (Pen, Rect, Circle, Arrow, Eraser)
    dom.toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        setTool(tool);
      });
    });

    // Color Swatches
    dom.colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        setColor(color);
      });
    });

    // Stroke Thickness
    dom.strokeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const stroke = parseInt(btn.getAttribute('data-stroke'), 10) || 4;
        setStrokeWidth(stroke);
      });
    });

    // Undo / Redo
    if (dom.btnUndo) dom.btnUndo.addEventListener('click', undoCanvas);
    if (dom.btnRedo) dom.btnRedo.addEventListener('click', redoCanvas);

    // Toggle Spatial Grid
    if (dom.btnToggleGrid && dom.canvasWrapper) {
      dom.btnToggleGrid.addEventListener('click', () => {
        dom.canvasWrapper.classList.toggle('grid-pattern');
        const isActive = dom.canvasWrapper.classList.contains('grid-pattern');
        dom.btnToggleGrid.classList.toggle('active', isActive);
      });
    }

    // Clear Canvas Only
    if (dom.btnClearCanvas) {
      dom.btnClearCanvas.addEventListener('click', clearCanvas);
    }

    // Download Sketch Image
    if (dom.btnDownloadSketch) {
      dom.btnDownloadSketch.addEventListener('click', downloadSketchImage);
    }

    // Keyboard Shortcuts (Ctrl+Z: Undo, Ctrl+Y: Redo)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (!e.shiftKey) {
          e.preventDefault();
          undoCanvas();
        } else {
          e.preventDefault();
          redoCanvas();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redoCanvas();
      }
    });
  }

  /**
   * Translate viewport PointerEvent to Canvas internal (800x480) coordinates
   */
  function getCanvasCoords(event) {
    const rect = dom.canvas.getBoundingClientRect();
    const scaleX = dom.canvas.width / rect.width;
    const scaleY = dom.canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function handlePointerDown(e) {
    if (!ctx) return;
    try {
      dom.canvas.setPointerCapture(e.pointerId);
    } catch (err) { }

    const coords = getCanvasCoords(e);
    state.isDrawing = true;
    state.startX = coords.x;
    state.startY = coords.y;

    // Hide empty watermark hint
    setEmptyHint(false);

    if (state.currentTool === 'pen' || state.currentTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
      applyStrokeStyles();

      if (state.currentTool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(coords.x, coords.y, state.currentStrokeWidth * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
      }
    } else {
      // For shapes (rect, circle, arrow): capture snapshot to support live preview
      state.snapshot = ctx.getImageData(0, 0, dom.canvas.width, dom.canvas.height);
    }
  }

  function handlePointerMove(e) {
    if (!state.isDrawing || !ctx) return;
    const coords = getCanvasCoords(e);

    if (state.currentTool === 'pen') {
      ctx.globalCompositeOperation = 'source-over';
      applyStrokeStyles();
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (state.currentTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, state.currentStrokeWidth * 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (state.snapshot) {
      // Shape live preview: restore previous frame then render preview shape
      ctx.putImageData(state.snapshot, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      applyStrokeStyles();

      if (state.currentTool === 'rect') {
        const w = coords.x - state.startX;
        const h = coords.y - state.startY;
        ctx.strokeRect(state.startX, state.startY, w, h);
      } else if (state.currentTool === 'circle') {
        const radiusX = Math.abs(coords.x - state.startX) / 2;
        const radiusY = Math.abs(coords.y - state.startY) / 2;
        const centerX = state.startX + (coords.x - state.startX) / 2;
        const centerY = state.startY + (coords.y - state.startY) / 2;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, Math.max(0.1, radiusX), Math.max(0.1, radiusY), 0, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (state.currentTool === 'arrow') {
        drawArrow(ctx, state.startX, state.startY, coords.x, coords.y, state.currentStrokeWidth);
      }
    }
  }

  function handlePointerUp(e) {
    if (!state.isDrawing || !ctx) return;
    state.isDrawing = false;
    ctx.globalCompositeOperation = 'source-over';

    try {
      dom.canvas.releasePointerCapture(e.pointerId);
    } catch (err) { }

    // Commit snapshot history state
    state.snapshot = null;
    saveCanvasState();
    state.hasDrawn = true;
  }

  function handlePointerLeave(e) {
    if (state.isDrawing) {
      handlePointerUp(e);
    }
  }

  function applyStrokeStyles() {
    if (!ctx) return;
    ctx.strokeStyle = state.currentColor;
    ctx.lineWidth = state.currentStrokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  /**
   * Draw directional arrow with proportioned arrowhead
   */
  function drawArrow(context, fromX, fromY, toX, toY, strokeWidth) {
    const headLength = Math.max(14, strokeWidth * 3.5);
    const angle = Math.atan2(toY - fromY, toX - fromX);

    // Main arrow shaft
    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();

    // Arrowhead wings
    context.beginPath();
    context.moveTo(toX, toY);
    context.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    context.moveTo(toX, toY);
    context.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    context.stroke();
  }

  /**
   * Set Active Drawing Tool
   */
  function setTool(tool) {
    state.currentTool = tool;
    dom.toolBtns.forEach(btn => {
      const bTool = btn.getAttribute('data-tool');
      btn.classList.toggle('active', bTool === tool);
    });

    if (dom.canvas) {
      if (tool === 'eraser') {
        dom.canvas.style.cursor = 'cell';
      } else if (tool === 'pen') {
        dom.canvas.style.cursor = 'crosshair';
      } else {
        dom.canvas.style.cursor = 'crosshair';
      }
    }
  }

  /**
   * Set Active Color
   */
  function setColor(color) {
    state.currentColor = color;
    dom.colorBtns.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-color') === color);
    });

    // If eraser was active, switch back to pen
    if (state.currentTool === 'eraser') {
      setTool('pen');
    }
  }

  /**
   * Set Active Stroke Thickness
   */
  function setStrokeWidth(width) {
    state.currentStrokeWidth = width;
    dom.strokeBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-stroke'), 10) === width);
    });
  }

  /**
   * Save current canvas buffer into undo history stack
   */
  function saveCanvasState() {
    if (!ctx) return;
    // Truncate redo branches
    if (state.historyIndex < state.history.length - 1) {
      state.history = state.history.slice(0, state.historyIndex + 1);
    }

    const imgData = ctx.getImageData(0, 0, dom.canvas.width, dom.canvas.height);
    state.history.push(imgData);

    if (state.history.length > state.maxHistory) {
      state.history.shift();
    }
    state.historyIndex = state.history.length - 1;

    updateUndoRedoUI();
  }

  function undoCanvas() {
    if (state.historyIndex > 0 && ctx) {
      state.historyIndex--;
      ctx.putImageData(state.history[state.historyIndex], 0, 0);
      updateUndoRedoUI();
    }
  }

  function redoCanvas() {
    if (state.historyIndex < state.history.length - 1 && ctx) {
      state.historyIndex++;
      ctx.putImageData(state.history[state.historyIndex], 0, 0);
      updateUndoRedoUI();
    }
  }

  function updateUndoRedoUI() {
    if (dom.btnUndo) {
      dom.btnUndo.disabled = state.historyIndex <= 0;
      dom.btnUndo.style.opacity = state.historyIndex <= 0 ? '0.45' : '1';
    }
    if (dom.btnRedo) {
      dom.btnRedo.disabled = state.historyIndex >= state.history.length - 1;
      dom.btnRedo.style.opacity = state.historyIndex >= state.history.length - 1 ? '0.45' : '1';
    }
  }

  function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
    saveCanvasState();
    state.hasDrawn = false;
    setEmptyHint(true);
  }

  function setEmptyHint(show) {
    if (dom.canvasEmptyHint) {
      dom.canvasEmptyHint.classList.toggle('hidden', !show);
    }
  }

  /**
   * Export crisp PNG data URL with solid background
   * (Transparent canvases look dark when fed into Gemini Vision OCR)
   */
  function getCleanCanvasDataURL() {
    if (!dom.canvas) return '';
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = dom.canvas.width;
    tempCanvas.height = dom.canvas.height;
    const tCtx = tempCanvas.getContext('2d');

    // Fill dyslexia-safe warm cream background
    tCtx.fillStyle = '#FDFBF7';
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw active drawing over solid background
    tCtx.drawImage(dom.canvas, 0, 0);
    return tempCanvas.toDataURL('image/png');
  }

  function downloadSketchImage() {
    const dataUrl = getCleanCanvasDataURL();
    const link = document.createElement('a');
    link.download = 'mindforge-creative-sketch.png';
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ===================================================================
  // 2. DEMO SCHEMATIC SKETCH ENGINE ("Smart Rainwater Harvester")
  // ===================================================================
  /**
   * Draws a rich, authentic schematic on the canvas for instant testing
   */
  function drawRainwaterHarvesterDemo() {
    if (!ctx) return;
    clearCanvas();
    setEmptyHint(false);

    ctx.save();

    // 1. Sun & Solar Rays
    ctx.strokeStyle = '#D97706';
    ctx.fillStyle = '#FEF3C7';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(80, 80, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Sun rays
    const rays = [
      [80, 42, 80, 25],
      [112, 60, 126, 48],
      [118, 80, 136, 80],
      [112, 100, 126, 112],
      [48, 60, 34, 48],
      [42, 80, 24, 80]
    ];
    rays.forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // 2. Rain Cloud & Droplets
    ctx.strokeStyle = '#2563EB';
    ctx.fillStyle = '#DBEAFE';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(220, 65, 22, 0, Math.PI * 2);
    ctx.arc(245, 55, 26, 0, Math.PI * 2);
    ctx.arc(275, 62, 22, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Rain drop streaks
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 2;
    const rainDrops = [[215, 100, 205, 125], [235, 105, 225, 130], [255, 100, 245, 125], [275, 108, 265, 132]];
    rainDrops.forEach(([x1, y1, x2, y2]) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });

    // 3. Curved Solar Roof / Water Diverter Canopy
    ctx.strokeStyle = '#1E3A8A';
    ctx.fillStyle = '#BFDBFE';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(140, 155);
    ctx.quadraticCurveTo(270, 135, 380, 175);
    ctx.lineTo(375, 195);
    ctx.quadraticCurveTo(265, 155, 135, 175);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Photovoltaic cell grid lines on canopy
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 1.5;
    [190, 240, 290, 340].forEach(gx => {
      ctx.beginPath();
      ctx.moveTo(gx, 150);
      ctx.lineTo(gx - 5, 185);
      ctx.stroke();
    });

    // 4. Downspout Catchment Pipe
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(380, 185);
    ctx.lineTo(405, 220);
    ctx.lineTo(405, 270);
    ctx.stroke();

    // Flow arrow into filter
    drawArrow(ctx, 405, 225, 405, 260, 3);

    // 5. Multi-Layer Sediment Filter Tank (Cylinder)
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3.5;
    ctx.fillStyle = '#F1F5F9';
    ctx.strokeRect(360, 270, 90, 140);
    ctx.fillRect(360, 270, 90, 140);

    // Layer 1: Coarse Gravel (Top)
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(362, 272, 86, 38);
    ctx.strokeStyle = '#64748B';
    ctx.strokeRect(362, 272, 86, 38);

    // Layer 2: Fine Silica Sand (Middle)
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(362, 312, 86, 45);
    ctx.strokeStyle = '#D97706';
    ctx.strokeRect(362, 312, 86, 45);

    // Layer 3: Activated Charcoal (Bottom)
    ctx.fillStyle = '#334155';
    ctx.fillRect(362, 359, 86, 48);

    // 6. Submersible 12V DC Pump & Battery Box
    ctx.strokeStyle = '#7C3AED';
    ctx.fillStyle = '#EDE9FE';
    ctx.lineWidth = 3;
    ctx.strokeRect(485, 335, 65, 75);
    ctx.fillRect(485, 335, 65, 75);

    // Battery connection wire from roof to pump
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(250, 175);
    ctx.lineTo(250, 320);
    ctx.lineTo(485, 350);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // 7. Water pipe from filter tank into pump
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 4;
    drawArrow(ctx, 450, 380, 485, 380, 3);

    // 8. Irrigation pipe from pump to Terrace Garden
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(550, 375);
    ctx.lineTo(610, 375);
    ctx.lineTo(610, 310);
    ctx.lineTo(650, 310);
    ctx.stroke();
    drawArrow(ctx, 550, 375, 605, 375, 3);

    // 9. Terrace Garden Planter Box & Healthy Plants
    ctx.strokeStyle = '#065F46';
    ctx.fillStyle = '#D1FAE5';
    ctx.lineWidth = 3;
    ctx.strokeRect(650, 290, 120, 120);
    ctx.fillRect(650, 290, 120, 120);

    // Green plant leaves
    ctx.strokeStyle = '#059669';
    ctx.fillStyle = '#10B981';
    ctx.lineWidth = 2.5;
    const plants = [675, 705, 735];
    plants.forEach(px => {
      // Stem
      ctx.beginPath();
      ctx.moveTo(px, 290);
      ctx.lineTo(px, 255);
      ctx.stroke();
      // Leaves
      ctx.beginPath();
      ctx.ellipse(px - 10, 260, 10, 6, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(px + 10, 260, 10, 6, Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // 10. Labels with Dyslexia-safe typography
    ctx.font = 'bold 15px Lexend, sans-serif';
    ctx.fillStyle = '#1E293B';

    ctx.fillText('☀️ Curved Solar Roof Canopy', 120, 125);
    ctx.fillText('💧 Multi-Layer Filter', 330, 255);
    ctx.font = '12px Lexend, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('• Gravel', 370, 295);
    ctx.fillText('• Sand', 370, 335);
    ctx.fillText('• Charcoal', 370, 385);

    ctx.font = 'bold 14px Lexend, sans-serif';
    ctx.fillStyle = '#7C3AED';
    ctx.fillText('⚡ 12V DC Pump', 475, 325);

    ctx.fillStyle = '#065F46';
    ctx.fillText('🌿 Terrace Garden', 650, 235);

    ctx.restore();

    // Commit demo sketch to history
    saveCanvasState();
    state.hasDrawn = true;
  }

  // ===================================================================
  // 3. VOICE IDEATION & WEBSPEECH ENGINE
  // ===================================================================
  function initVoiceEngine() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (dom.btnVoiceToggle) {
      dom.btnVoiceToggle.addEventListener('click', toggleVoiceRecording);
    }

    // Editable transcript input counter
    if (dom.studioTranscript) {
      dom.studioTranscript.addEventListener('input', () => {
        updateWordCount();
      });
    }

    // Quick Concept Chips
    dom.conceptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const concept = chip.getAttribute('data-concept') || chip.textContent.replace('+', '').trim();
        appendConceptToTranscript(concept);
      });
    });

    // Top Demo and Reset Buttons
    if (dom.btnLoadDemo) {
      dom.btnLoadDemo.addEventListener('click', loadRainwaterHarvesterDemo);
    }

    if (dom.btnClearAll) {
      dom.btnClearAll.addEventListener('click', resetStudioAll);
    }
  }

  function toggleVoiceRecording() {
    if (state.isListening) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }

  function startVoiceRecording() {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      updateVoiceStatus('Voice recognition not supported in this browser. Please type or use the sample button.', false);
      return;
    }

    try {
      stopVoiceRecording();

      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN'; // Supports English with natural Hinglish phonetics
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        state.isListening = true;
        updateVoiceRecordingUI(true);
      };

      rec.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const piece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalChunk += piece + ' ';
          } else {
            interim += piece;
          }
        }

        if (finalChunk && dom.studioTranscript) {
          const current = dom.studioTranscript.value;
          dom.studioTranscript.value = (current ? current.trim() + ' ' : '') + finalChunk.trim();
          updateWordCount();
          // Auto scroll to bottom
          dom.studioTranscript.scrollTop = dom.studioTranscript.scrollHeight;
        }

        if (interim && dom.studioVoiceStatus) {
          dom.studioVoiceStatus.textContent = `🎙️ "${interim.slice(-35)}..."`;
        }
      };

      rec.onerror = (e) => {
        console.warn('[CreativeStudio] Recognition error:', e.error);
        if (e.error === 'not-allowed') {
          updateVoiceStatus('Microphone access blocked. Click browser lock icon to allow mic.', false);
          stopVoiceRecording();
        }
      };

      rec.onend = () => {
        if (state.isListening) {
          // Keep continuous recognition alive
          try {
            rec.start();
          } catch (err) {
            stopVoiceRecording();
          }
        } else {
          updateVoiceRecordingUI(false);
        }
      };

      rec.start();
      state.recognition = rec;
    } catch (err) {
      console.error('[CreativeStudio] Failed to start recognition:', err);
      updateVoiceStatus('Could not access microphone.', false);
      updateVoiceRecordingUI(false);
    }
  }

  function stopVoiceRecording() {
    state.isListening = false;
    if (state.recognition) {
      try {
        state.recognition.stop();
      } catch (e) { }
      state.recognition = null;
    }
    updateVoiceRecordingUI(false);
  }

  function updateVoiceRecordingUI(isRecording) {
    if (dom.btnVoiceToggle) {
      dom.btnVoiceToggle.classList.toggle('recording', isRecording);
      dom.btnVoiceToggle.setAttribute('aria-pressed', isRecording ? 'true' : 'false');
    }
    if (dom.studioMicIcon) {
      dom.studioMicIcon.textContent = isRecording ? '⏹️' : '🎤';
    }
    if (dom.studioMicLabel) {
      dom.studioMicLabel.textContent = isRecording ? 'Stop Microphone' : 'Start Speaking';
    }
    if (dom.studioMicDot) {
      dom.studioMicDot.style.display = isRecording ? 'inline-block' : 'none';
    }
    if (dom.studioVoiceStatus) {
      dom.studioVoiceStatus.textContent = isRecording
        ? '🔴 Listening live... Speak your idea in Hinglish or English!'
        : 'Microphone Ready';
    }
  }

  function updateVoiceStatus(msg, isPulsing = false) {
    if (dom.studioVoiceStatus) {
      dom.studioVoiceStatus.textContent = msg;
    }
  }

  function updateWordCount() {
    if (!dom.studioTranscript || !dom.studioWordCount) return;
    const text = dom.studioTranscript.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    dom.studioWordCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
  }

  function appendConceptToTranscript(concept) {
    if (!dom.studioTranscript) return;
    const current = dom.studioTranscript.value.trim();
    if (current) {
      dom.studioTranscript.value = `${current}, ${concept}`;
    } else {
      dom.studioTranscript.value = concept;
    }
    updateWordCount();
    dom.studioTranscript.focus();
  }

  /**
   * Load the built-in "Smart Rainwater Harvester" Sample into both
   * Whiteboard canvas and speech transcript box
   */
  function loadRainwaterHarvesterDemo() {
    // 1. Draw schematic sketch
    drawRainwaterHarvesterDemo();

    // 2. Populate transcript with Hinglish spoken thoughts
    const demo = window.DemoData?.demoSketchMasterpiece;
    const prompt = demo?.studentVoicePrompt ||
      'Yahan upar ek curved solar panel roof hai jo rainwater ko collect karke ek sand-gravel filter pipe mein bhejta hai. Solar battery se ek automatic 12V pump chalta hai jo filtered paani ko terrace kitchen garden mein bhejta hai.';

    if (dom.studioTranscript) {
      dom.studioTranscript.value = prompt;
      updateWordCount();
    }

    if (dom.studioVoiceStatus) {
      dom.studioVoiceStatus.textContent = '💡 Loaded Rainwater Harvester Demo! Click "Turn Sketch + Voice into Masterpiece" below.';
    }
  }

  function resetStudioAll() {
    clearCanvas();
    if (dom.studioTranscript) {
      dom.studioTranscript.value = '';
      updateWordCount();
    }
    stopVoiceRecording();
    if (dom.masterpieceResultSection) {
      dom.masterpieceResultSection.classList.remove('active');
    }
    if (window.SpeechEngine) {
      window.SpeechEngine.stop();
    }
  }

  // ===================================================================
  // 4. MULTIMODAL MASTERPIECE GENERATOR (Gemini 2.5 Flash + Fallback)
  // ===================================================================
  function initMasterpieceControls() {
    if (dom.btnGenerateMasterpiece) {
      dom.btnGenerateMasterpiece.addEventListener('click', generateMasterpiece);
    }

    // Subtab Buttons
    if (dom.subtabBtnEssay) {
      dom.subtabBtnEssay.addEventListener('click', () => switchSubtab('essay'));
    }
    if (dom.subtabBtnBullets) {
      dom.subtabBtnBullets.addEventListener('click', () => switchSubtab('bullets'));
    }
    if (dom.subtabBtnUpgrades) {
      dom.subtabBtnUpgrades.addEventListener('click', () => switchSubtab('upgrades'));
    }

    // Read Aloud Button
    if (dom.btnReadMasterpiece) {
      dom.btnReadMasterpiece.addEventListener('click', toggleReadMasterpiece);
    }

    // Copy Text Button
    if (dom.btnCopyMasterpiece) {
      dom.btnCopyMasterpiece.addEventListener('click', copyMasterpieceToClipboard);
    }

    // Save to Notes Button
    if (dom.btnSaveMasterpiece) {
      dom.btnSaveMasterpiece.addEventListener('click', saveMasterpieceToNotes);
    }
  }

  /**
   * Main synthesis trigger:
   * Captures canvas.toDataURL() + spoken transcript -> Gemini 2.5 Flash
   */
  async function generateMasterpiece() {
    const transcript = dom.studioTranscript ? dom.studioTranscript.value.trim() : '';
    const canvasDataUrl = getCleanCanvasDataURL();

    // Check if user has provided either sketch or voice thoughts
    if (!state.hasDrawn && !transcript) {
      // Friendly auto-prompt: load demo or ask user
      const useDemo = confirm(
        '🎨 Your sketch whiteboard and speech transcript are currently blank!\n\nWould you like to load the "Smart Rainwater Harvester" sample demo to see the magic in action?'
      );
      if (useDemo) {
        loadRainwaterHarvesterDemo();
      }
      return;
    }

    // Stop microphone if currently active
    stopVoiceRecording();

    // Show Progress State
    setGeneratingState(true);

    try {
      let result = null;
      if (window.GeminiService && window.GeminiService.generateSketchMasterpiece) {
        result = await window.GeminiService.generateSketchMasterpiece(canvasDataUrl, transcript);
      } else {
        result = window.DemoData?.demoSketchMasterpiece;
      }

      state.activeMasterpiece = result;
      displayMasterpieceResult(result);

      // Increment student study metrics
      if (window.StorageService) {
        window.StorageService.incrementStat('createdSketches', 1);
      }
    } catch (err) {
      console.warn('[CreativeStudio] Generation error, falling back to demo data:', err);
      const fallback = window.DemoData?.demoSketchMasterpiece;
      state.activeMasterpiece = fallback;
      displayMasterpieceResult(fallback);
    } finally {
      setGeneratingState(false);
    }
  }

  function setGeneratingState(isBusy) {
    state.isGenerating = isBusy;
    if (dom.masterpieceProgress) {
      dom.masterpieceProgress.style.display = isBusy ? 'block' : 'none';
    }
    if (dom.btnGenerateMasterpiece) {
      dom.btnGenerateMasterpiece.disabled = isBusy;
      dom.btnGenerateMasterpiece.style.opacity = isBusy ? '0.6' : '1';
    }
  }

  /**
   * Render Masterpiece Results into Sub-tabs
   */
  function displayMasterpieceResult(data) {
    if (!data || !dom.masterpieceResultSection) return;

    // 1. Title & Source Badge
    if (dom.masterpieceTitle) {
      dom.masterpieceTitle.textContent = data.title || 'Innovative Engineering Project Report';
    }
    if (dom.masterpieceSourceBadge) {
      if (data.source === 'gemini') {
        dom.masterpieceSourceBadge.textContent = '✨ Gemini 2.5 Flash Multimodal Synthesized';
        dom.masterpieceSourceBadge.style.backgroundColor = 'var(--accent-green-light)';
        dom.masterpieceSourceBadge.style.color = 'var(--accent-green)';
      } else {
        dom.masterpieceSourceBadge.textContent = '💡 Offline Smart Demo Mode';
        dom.masterpieceSourceBadge.style.backgroundColor = 'var(--accent-amber-light)';
        dom.masterpieceSourceBadge.style.color = 'var(--accent-amber)';
      }
    }

    // 2. Structured Essay Panel (Markdown to HTML)
    if (dom.masterpieceEssayBody) {
      dom.masterpieceEssayBody.innerHTML = formatMarkdownToHtml(data.generatedReport || '');
    }

    // 3. Key Conceptual Bullets Panel
    if (dom.masterpieceBulletsGrid) {
      const bullets = Array.isArray(data.bulletSummary) ? data.bulletSummary : [data.bulletSummary];
      dom.masterpieceBulletsGrid.innerHTML = bullets.map((item, idx) => `
        <div class="masterpiece-bullet-card">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 1.3rem;">🎯</span>
            <div>
              <strong style="color: var(--accent-blue); display: block; margin-bottom: 4px;">Concept #${idx + 1}</strong>
              <p style="margin: 0; font-size: 0.95rem;">${escapeHtml(item)}</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    // 4. Engineering Upgrades Panel
    if (dom.masterpieceUpgradesGrid) {
      const upgrades = Array.isArray(data.upgradeIdeas) ? data.upgradeIdeas : [data.upgradeIdeas];
      dom.masterpieceUpgradesGrid.innerHTML = upgrades.map((item, idx) => `
        <div class="masterpiece-upgrade-card">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 1.3rem;">🚀</span>
            <div>
              <strong style="color: var(--accent-amber); display: block; margin-bottom: 4px;">Engineering Upgrade #${idx + 1}</strong>
              <p style="margin: 0; font-size: 0.95rem;">${escapeHtml(item)}</p>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Activate Result Section & Switch to Essay Subtab
    dom.masterpieceResultSection.classList.add('active');
    switchSubtab('essay');

    // Smooth scroll to masterpiece card
    dom.masterpieceResultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function switchSubtab(tabName) {
    state.activeSubtab = tabName;

    // Subtab Buttons State
    if (dom.subtabBtnEssay) {
      dom.subtabBtnEssay.classList.toggle('active', tabName === 'essay');
      dom.subtabBtnEssay.setAttribute('aria-selected', tabName === 'essay' ? 'true' : 'false');
    }
    if (dom.subtabBtnBullets) {
      dom.subtabBtnBullets.classList.toggle('active', tabName === 'bullets');
      dom.subtabBtnBullets.setAttribute('aria-selected', tabName === 'bullets' ? 'true' : 'false');
    }
    if (dom.subtabBtnUpgrades) {
      dom.subtabBtnUpgrades.classList.toggle('active', tabName === 'upgrades');
      dom.subtabBtnUpgrades.setAttribute('aria-selected', tabName === 'upgrades' ? 'true' : 'false');
    }

    // Subtab Panels State
    if (dom.panelEssay) dom.panelEssay.classList.toggle('active', tabName === 'essay');
    if (dom.panelBullets) dom.panelBullets.classList.toggle('active', tabName === 'bullets');
    if (dom.panelUpgrades) dom.panelUpgrades.classList.toggle('active', tabName === 'upgrades');
  }

  // ===================================================================
  // 5. AUDIO PLAYBACK & REPORT UTILITIES
  // ===================================================================
  /**
   * "🔊 Read My Generated Essay" button handler
   */
  function toggleReadMasterpiece() {
    if (!state.activeMasterpiece || !window.SpeechEngine) return;

    if (state.isReadingEssay) {
      window.SpeechEngine.stop();
      state.isReadingEssay = false;
      updateReadButtonUI(false);
      return;
    }

    // Extract plain text from report (stripping markdown syntax)
    const cleanText = cleanMarkdownForSpeech(state.activeMasterpiece.generatedReport);
    if (!cleanText) return;

    state.isReadingEssay = true;
    updateReadButtonUI(true);

    window.SpeechEngine.speakText(cleanText, {
      rate: 1.0,
      pitch: 1.0,
      onEnd: () => {
        state.isReadingEssay = false;
        updateReadButtonUI(false);
      },
      onError: () => {
        state.isReadingEssay = false;
        updateReadButtonUI(false);
      }
    });
  }

  function updateReadButtonUI(isPlaying) {
    if (dom.readMasterpieceIcon) {
      dom.readMasterpieceIcon.textContent = isPlaying ? '⏹️' : '🔊';
    }
    if (dom.readMasterpieceLabel) {
      dom.readMasterpieceLabel.textContent = isPlaying ? 'Stop Reading' : 'Read My Generated Essay';
    }
  }

  /**
   * "📋 Copy Text" button handler
   */
  async function copyMasterpieceToClipboard() {
    if (!state.activeMasterpiece) return;

    let textToCopy = '';
    if (state.activeSubtab === 'bullets') {
      textToCopy = (state.activeMasterpiece.bulletSummary || []).join('\n• ');
      textToCopy = 'Key Conceptual Points:\n• ' + textToCopy;
    } else if (state.activeSubtab === 'upgrades') {
      textToCopy = (state.activeMasterpiece.upgradeIdeas || []).join('\n• ');
      textToCopy = 'Real-World Engineering Upgrades:\n• ' + textToCopy;
    } else {
      // Full essay / report
      textToCopy = `# ${state.activeMasterpiece.title}\n\n${state.activeMasterpiece.generatedReport}`;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      if (dom.copyMasterpieceLabel) {
        const orig = dom.copyMasterpieceLabel.textContent;
        dom.copyMasterpieceLabel.textContent = '✅ Copied!';
        setTimeout(() => {
          dom.copyMasterpieceLabel.textContent = orig;
        }, 2200);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  }

  /**
   * "💾 Save to Brain Notes" button handler
   */
  function saveMasterpieceToNotes() {
    if (!state.activeMasterpiece) return;

    try {
      const savedNotesKey = 'mindforge_saved_masterpieces';
      const raw = localStorage.getItem(savedNotesKey);
      const notes = raw ? JSON.parse(raw) : [];

      const newEntry = {
        id: 'note_' + Date.now(),
        date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: state.activeMasterpiece.title,
        report: state.activeMasterpiece.generatedReport,
        bullets: state.activeMasterpiece.bulletSummary,
        upgrades: state.activeMasterpiece.upgradeIdeas
      };

      notes.unshift(newEntry);
      localStorage.setItem(savedNotesKey, JSON.stringify(notes.slice(0, 30)));

      if (dom.saveMasterpieceLabel) {
        const orig = dom.saveMasterpieceLabel.textContent;
        dom.saveMasterpieceLabel.textContent = '🌟 Saved!';
        setTimeout(() => {
          dom.saveMasterpieceLabel.textContent = orig;
        }, 2200);
      }
    } catch (err) {
      console.error('Failed to save to brain notes:', err);
    }
  }

  // ===================================================================
  // 6. DYSLEXIA-SAFE MARKDOWN FORMATTERS & PARSERS
  // ===================================================================
  function formatMarkdownToHtml(markdown) {
    if (!markdown) return '';

    let html = markdown
      // Escape HTML entities
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Unordered Lists
      .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\s*\n/gim, '</p><p>')
      .replace(/\n/gim, '<br>');

    // Wrap floating <li> elements into <ul>
    html = html.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');
    return `<p>${html}</p>`;
  }

  function cleanMarkdownForSpeech(markdown) {
    if (!markdown) return '';
    return markdown
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/-\s+/g, '')
      .replace(/`{1,3}.*?`{1,3}/g, '')
      .replace(/\n+/g, '. ')
      .trim();
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ===================================================================
  // 7. PUBLIC API & BOOTSTRAPPER
  // ===================================================================
  const CreativeStudio = {
    init: function () {
      cacheDom();
      initCanvas();
      initVoiceEngine();
      initMasterpieceControls();
      console.log('%c🎨 MindForge Creative Studio Active: Whiteboard & Voice Multimodal Ready', 'color: #7C3AED; font-weight: bold;');
    },

    loadDemo: function () {
      loadRainwaterHarvesterDemo();
    },

    clearAll: function () {
      resetStudioAll();
    },

    getCanvasDataURL: function () {
      return getCleanCanvasDataURL();
    }
  };

  // Expose globally
  window.CreativeStudio = CreativeStudio;

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CreativeStudio.init());
  } else {
    CreativeStudio.init();
  }

})(window, document);
