var Editor = (function() {
    'use strict';

    var editorElement = null;
    var onStatsChangeCallback = null;
    var userScrolled = false;
    var scrollTimeout = null;

    function init(element) {
        editorElement = element;
        
        if (!editorElement) {
            return false;
        }

        var savedContent = Storage.loadContent();
        if (savedContent) {
            editorElement.value = savedContent;
            updateStats();
        }

        editorElement.addEventListener('input', function() {
            Storage.saveContent(editorElement.value);
            updateStats();
        });

        editorElement.addEventListener('scroll', handleUserScroll);
        editorElement.addEventListener('mousedown', function() {
            userScrolled = true;
            resetScrollTimeout();
        });

        editorElement.focus();

        return true;
    }

    function handleUserScroll() {
        var isAtBottom = editorElement.scrollHeight - editorElement.scrollTop <= editorElement.clientHeight + 50;
        
        if (!isAtBottom) {
            userScrolled = true;
            resetScrollTimeout();
        }
    }

    function resetScrollTimeout() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(function() {
            userScrolled = false;
        }, 5000);
    }

    function countWords(text) {
        if (!text || !text.trim()) {
            return 0;
        }
        
        var words = text.trim().split(/\s+/).filter(function(word) {
            return word.length > 0;
        });
        
        return words.length;
    }

    function countCharacters(text) {
        return text ? text.length : 0;
    }

    function updateStats() {
        if (onStatsChangeCallback && editorElement) {
            var content = editorElement.value;
            var stats = {
                words: countWords(content),
                characters: countCharacters(content)
            };
            onStatsChangeCallback(stats);
        }
    }

    function getContent() {
        return editorElement ? editorElement.value : '';
    }

    function setContent(content) {
        if (editorElement) {
            editorElement.value = content;
            Storage.saveContent(content);
            updateStats();
        }
    }

    function replaceContent(content) {
        if (editorElement) {
            editorElement.value = content || '';
            Storage.saveContent(editorElement.value);
            updateStats();
            editorElement.focus();
            editorElement.setSelectionRange(editorElement.value.length, editorElement.value.length);
            userScrolled = false;
        }
    }

    function insertText(text) {
        if (!editorElement) {
            return;
        }

        var start = editorElement.selectionStart;
        var end = editorElement.selectionEnd;
        var currentValue = editorElement.value;

        var insertedText = text;
        if (start > 0 && currentValue[start - 1] !== ' ' && currentValue[start - 1] !== '\n') {
            insertedText = ' ' + text;
        }

        editorElement.value = currentValue.substring(0, start) + insertedText + currentValue.substring(end);

        var newPosition = start + insertedText.length;
        editorElement.setSelectionRange(newPosition, newPosition);

        Storage.saveContent(editorElement.value);
        updateStats();

        if (!userScrolled) {
            editorElement.scrollTop = editorElement.scrollHeight;
        }
    }

    function insertLineBreak() {
        if (!editorElement) {
            return;
        }

        var start = editorElement.selectionStart;
        var end = editorElement.selectionEnd;
        var currentValue = editorElement.value;

        editorElement.value = currentValue.substring(0, start) + '\n' + currentValue.substring(end);

        var newPosition = start + 1;
        editorElement.setSelectionRange(newPosition, newPosition);

        Storage.saveContent(editorElement.value);
        updateStats();

        if (!userScrolled) {
            editorElement.scrollTop = editorElement.scrollHeight;
        }
    }

    function clear() {
        if (editorElement) {
            editorElement.value = '';
            Storage.clearContent();
            updateStats();
            editorElement.focus();
            userScrolled = false;
        }
    }

    function saveCurrentSession() {
        if (editorElement && editorElement.value.trim()) {
            return Storage.saveSession(editorElement.value);
        }
        return false;
    }

    function copyToClipboard() {
        if (!editorElement) {
            return Promise.reject(new Error('Editor not initialized'));
        }

        var content = editorElement.value;

        if (!content) {
            return Promise.reject(new Error('Nothing to copy'));
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(content);
        }

        return new Promise(function(resolve, reject) {
            try {
                editorElement.select();
                document.execCommand('copy');
                editorElement.setSelectionRange(0, 0);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    function exportAsText() {
        if (!editorElement) {
            return false;
        }

        var content = editorElement.value;

        if (!content.trim()) {
            return false;
        }

        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');
        var filename = 'speech-' + year + '-' + month + '-' + day + '.txt';

        var blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);

        var link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        return true;
    }

    function focus() {
        if (editorElement) {
            editorElement.focus();
        }
    }

    function getStats() {
        var content = editorElement ? editorElement.value : '';
        return {
            words: countWords(content),
            characters: countCharacters(content)
        };
    }

    function onStatsChange(callback) {
        onStatsChangeCallback = callback;
        updateStats();
    }

    return {
        init: init,
        getContent: getContent,
        setContent: setContent,
        replaceContent: replaceContent,
        insertText: insertText,
        insertLineBreak: insertLineBreak,
        clear: clear,
        saveCurrentSession: saveCurrentSession,
        copyToClipboard: copyToClipboard,
        exportAsText: exportAsText,
        focus: focus,
        getStats: getStats,
        onStatsChange: onStatsChange
    };
})();
