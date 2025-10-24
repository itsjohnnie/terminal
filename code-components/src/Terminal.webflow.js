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
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showLoadingState, setShowLoadingState] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const timeoutRef = useRef(null);
  const terminalBodyRef = useRef(null);

  const codeLines = code.split('\n');

  const loadingMessages = [
    'Thinking', 'Processing', 'Compiling', 'Brewing', 'Crafting',
    'Initializing', 'Loading', 'Preparing', 'Computing', 'Analyzing'
  ];

  const getTypingDelay = (char) => {
    const baseDelay = typingSpeed * (0.5 + Math.random() * 1.0);
    const pauseChars = [' ', ',', ';', '.', ':', '!', '?', ')', '}', ']', '>', '\n'];
    const longPauseChars = ['.', '!', '?', ';'];

    if (longPauseChars.includes(char)) {
      return baseDelay * (3.5 + Math.random() * 2.0);
    } else if (pauseChars.includes(char)) {
      return baseDelay * (2.0 + Math.random() * 1.5);
    } else if (['(', '{', '['].includes(char)) {
      return baseDelay * (1.8 + Math.random() * 1.0);
    }
    return baseDelay;
  };

  const showLoadingAnimation = async () => {
    setShowLoadingState(true);
    const messages = loadingMessages.sort(() => Math.random() - 0.5).slice(0, 3);

    for (const msg of messages) {
      setLoadingMessage(msg);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setShowLoadingState(false);
    setLoadingMessage('');
  };

  const startAnimation = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setLines([]);
    setCurrentLine(0);
    setCurrentChar(0);

    if (autoPlay) {
      await showLoadingAnimation();
    }

    animateNextChar();
  };

  const animateNextChar = () => {
    if (currentLine >= codeLines.length) {
      setIsAnimating(false);
      return;
    }

    const lineText = codeLines[currentLine];

    if (currentChar < lineText.length) {
      const char = lineText[currentChar];

      setLines(prev => {
        const newLines = [...prev];
        if (!newLines[currentLine]) {
          newLines[currentLine] = {
            lineNumber: currentLine + 1,
            content: '',
            isComplete: false
          };
        }
        newLines[currentLine].content += char;
        return newLines;
      });

      setCurrentChar(prev => prev + 1);

      const delay = getTypingDelay(char);
      timeoutRef.current = setTimeout(animateNextChar, delay);
    } else {
      // Line complete, move to next
      setLines(prev => {
        const newLines = [...prev];
        if (newLines[currentLine]) {
          newLines[currentLine].isComplete = true;
        }
        return newLines;
      });

      setCurrentLine(prev => prev + 1);
      setCurrentChar(0);

      const lineBreakDelay = typingSpeed * (3 + Math.random() * 2);
      timeoutRef.current = setTimeout(animateNextChar, lineBreakDelay);
    }

    // Auto-scroll
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  };

  const copyCode = () => {
    const codeText = lines.map(line => line.content).join('\n');
    navigator.clipboard.writeText(codeText || code);
  };

  useEffect(() => {
    if (autoPlay && !isAnimating) {
      startAnimation();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, autoPlay]);

  const aspectRatioClass = aspectRatio !== 'auto' ? `aspect-${aspectRatio}` : '';

  return (
    <div className={`terminal-wrapper theme-${theme}`}>
      <div className={`terminal-container ${aspectRatioClass}`}>
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="terminal-button close"></span>
            <span className="terminal-button minimize"></span>
            <span className="terminal-button maximize"></span>
          </div>
          <div className="terminal-title">{title}</div>
          <div className="terminal-language">{language}</div>
          <button className="terminal-copy-btn" onClick={copyCode} title="Copy code">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
        <div
          className={`terminal-body ${showLineNumbers ? 'show-line-numbers' : ''}`}
          ref={terminalBodyRef}
        >
          {showLoadingState ? (
            <div className="terminal-line loading-line">
              {showLineNumbers && <span className="line-number">  1</span>}
              <span className="loading-spinner">◐ </span>
              <span className="loading-text">{loadingMessage}</span>
            </div>
          ) : (
            <>
              {lines.map((line, index) => (
                <div key={index} className="terminal-line">
                  {showLineNumbers && (
                    <span className="line-number">
                      {line.lineNumber.toString().padStart(3, ' ')}
                    </span>
                  )}
                  <span className="code-content">{line.content}</span>
                  {!line.isComplete && index === currentLine && (
                    <span className="cursor">|</span>
                  )}
                </div>
              ))}
              {!showLoadingState && lines.length === 0 && (
                <div className="terminal-line">
                  {showLineNumbers && <span className="line-number">  1</span>}
                  <span className="cursor">|</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
