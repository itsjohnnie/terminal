# Terminal UI Playground

A responsive, customizable terminal UI template that allows you to paste code and watch it animate line by line as if it was being typed in real-time.

## Features

### Core Functionality
- **Line-by-Line Animation**: Code is displayed character by character with a realistic typing effect
- **Syntax Highlighting**: Support for 15+ programming languages using highlight.js
- **Fully Responsive**: Works seamlessly on mobile phones, tablets, and desktops
- **Custom Prompt**: Customize the terminal prompt to match your style

### Customization Options
- **Typing Speed**: Adjust animation speed from 10ms to 200ms per character
- **Language Selection**: Choose from JavaScript, Python, Java, C++, C#, PHP, Ruby, Go, Rust, TypeScript, HTML, CSS, SQL, Bash, and Plain Text
- **Theme Selection**: 5 beautiful themes to choose from:
  - Dark (default)
  - Light
  - Dracula
  - Monokai
  - Nord

### Export Features
- **Export as HTML**: Download a standalone HTML file with your terminal output
- **Copy as Code**: Copy the raw code to your clipboard
- **Export as JSON**: Save your configuration and code as JSON
- **Take Screenshot**: Capture your terminal as a PNG image

## Usage

1. **Open the Application**
   - Open `index.html` in your web browser
   - No build process required!

2. **Paste Your Code**
   - Paste your code in the input field at the top
   - Or type directly into the textarea

3. **Customize Settings**
   - Adjust the typing speed using the slider
   - Select your programming language
   - Choose your preferred theme
   - Customize the terminal prompt

4. **Start Animation**
   - Click the "Start Animation" button or press `Ctrl+Enter`
   - Watch your code animate line by line
   - Use "Pause" to pause/resume
   - Use "Reset" to start over
   - Press `Escape` to reset

5. **Export Your Work**
   - Choose from various export options
   - Share your animated terminal output

## Responsive Design

The terminal UI is designed to work perfectly on all devices:

- **Width**: Always 90% of the viewport
- **Max-width**: 50rem for optimal readability
- **Mobile-optimized**: Touch-friendly controls and readable font sizes
- **Flexible Layout**: Grid-based controls that adapt to screen size

## Keyboard Shortcuts

- `Ctrl+Enter`: Start animation
- `Escape`: Reset animation

## Technical Details

### Technologies Used
- Pure HTML, CSS, and JavaScript (no frameworks required)
- [Highlight.js](https://highlightjs.org/) for syntax highlighting
- [html2canvas](https://html2canvas.hertzen.com/) for screenshot functionality
- CSS Grid and Flexbox for responsive layout
- CSS Custom Properties for theming

### Browser Compatibility
Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### File Structure
```
terminal-ui/
├── index.html      # Main HTML file
├── styles.css      # All styles and themes
├── script.js       # Terminal animation logic
└── README.md       # This file
```

## Customization Guide

### Adding New Themes

Edit `styles.css` and add your theme colors:

```css
body.theme-yourtheme {
    --bg-primary: #your-color;
    --bg-secondary: #your-color;
    --text-primary: #your-color;
    --accent: #your-color;
    /* ... other variables */
}
```

Then add the theme option to the select in `index.html`:

```html
<option value="yourtheme">Your Theme</option>
```

### Changing Default Settings

In `script.js`, modify the constructor defaults:

```javascript
this.typingSpeed = 50;  // Change default speed
this.promptText = '$ '; // Change default prompt
```

### Adding More Languages

Languages are automatically supported by highlight.js. Just add them to the select dropdown in `index.html`:

```html
<option value="yourlang">Your Language</option>
```

## Examples

### Example 1: JavaScript Code
```javascript
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));
```

### Example 2: Python Code
```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))
```

### Example 3: HTML Code
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello, World!</h1>
</body>
</html>
```

## Tips

1. **Performance**: For very large code files, consider increasing the typing speed to reduce animation time
2. **Mobile**: The terminal is fully touch-responsive, but works best on devices 375px wide or larger
3. **Themes**: The theme affects both the interface and the terminal output
4. **Export**: Screenshots work best after the animation is complete
5. **Syntax**: Choose the correct language for proper syntax highlighting

## Future Enhancements

Potential features to add:
- Multiple terminal tabs
- Command history
- Real command execution (with web-based terminal)
- Custom color schemes
- Collaborative sharing links
- Terminal sound effects
- Multiple cursor styles

## License

Free to use and modify for personal and commercial projects.

## Credits

Built with:
- Highlight.js for syntax highlighting
- html2canvas for screenshot functionality
- Love for terminal aesthetics

---

**Enjoy creating beautiful terminal animations!**
