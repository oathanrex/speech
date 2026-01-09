(function() {
    'use strict';

    function init() {
        if (!UI.init()) {
            return;
        }

        if (!Editor.init(UI.getEditorElement())) {
            return;
        }

        Editor.onStatsChange(function(stats) {
            UI.updateStatsDisplay(stats);
        });

        if (!Speech.isSupported()) {
            UI.disableDictation('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Brave.');
            return;
        }

        var supportMessage = Speech.getSupportMessage();
        if (supportMessage) {
            UI.setStatus(supportMessage, 'error');
        }

        if (!Speech.init()) {
            UI.disableDictation('Failed to initialize speech recognition.');
            return;
        }

        Speech.onResult(function(text) {
            Editor.insertText(text);
        });

        Speech.onInterim(function(text) {
            UI.showInterimText(text);
        });

        Speech.onError(function(message) {
            UI.showError(message);
        });

        Speech.onStatusChange(function(status) {
            UI.setListeningState(status === 'listening');
        });

        Speech.onSilence(function() {
            UI.showSilenceWarning();
        });

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(function() {});
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
