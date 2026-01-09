var UI = (function() {
    'use strict';

    var elements = {};
    var wordTarget = 0;

    var LANGUAGES = [
        { code: 'af-ZA', name: 'Afrikaans (South Africa)' },
        { code: 'am-ET', name: 'Amharic (Ethiopia)' },
        { code: 'ar-AE', name: 'Arabic (UAE)' },
        { code: 'ar-BH', name: 'Arabic (Bahrain)' },
        { code: 'ar-DZ', name: 'Arabic (Algeria)' },
        { code: 'ar-EG', name: 'Arabic (Egypt)' },
        { code: 'ar-IL', name: 'Arabic (Israel)' },
        { code: 'ar-IQ', name: 'Arabic (Iraq)' },
        { code: 'ar-JO', name: 'Arabic (Jordan)' },
        { code: 'ar-KW', name: 'Arabic (Kuwait)' },
        { code: 'ar-LB', name: 'Arabic (Lebanon)' },
        { code: 'ar-MA', name: 'Arabic (Morocco)' },
        { code: 'ar-OM', name: 'Arabic (Oman)' },
        { code: 'ar-PS', name: 'Arabic (Palestine)' },
        { code: 'ar-QA', name: 'Arabic (Qatar)' },
        { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
        { code: 'ar-TN', name: 'Arabic (Tunisia)' },
        { code: 'ar-YE', name: 'Arabic (Yemen)' },
        { code: 'az-AZ', name: 'Azerbaijani (Azerbaijan)' },
        { code: 'bg-BG', name: 'Bulgarian (Bulgaria)' },
        { code: 'bn-BD', name: 'Bengali (Bangladesh)' },
        { code: 'bn-IN', name: 'Bengali (India)' },
        { code: 'bs-BA', name: 'Bosnian (Bosnia)' },
        { code: 'ca-ES', name: 'Catalan (Spain)' },
        { code: 'cmn-Hans-CN', name: 'Chinese Mandarin (Simplified, China)' },
        { code: 'cmn-Hans-HK', name: 'Chinese Mandarin (Simplified, Hong Kong)' },
        { code: 'cmn-Hant-TW', name: 'Chinese Mandarin (Traditional, Taiwan)' },
        { code: 'cs-CZ', name: 'Czech (Czech Republic)' },
        { code: 'da-DK', name: 'Danish (Denmark)' },
        { code: 'de-AT', name: 'German (Austria)' },
        { code: 'de-CH', name: 'German (Switzerland)' },
        { code: 'de-DE', name: 'German (Germany)' },
        { code: 'el-GR', name: 'Greek (Greece)' },
        { code: 'en-AU', name: 'English (Australia)' },
        { code: 'en-CA', name: 'English (Canada)' },
        { code: 'en-GB', name: 'English (United Kingdom)' },
        { code: 'en-GH', name: 'English (Ghana)' },
        { code: 'en-IE', name: 'English (Ireland)' },
        { code: 'en-IN', name: 'English (India)' },
        { code: 'en-KE', name: 'English (Kenya)' },
        { code: 'en-NG', name: 'English (Nigeria)' },
        { code: 'en-NZ', name: 'English (New Zealand)' },
        { code: 'en-PH', name: 'English (Philippines)' },
        { code: 'en-SG', name: 'English (Singapore)' },
        { code: 'en-TZ', name: 'English (Tanzania)' },
        { code: 'en-US', name: 'English (United States)' },
        { code: 'en-ZA', name: 'English (South Africa)' },
        { code: 'es-AR', name: 'Spanish (Argentina)' },
        { code: 'es-BO', name: 'Spanish (Bolivia)' },
        { code: 'es-CL', name: 'Spanish (Chile)' },
        { code: 'es-CO', name: 'Spanish (Colombia)' },
        { code: 'es-CR', name: 'Spanish (Costa Rica)' },
        { code: 'es-CU', name: 'Spanish (Cuba)' },
        { code: 'es-DO', name: 'Spanish (Dominican Republic)' },
        { code: 'es-EC', name: 'Spanish (Ecuador)' },
        { code: 'es-ES', name: 'Spanish (Spain)' },
        { code: 'es-GQ', name: 'Spanish (Equatorial Guinea)' },
        { code: 'es-GT', name: 'Spanish (Guatemala)' },
        { code: 'es-HN', name: 'Spanish (Honduras)' },
        { code: 'es-MX', name: 'Spanish (Mexico)' },
        { code: 'es-NI', name: 'Spanish (Nicaragua)' },
        { code: 'es-PA', name: 'Spanish (Panama)' },
        { code: 'es-PE', name: 'Spanish (Peru)' },
        { code: 'es-PR', name: 'Spanish (Puerto Rico)' },
        { code: 'es-PY', name: 'Spanish (Paraguay)' },
        { code: 'es-SV', name: 'Spanish (El Salvador)' },
        { code: 'es-US', name: 'Spanish (United States)' },
        { code: 'es-UY', name: 'Spanish (Uruguay)' },
        { code: 'es-VE', name: 'Spanish (Venezuela)' },
        { code: 'et-EE', name: 'Estonian (Estonia)' },
        { code: 'eu-ES', name: 'Basque (Spain)' },
        { code: 'fa-IR', name: 'Persian (Iran)' },
        { code: 'fi-FI', name: 'Finnish (Finland)' },
        { code: 'fil-PH', name: 'Filipino (Philippines)' },
        { code: 'fr-BE', name: 'French (Belgium)' },
        { code: 'fr-CA', name: 'French (Canada)' },
        { code: 'fr-CH', name: 'French (Switzerland)' },
        { code: 'fr-FR', name: 'French (France)' },
        { code: 'gl-ES', name: 'Galician (Spain)' },
        { code: 'gu-IN', name: 'Gujarati (India)' },
        { code: 'he-IL', name: 'Hebrew (Israel)' },
        { code: 'hi-IN', name: 'Hindi (India)' },
        { code: 'hr-HR', name: 'Croatian (Croatia)' },
        { code: 'hu-HU', name: 'Hungarian (Hungary)' },
        { code: 'hy-AM', name: 'Armenian (Armenia)' },
        { code: 'id-ID', name: 'Indonesian (Indonesia)' },
        { code: 'is-IS', name: 'Icelandic (Iceland)' },
        { code: 'it-CH', name: 'Italian (Switzerland)' },
        { code: 'it-IT', name: 'Italian (Italy)' },
        { code: 'ja-JP', name: 'Japanese (Japan)' },
        { code: 'jv-ID', name: 'Javanese (Indonesia)' },
        { code: 'ka-GE', name: 'Georgian (Georgia)' },
        { code: 'km-KH', name: 'Khmer (Cambodia)' },
        { code: 'kn-IN', name: 'Kannada (India)' },
        { code: 'ko-KR', name: 'Korean (South Korea)' },
        { code: 'lo-LA', name: 'Lao (Laos)' },
        { code: 'lt-LT', name: 'Lithuanian (Lithuania)' },
        { code: 'lv-LV', name: 'Latvian (Latvia)' },
        { code: 'mk-MK', name: 'Macedonian (North Macedonia)' },
        { code: 'ml-IN', name: 'Malayalam (India)' },
        { code: 'mn-MN', name: 'Mongolian (Mongolia)' },
        { code: 'mr-IN', name: 'Marathi (India)' },
        { code: 'ms-MY', name: 'Malay (Malaysia)' },
        { code: 'my-MM', name: 'Burmese (Myanmar)' },
        { code: 'nb-NO', name: 'Norwegian Bokmal (Norway)' },
        { code: 'ne-NP', name: 'Nepali (Nepal)' },
        { code: 'nl-BE', name: 'Dutch (Belgium)' },
        { code: 'nl-NL', name: 'Dutch (Netherlands)' },
        { code: 'pa-Guru-IN', name: 'Punjabi (India)' },
        { code: 'pl-PL', name: 'Polish (Poland)' },
        { code: 'pt-BR', name: 'Portuguese (Brazil)' },
        { code: 'pt-PT', name: 'Portuguese (Portugal)' },
        { code: 'ro-RO', name: 'Romanian (Romania)' },
        { code: 'ru-RU', name: 'Russian (Russia)' },
        { code: 'si-LK', name: 'Sinhala (Sri Lanka)' },
        { code: 'sk-SK', name: 'Slovak (Slovakia)' },
        { code: 'sl-SI', name: 'Slovenian (Slovenia)' },
        { code: 'sq-AL', name: 'Albanian (Albania)' },
        { code: 'sr-RS', name: 'Serbian (Serbia)' },
        { code: 'su-ID', name: 'Sundanese (Indonesia)' },
        { code: 'sv-SE', name: 'Swedish (Sweden)' },
        { code: 'sw-KE', name: 'Swahili (Kenya)' },
        { code: 'sw-TZ', name: 'Swahili (Tanzania)' },
        { code: 'ta-IN', name: 'Tamil (India)' },
        { code: 'ta-LK', name: 'Tamil (Sri Lanka)' },
        { code: 'ta-MY', name: 'Tamil (Malaysia)' },
        { code: 'ta-SG', name: 'Tamil (Singapore)' },
        { code: 'te-IN', name: 'Telugu (India)' },
        { code: 'th-TH', name: 'Thai (Thailand)' },
        { code: 'tr-TR', name: 'Turkish (Turkey)' },
        { code: 'uk-UA', name: 'Ukrainian (Ukraine)' },
        { code: 'ur-IN', name: 'Urdu (India)' },
        { code: 'ur-PK', name: 'Urdu (Pakistan)' },
        { code: 'uz-UZ', name: 'Uzbek (Uzbekistan)' },
        { code: 'vi-VN', name: 'Vietnamese (Vietnam)' },
        { code: 'yue-Hant-HK', name: 'Cantonese (Hong Kong)' },
        { code: 'zu-ZA', name: 'Zulu (South Africa)' }
    ];

    function init() {
        elements = {
            editor: document.getElementById('editor'),
            languageSearch: document.getElementById('language-search'),
            languageSelect: document.getElementById('language-select'),
            themeToggle: document.getElementById('theme-toggle'),
            dictationToggle: document.getElementById('dictation-toggle'),
            clearButton: document.getElementById('clear-button'),
            copyButton: document.getElementById('copy-button'),
            exportButton: document.getElementById('export-button'),
            newSessionButton: document.getElementById('new-session-button'),
            statusLine: document.getElementById('status-line'),
            statsDisplay: document.getElementById('stats-display'),
            interimText: document.getElementById('interim-text'),
            wordTargetInput: document.getElementById('word-target-input'),
            wordTargetSet: document.getElementById('word-target-set'),
            wordTargetClear: document.getElementById('word-target-clear'),
            previousSessionsLink: document.getElementById('previous-sessions-link')
        };

        populateLanguages();
        setupEventListeners();
        loadPreferences();
        updateSessionLinkVisibility();

        return true;
    }

    function populateLanguages() {
        var select = elements.languageSelect;
        
        for (var i = 0; i < LANGUAGES.length; i++) {
            var lang = LANGUAGES[i];
            var option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            select.appendChild(option);
        }
    }

    function updateSessionLinkVisibility() {
        if (elements.previousSessionsLink) {
            var count = Storage.getSessionCount();
            if (count > 0) {
                elements.previousSessionsLink.style.display = '';
            } else {
                elements.previousSessionsLink.style.display = 'none';
            }
        }
    }

    function setupEventListeners() {
        elements.languageSearch.addEventListener('input', function(e) {
            var searchTerm = e.target.value.toLowerCase();
            var options = elements.languageSelect.options;

            for (var i = 1; i < options.length; i++) {
                var option = options[i];
                var text = option.textContent.toLowerCase();
                option.style.display = text.indexOf(searchTerm) !== -1 ? '' : 'none';
            }
        });

        elements.languageSelect.addEventListener('change', function(e) {
            var language = e.target.value;
            if (language) {
                Speech.setLanguage(language);
                Storage.saveLanguage(language);
                elements.dictationToggle.disabled = false;
                setStatus('Ready. Click "Start Dictation" to begin.');
            } else {
                elements.dictationToggle.disabled = true;
                setStatus('Please select a language.');
            }
        });

        elements.themeToggle.addEventListener('click', function() {
            var currentTheme = document.documentElement.getAttribute('data-theme');
            var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            Storage.saveTheme(newTheme);
        });

        elements.dictationToggle.addEventListener('click', function() {
            Speech.toggle();
        });

        elements.clearButton.addEventListener('click', function() {
            if (confirm('Clear all text?')) {
                Editor.clear();
                setStatus('Text cleared.');
            }
        });

        elements.copyButton.addEventListener('click', function() {
            Editor.copyToClipboard()
                .then(function() {
                    setStatus('Copied to clipboard.');
                })
                .catch(function(err) {
                    setStatus(err.message, 'error');
                });
        });

        elements.exportButton.addEventListener('click', function() {
            if (Editor.exportAsText()) {
                setStatus('File exported.');
            } else {
                setStatus('Nothing to export.', 'error');
            }
        });

        elements.newSessionButton.addEventListener('click', function() {
            if (confirm('Start a new session? Current text will be cleared.')) {
                if (Speech.getIsListening()) {
                    Speech.stop();
                }
                
                Editor.saveCurrentSession();
                Editor.clear();
                clearInterimText();
                updateSessionLinkVisibility();
                setStatus('New session started.');
            }
        });

        if (elements.wordTargetInput) {
            elements.wordTargetInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    setWordTargetFromInput();
                }
            });
        }

        if (elements.wordTargetSet) {
            elements.wordTargetSet.addEventListener('click', function() {
                setWordTargetFromInput();
            });
        }

        if (elements.wordTargetClear) {
            elements.wordTargetClear.addEventListener('click', function() {
                wordTarget = 0;
                Storage.saveWordTarget(0);
                if (elements.wordTargetInput) {
                    elements.wordTargetInput.value = '';
                }
                updateStatsDisplay(Editor.getStats());
                setStatus('Word target cleared.');
            });
        }

        if (elements.previousSessionsLink) {
            elements.previousSessionsLink.addEventListener('click', function(e) {
                e.preventDefault();
                showSessionRestoreDialog();
            });
        }

        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                if (!elements.dictationToggle.disabled) {
                    Speech.toggle();
                }
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                if (Editor.exportAsText()) {
                    setStatus('File exported.');
                } else {
                    setStatus('Nothing to export.', 'error');
                }
            }
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden && Speech.getIsListening()) {
                Speech.stop();
                setStatus('Dictation stopped due to browser inactivity.');
            }
        });
    }

    function showSessionRestoreDialog() {
        var sessions = Storage.loadSessions();
        
        if (sessions.length === 0) {
            setStatus('No previous sessions found.');
            return;
        }

        var lastSession = sessions[0];
        var timeStr = Storage.formatSessionTime(lastSession.timestamp);
        var preview = lastSession.preview;
        if (preview.length >= 100) {
            preview = preview + '...';
        }

        var message = 'Restore session from ' + timeStr + '?\n\n"' + preview + '"';
        
        if (confirm(message)) {
            if (Speech.getIsListening()) {
                Speech.stop();
            }
            
            Editor.replaceContent(lastSession.content);
            setStatus('Session restored.');
        }
    }

    function setWordTargetFromInput() {
        if (!elements.wordTargetInput) {
            return;
        }

        var value = parseInt(elements.wordTargetInput.value, 10);
        
        if (isNaN(value) || value <= 0) {
            wordTarget = 0;
            Storage.saveWordTarget(0);
            setStatus('Invalid target. Enter a positive number.');
        } else {
            wordTarget = value;
            Storage.saveWordTarget(value);
            updateStatsDisplay(Editor.getStats());
            setStatus('Word target set to ' + value + '.');
        }
    }

    function loadPreferences() {
        var savedTheme = Storage.loadTheme();
        setTheme(savedTheme);

        var savedLanguage = Storage.loadLanguage();
        if (savedLanguage) {
            elements.languageSelect.value = savedLanguage;
            Speech.setLanguage(savedLanguage);
            elements.dictationToggle.disabled = false;
            setStatus('Ready. Click "Start Dictation" to begin.');
        } else {
            setStatus('Please select a language.');
        }

        wordTarget = Storage.loadWordTarget();
        if (wordTarget > 0 && elements.wordTargetInput) {
            elements.wordTargetInput.value = wordTarget;
        }
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            elements.themeToggle.textContent = 'Light mode';
        } else {
            document.documentElement.removeAttribute('data-theme');
            elements.themeToggle.textContent = 'Dark mode';
        }
    }

    function setStatus(message, type) {
        elements.statusLine.textContent = message;
        elements.statusLine.className = 'status-line';
        
        if (type) {
            elements.statusLine.classList.add(type);
        }
    }

    function updateStatsDisplay(stats) {
        if (!elements.statsDisplay) {
            return;
        }

        var text = stats.words.toLocaleString() + ' words';
        
        if (wordTarget > 0) {
            text = stats.words.toLocaleString() + ' / ' + wordTarget.toLocaleString() + ' words';
        }

        text += ' · ' + stats.characters.toLocaleString() + ' characters';

        elements.statsDisplay.textContent = text;
    }

    function setListeningState(isListening) {
        if (isListening) {
            elements.dictationToggle.textContent = 'Stop Dictation';
            elements.dictationToggle.classList.add('listening');
            setStatus('Listening...', 'listening');
        } else {
            elements.dictationToggle.textContent = 'Start Dictation';
            elements.dictationToggle.classList.remove('listening');
            setStatus('Stopped.');
            clearInterimText();
        }
    }

    function showSilenceWarning() {
        if (Speech.getIsListening()) {
            setStatus('No speech detected.', 'listening');
        }
    }

    function showInterimText(text) {
        elements.interimText.textContent = text;
    }

    function clearInterimText() {
        elements.interimText.textContent = '';
    }

    function showError(message) {
        setStatus(message, 'error');
        clearInterimText();
    }

    function getEditorElement() {
        return elements.editor;
    }

    function disableDictation(message) {
        elements.dictationToggle.disabled = true;
        setStatus(message, 'error');
    }

    return {
        init: init,
        setStatus: setStatus,
        updateStatsDisplay: updateStatsDisplay,
        setListeningState: setListeningState,
        showSilenceWarning: showSilenceWarning,
        showInterimText: showInterimText,
        clearInterimText: clearInterimText,
        showError: showError,
        getEditorElement: getEditorElement,
        disableDictation: disableDictation
    };
})();
