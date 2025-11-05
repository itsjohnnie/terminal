// Terminal UI Playground Script
class TerminalUI {
    constructor() {
        // Elements
        this.terminal = document.getElementById('terminal');
        this.codeInput = document.getElementById('code-input');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.speedInput = document.getElementById('speed');
        this.speedValue = document.getElementById('speed-value');
        this.languageSelect = document.getElementById('language');
        this.themeSelect = document.getElementById('theme');
        this.terminalTitleInput = document.getElementById('terminal-title');
        this.terminalTitleDisplay = document.getElementById('terminal-title-display');
        this.terminalLanguageDisplay = document.getElementById('terminal-language-display');
        this.terminalCopyBtn = document.getElementById('terminal-copy-btn');
        this.showLineNumbersCheckbox = document.getElementById('show-line-numbers');
        this.resizableCheckbox = document.getElementById('resizable');
        this.aspectRatioSelect = document.getElementById('aspect-ratio');
        this.terminalSection = document.querySelector('.terminal-section');
        this.animateCheckbox = document.getElementById('animate-checkbox');
        this.animationControls = document.getElementById('animation-controls');

        // Export buttons
        this.exportHtmlBtn = document.getElementById('export-html');
        this.screenshotBtn = document.getElementById('screenshot');
        this.recordVideoBtn = document.getElementById('record-video');

        // State
        this.typingSpeed = this.calculateTypingSpeed(50); // Convert slider value to ms
        this.isPaused = false;

        // Update range slider progress on load
        this.updateRangeProgress();
        this.isAnimating = false;
        this.currentLine = 0;
        this.currentChar = 0;
        this.lines = [];
        this.animationTimeout = null;
        this.isLoadingPhase = false;
        this.loadingMessages = [
            'Thinking',
            'Processing',
            'Compiling',
            'Brewing',
            'Crafting',
            'Initializing',
            'Loading',
            'Preparing',
            'Computing',
            'Analyzing',
            'Optimizing',
            'Bootstrapping',
            'Synthesizing',
            'Calibrating',
            'Pondering',
            'Configuring'
        ];
        this.spinnerFrames = ['◐', '◓', '◑', '◒', '◆', '◇', '■', '□', '▲', '△', '◉', '◈'];
        this.currentSpinnerFrame = 0;

        // Video recording state
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;

        // Dragging state
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartY = 0;
        this.terminalStartX = 0;
        this.terminalStartY = 0;

        this.init();
    }

    init() {
        this.loadSavedTheme();
        this.loadSavedAspectRatio();
        this.loadSavedAnimatedState();
        this.setupEventListeners();
        this.setupScrollTrigger();
        // Display static code after a brief delay to ensure everything is ready
        setTimeout(() => this.displayStaticCode(), 0);
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('terminalTheme');
        if (savedTheme) {
            this.themeSelect.value = savedTheme;
            this.changeTheme(savedTheme);
        }
    }

    saveTheme(theme) {
        localStorage.setItem('terminalTheme', theme);
    }

    loadSavedAspectRatio() {
        const savedAspectRatio = localStorage.getItem('terminalAspectRatio');
        if (savedAspectRatio) {
            this.aspectRatioSelect.value = savedAspectRatio;
            this.changeAspectRatio(savedAspectRatio);
        }
    }

    saveAspectRatio(ratio) {
        localStorage.setItem('terminalAspectRatio', ratio);
    }

    loadSavedAnimatedState() {
        const savedAnimated = localStorage.getItem('terminalAnimated');
        if (savedAnimated === 'true') {
            this.animateCheckbox.checked = true;
            this.toggleAnimationControls(true);
        }
    }

    saveAnimatedState(isAnimated) {
        localStorage.setItem('terminalAnimated', isAnimated);
    }

    updateRangeProgress() {
        const min = parseFloat(this.speedInput.min);
        const max = parseFloat(this.speedInput.max);
        const value = parseFloat(this.speedInput.value);
        const percentage = ((value - min) / (max - min)) * 100;
        this.speedInput.style.setProperty('--range-progress', `${percentage}%`);
    }

    calculateTypingSpeed(sliderValue) {
        // Convert slider value (0-100) to typing speed in milliseconds
        // 0 = 200ms (slowest), 50 = 50ms (medium), 100 = 10ms (fastest)
        // Non-linear mapping for better feel
        if (sliderValue <= 50) {
            // 0-50: map from 200ms to 50ms
            return 200 - (sliderValue * 3);
        } else {
            // 51-100: map from 50ms to 10ms
            return 50 - ((sliderValue - 50) * 0.8);
        }
    }

    setupScrollTrigger() {
        // Only setup scroll trigger if this is embedded (not in playground)
        // Check if sidebar exists - if not, we're embedded
        const isEmbedded = !document.querySelector('.sidebar');

        if (!isEmbedded) return;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // If reduced motion is preferred, just show the code immediately
            if (this.codeInput.value.trim()) {
                this.displayStaticCode();
            }
            return;
        }

