import React from 'react';
import Terminal from './Terminal';

// Webflow Code Component with declareComponent
export const WebflowTerminal = ({
  code = "console.log('Hello World');",
  language = 'JavaScript',
  theme = 'dark',
  aspectRatio = '3-2',
  title = 'Terminal',
  showLineNumbers = true,
  autoPlay = true,
  typingSpeed = 40,
}: {
  code: string;
  language: string;
  theme: string;
  aspectRatio: string;
  title: string;
  showLineNumbers: boolean;
  autoPlay: boolean;
  typingSpeed: number;
}) => {
  return (
    <Terminal
      code={code}
      language={language}
      theme={theme as any}
      aspectRatio={aspectRatio as any}
      title={title}
      showLineNumbers={showLineNumbers}
      autoPlay={autoPlay}
      typingSpeed={typingSpeed}
    />
  );
};

// Webflow Component Configuration
// This would be in your devlink configuration
export const TerminalComponentConfig = {
  component: WebflowTerminal,
  props: {
    code: {
      type: 'string',
      displayName: 'Code',
      description: 'The code to display in the terminal',
      defaultValue: "console.log('Hello World');",
      control: 'textarea',
      rows: 10,
    },
    language: {
      type: 'string',
      displayName: 'Language',
      description: 'Programming language for syntax highlighting',
      defaultValue: 'JavaScript',
      control: 'select',
      options: [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'C++',
        'C#',
        'PHP',
        'Ruby',
        'Go',
        'Rust',
        'HTML',
        'CSS',
        'SQL',
        'Bash',
        'Plain Text',
      ],
    },
    theme: {
      type: 'string',
      displayName: 'Theme',
      description: 'Color theme for the terminal',
      defaultValue: 'dark',
      control: 'select',
      options: ['dark', 'light', 'claude', 'dracula', 'monokai', 'nord'],
    },
    aspectRatio: {
      type: 'string',
      displayName: 'Aspect Ratio',
      description: 'Terminal window aspect ratio',
      defaultValue: '3-2',
      control: 'select',
      options: [
        { label: 'Auto', value: 'auto' },
        { label: '1:1 (Square)', value: '1-1' },
        { label: '3:2', value: '3-2' },
        { label: '16:9', value: '16-9' },
      ],
    },
    title: {
      type: 'string',
      displayName: 'Terminal Title',
      description: 'Title shown in terminal header',
      defaultValue: 'Terminal',
      control: 'text',
    },
    showLineNumbers: {
      type: 'boolean',
      displayName: 'Show Line Numbers',
      description: 'Display line numbers in the terminal',
      defaultValue: true,
      control: 'checkbox',
    },
    autoPlay: {
      type: 'boolean',
      displayName: 'Auto Play',
      description: 'Start typing animation automatically',
      defaultValue: true,
      control: 'checkbox',
    },
    typingSpeed: {
      type: 'number',
      displayName: 'Typing Speed (ms)',
      description: 'Speed of typing animation in milliseconds',
      defaultValue: 40,
      control: 'number',
      min: 10,
      max: 200,
      step: 10,
    },
  },
};

export default WebflowTerminal;
