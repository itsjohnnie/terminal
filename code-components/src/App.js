import Terminal from './Terminal';
import './App.css';

function App() {
  const exampleCode = `// Fibonacci sequence in JavaScript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <Terminal
        code={exampleCode}
        language="JavaScript"
        theme="claude"
        aspectRatio="3-2"
        title="Terminal"
        showLineNumbers={true}
        autoPlay={true}
        typingSpeed={40}
      />
    </div>
  );
}

export default App;
