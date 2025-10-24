# Terminal Component for Webflow

An animated terminal code display component built as a Webflow Code Component using React.

## Features

- 🎨 **6 Built-in Themes**: Dark, Light, Claude, Dracula, Monokai, Nord
- 📐 **Aspect Ratio Control**: Auto, 1:1, 3:2, 16:9
- ⚡ **Typing Animation**: Realistic human-like typing with variable speed
- 📝 **Line Numbers**: Toggle line number display
- 🎯 **Auto-play**: Optional automatic animation on load
- 📋 **Copy Button**: Built-in code copying functionality
- 🎬 **Loading States**: Animated loading messages before typing starts

## Installation for Webflow

### Prerequisites
- Webflow account with DevLink access
- Node.js and npm installed locally

### Steps

1. **Set up your React project with DevLink**
   ```bash
   npm create cloudflare@latest -- my-terminal-component --framework=react
   cd my-terminal-component
   ```

2. **Copy the component files**
   - Copy `Terminal.tsx` to your `src/components/` folder
   - Copy `TerminalWebflow.tsx` to your `src/components/` folder
   - Copy `Terminal.css` to your `src/components/` folder

3. **Import in your main file** (`src/index.tsx` or `src/App.tsx`)
   ```typescript
   import { WebflowTerminal } from './components/TerminalWebflow';
   ```

4. **Publish via DevLink**
   - Build your project: `npm run build`
   - Use DevLink to sync your components to Webflow
   - Install the component in your Webflow site

## Webflow Designer Configuration

Once installed, the component will have these editable props in the Webflow Designer:

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **Code** | Textarea | `console.log('Hello World');` | The code to display (multi-line) |
| **Language** | Select | `JavaScript` | Programming language name displayed in header |
| **Theme** | Select | `dark` | Color theme (dark, light, claude, dracula, monokai, nord) |
| **Aspect Ratio** | Select | `3-2` | Terminal dimensions (auto, 1:1, 3:2, 16:9) |
| **Terminal Title** | Text | `Terminal` | Text shown in terminal header |
| **Show Line Numbers** | Checkbox | `true` | Display line numbers |
| **Auto Play** | Checkbox | `true` | Start animation automatically |
| **Typing Speed** | Number | `40` | Animation speed in milliseconds (10-200) |

## Usage in Webflow

### Basic Example
1. Drag the Terminal component onto your page
2. In the right panel, paste your code into the **Code** field
3. Select your preferred **Language** from the dropdown
4. Choose a **Theme**
5. Publish and preview!

### Common Use Cases

**Code Documentation Site**
```
Code: Your API example code
Language: JavaScript
Theme: Claude
Aspect Ratio: 16:9
Auto Play: true
```

**Portfolio Project Showcase**
```
Code: Key code snippet from your project
Language: TypeScript
Theme: Dracula
Aspect Ratio: 3:2
Auto Play: true
```

**Tutorial/Blog Post**
```
Code: Step-by-step code example
Language: Python
Theme: Dark
Aspect Ratio: Auto
Auto Play: false
```

## Component Architecture

```
TerminalWebflow.tsx (Webflow wrapper)
    ↓
Terminal.tsx (Core React component)
    ↓
Terminal.css (Styles with CSS variables)
```

### File Structure
```
src/
├── components/
│   ├── Terminal.tsx           # Main component logic
│   ├── TerminalWebflow.tsx    # Webflow Code Component wrapper
│   └── Terminal.css           # Styles
```

## Customization

### Adding Custom Themes

Edit `Terminal.css` and add a new theme class:

```css
.terminal-wrapper.theme-custom {
  --bg-primary: #yourcolor;
  --bg-secondary: #yourcolor;
  --bg-tertiary: #yourcolor;
  --text-primary: #yourcolor;
  --text-secondary: #yourcolor;
  --accent: #yourcolor;
  --border: #yourcolor;
  --terminal-bg: #yourcolor;
  --terminal-text: #yourcolor;
}
```

Then add the option to `TerminalWebflow.tsx`:

```typescript
theme: {
  options: ['dark', 'light', 'claude', 'dracula', 'monokai', 'nord', 'custom'],
}
```

### Adjusting Animation Behavior

In `Terminal.tsx`, modify the `getTypingDelay` function:

```typescript
const getTypingDelay = (char: string): number => {
  const baseDelay = typingSpeed * (0.5 + Math.random() * 1.0);
  // Adjust multipliers for different pause lengths
  // ...
};
```

## Limitations

- No real-time code execution
- Syntax highlighting is display-only (language name shown but not parsed)
- Animation runs once per page load (unless re-triggered)
- Maximum recommended code length: ~100 lines for optimal performance

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive (aspect ratios work)

## Performance

- Component is lightweight (~15KB including CSS)
- Animation uses `setTimeout` for smooth rendering
- Shadow DOM isolation prevents conflicts
- No external dependencies beyond React

## Troubleshooting

**Animation not starting**
- Check that `autoPlay` is set to `true`
- Verify code prop is not empty

**Styling issues**
- Make sure `Terminal.css` is imported
- Check CSS variable inheritance

**Copy button not working**
- Requires HTTPS or localhost (clipboard API restriction)
- Check browser console for errors

## Support

For issues or questions:
1. Check Webflow DevLink documentation
2. Review component props configuration
3. Test in isolation before publishing

## License

MIT
