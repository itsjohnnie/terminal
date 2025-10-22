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
        this.terminalTitleInput = document.getElementById('terminal-title');
        this.terminalTitleDisplay = document.getElementById('terminal-title-display');
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
        this.spinnerFrames = ['|', '/', '-', '\\'];
        this.currentSpinnerFrame = 0;

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

        this.terminalTitleInput.addEventListener('input', (e) => {
            this.updateTerminalTitle(e.target.value);
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

    updateTerminalTitle(title) {
        this.terminalTitleDisplay.textContent = title || 'Terminal';
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

    getTypingDelay(currentChar, nextChar) {
        // Base speed with more random variation (±30%)
        const baseDelay = this.typingSpeed * (0.7 + Math.random() * 0.6);

        // Characters that indicate natural pause points
        const pauseChars = [' ', ',', ';', '.', ':', '!', '?', ')', '}', ']', '>', '\n'];
        const longPauseChars = ['.', '!', '?', ';'];

        // Check if current character is a pause point
        if (longPauseChars.includes(currentChar)) {
            // Longer pause after sentence-ending punctuation
            return baseDelay * (3.5 + Math.random() * 1.5);
        } else if (pauseChars.includes(currentChar)) {
            // Medium pause after commas, spaces, etc.
            return baseDelay * (2.0 + Math.random() * 1.0);
        } else if (currentChar === '(' || currentChar === '{' || currentChar === '[') {
            // Noticeable pause before typing inside brackets
            return baseDelay * (1.8 + Math.random() * 0.7);
        } else {
            // Normal typing with variation
            return baseDelay;
        }
    }

    async showLoadingMessages() {
        // Select 3-4 random loading messages
        const numMessages = 3 + Math.floor(Math.random() * 2); // 3 or 4
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

        const spinnerSpan = document.createElement('span');
        spinnerSpan.className = 'loading-spinner';
        loadingLine.appendChild(spinnerSpan);

        const loadingText = document.createElement('span');
        loadingText.className = 'loading-text';
        loadingLine.appendChild(loadingText);

        this.terminal.appendChild(loadingLine);

        // Spinner animation interval (updates every 500ms)
        const spinnerInterval = setInterval(() => {
            if (!this.isLoadingPhase) {
                clearInterval(spinnerInterval);
                return;
            }
            this.currentSpinnerFrame = (this.currentSpinnerFrame + 1) % this.spinnerFrames.length;
            spinnerSpan.textContent = this.spinnerFrames[this.currentSpinnerFrame] + ' ';
        }, 500);

        // Show each message for 2 seconds
        for (let i = 0; i < selectedMessages.length; i++) {
            if (!this.isLoadingPhase) break; // Allow interruption

            loadingText.textContent = selectedMessages[i];
            spinnerSpan.textContent = this.spinnerFrames[this.currentSpinnerFrame] + ' ';
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Clean up
        clearInterval(spinnerInterval);

        // Remove loading line
        if (loadingLine.parentNode) {
            loadingLine.remove();
        }
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

        // Remove cursor if present
        const cursor = this.terminal.querySelector('.cursor');
        if (cursor) cursor.remove();

        // Add final empty line with line number
        const finalLine = document.createElement('div');
        finalLine.className = 'terminal-line';

        // Add line number for the empty line
        const lineNumber = document.createElement('span');
        lineNumber.className = 'line-number';
        lineNumber.textContent = (this.lines.length + 1).toString().padStart(3, ' ');
        finalLine.appendChild(lineNumber);

        // Add cursor
        const finalCursor = document.createElement('span');
        finalCursor.className = 'cursor';
        finalCursor.textContent = '█';
        finalLine.appendChild(finalCursor);

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

// Code examples for different languages
const codeExamples = {
    javascript: `// Fibonacci sequence in JavaScript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

    python: `# Fibonacci sequence in Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))`,

    java: `// Fibonacci sequence in Java
public class Fibonacci {
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fibonacci(10));
    }
}`,

    cpp: `// Fibonacci sequence in C++
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << fibonacci(10) << endl;
    return 0;
}`,

    csharp: `// Fibonacci sequence in C#
using System;

class Program {
    static int Fibonacci(int n) {
        if (n <= 1) return n;
        return Fibonacci(n - 1) + Fibonacci(n - 2);
    }

    static void Main() {
        Console.WriteLine(Fibonacci(10));
    }
}`,

    php: `<?php
// Fibonacci sequence in PHP
function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

echo fibonacci(10);
?>`,

    ruby: `# Fibonacci sequence in Ruby
def fibonacci(n)
    return n if n <= 1
    fibonacci(n - 1) + fibonacci(n - 2)
end

puts fibonacci(10)`,

    go: `// Fibonacci sequence in Go
package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println(fibonacci(10))
}`,

    rust: `// Fibonacci sequence in Rust
fn fibonacci(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    println!("{}", fibonacci(10));
}`,

    typescript: `// Fibonacci sequence in TypeScript
function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`,

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
# Fibonacci sequence in Bash

fibonacci() {
    if [ $1 -le 1 ]; then
        echo $1
    else
        echo $(( $(fibonacci $(($1-1))) + $(fibonacci $(($1-2))) ))
    fi
}

fibonacci 10`,

    plaintext: `This is plain text.
No syntax highlighting will be applied.

You can use this mode for:
- General notes
- Documentation
- Plain text output
- Any non-code content`
};

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new TerminalUI();
    const codeInput = document.getElementById('code-input');
    const languageSelect = document.getElementById('language');
    const terminalElement = document.getElementById('terminal');

    // Set default code in the input
    codeInput.value = codeExamples.javascript;

    // Show line numbers by default
    terminalElement.classList.add('show-line-numbers');

    // Update code example when language changes
    languageSelect.addEventListener('change', (e) => {
        const language = e.target.value;
        if (codeExamples[language]) {
            codeInput.value = codeExamples[language];
        }
    });
});
