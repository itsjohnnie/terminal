// Terminal UI Playground Script
class TerminalUI {
    constructor() {
        // Elements
        this.terminal = document.getElementById('terminal');
        this.codeInput = document.getElementById('code-input');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.speedSlider = document.getElementById('speed');
        this.speedValue = document.getElementById('speed-value');
        this.languageSelect = document.getElementById('language');
        this.themeSelect = document.getElementById('theme');
        this.promptInput = document.getElementById('prompt');
        this.showLineNumbersCheckbox = document.getElementById('show-line-numbers');

        // Export buttons
        this.exportHtmlBtn = document.getElementById('export-html');
        this.exportCodeBtn = document.getElementById('export-gif');
        this.exportJsonBtn = document.getElementById('export-video');
        this.screenshotBtn = document.getElementById('screenshot');

        // State
        this.typingSpeed = 50;
        this.isPaused = false;
        this.isAnimating = false;
        this.currentLine = 0;
        this.currentChar = 0;
        this.lines = [];
        this.animationTimeout = null;
        this.promptText = '$ ';

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSpeedDisplay();
    }

    setupEventListeners() {
        // Control buttons
        this.startBtn.addEventListener('click', () => this.startAnimation());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        this.resetBtn.addEventListener('click', () => this.resetAnimation());
        this.clearBtn.addEventListener('click', () => this.clearTerminal());

        // Settings
        this.speedSlider.addEventListener('input', (e) => {
            this.typingSpeed = parseInt(e.target.value);
            this.updateSpeedDisplay();
        });

        this.themeSelect.addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });

        this.promptInput.addEventListener('input', (e) => {
            this.promptText = e.target.value;
        });

        this.showLineNumbersCheckbox.addEventListener('change', (e) => {
            this.toggleLineNumbers(e.target.checked);
        });

        // Export buttons
        this.exportHtmlBtn.addEventListener('click', () => this.exportAsHtml());
        this.exportCodeBtn.addEventListener('click', () => this.copyCode());
        this.exportJsonBtn.addEventListener('click', () => this.exportAsJson());
        this.screenshotBtn.addEventListener('click', () => this.takeScreenshot());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.startAnimation();
            } else if (e.key === 'Escape') {
                this.resetAnimation();
            }
        });
    }

    updateSpeedDisplay() {
        this.speedValue.textContent = `${this.typingSpeed}ms`;
    }

    changeTheme(theme) {
        document.body.className = `theme-${theme}`;
    }

    toggleLineNumbers(show) {
        if (show) {
            this.terminal.classList.add('show-line-numbers');
        } else {
            this.terminal.classList.remove('show-line-numbers');
        }
    }

    clearTerminal() {
        this.terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">${this.promptText}</span>
                <span class="cursor">█</span>
            </div>
        `;
        this.codeInput.value = '';
        this.resetState();
    }

    resetState() {
        this.currentLine = 0;
        this.currentChar = 0;
        this.lines = [];
        this.isAnimating = false;
        this.isPaused = false;
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
        this.updateButtonStates();
    }

    resetAnimation() {
        this.resetState();
        this.terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">${this.promptText}</span>
                <span class="cursor">█</span>
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

    startAnimation() {
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

        this.resetState();
        this.lines = code.split('\n');
        this.isAnimating = true;
        this.updateButtonStates();

        // Clear terminal
        this.terminal.innerHTML = '';

        // Start animation
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

            // Add prompt
            const prompt = document.createElement('span');
            prompt.className = 'prompt';
            prompt.textContent = this.promptText;
            lineElement.appendChild(prompt);

            const codeSpan = document.createElement('span');
            codeSpan.className = 'code-content';
            lineElement.appendChild(codeSpan);

            const cursor = document.createElement('span');
            cursor.className = 'cursor';
            cursor.textContent = '█';
            lineElement.appendChild(cursor);

            this.terminal.appendChild(lineElement);
        }

        const lineElement = this.terminal.lastElementChild;
        const codeSpan = lineElement.querySelector('.code-content');

        if (this.currentChar < currentLineText.length) {
            // Add next character
            const char = currentLineText[this.currentChar];
            codeSpan.textContent += char;
            this.currentChar++;

            // Scroll to bottom
            this.terminal.scrollTop = this.terminal.scrollHeight;

            this.animationTimeout = setTimeout(() => this.animateNextChar(), this.typingSpeed);
        } else {
            // Move to next line
            const cursor = lineElement.querySelector('.cursor');
            if (cursor) cursor.remove();

            // Apply syntax highlighting to the completed line
            this.highlightLine(lineElement);

            this.currentLine++;
            this.currentChar = 0;

            this.animationTimeout = setTimeout(() => this.animateNextChar(), this.typingSpeed * 5);
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

        // Remove cursor if present
        const cursor = this.terminal.querySelector('.cursor');
        if (cursor) cursor.remove();

        // Add final cursor at the end
        const finalLine = document.createElement('div');
        finalLine.className = 'terminal-line';
        finalLine.innerHTML = `<span class="prompt">${this.promptText}</span><span class="cursor">█</span>`;
        this.terminal.appendChild(finalLine);
    }

    // Export Functions
    exportAsHtml() {
        const terminalContent = this.terminal.innerHTML;
        const theme = this.themeSelect.value;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminal Output</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
</head>
<body class="theme-${theme}">
    <div class="container">
        <div class="terminal-section">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <span class="terminal-button close"></span>
                    <span class="terminal-button minimize"></span>
                    <span class="terminal-button maximize"></span>
                </div>
                <div class="terminal-title">Terminal</div>
            </div>
            <div class="terminal-body">
                ${terminalContent}
            </div>
        </div>
    </div>
</body>
</html>`;

        this.downloadFile(html, 'terminal-output.html', 'text/html');
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
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new TerminalUI();

    // Add sample code for demonstration
    const sampleCode = `// Sample JavaScript Code
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

    document.getElementById('code-input').placeholder = sampleCode;
});
