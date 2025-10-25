import React, { useState, useEffect, useRef } from 'react';
import './Terminal.css';

const Terminal = ({
  code = "console.log('Hello World');",
  language = 'JavaScript',
  theme = 'dark',
  aspectRatio = '3-2',
  title = 'Terminal',
  showLineNumbers = true,
  autoPlay = true,
  typingSpeed = 40,
}) => {
  const [lines, setLines] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoadingPhase, setIsLoadingPhase] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [spinnerFrame, setSpinnerFrame] = useState(0);
  const [copied, setCopied] = useState(false);

  const terminalBodyRef = useRef(null);
  const animationStateRef = useRef({
    currentLine: 0,
    currentChar: 0,
    timeout: null,
  });
  const hasStartedRef = useRef(false);

  const loadingMessages = [
    'Thinking', 'Processing', 'Compiling', 'Brewing', 'Crafting',
    'Initializing', 'Loading', 'Preparing', 'Computing', 'Analyzing',
    'Optimizing', 'Bootstrapping', 'Synthesizing', 'Calibrating',
    'Pondering', 'Configuring'
  ];

  const spinnerFrames = ['◐', '◓', '◑', '◒', '◆', '◇', '■', '□', '▲', '△', '◉', '◈'];

  const codeLines = code.split('\n');

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  useEffect(() => {
    if (autoPlay && !hasStartedRef.current) {
      hasStartedRef.current = true;
      startAnimation();
    }
  }, [autoPlay]);

  const getTypingDelay = (currentChar) => {
    const baseDelay = typingSpeed * (0.5 + Math.random() * 1.0);
    const longPauseChars = ['.', '!', '?', ';'];
    const pauseChars = [' ', ',', ';', '.', ':', '!', '?', ')', '}', ']', '>', '\n'];

    if (longPauseChars.includes(currentChar)) {
      return baseDelay * (3.5 + Math.random() * 2.0);
    } else if (pauseChars.includes(currentChar)) {
      return baseDelay * (2.0 + Math.random() * 1.5);
    } else if (['(', '{', '['].includes(currentChar)) {
      return baseDelay * (1.8 + Math.random() * 1.0);
    }
    return baseDelay;
  };

  const animateTextTransition = async (oldText, newText, setTextFn) => {
    const maxLength = Math.max(oldText.length, newText.length);
    const chars = [];

    // Initialize with old characters or spaces
    for (let i = 0; i < maxLength; i++) {
      chars[i] = oldText[i] || '';
    }

    // Staggered animation - each character changes after a delay
    const characterPromises = [];
    for (let i = 0; i < maxLength; i++) {
      const promise = (async (index) => {
        // Stagger delay: each character waits a bit longer
        await new Promise(r => setTimeout(r, index * 30));

        // Flip through random characters briefly
        const flipDuration = 150;
        const flipInterval = 30;
        const flips = Math.floor(flipDuration / flipInterval);

        for (let j = 0; j < flips; j++) {
          const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
          chars[index] = randomChar;
          setTextFn(chars.join(''));
          await new Promise(r => setTimeout(r, flipInterval));
        }

        // Set final character
        chars[index] = newText[index] || '';
        setTextFn(chars.join(''));
      })(i);

      characterPromises.push(promise);
    }

    await Promise.all(characterPromises);
  };

  const showLoadingMessages = async () => {
    setIsLoadingPhase(true);

    // Select 3-4 random loading messages
    const numMessages = 3 + Math.floor(Math.random() * 2);
    const selectedMessages = [];
    const availableMessages = [...loadingMessages];

    for (let i = 0; i < numMessages; i++) {
      const randomIndex = Math.floor(Math.random() * availableMessages.length);
      selectedMessages.push(availableMessages[randomIndex]);
      availableMessages.splice(randomIndex, 1);
    }

    // Start spinner animation
    const spinnerInterval = setInterval(() => {
      setSpinnerFrame(prev => (prev + 1) % spinnerFrames.length);
    }, 300);

    // Show each message with staggered character flip animation
    for (let i = 0; i < selectedMessages.length; i++) {
      const newMessage = selectedMessages[i];
      const oldMessage = i === 0 ? '' : selectedMessages[i - 1];

      await animateTextTransition(oldMessage, newMessage, setLoadingText);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    clearInterval(spinnerInterval);
    setIsLoadingPhase(false);
    setLoadingText('');
  };

  const animateNextChar = () => {
    const state = animationStateRef.current;

    if (state.currentLine >= codeLines.length) {
      setIsAnimating(false);
      return;
    }

    const currentLineText = codeLines[state.currentLine];

    if (state.currentChar === 0) {
      // Starting a new line
      setLines(prev => [
        ...prev,
        {
          lineNumber: state.currentLine + 1,
          content: '',
          isComplete: false,
        }
      ]);
    }

    if (state.currentChar < currentLineText.length) {
      const char = currentLineText[state.currentChar];

      setLines(prev => {
        const newLines = [...prev];
        const lastLine = newLines[newLines.length - 1];
        lastLine.content += char;
        return newLines;
      });

      state.currentChar++;

      // Scroll to bottom
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      }

      const delay = getTypingDelay(char);
      state.timeout = setTimeout(() => animateNextChar(), delay);
    } else {
      // Line complete, mark it and move to next
      setLines(prev => {
        const newLines = [...prev];
        const lastLine = newLines[newLines.length - 1];
        lastLine.isComplete = true;
        return newLines;
      });

      state.currentLine++;
      state.currentChar = 0;

      const lineBreakDelay = typingSpeed * (3 + Math.random() * 2);
      state.timeout = setTimeout(() => animateNextChar(), lineBreakDelay);
    }
  };

  const startAnimation = async () => {
    // Clear any existing animation
    if (animationStateRef.current.timeout) {
      clearTimeout(animationStateRef.current.timeout);
    }

    // Reset state
    setLines([]);
    animationStateRef.current = {
      currentLine: 0,
      currentChar: 0,
      timeout: null,
    };

    setIsAnimating(true);

    // Show loading messages first
    await showLoadingMessages();

    // Start typing animation
    animateNextChar();
  };

  const handleCopy = async () => {
    const codeText = lines.map(line => line.content).join('\n');
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationStateRef.current.timeout) {
        clearTimeout(animationStateRef.current.timeout);
      }
    };
  }, []);

  const aspectRatioClass = aspectRatio !== 'auto' ? `aspect-${aspectRatio}` : '';

  return (
    <div className={`terminal-section ${aspectRatioClass}`}>
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-button close"></span>
          <span className="terminal-button minimize"></span>
          <span className="terminal-button maximize"></span>
        </div>
        <div className="terminal-title">{title}</div>
        <div className="terminal-language">{language}</div>
        <button className="terminal-copy-btn" onClick={handleCopy} title="Copy code">
          {copied ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>
      <div
        ref={terminalBodyRef}
        className={`terminal-body ${showLineNumbers ? 'show-line-numbers' : ''}`}
      >
        {isLoadingPhase && (
          <div className="terminal-line loading-line">
            <span className="line-number">  1</span>
            <span className="loading-spinner">{spinnerFrames[spinnerFrame]} </span>
            <span className="loading-text">{loadingText}</span>
          </div>
        )}
        {lines.map((line, index) => (
          <div key={index} className="terminal-line">
            <span className="line-number">{line.lineNumber.toString().padStart(3, ' ')}</span>
            <span className="code-content">{line.content}</span>
            {!line.isComplete && index === lines.length - 1 && (
              <span className="cursor">|</span>
            )}
          </div>
        ))}
        {!isAnimating && !isLoadingPhase && lines.length > 0 && (
          <div className="terminal-line">
            <span className="line-number">{(lines.length + 1).toString().padStart(3, ' ')}</span>
            <span className="cursor">|</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
