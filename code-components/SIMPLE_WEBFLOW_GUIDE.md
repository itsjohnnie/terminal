# Simple Webflow Setup - Terminal Component

Since you're having CLI installation issues, here's the **simplest way** to get your Terminal component into Webflow:

## 🚀 Quick Deploy Method (Recommended)

### Step 1: Build Your Component

```bash
cd /Users/johnnie/Documents/GitHub/terminal/code-components
npm run build
```

This creates a `build` folder with your compiled component.

### Step 2: Deploy to Netlify (Free & Easy)

1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop your `build` folder
3. Netlify will give you a URL like: `https://random-name-12345.netlify.app`

**That's it!** Your component is now live.

### Step 3: Use in Webflow

1. In Webflow Designer, add an **Embed** element where you want the terminal
2. Paste this code:

```html
<div style="width: 100%; max-width: 50rem; margin: 0 auto;">
  <iframe
    src="https://your-netlify-url.netlify.app"
    width="100%"
    height="600px"
    frameborder="0"
    style="border: none; border-radius: 8px;"
    loading="lazy"
  ></iframe>
</div>
```

3. Replace `your-netlify-url.netlify.app` with your actual Netlify URL
4. Publish!

---

## 🎨 Make It Configurable

To change the code/theme/language, you'll need to edit your component and redeploy:

### Edit the Component

Open `/src/App.js` and change these lines:

```javascript
const exampleCode = `// Your code here
function myFunction() {
  console.log("Hello!");
}`;

<Terminal
  code={exampleCode}
  language="JavaScript"  // Change this
  theme="claude"         // Change this
  aspectRatio="3-2"      // Change this
  // ... etc
/>
```

### Redeploy

```bash
npm run build
```

Then drag the new `build` folder to Netlify again (it will update your site).

---

## 📋 Available Options

Edit these in `/src/App.js`:

```javascript
<Terminal
  code="your code here"
  language="JavaScript"     // JavaScript, Python, TypeScript, etc.
  theme="claude"           // dark, light, claude, dracula, monokai, nord
  aspectRatio="3-2"        // auto, 1-1, 3-2, 16-9
  title="My Terminal"
  showLineNumbers={true}   // true or false
  autoPlay={true}          // true or false
  typingSpeed={40}         // 10-200 (milliseconds)
/>
```

---

## 🔄 Alternative: Create Multiple Versions

Want different terminals with different code? Create multiple React components!

### Example: Create `TerminalPython.js`

```javascript
import Terminal from './Terminal.webflow';

function TerminalPython() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#1a1a1a', minHeight: '100vh' }}>
      <Terminal
        code={`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))`}
        language="Python"
        theme="monokai"
        aspectRatio="16-9"
      />
    </div>
  );
}

export default TerminalPython;
```

Then in `App.js`, import and use it!

---

## 💡 Pro Tips

**Custom Domain:**
- In Netlify, go to Site settings → Domain management
- Add your custom domain (e.g., `terminal.yourdomain.com`)
- Use that in your iframe instead

**Multiple Terminals:**
- Deploy different builds to different Netlify sites
- Each gets its own URL
- Embed different terminals on different Webflow pages

**Responsive:**
- The iframe is already responsive
- Adjust `height` in the iframe tag if needed
- On mobile, the terminal adapts automatically

---

## ✅ Checklist

- [ ] Run `npm run build`
- [ ] Drag `build` folder to [netlify.com/drop](https://app.netlify.com/drop)
- [ ] Copy the Netlify URL
- [ ] Add Embed element in Webflow
- [ ] Paste iframe code with your URL
- [ ] Publish Webflow site
- [ ] Test on different devices

---

## 🐛 Troubleshooting

**Terminal not showing:**
- Check the Netlify URL works in a regular browser first
- Make sure iframe src URL is correct
- Check browser console for errors

**Styling looks wrong:**
- The terminal is self-contained with its own styles
- Make sure the Webflow embed element has enough height
- Try setting a fixed width on the parent div

**Want to change the code:**
- Edit `/src/App.js`
- Run `npm run build` again
- Redeploy to Netlify

---

## 📈 Next Level: GitHub Pages (Free Alternative)

If you prefer GitHub Pages:

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to `package.json` scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`
4. Your site will be at: `https://YOUR_USERNAME.github.io/terminal`

---

This method works **immediately** and requires **no special Webflow plan**! 🎉
