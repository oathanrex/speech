var Speech = (function() {
    'use strict';

    var recognition = null;
    var isListening = false;
    var currentLanguage = '';

    var onResultCallback = null;
    var onInterimCallback = null;
    var onErrorCallback = null;
    var onStatusChangeCallback = null;
    var onSilenceCallback = null;

    var silenceTimeout = null;
    var SILENCE_THRESHOLD = 12000;
    var lastResultTime = 0;

    var VOICE_COMMANDS = {
        'new line': 'newline',
        'newline': 'newline',
        'stop dictation': 'stop',
        'stop listening': 'stop',
        'clear text': 'clear',
        'clear all': 'clear'
    };

    var ERROR_MESSAGES = {
        'no-speech': 'No speech detected. Try speaking again.',
        'audio-capture': 'Microphone not found. Check your audio input device.',
        'not-allowed': 'Microphone access blocked. Allow access in browser settings.',
        'network': 'Network error. Check your internet connection.',
        'aborted': 'Dictation stopped.',
        'language-not-supported': 'Selected language is not supported.',
        'service-not-allowed': 'Speech service not available. Try again later.',
        'bad-grammar': 'Speech recognition error. Try again.',
        'default': 'Dictation error occurred.'
    };

    function isEnglishLanguage() {
        return currentLanguage && currentLanguage.toLowerCase().startsWith('en');
    }

    function isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }

    function getSupportMessage() {
        var userAgent = navigator.userAgent.toLowerCase();
        
        if (userAgent.indexOf('chrome') !== -1 || userAgent.indexOf('edge') !== -1 || userAgent.indexOf('brave') !== -1) {
            return null;
        }
        
        return 'Speech recognition works best in Chrome, Edge, or Brave browsers.';
    }

    function init() {
        if (!isSupported()) {
            return false;
        }

        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = handleResult;
        recognition.onerror = handleError;
        recognition.onend = handleEnd;
        recognition.onstart = handleStart;

        return true;
    }

    function startSilenceTimer() {
        stopSilenceTimer();
        lastResultTime = Date.now();
        
        silenceTimeout = setInterval(function() {
            if (isListening && Date.now() - lastResultTime > SILENCE_THRESHOLD) {
                if (onSilenceCallback) {
                    onSilenceCallback();
                }
            }
        }, 3000);
    }

    function stopSilenceTimer() {
        if (silenceTimeout) {
            clearInterval(silenceTimeout);
            silenceTimeout = null;
        }
    }

    function resetSilenceTimer() {
        lastResultTime = Date.now();
    }

    function handleResult(event) {
        var interimTranscript = '';
        var finalTranscript = '';

        resetSilenceTimer();

        for (var i = event.resultIndex; i < event.results.length; i++) {
            var transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                var command = isEnglishLanguage() ? checkVoiceCommand(transcript.trim().toLowerCase()) : null;
                
                if (command) {
                    executeCommand(command);
                } else {
                    finalTranscript += transcript;
                }
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript && onResultCallback) {
            onResultCallback(finalTranscript);
        }

        if (onInterimCallback) {
            onInterimCallback(interimTranscript);
        }
    }

    function checkVoiceCommand(text) {
        for (var phrase in VOICE_COMMANDS) {
            if (text === phrase || text.indexOf(phrase, text.length - phrase.length) !== -1) {
                return VOICE_COMMANDS[phrase];
            }
        }
        return null;
    }

    function executeCommand(command) {
        switch (command) {
            case 'newline':
                Editor.insertLineBreak();
                break;
            case 'stop':
                stop();
                break;
            case 'clear':
                Editor.clear();
                break;
        }
    }

    function handleError(event) {
        var message = ERROR_MESSAGES[event.error] || ERROR_MESSAGES['default'];

        if (event.error === 'not-allowed') {
            try {
                if (event.message && event.message.indexOf('denied') !== -1) {
                    message = 'Microphone permission denied. Enable it in browser settings.';
                }
            } catch (e) {}
        }

        if (onErrorCallback) {
            onErrorCallback(message);
        }
    }

    function handleEnd() {
        isListening = false;
        stopSilenceTimer();
        
        if (onStatusChangeCallback) {
            onStatusChangeCallback('stopped');
        }
    }

    function handleStart() {
        isListening = true;
        startSilenceTimer();
        
        if (onStatusChangeCallback) {
            onStatusChangeCallback('listening');
        }
    }

    function setLanguage(lang) {
        if (!recognition) {
            return false;
        }

        if (isListening) {
            stop();
        }

        currentLanguage = lang;
        recognition.lang = lang;
        return true;
    }

    function getLanguage() {
        return currentLanguage;
    }

    function start() {
        if (!recognition) {
            if (onErrorCallback) {
                onErrorCallback('Speech recognition not available.');
            }
            return false;
        }

        if (!currentLanguage) {
            if (onErrorCallback) {
                onErrorCallback('Please select a language first.');
            }
            return false;
        }

        if (isListening) {
            return true;
        }

        try {
            recognition.start();
            return true;
        } catch (e) {
            var message = 'Failed to start dictation.';
            if (e.name === 'InvalidStateError') {
                message = 'Dictation already starting. Please wait.';
            }
            if (onErrorCallback) {
                onErrorCallback(message);
            }
            return false;
        }
    }

    function stop() {
        if (!recognition || !isListening) {
            return false;
        }

        try {
            recognition.stop();
            stopSilenceTimer();
            return true;
        } catch (e) {
            return false;
        }
    }

    function toggle() {
        if (isListening) {
            return stop();
        } else {
            return start();
        }
    }

    function getIsListening() {
        return isListening;
    }

    function onResult(callback) {
        onResultCallback = callback;
    }

    function onInterim(callback) {
        onInterimCallback = callback;
    }

    function onError(callback) {
        onErrorCallback = callback;
    }

    function onStatusChange(callback) {
        onStatusChangeCallback = callback;
    }

    function onSilence(callback) {
        onSilenceCallback = callback;
    }

    return {
        isSupported: isSupported,
        getSupportMessage: getSupportMessage,
        init: init,
        setLanguage: setLanguage,
        getLanguage: getLanguage,
        start: start,
        stop: stop,
        toggle: toggle,
        getIsListening: getIsListening,
        onResult: onResult,
        onInterim: onInterim,
        onError: onError,
        onStatusChange: onStatusChange,
        onSilence: onSilence
    };
})();