        // Create Intersection Observer to watch when terminal becomes visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger when at least 50% visible
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    // Only auto-start if not already animating and code exists
                    if (!this.isAnimating && this.codeInput.value.trim()) {
                        this.startAnimation();
                        // Disconnect after first trigger
                        observer.disconnect();
                    }
                }
            });
        }, {
            threshold: 0.5 // Trigger at 50% visibility
        });

        // Observe the terminal section
        const terminalSection = document.querySelector('.terminal-section');
        if (terminalSection) {
            observer.observe(terminalSection);
        }
    }

    setupEventListeners() {
        // Control buttons
        this.startBtn.addEventListener('click', () => this.startAnimation());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetAnimation());

        // Settings
        this.speedInput.addEventListener('input', (e) => {
            const sliderValue = parseInt(e.target.value);
            this.typingSpeed = this.calculateTypingSpeed(sliderValue);
            this.speedValue.textContent = sliderValue;
            this.updateRangeProgress();
        });

        this.languageSelect.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
            // Update static display with new language highlighting
            if (!this.animateCheckbox.checked) {
                this.displayStaticCode();
            }
        });

        this.themeSelect.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        this.terminalTitleInput.addEventListener('input', (e) => {
            this.updateTerminalTitle(e.target.value);
        });

        // Update static display when code changes (if not animating)
        this.codeInput.addEventListener('input', () => {
            if (!this.animateCheckbox.checked) {
                this.displayStaticCode();
            }
        });

        this.showLineNumbersCheckbox.addEventListener('change', (e) => {
            this.toggleLineNumbers(e.target.checked);
            // Refresh display to apply line number changes
            if (!this.animateCheckbox.checked) {
                this.displayStaticCode();
            }
        });

        this.resizableCheckbox.addEventListener('change', (e) => {
            this.toggleResizable(e.target.checked);
        });

        this.aspectRatioSelect.addEventListener('change', (e) => {
            this.changeAspectRatio(e.target.value);
            this.saveAspectRatio(e.target.value);
        });

        this.terminalCopyBtn.addEventListener('click', () => this.copyTerminalCode());

        // Animation checkbox
        this.animateCheckbox.addEventListener('change', (e) => {
            this.toggleAnimationControls(e.target.checked);
            this.saveAnimatedState(e.target.checked);
        });

        // Export dropdown
        const exportDropdownBtn = document.getElementById('export-dropdown-btn');
        const exportDropdownMenu = document.getElementById('export-dropdown-menu');
        const exportImageBtn = document.getElementById('export-image');
        const exportVideoBtn = document.getElementById('export-video');
        const exportCodeBtn = document.getElementById('export-code');

        exportDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportDropdownMenu.classList.toggle('visible');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            exportDropdownMenu.classList.remove('visible');
        });

        exportImageBtn.addEventListener('click', () => {
            exportDropdownMenu.classList.remove('visible');
            this.takeScreenshot();
        });

        exportVideoBtn.addEventListener('click', () => {
            exportDropdownMenu.classList.remove('visible');
            this.toggleVideoRecording();
        });

        exportCodeBtn.addEventListener('click', () => {
            exportDropdownMenu.classList.remove('visible');
            this.exportAsHtml();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.startAnimation();
            } else if (e.key === 'Escape') {
                this.resetAnimation();
            }
        });

        // Dragging functionality
        const terminalHeader = document.querySelector('.terminal-header');
        terminalHeader.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDragging());
    }

    changeLanguage(language) {
        // Update the code input with the example for the selected language
        if (typeof codeExamples !== 'undefined' && codeExamples[language]) {
            this.codeInput.value = codeExamples[language];
        }

        // Update the language display
        this.updateTerminalLanguage(language);
    }

    changeTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.saveTheme(theme);
    }

    updateTerminalTitle(title) {
        this.terminalTitleDisplay.textContent = title || 'Terminal';
    }

    updateTerminalLanguage(language) {
        // Capitalize first letter of language name
        const displayName = language.charAt(0).toUpperCase() + language.slice(1);
        this.terminalLanguageDisplay.textContent = displayName;
    }

    toggleLineNumbers(show) {
        if (show) {
            this.terminal.classList.add('show-line-numbers');
        } else {
            this.terminal.classList.remove('show-line-numbers');
        }
    }

    toggleAnimationControls(show) {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (show) {
            this.animationControls.classList.add('visible');
            if (prefersReducedMotion) {
                // If reduced motion is preferred, show code immediately
                this.displayStaticCode();
            } else {
                // Clear terminal for animation
                this.resetAnimation();
            }
        } else {
            this.animationControls.classList.remove('visible');
            // Show static code after animation completes
            setTimeout(() => this.displayStaticCode(), 300);
        }
    }

    displayStaticCode() {
        const code = this.codeInput.value.trim();
        console.log('displayStaticCode called, code length:', code.length);
        if (!code) {
            this.terminal.innerHTML = `
                <div class="terminal-line">
                    <span class="cursor">|</span>
                </div>
            `;
            return;
        }

        const lines = code.split('\n');
        this.terminal.innerHTML = '';

        lines.forEach((lineText, index) => {
            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';

            // Add line number
            const lineNumber = document.createElement('span');
            lineNumber.className = 'line-number';
            lineNumber.textContent = (index + 1).toString().padStart(3, ' ');
            lineElement.appendChild(lineNumber);

            const codeSpan = document.createElement('span');
            codeSpan.className = 'code-content';
            codeSpan.textContent = lineText;
            lineElement.appendChild(codeSpan);

            this.terminal.appendChild(lineElement);

            // Apply syntax highlighting
            this.highlightLine(lineElement);
        });

        // Add cursor to the last line
        const lastLine = this.terminal.lastElementChild;
        if (lastLine) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            lastLine.appendChild(cursor);
        }
    }

    toggleResizable(resizable) {
        const terminalBody = document.querySelector('.terminal-body');
        const terminalContainer = document.querySelector('.terminal-container');

        if (resizable) {
            terminalBody.style.resize = 'both';
            terminalBody.style.minWidth = '400px';
            terminalBody.style.minHeight = '200px';
            this.isManuallyResized = false;

            // Use ResizeObserver to sync container width with body width
            this.resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    const width = entry.borderBoxSize?.[0]?.inlineSize || entry.contentRect.width;
                    terminalContainer.style.width = width + 'px';

                    // Mark as manually resized and fade the aspect ratio dropdown
                    if (!this.isManuallyResized) {
                        this.isManuallyResized = true;
                        this.aspectRatioSelect.style.opacity = '0.7';
                    }
                }
            });
            this.resizeObserver.observe(terminalBody);
        } else {
            terminalBody.style.resize = 'none';
            terminalBody.style.minWidth = '';
            terminalBody.style.minHeight = '';
            terminalContainer.style.width = '';
            this.isManuallyResized = false;
            this.aspectRatioSelect.style.opacity = '';

            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
                this.resizeObserver = null;
            }
        }
    }

    changeAspectRatio(ratio) {
        const terminalBody = document.querySelector('.terminal-body');
        const terminalContainer = document.querySelector('.terminal-container');

        // Reset manual resize styles
        terminalBody.style.width = '';
        terminalBody.style.height = '';
        terminalContainer.style.width = '';

        // Reset opacity and flag
        this.aspectRatioSelect.style.opacity = '';
        this.isManuallyResized = false;

        // Remove all aspect ratio classes
        this.terminalSection.classList.remove('aspect-1-1', 'aspect-3-2', 'aspect-16-9');

        // Add the selected aspect ratio class
        if (ratio !== 'auto') {
            this.terminalSection.classList.add(`aspect-${ratio}`);
        }

        // Save to localStorage
        this.saveAspectRatio(ratio);
    }

    copyTerminalCode() {
        const terminalLines = this.terminal.querySelectorAll('.terminal-line');
        let code = '';

        terminalLines.forEach(line => {
            const codeContent = line.querySelector('.code-content');
            if (codeContent) {
                code += codeContent.textContent + '\n';
            }
        });

        if (code.trim()) {
            navigator.clipboard.writeText(code.trim()).then(() => {
                // Visual feedback - change icon temporarily
                const originalHTML = this.terminalCopyBtn.innerHTML;
                this.terminalCopyBtn.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                setTimeout(() => {
                    this.terminalCopyBtn.innerHTML = originalHTML;
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        }
    }

    resetState() {
        this.currentLine = 0;
        this.currentChar = 0;
        this.lines = [];
        this.isAnimating = false;
        this.isPaused = false;
        this.isLoadingPhase = false;
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
        this.updateButtonStates();
    }

    resetAnimation() {
        this.resetState();
        this.terminal.innerHTML = `
            <div class="terminal-line">
                <span class="cursor">|</span>
            </div>
        `;
    }

    togglePause() {
        if (!this.isAnimating) return;

        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';

        if (!this.isPaused) {
            this.animateNextChar();
        }
    }

    updateButtonStates() {
        this.startBtn.disabled = this.isAnimating && !this.isPaused;
        this.pauseBtn.disabled = !this.isAnimating;
        this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
    }

    getTypingDelay(currentChar, nextChar) {
        // Base speed with much more random variation (±50% instead of ±30%)
        const baseDelay = this.typingSpeed * (0.5 + Math.random() * 1.0);

        // Characters that indicate natural pause points
        const pauseChars = [' ', ',', ';', '.', ':', '!', '?', ')', '}', ']', '>', '\n'];
        const longPauseChars = ['.', '!', '?', ';'];

        // Check if current character is a pause point
        if (longPauseChars.includes(currentChar)) {
            // Longer pause after sentence-ending punctuation
            return baseDelay * (3.5 + Math.random() * 2.0);
        } else if (pauseChars.includes(currentChar)) {
            // Medium pause after commas, spaces, etc.
            return baseDelay * (2.0 + Math.random() * 1.5);
        } else if (currentChar === '(' || currentChar === '{' || currentChar === '[') {
            // Noticeable pause before typing inside brackets
            return baseDelay * (1.8 + Math.random() * 1.0);
        } else {
            // Normal typing with variation
            return baseDelay;
        }
    }

    async showLoadingMessages() {
        // Select 2-3 random loading messages
        const numMessages = 2 + Math.floor(Math.random() * 2); // 2 or 3
        const selectedMessages = [];
        const availableMessages = [...this.loadingMessages];

        for (let i = 0; i < numMessages; i++) {
            const randomIndex = Math.floor(Math.random() * availableMessages.length);
            selectedMessages.push(availableMessages[randomIndex]);
            availableMessages.splice(randomIndex, 1);
        }

        // Create loading line element
        const loadingLine = document.createElement('div');
        loadingLine.className = 'terminal-line loading-line';

        // Add line number
        const lineNumber = document.createElement('span');
        lineNumber.className = 'line-number';
        lineNumber.textContent = '  1';
        loadingLine.appendChild(lineNumber);

        const spinnerSpan = document.createElement('span');
        spinnerSpan.className = 'loading-spinner';
        loadingLine.appendChild(spinnerSpan);

        const loadingText = document.createElement('span');
        loadingText.className = 'loading-text';
        loadingLine.appendChild(loadingText);

        this.terminal.appendChild(loadingLine);

        // Spinner animation interval (updates every 160ms)
        const spinnerInterval = setInterval(() => {
            if (!this.isLoadingPhase) {
                clearInterval(spinnerInterval);
                return;
            }
            this.currentSpinnerFrame = (this.currentSpinnerFrame + 1) % this.spinnerFrames.length;
            spinnerSpan.textContent = this.spinnerFrames[this.currentSpinnerFrame] + '   ';
        }, 160);

        // Calculate timing to ensure max 4 seconds total
        // Reserve time for transitions: numMessages * (transition + hold)
        // Max time per message: 4000ms / numMessages
        const maxTimePerMessage = 4000 / numMessages;
        const transitionTime = 400; // Fixed transition time
        const holdTime = Math.max(200, maxTimePerMessage - transitionTime); // At least 200ms hold

        // Show each message with staggered character flip animation
        for (let i = 0; i < selectedMessages.length; i++) {
            if (!this.isLoadingPhase) break;

            const newMessage = selectedMessages[i];
            const oldMessage = loadingText.textContent;

            // Animate character by character with stagger
            await this.animateTextTransition(loadingText, oldMessage, newMessage);

            // Hold the complete message briefly
            await new Promise(resolve => setTimeout(resolve, holdTime));
        }

        // Clean up
        clearInterval(spinnerInterval);

        // Remove loading line
        if (loadingLine.parentNode) {
            loadingLine.remove();
        }
    }

    async animateTextTransition(element, oldText, newText) {
        const maxLength = Math.max(oldText.length, newText.length);
        const chars = [];

        // Initialize with old characters or spaces
        for (let i = 0; i < maxLength; i++) {
            chars[i] = oldText[i] || '';
        }

        // Staggered animation - each character changes after a delay
        const promises = [];
        for (let i = 0; i < maxLength; i++) {
            const promise = new Promise(async (resolve) => {
                // Stagger delay: 25ms per character for smoother transitions
                await new Promise(r => setTimeout(r, i * 25));

                // Flip through random characters with slower timing
                const flipDuration = 150; // Increased from 60ms
                const flipInterval = 30; // Increased from 15ms
                const flips = Math.floor(flipDuration / flipInterval);

                for (let j = 0; j < flips; j++) {
                    const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
                    chars[i] = randomChar;
                    element.textContent = chars.join('');
                    await new Promise(r => setTimeout(r, flipInterval));
                }

                // Set final character
                chars[i] = newText[i] || '';
                element.textContent = chars.join('');
                resolve();
            });
            promises.push(promise);
        }

        await Promise.all(promises);
    }

    async startAnimation() {
        const code = this.codeInput.value.trim();

        if (!code) {
            alert('Please paste some code first!');
            return;
        }

        if (this.isAnimating && this.isPaused) {
            this.togglePause();
            return;
        }

        if (this.isAnimating) return;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Show code immediately without animation
            this.displayStaticCode();
            return;
        }

        this.resetState();
        this.lines = code.split('\n');
        this.isAnimating = true;
        this.isLoadingPhase = true;
        this.updateButtonStates();

        // Clear terminal
        this.terminal.innerHTML = '';

        // Show loading messages first
        await this.showLoadingMessages();

        // End loading phase
        this.isLoadingPhase = false;

        // Start actual animation
        this.animateNextChar();
    }

    animateNextChar() {
        if (this.isPaused) return;

        if (this.currentLine >= this.lines.length) {
            this.finishAnimation();
            return;
        }

        const currentLineText = this.lines[this.currentLine];

        // If starting a new line
        if (this.currentChar === 0) {
            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';

            // Add line number
            const lineNumber = document.createElement('span');
            lineNumber.className = 'line-number';
            lineNumber.textContent = (this.currentLine + 1).toString().padStart(3, ' ');
            lineElement.appendChild(lineNumber);

            const codeSpan = document.createElement('span');
            codeSpan.className = 'code-content';
            lineElement.appendChild(codeSpan);

            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            lineElement.appendChild(cursor);

            this.terminal.appendChild(lineElement);
        }

        const lineElement = this.terminal.lastElementChild;
        const codeSpan = lineElement.querySelector('.code-content');

        if (this.currentChar < currentLineText.length) {
            // Add next character
            const char = currentLineText[this.currentChar];
            codeSpan.textContent += char;

            // Get next character for delay calculation
            const nextChar = this.currentChar + 1 < currentLineText.length ?
                            currentLineText[this.currentChar + 1] : '';

            this.currentChar++;

            // Apply syntax highlighting in real-time
            this.highlightLine(lineElement);

            // Ensure cursor is at the end after highlighting
            const cursor = lineElement.querySelector('.cursor');
            if (cursor) {
                lineElement.removeChild(cursor);
                lineElement.appendChild(cursor);
            }

            // Scroll to bottom
            this.terminal.scrollTop = this.terminal.scrollHeight;

            // Use human-like typing delay
            const delay = this.getTypingDelay(char, nextChar);
            this.animationTimeout = setTimeout(() => this.animateNextChar(), delay);
        } else {
            // Move to next line
            const cursor = lineElement.querySelector('.cursor');
            if (cursor) cursor.remove();

            // Final syntax highlighting for the completed line
            this.highlightLine(lineElement);

            this.currentLine++;
            this.currentChar = 0;

            // Add natural pause at end of line with variation
            const lineBreakDelay = this.typingSpeed * (3 + Math.random() * 2);
            this.animationTimeout = setTimeout(() => this.animateNextChar(), lineBreakDelay);
        }
    }

    highlightLine(lineElement) {
        const codeSpan = lineElement.querySelector('.code-content');
        if (!codeSpan) return;

        const language = this.languageSelect.value;
        const code = codeSpan.textContent;

        if (language === 'plaintext') {
            return;
        }

        try {
            const highlighted = hljs.highlight(code, { language }).value;
            codeSpan.innerHTML = highlighted;
        } catch (e) {
            // If highlighting fails, keep original text
            console.warn('Highlighting failed:', e);
        }
    }

    finishAnimation() {
        this.isAnimating = false;
        this.updateButtonStates();

        // Add cursor to the last line instead of creating a new line
        const lastLine = this.terminal.lastElementChild;
        if (lastLine) {
            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '|';
            lastLine.appendChild(cursor);
        }
    }

    // Export Functions
    exportAsHtml() {
        const theme = this.themeSelect.value;
        const showLineNumbers = this.showLineNumbersCheckbox.checked;
        const terminalTitle = this.terminalTitleInput.value || 'Terminal';
        const language = this.languageSelect.value;
        const displayLanguage = language.charAt(0).toUpperCase() + language.slice(1);
        const code = this.codeInput.value;
        const typingSpeed = this.typingSpeed;
        const aspectRatio = this.aspectRatioSelect.value;

        // Get the computed styles for the current theme
        const themeStyles = this.getThemeStyles(theme);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminal Output</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
        }

        .terminal-section {
            display: inline-block;
            min-width: 800px;
        }

        @media (max-width: 800px) {
            .terminal-section {
                min-width: 100%;
            }
        }

        .terminal-header {
            background-color: ${themeStyles.bgTertiary};
            padding: 0.5rem 0.625rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            border: 1px solid ${themeStyles.border};
            border-radius: 8px 8px 0 0;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .terminal-buttons {
            display: flex;
            gap: 0.375rem;
        }

        .terminal-button {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }

        .terminal-button.close { background-color: #ff5f56; }
        .terminal-button.minimize { background-color: #ffbd2e; }
        .terminal-button.maximize { background-color: #27c93f; }

        .terminal-title {
            font-size: 0.8rem;
            color: ${themeStyles.textSecondary};
            font-weight: 600;
            flex: 1;
        }

        .terminal-language {
            font-size: 0.8rem;
            color: ${themeStyles.textSecondary};
            font-weight: 400;
            margin-left: auto;
        }

        .terminal-body {
            background-color: ${themeStyles.terminalBg};
            padding: 1.5rem;
            ${aspectRatio !== 'auto' ? `aspect-ratio: ${aspectRatio.replace('-', ' / ')};` : 'min-height: 300px; max-height: 500px;'}
            overflow-y: auto;
            overflow-x: auto;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.875rem;
            line-height: 1.4;
            tab-size: 4;
            border: 1px solid ${themeStyles.border};
            border-top: none;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .terminal-line {
            color: ${themeStyles.terminalText};
            margin-bottom: 0.25rem;
            white-space: nowrap;
        }

        .code-content {
            white-space: pre;
            display: inline;
        }

        .line-number {
            display: ${showLineNumbers ? 'inline-block' : 'none'};
            color: ${themeStyles.textSecondary};
            opacity: 0.5;
            margin-right: 0.75rem;
            min-width: 0.5rem;
            text-align: right;
            user-select: none;
        }

        .cursor {
            display: inline-block;
            color: ${themeStyles.accent};
            animation: blink 1s infinite;
            margin-left: 2px;
            font-weight: bold;
        }

        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        /* Syntax Highlighting Overrides */
        .terminal-body .hljs-comment {
            font-style: normal !important;
        }

        /* Scrollbar Styling */
        .terminal-body::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        .terminal-body::-webkit-scrollbar-track {
            background: ${themeStyles.bgTertiary};
        }

        .terminal-body::-webkit-scrollbar-thumb {
            background: ${themeStyles.accent};
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="terminal-section">
        <div class="terminal-header">
            <div class="terminal-buttons">
                <span class="terminal-button close"></span>
                <span class="terminal-button minimize"></span>
                <span class="terminal-button maximize"></span>
            </div>
            <div class="terminal-title">${terminalTitle}</div>
            <div class="terminal-language">${displayLanguage}</div>
        </div>
        <div class="terminal-body ${showLineNumbers ? 'show-line-numbers' : ''}" id="terminal"></div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>
        // Terminal typing animation script
        // To use: Call animateTerminal(code, language, speed, showLineNumbers) after loading this HTML
        function animateTerminal(code, language = 'javascript', typingSpeed = 40, showLineNumbers = true) {
            const terminal = document.getElementById('terminal');
            if (!terminal) return;

            const lines = code.split('\\n');
            let currentLine = 0;
            let currentChar = 0;

            terminal.innerHTML = '';
            terminal.className = 'terminal-body' + (showLineNumbers ? ' show-line-numbers' : '');

            function getTypingDelay(currentChar) {
                const baseDelay = typingSpeed * (0.5 + Math.random() * 1.0);
                const pauseChars = [' ', ',', ';', '.', ':', '!', '?', ')', '}', ']', '>'];
                const longPauseChars = ['.', '!', '?', ';'];

                if (longPauseChars.includes(currentChar)) {
                    return baseDelay * (3.5 + Math.random() * 2.0);
                } else if (pauseChars.includes(currentChar)) {
                    return baseDelay * (2.0 + Math.random() * 1.5);
                } else if (currentChar === '(' || currentChar === '{' || currentChar === '[') {
                    return baseDelay * (1.8 + Math.random() * 1.0);
                }
                return baseDelay;
            }

            function highlightLine(lineElement) {
                const codeSpan = lineElement.querySelector('.code-content');
                if (!codeSpan || language === 'plaintext') return;

                const code = codeSpan.textContent;
                try {
                    const highlighted = hljs.highlight(code, { language: language }).value;
                    codeSpan.innerHTML = highlighted;
                } catch (e) {
                    console.warn('Highlighting failed:', e);
                }
            }

            function animateNextChar() {
                if (currentLine >= lines.length) {
                    const lastLine = terminal.lastElementChild;
                    if (lastLine) {
                        const cursor = document.createElement('span');
                        cursor.className = 'cursor';
                        cursor.textContent = '|';
                        lastLine.appendChild(cursor);
                    }
                    return;
                }

                const currentLineText = lines[currentLine];

                if (currentChar === 0) {
                    const lineElement = document.createElement('div');
                    lineElement.className = 'terminal-line';

                    const lineNumber = document.createElement('span');
                    lineNumber.className = 'line-number';
                    lineNumber.textContent = (currentLine + 1).toString().padStart(3, ' ');
                    lineElement.appendChild(lineNumber);

                    const codeSpan = document.createElement('span');
                    codeSpan.className = 'code-content';
                    lineElement.appendChild(codeSpan);

                    const cursor = document.createElement('span');
                    cursor.className = 'cursor';
                    cursor.textContent = '|';
                    lineElement.appendChild(cursor);

                    terminal.appendChild(lineElement);
                }

                const lineElement = terminal.lastElementChild;
                const codeSpan = lineElement.querySelector('.code-content');

                if (currentChar < currentLineText.length) {
                    const char = currentLineText[currentChar];
                    codeSpan.textContent += char;
                    currentChar++;

                    highlightLine(lineElement);

                    const cursor = lineElement.querySelector('.cursor');
                    if (cursor) {
                        lineElement.removeChild(cursor);
                        lineElement.appendChild(cursor);
                    }

                    terminal.scrollTop = terminal.scrollHeight;
                    setTimeout(animateNextChar, getTypingDelay(char));
                } else {
                    const cursor = lineElement.querySelector('.cursor');
                    if (cursor) cursor.remove();

                    highlightLine(lineElement);

                    currentLine++;
                    currentChar = 0;

                    setTimeout(animateNextChar, typingSpeed * (3 + Math.random() * 2));
                }
            }

            animateNextChar();
        }

        // Auto-start with embedded code using Intersection Observer
        const embeddedCode = \`${code.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;

        // Setup Intersection Observer to trigger when 50% visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    animateTerminal(embeddedCode, '${language}', ${typingSpeed}, ${showLineNumbers});
                    observer.disconnect();
                }
            });
        }, {
            threshold: 0.5
        });

        const terminalSection = document.querySelector('.terminal-section');
        if (terminalSection) {
            observer.observe(terminalSection);
        }
    </script>
</body>
</html>`;

        // Copy to clipboard
        navigator.clipboard.writeText(html).then(() => {
            // Visual feedback
            const originalText = this.exportHtmlBtn.textContent;
            this.exportHtmlBtn.textContent = 'Copied!';
            setTimeout(() => {
                this.exportHtmlBtn.textContent = originalText;
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy HTML to clipboard. Please try again.');
        });
    }

    getThemeStyles(theme) {
        const themes = {
            dark: {
                bgPrimary: '#1a1a1a',
                bgSecondary: '#2b2b2b',
                bgTertiary: '#3a3a3a',
                textPrimary: '#e8e8e8',
                textSecondary: '#9b9b9b',
                accent: '#e8e8e8',
                border: '#404040',
                terminalBg: '#1f1f1f',
                terminalText: '#e8e8e8'
            },
            light: {
                bgPrimary: '#FAF9F6',
                bgSecondary: '#FAF9F6',
                bgTertiary: '#E8E6DC',
                textPrimary: '#141413',
                textSecondary: '#666666',
                accent: '#c96442',
                border: '#E8E6DC',
                terminalBg: '#F0EEE6',
                terminalText: '#141413'
            }
        };

        return themes[theme] || themes.dark;
    }

    copyCode() {
        const terminalLines = this.terminal.querySelectorAll('.terminal-line');
        let code = '';

        terminalLines.forEach(line => {
            const codeContent = line.querySelector('.code-content');
            if (codeContent) {
                code += codeContent.textContent + '\n';
            }
        });

        navigator.clipboard.writeText(code.trim()).then(() => {
            alert('Code copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy code. Please try again.');
        });
    }

    exportAsJson() {
        const data = {
            code: this.codeInput.value,
            settings: {
                speed: this.typingSpeed,
                language: this.languageSelect.value,
                theme: this.themeSelect.value,
                prompt: this.promptText
            },
            timestamp: new Date().toISOString()
        };

        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, 'terminal-config.json', 'application/json');
    }

    takeScreenshot() {
        const terminalSection = document.querySelector('.terminal-section');

        if (!terminalSection) {
            alert('No terminal content to capture!');
            return;
        }

        html2canvas(terminalSection, {
            backgroundColor: null,
            scale: 2
        }).then(canvas => {
            canvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `terminal-screenshot-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }).catch(err => {
            console.error('Screenshot failed:', err);
            alert('Failed to take screenshot. Please try again.');
        });
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    async toggleVideoRecording() {
        if (this.isRecording) {
            this.stopVideoRecording();
        } else {
            this.startVideoRecording();
        }
    }

    async startVideoRecording() {
        const terminalSection = document.querySelector('.terminal-section');

        if (!terminalSection) {
            alert('Terminal not found!');
            return;
        }

        if (!this.codeInput.value.trim()) {
            alert('Please paste some code first!');
            return;
        }

        try {
            // Create a canvas to capture frames
            const canvas = document.createElement('canvas');
            const rect = terminalSection.getBoundingClientRect();

            // Use higher resolution for better quality
            const scale = 2; // Retina/HiDPI support
            canvas.width = rect.width * scale;
            canvas.height = rect.height * scale;
            const ctx = canvas.getContext('2d', { alpha: false });

            // Scale context to match
            ctx.scale(scale, scale);

            // Start capturing frames at 60 FPS for smoother video
            this.recordedChunks = [];
            const stream = canvas.captureStream(60);

            // Try to use the best available codec with higher bitrate
            let options = { videoBitsPerSecond: 8000000 }; // 8 Mbps

            if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                options.mimeType = 'video/webm;codecs=vp9';
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
                options.mimeType = 'video/webm;codecs=vp8';
            } else if (MediaRecorder.isTypeSupported('video/webm')) {
                options.mimeType = 'video/webm';
            }

            this.mediaRecorder = new MediaRecorder(stream, options);

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `terminal-recording-${Date.now()}.webm`;
                a.click();
                URL.revokeObjectURL(url);
            };

            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            this.recordVideoBtn.textContent = 'Stop Recording';
            this.recordVideoBtn.style.backgroundColor = '#ff5f56';

            // Capture frames at consistent intervals (60 FPS = ~16.67ms)
            let lastFrameTime = 0;
            const targetFrameTime = 1000 / 60; // 60 FPS

            const captureFrame = async (currentTime) => {
                if (!this.isRecording) return;

                const elapsed = currentTime - lastFrameTime;

                if (elapsed >= targetFrameTime) {
                    lastFrameTime = currentTime - (elapsed % targetFrameTime);

                    try {
                        const canvasCapture = await html2canvas(terminalSection, {
                            backgroundColor: getComputedStyle(terminalSection).backgroundColor,
                            scale: scale,
                            logging: false,
                            useCORS: true,
                            allowTaint: true
                        });

                        // Draw scaled image
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(canvasCapture, 0, 0, rect.width, rect.height);
                    } catch (err) {
                        console.error('Frame capture error:', err);
                    }
                }

                if (this.isRecording) {
                    requestAnimationFrame(captureFrame);
                }
            };

            requestAnimationFrame(captureFrame);

            // Also trigger the animation to start
            if (!this.isAnimating) {
                this.startAnimation();
            }

            alert('Recording started! The video will have better quality at 60 FPS.');
        } catch (err) {
            console.error('Failed to start recording:', err);
            alert('Failed to start recording. Please try again.');
        }
    }

    stopVideoRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.isRecording = false;
            this.mediaRecorder.stop();
            this.recordVideoBtn.textContent = 'Record Video';
            this.recordVideoBtn.style.backgroundColor = '';
        }
    }

    startDragging(e) {
        // Don't drag if clicking on buttons or interactive elements
        if (e.target.closest('button') || e.target.closest('.terminal-button')) {
            return;
        }

        this.isDragging = true;
        this.dragStartX = e.clientX;
        this.dragStartY = e.clientY;

        const terminalSection = document.querySelector('.terminal-section');
        const rect = terminalSection.getBoundingClientRect();
        this.terminalStartX = rect.left;
        this.terminalStartY = rect.top;

        // Store the original width and height before changing position
        const originalWidth = rect.width;
        const originalHeight = rect.height;

        // Change cursor and add visual feedback
        document.body.style.cursor = 'grabbing';
        terminalSection.style.position = 'fixed';
        terminalSection.style.width = `${originalWidth}px`;
        terminalSection.style.height = `${originalHeight}px`;
        terminalSection.style.left = `${this.terminalStartX}px`;
        terminalSection.style.top = `${this.terminalStartY}px`;
        terminalSection.style.margin = '0';
    }

    drag(e) {
        if (!this.isDragging) return;

        const deltaX = e.clientX - this.dragStartX;
        const deltaY = e.clientY - this.dragStartY;

        const terminalSection = document.querySelector('.terminal-section');
        terminalSection.style.left = `${this.terminalStartX + deltaX}px`;
        terminalSection.style.top = `${this.terminalStartY + deltaY}px`;
    }

    stopDragging() {
        if (this.isDragging) {
            this.isDragging = false;
            document.body.style.cursor = '';
        }
    }
}

// Code examples for different languages
const codeExamples = {
    javascript: `// Fibonacci sequence generator in JavaScript
function* fibonacci(limit) {
    let prev = 0, curr = 1;

    while (prev < limit) {
        yield prev;
        [prev, curr] = [curr, prev + curr];
    }
}

// Generate Fibonacci numbers up to 1000
for (const num of fibonacci(1000)) {
    console.log(num);
}`,

    python: `# Fibonacci sequence generator in Python
def fibonacci(limit):
    """Generate Fibonacci numbers up to a limit"""
    prev, curr = 0, 1

    while prev < limit:
        yield prev
        prev, curr = curr, prev + curr

# Generate Fibonacci numbers up to 1000
for num in fibonacci(1000):
    print(num)`,

    java: `// Fibonacci sequence generator in Java
import java.util.ArrayList;
import java.util.List;

public class Fibonacci {
    public static List<Integer> generate(int limit) {
        List<Integer> sequence = new ArrayList<>();
        int prev = 0, curr = 1;

        while (prev < limit) {
            sequence.add(prev);
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return sequence;
    }

    public static void main(String[] args) {
        List<Integer> fibs = generate(1000);
        for (int num : fibs) {
            System.out.println(num);
        }
    }
}`,

    cpp: `// Fibonacci sequence generator in C++
#include <iostream>
#include <vector>
using namespace std;

vector<int> fibonacci(int limit) {
    vector<int> sequence;
    int prev = 0, curr = 1;

    while (prev < limit) {
        sequence.push_back(prev);
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return sequence;
}

int main() {
    vector<int> fibs = fibonacci(1000);
    for (int num : fibs) {
        cout << num << endl;
    }
    return 0;
}`,

    csharp: `// Fibonacci sequence generator in C#
using System;
using System.Collections.Generic;

class Program {
    static List<int> Fibonacci(int limit) {
        List<int> sequence = new List<int>();
        int prev = 0, curr = 1;

        while (prev < limit) {
            sequence.Add(prev);
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return sequence;
    }

    static void Main() {
        List<int> fibs = Fibonacci(1000);
        foreach (int num in fibs) {
            Console.WriteLine(num);
        }
    }
}`,

    php: `<?php
// Fibonacci sequence generator in PHP
function fibonacci($limit) {
    $sequence = array();
    $prev = 0;
    $curr = 1;

    while ($prev < $limit) {
        array_push($sequence, $prev);
        $next = $prev + $curr;
        $prev = $curr;
        $curr = $next;
    }
    return $sequence;
}

$fibs = fibonacci(1000);
foreach ($fibs as $num) {
    echo $num . "\n";
}
?>`,

    ruby: `# Fibonacci sequence generator in Ruby
def fibonacci(limit)
  sequence = []
  prev, curr = 0, 1

  while prev < limit
    sequence << prev
    prev, curr = curr, prev + curr
  end

  sequence
end

# Generate and print Fibonacci numbers
fibs = fibonacci(1000)
fibs.each { |num| puts num }`,

    go: `// Fibonacci sequence generator in Go
package main

import "fmt"

func fibonacci(limit int) []int {
    sequence := []int{}
    prev, curr := 0, 1

    for prev < limit {
        sequence = append(sequence, prev)
        prev, curr = curr, prev+curr
    }

    return sequence
}

func main() {
    fibs := fibonacci(1000)
    for _, num := range fibs {
        fmt.Println(num)
    }
}`,

    rust: `// Fibonacci sequence generator in Rust
fn fibonacci(limit: u32) -> Vec<u32> {
    let mut sequence = Vec::new();
    let mut prev = 0;
    let mut curr = 1;

    while prev < limit {
        sequence.push(prev);
        let next = prev + curr;
        prev = curr;
        curr = next;
    }

    sequence
}

fn main() {
    let fibs = fibonacci(1000);
    for num in fibs {
        println!("{}", num);
    }
}`,

    typescript: `// Fibonacci sequence generator in TypeScript
function* fibonacci(limit: number): Generator<number> {
    let prev = 0, curr = 1;

    while (prev < limit) {
        yield prev;
        [prev, curr] = [curr, prev + curr];
    }
}

// Generate Fibonacci numbers up to 1000
for (const num of fibonacci(1000)) {
    console.log(num);
}`,

    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is a sample HTML page.</p>
</body>
</html>`,

    css: `/* Modern CSS styling */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.card {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-4px);
}`,

    sql: `-- Sample SQL queries
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id
WHERE orders.status = 'completed'
  AND orders.total > 100
ORDER BY orders.total DESC
LIMIT 10;`,

    bash: `#!/bin/bash
# Fibonacci sequence generator in Bash

fibonacci() {
    local limit=$1
    local prev=0
    local curr=1

    while [ $prev -lt $limit ]; do
        echo $prev
        local next=$((prev + curr))
        prev=$curr
        curr=$next
    done
}

# Generate Fibonacci numbers up to 1000
fibonacci 1000`,

    plaintext: `This is plain text mode.
No syntax highlighting will be applied.

You can use this mode for:
- General notes and documentation
- Plain text output from commands
- Configuration files
- Log files
- README content
- Any non-code content

This example has more than 10 lines
to match the other code examples.`
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('code-input');

    // Set default code in the input BEFORE initializing terminal
    if (codeInput && !codeInput.value) {
        codeInput.value = codeExamples.bash;
    }

    // Initialize terminal after setting default code
    new TerminalUI();
});
