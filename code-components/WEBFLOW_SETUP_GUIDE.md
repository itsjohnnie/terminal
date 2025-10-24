# Terminal Component - Webflow Setup Guide

## ✅ What You Have Now

Your Terminal component is ready and working locally! You should see it running at `http://localhost:3000`

## 📋 Step-by-Step Guide to Use in Webflow

### Option 1: Using Webflow Code Components (Recommended)

**Note:** Webflow Code Components require a Webflow Enterprise or Sites plan with DevLink access.

#### Step 1: Verify Your Component

1. Open your browser to `http://localhost:3000`
2. You should see the Terminal component animating code
3. Test that it works as expected

#### Step 2: Prepare for Webflow

Your component file is located at:
```
/Users/johnnie/Documents/GitHub/terminal/code-components/src/Terminal.webflow.js
```

The `.webflow.js` extension tells Webflow this is a Code Component.

#### Step 3: Install Webflow CLI (if not already done)

Run this in your terminal (from the code-components directory):
```bash
npm install --save-dev @webflow/webflow-cli @webflow/data-types @webflow/react
```

**If you get errors**, you can skip this and use Option 2 below.

#### Step 4: Login to Webflow CLI

```bash
npx webflow login
```

This will open a browser window for you to authenticate.

#### Step 5: Register Your Component

Create a `.webflowrc` file in your project root:

```json
{
  "siteId": "YOUR_SITE_ID",
  "libraryId": "YOUR_LIBRARY_ID"
}
```

You can find these IDs in your Webflow site settings.

#### Step 6: Sync to Webflow

```bash
npx webflow devlink sync
```

This will push your Terminal component to Webflow.

#### Step 7: Use in Webflow Designer

1. Open your Webflow site in the Designer
2. Look for "Code Components" in the left panel
3. Drag the Terminal component onto your page
4. Configure it using the right panel:
   - **Code**: Paste your code
   - **Language**: Select the language
   - **Theme**: Choose a color theme
   - **Aspect Ratio**: Set dimensions
   - **Auto Play**: Enable/disable animation

---

### Option 2: Export as Standalone Component (Easier Alternative)

If you can't use DevLink, you can export your component and embed it:

#### Step 1: Build Your Component

```bash
npm run build
```

#### Step 2: Deploy to a Hosting Service

Upload the `build` folder to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting

Get the URL, for example: `https://your-terminal.netlify.app`

#### Step 3: Embed in Webflow

1. In Webflow Designer, add an **Embed** element
2. Paste this code:

```html
<iframe
  src="https://your-terminal.netlify.app"
  width="100%"
  height="600px"
  frameborder="0"
  style="border-radius: 8px;"
></iframe>
```

**Pros:** Works on any Webflow plan
**Cons:** Not editable in Designer, need to redeploy for changes

---

### Option 3: Create Custom Props (Most Flexible)

If you want to make it configurable in Webflow without DevLink:

#### Step 1: Modify Your Component

Make it accept URL parameters:

```javascript
// Add this to Terminal.webflow.js
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code') || "console.log('Hello');";
const theme = urlParams.get('theme') || 'dark';
const language = urlParams.get('language') || 'JavaScript';
```

#### Step 2: Use in Webflow Embed

```html
<iframe
  src="https://your-terminal.netlify.app?code=console.log('test')&theme=claude&language=JavaScript"
  width="100%"
  height="600px"
></iframe>
```

Change the URL parameters to update the component!

---

## 🎨 Available Props

When using the component (either in DevLink or programmatically):

| Prop | Type | Default | Options |
|------|------|---------|---------|
| **code** | string | `"console.log('Hello World');"` | Any code text |
| **language** | string | `"JavaScript"` | JavaScript, Python, TypeScript, etc. |
| **theme** | string | `"dark"` | dark, light, claude, dracula, monokai, nord |
| **aspectRatio** | string | `"3-2"` | auto, 1-1, 3-2, 16-9 |
| **title** | string | `"Terminal"` | Any text |
| **showLineNumbers** | boolean | `true` | true, false |
| **autoPlay** | boolean | `true` | true, false |
| **typingSpeed** | number | `40` | 10-200 (milliseconds) |

---

## 🔧 Customization

### Change Themes

Edit `/src/Terminal.css` and modify the CSS variables:

```css
.terminal-wrapper.theme-custom {
  --bg-primary: #yourcolor;
  --accent: #yourcolor;
  /* etc */
}
```

### Adjust Animation

Edit `/src/Terminal.webflow.js` and modify:

```javascript
const getTypingDelay = (char) => {
  const baseDelay = typingSpeed * (0.5 + Math.random() * 1.0);
  // Adjust these multipliers
  // ...
};
```

---

## 🐛 Troubleshooting

**Component not showing:**
- Check that the file is named `Terminal.webflow.js`
- Verify `webflow.json` includes the correct path
- Run `npm start` to test locally first

**Animation not working:**
- Set `autoPlay={true}`
- Check browser console for errors
- Verify the code prop is not empty

**Styling issues:**
- Make sure `Terminal.css` is imported
- Check that the wrapper has the correct theme class

**DevLink errors:**
- Try `npx webflow logout` then `npx webflow login`
- Verify your Webflow plan supports Code Components
- Check that siteId and libraryId are correct

---

## 📝 Example Usage in React

```jsx
import Terminal from './Terminal.webflow';

function MyPage() {
  return (
    <Terminal
      code={`function hello() {
  console.log("Hello!");
}`}
      language="JavaScript"
      theme="claude"
      aspectRatio="16-9"
      title="Code Example"
      showLineNumbers={true}
      autoPlay={true}
      typingSpeed={40}
    />
  );
}
```

---

## 🚀 Next Steps

1. **Test locally** - Make sure everything works at `http://localhost:3000`
2. **Choose your method** - DevLink (best) or standalone deploy
3. **Customize** - Adjust themes, animation speed, etc.
4. **Deploy** - Push to Webflow or hosting service
5. **Iterate** - Make changes and redeploy

---

## 📚 Resources

- [Webflow Code Components Docs](https://developers.webflow.com/code-components/introduction)
- [DevLink Documentation](https://developers.webflow.com/code-components/reference/cli)
- [Your Component Files](./src/Terminal.webflow.js)

---

## ✨ Features

- ✅ Realistic typing animation
- ✅ 6 built-in themes
- ✅ Line numbers toggle
- ✅ Copy to clipboard
- ✅ Multiple aspect ratios
- ✅ Loading states
- ✅ Fully responsive
- ✅ Customizable speed

Enjoy your Terminal component! 🎉
