/**
 * MINDFORGE - Storage & Brain Profile Service
 * Manages localStorage for Dyslexia Brain Profile settings, Gemini API Key,
 * and user learning metrics.
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    BRAIN_PROFILE: 'mindforge_brain_profile',
    GEMINI_KEY: 'mindforge_gemini_key',
    STUDY_STATS: 'mindforge_study_stats',
    ACTIVE_TAB: 'mindforge_active_tab',
    SUPERPOWER_BADGES: 'mindforge_superpower_badges',
    VIVA_HISTORY: 'mindforge_viva_history',
    CUSTOM_LESSONS: 'mindforge_custom_lessons'
  };

  /**
   * One-time automated migration from legacy storage keys to mindforge_
   */
  function migrateLegacyStorage() {
    try {
      const legacyPrefix = ['neuro', 'spark_'].join('');
      Object.keys(STORAGE_KEYS).forEach((k) => {
        const newKey = STORAGE_KEYS[k];
        const oldKey = newKey.replace('mindforge_', legacyPrefix);
        if (localStorage.getItem(newKey) === null) {
          const oldVal = localStorage.getItem(oldKey);
          if (oldVal !== null) {
            localStorage.setItem(newKey, oldVal);
          }
        }
      });
      const oldNotesKey = ['neuro', 'spark_saved_masterpieces'].join('');
      if (localStorage.getItem('mindforge_saved_masterpieces') === null && localStorage.getItem(oldNotesKey) !== null) {
        localStorage.setItem('mindforge_saved_masterpieces', localStorage.getItem(oldNotesKey));
      }
    } catch (e) {
      console.warn('[Storage] Legacy migration check skipped:', e);
    }
  }

  migrateLegacyStorage();

  const DEFAULT_PROFILE = {
    theme: 'cream',           // 'cream' | 'yellow' | 'mint' | 'sky' | 'dark-comfort'
    font: 'lexend',           // 'lexend' | 'opendyslexic'
    fontSize: 18,             // px: 16 to 26
    letterSpacing: 0.12,      // em: 0.08 to 0.25
    wordSpacing: 0.28,        // em: 0.15 to 0.45
    lineHeight: 1.85,         // unitless: 1.5 to 2.4
    bionicEnabled: false,
    syllablesEnabled: false,
    rulerEnabled: false,
    speechRate: 1.0,
    hasOnboarded: false
  };

  const DEFAULT_STATS = {
    totalFocusMinutes: 0,
    breaksTaken: 0,
    completedVivas: 0,
    createdSketches: 0
  };

  const StorageService = {
    /**
     * Retrieve the current Brain Profile with fallback to defaults
     */
    getProfile: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.BRAIN_PROFILE);
        if (!raw) return { ...DEFAULT_PROFILE };
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_PROFILE, ...parsed };
      } catch (err) {
        console.warn('[Storage] Error reading brain profile, using default:', err);
        return { ...DEFAULT_PROFILE };
      }
    },

    /**
     * Save the updated Brain Profile to localStorage and apply CSS rules
     */
    saveProfile: function (updates) {
      try {
        const current = this.getProfile();
        const updated = { ...current, ...updates };
        localStorage.setItem(STORAGE_KEYS.BRAIN_PROFILE, JSON.stringify(updated));
        this.applyProfile(updated);
        window.dispatchEvent(new CustomEvent('brainProfileUpdated', { detail: updated }));
        return updated;
      } catch (err) {
        console.error('[Storage] Error saving brain profile:', err);
        return updates;
      }
    },

    /**
     * Reset Brain Profile back to standard BDA recommended defaults
     */
    resetProfile: function () {
      try {
        localStorage.removeItem(STORAGE_KEYS.BRAIN_PROFILE);
        const defaults = { ...DEFAULT_PROFILE, hasOnboarded: true };
        this.saveProfile(defaults);
        return defaults;
      } catch (err) {
        console.error('[Storage] Error resetting profile:', err);
        return DEFAULT_PROFILE;
      }
    },

    /**
     * Apply profile settings to document root (CSS variables & data attributes)
     */
    applyProfile: function (profile) {
      const p = profile || this.getProfile();
      const root = document.documentElement;

      // 1. Color overlay theme
      if (p.theme === 'cream') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', p.theme);
      }

      // 2. Font family
      root.setAttribute('data-font', p.font === 'opendyslexic' ? 'opendyslexic' : 'lexend');

      // 3. Dynamic typography CSS variables
      root.style.setProperty('--base-font-size', `${p.fontSize}px`);
      root.style.setProperty('--letter-spacing', `${p.letterSpacing}em`);
      root.style.setProperty('--word-spacing', `${p.wordSpacing}em`);
      root.style.setProperty('--line-height', p.lineHeight);

      // 4. Update ruler display if present
      const ruler = document.getElementById('readingRulerOverlay');
      if (ruler) {
        if (p.rulerEnabled) {
          ruler.classList.add('active');
        } else {
          ruler.classList.remove('active');
        }
      }
    },

    /**
     * Get user-supplied Gemini API Key
     */
    getApiKey: function () {
      try {
        return localStorage.getItem(STORAGE_KEYS.GEMINI_KEY) || '';
      } catch (e) {
        return '';
      }
    },

    /**
     * Set user-supplied Gemini API Key
     */
    setApiKey: function (key) {
      try {
        const trimmed = (key || '').trim();
        if (trimmed) {
          localStorage.setItem(STORAGE_KEYS.GEMINI_KEY, trimmed);
        } else {
          localStorage.removeItem(STORAGE_KEYS.GEMINI_KEY);
        }
        window.dispatchEvent(new CustomEvent('geminiKeyUpdated', { detail: { hasKey: Boolean(trimmed) } }));
      } catch (e) {
        console.error('[Storage] Error saving API key:', e);
      }
    },

    /**
     * Clear stored Gemini API Key
     */
    clearApiKey: function () {
      this.setApiKey('');
    },

    /**
     * Completely wipe all MindForge keys, session storage, and offline app caches
     */
    wipeAllLocalData: function () {
      try {
        const legacyPrefix = ['neuro', 'spark_'].join('');
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('mindforge_') || k.startsWith(legacyPrefix))) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));

        try {
          sessionStorage.clear();
        } catch (se) {
          console.warn('[Storage] Session storage clear skipped:', se);
        }

        if (window.caches && typeof window.caches.keys === 'function') {
          window.caches.keys().then(cacheNames => {
            return Promise.all(cacheNames.map(name => window.caches.delete(name)));
          }).catch(ce => {
            console.warn('[Storage] Cache clear error:', ce);
          });
        }

        this.applyProfile(DEFAULT_PROFILE);
        window.dispatchEvent(new CustomEvent('geminiKeyUpdated', { detail: { hasKey: false } }));
        window.dispatchEvent(new CustomEvent('mindforgeDataWiped'));
        return true;
      } catch (err) {
        console.error('[Storage] Error wiping local data:', err);
        return false;
      }
    },

    /**
     * Check if user is using an API key or offline smart demo mode
     */
    hasApiKey: function () {
      return Boolean(this.getApiKey());
    },

    /**
     * User learning statistics
     */
    getStats: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.STUDY_STATS);
        return raw ? { ...DEFAULT_STATS, ...JSON.parse(raw) } : { ...DEFAULT_STATS };
      } catch (e) {
        return { ...DEFAULT_STATS };
      }
    },

    incrementStat: function (key, amount = 1) {
      try {
        const stats = this.getStats();
        stats[key] = (stats[key] || 0) + amount;
        localStorage.setItem(STORAGE_KEYS.STUDY_STATS, JSON.stringify(stats));
        return stats;
      } catch (e) {
        console.error('[Storage] Error incrementing stat:', e);
      }
    },

    /**
     * Last active tab navigation memory
     */
    getActiveTab: function () {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB) || 'tab-read';
    },

    setActiveTab: function (tabId) {
      try {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, tabId);
      } catch (e) { }
    },

    /**
     * Dyslexic Advantage Superpower Badges
     */
    getBadges: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.SUPERPOWER_BADGES);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    awardBadge: function (badge) {
      try {
        const current = this.getBadges();
        const existingIdx = current.findIndex(b => b.id === badge.id || b.title === badge.title);
        if (existingIdx >= 0) {
          current[existingIdx] = { ...current[existingIdx], ...badge, unlockedAt: Date.now() };
        } else {
          current.push({ ...badge, unlockedAt: Date.now() });
        }
        localStorage.setItem(STORAGE_KEYS.SUPERPOWER_BADGES, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('superpowerBadgeAwarded', { detail: badge }));
        return current;
      } catch (e) {
        console.error('[Storage] Error saving badge:', e);
        return [];
      }
    },

    /**
     * Oral Viva History
     */
    getVivaHistory: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.VIVA_HISTORY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    saveVivaResult: function (result) {
      try {
        const current = this.getVivaHistory();
        current.unshift({ ...result, timestamp: Date.now() });
        // Keep latest 20
        const trimmed = current.slice(0, 20);
        localStorage.setItem(STORAGE_KEYS.VIVA_HISTORY, JSON.stringify(trimmed));
        this.incrementStat('completedVivas', 1);
        window.dispatchEvent(new CustomEvent('vivaCompleted', { detail: result }));
        return trimmed;
      } catch (e) {
        console.error('[Storage] Error saving viva result:', e);
        return [];
      }
    },

    /**
     * Custom Uploaded & Pasted Study Lessons
     */
    getCustomLessons: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LESSONS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    },

    saveCustomLesson: function (lesson) {
      try {
        const current = this.getCustomLessons();
        const existingIdx = current.findIndex(l => l.id === lesson.id);
        if (existingIdx >= 0) {
          current[existingIdx] = lesson;
        } else {
          current.unshift(lesson);
        }
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('customLessonSaved', { detail: lesson }));
        return current;
      } catch (e) {
        console.error('[Storage] Error saving custom lesson:', e);
        return [];
      }
    },

    deleteCustomLesson: function (lessonId) {
      try {
        let current = this.getCustomLessons();
        current = current.filter(l => l.id !== lessonId);
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LESSONS, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('customLessonDeleted', { detail: { lessonId } }));
        return current;
      } catch (e) {
        return [];
      }
    }
  };

  // Expose globally
  window.StorageService = StorageService;

  // Auto-apply profile immediately as soon as DOM starts parsing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => StorageService.applyProfile());
  } else {
    StorageService.applyProfile();
  }

})(window);
