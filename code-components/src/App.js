import './App.css';
import Terminal from './Terminal.webflow';

function App() {
  const exampleCode = `// Example code
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

  return (
    <div className="App" style={{ padding: '2rem', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
        Terminal Component Demo
      </h1>

      <Terminal
        code={exampleCode}
        language="JavaScript"
        theme="claude"
        aspectRatio="3-2"
        title="My Terminal"
        showLineNumbers={true}
        autoPlay={true}
        typingSpeed={40}
      />
    </div>
  );
}

export default App;
