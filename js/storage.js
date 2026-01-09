var Storage = (function() {
    'use strict';

    var STORAGE_KEY = 'speech-to-text-content';
    var LANGUAGE_KEY = 'speech-to-text-language';
    var THEME_KEY = 'speech-to-text-theme';
    var WORD_TARGET_KEY = 'speech-to-text-word-target';
    var SESSION_HISTORY_KEY = 'speech-to-text-sessions';
    var MAX_STORAGE_SIZE = 5 * 1024 * 1024;
    var MAX_SESSIONS = 3;

    var saveTimeout = null;
    var DEBOUNCE_DELAY = 500;

    function isAvailable() {
        try {
            var test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    function getByteSize(str) {
        return new Blob([str]).size;
    }

    function saveContent(content) {
        if (!isAvailable()) {
            return false;
        }

        if (saveTimeout) {
            clearTimeout(saveTimeout);
        }

        saveTimeout = setTimeout(function() {
            try {
                var size = getByteSize(content);
                if (size > MAX_STORAGE_SIZE) {
                    return false;
                }
                localStorage.setItem(STORAGE_KEY, content);
                return true;
            } catch (e) {
                return false;
            }
        }, DEBOUNCE_DELAY);

        return true;
    }

    function loadContent() {
        if (!isAvailable()) {
            return '';
        }

        try {
            return localStorage.getItem(STORAGE_KEY) || '';
        } catch (e) {
            return '';
        }
    }

    function clearContent() {
        if (!isAvailable()) {
            return false;
        }

        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            return false;
        }
    }

    function saveLanguage(language) {
        if (!isAvailable()) {
            return false;
        }

        try {
            localStorage.setItem(LANGUAGE_KEY, language);
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadLanguage() {
        if (!isAvailable()) {
            return '';
        }

        try {
            return localStorage.getItem(LANGUAGE_KEY) || '';
        } catch (e) {
            return '';
        }
    }

    function saveTheme(theme) {
        if (!isAvailable()) {
            return false;
        }

        try {
            localStorage.setItem(THEME_KEY, theme);
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadTheme() {
        if (!isAvailable()) {
            return 'light';
        }

        try {
            return localStorage.getItem(THEME_KEY) || 'light';
        } catch (e) {
            return 'light';
        }
    }

    function saveWordTarget(target) {
        if (!isAvailable()) {
            return false;
        }

        try {
            if (target && target > 0) {
                localStorage.setItem(WORD_TARGET_KEY, target.toString());
            } else {
                localStorage.removeItem(WORD_TARGET_KEY);
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadWordTarget() {
        if (!isAvailable()) {
            return 0;
        }

        try {
            var target = localStorage.getItem(WORD_TARGET_KEY);
            return target ? parseInt(target, 10) : 0;
        } catch (e) {
            return 0;
        }
    }

    function formatSessionTime(timestamp) {
        var date = new Date(timestamp);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var month = months[date.getMonth()];
        var day = date.getDate();
        
        return month + ' ' + day + ', ' + hours + ':' + minutes + ' ' + ampm;
    }

    function saveSession(content) {
        if (!isAvailable()) {
            return false;
        }

        if (!content || !content.trim()) {
            return false;
        }

        try {
            var sessions = loadSessions();
            
            var newSession = {
                timestamp: Date.now(),
                content: content.trim(),
                preview: content.trim().substring(0, 100)
            };

            sessions.unshift(newSession);

            if (sessions.length > MAX_SESSIONS) {
                sessions = sessions.slice(0, MAX_SESSIONS);
            }

            var totalSize = getByteSize(JSON.stringify(sessions));
            if (totalSize > MAX_STORAGE_SIZE / 2) {
                sessions = sessions.slice(0, 1);
            }

            localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(sessions));
            return true;
        } catch (e) {
            return false;
        }
    }

    function loadSessions() {
        if (!isAvailable()) {
            return [];
        }

        try {
            var data = localStorage.getItem(SESSION_HISTORY_KEY);
            if (!data) {
                return [];
            }
            var sessions = JSON.parse(data);
            if (!Array.isArray(sessions)) {
                return [];
            }
            return sessions;
        } catch (e) {
            return [];
        }
    }

    function getSessionCount() {
        return loadSessions().length;
    }

    function getLastSession() {
        var sessions = loadSessions();
        if (sessions.length === 0) {
            return null;
        }
        return sessions[0];
    }

    function getSessionByIndex(index) {
        var sessions = loadSessions();
        if (index < 0 || index >= sessions.length) {
            return null;
        }
        return sessions[index];
    }

    function clearSessions() {
        if (!isAvailable()) {
            return false;
        }

        try {
            localStorage.removeItem(SESSION_HISTORY_KEY);
            return true;
        } catch (e) {
            return false;
        }
    }

    return {
        isAvailable: isAvailable,
        saveContent: saveContent,
        loadContent: loadContent,
        clearContent: clearContent,
        saveLanguage: saveLanguage,
        loadLanguage: loadLanguage,
        saveTheme: saveTheme,
        loadTheme: loadTheme,
        saveWordTarget: saveWordTarget,
        loadWordTarget: loadWordTarget,
        saveSession: saveSession,
        loadSessions: loadSessions,
        getSessionCount: getSessionCount,
        getLastSession: getLastSession,
        getSessionByIndex: getSessionByIndex,
        clearSessions: clearSessions,
        formatSessionTime: formatSessionTime
    };
})();
