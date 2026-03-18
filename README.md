# 🧠 Brilliant Mind - Chrome Extension

**"See clearly. Think brilliantly."**

**Brilliant Mind** is a modular accessibility and productivity ecosystem designed to personalize the web experience for neurodiverse and visually impaired individuals. Developed by team **ByteForce** for the **48-hour Hermes Hackathon (Nov 2025)**, this project was awarded **1st place** for its technical depth and user-centric design.

---

### 👓 Featured: Accessibility & Precision Logic (Personal Contributions)

My primary focus was the engineering of the **Dyslexia Module** and the optimization of the **Visual Safety** systems, ensuring a stable and adaptive interface.

* **Dynamic Reading Ruler** 📏:
    * **Context-Aware Coloring**: Implemented `getRulerColor` using HSL-based lightness adjustments to ensure the ruler maintains optimal contrast against any background (Dark or Light mode).
    * **Interactive Paragraph Tracking**: Developed `addParagraphClickHandlers` and `showReadingRuler` to allow users to center focus on specific text blocks via clicks or keyboard navigation (`ArrowUp`/`Down`).
* **Intelligent Text Normalization**:
    * **Acronym Preservation**: Created `replaceAcronymsWithTokens` to protect specialized terms (e.g., "NASA") while converting high-stress All-Caps headings into a readable sentence case.
    * **Media Collision Detection**: Developed `doesElementOverlapMedia` using `getBoundingClientRect` to ensure text transformations do not overlap or obscure images.
* **Distraction Erasure & Optimal Visibility** 🧹:
    * **DOM Sanitization**: Automatically strips away non-essential site elements like footers and navigation bars to provide a distraction-free reading zone.
    * **Focus Highlighting**: Forces high-visibility text styles on active paragraphs while applying a soft fade to surrounding content to guide the reader's eye.

---

### 🛠️ Core Module Ecosystem

The extension is architected into specialized "Affections" modules, each targeting a specific set of neurodivergent needs:

* **ADHD Module** ⏳: Features a **Paragraph Focus System** and a dynamically generated **Table of Contents** for rapid content scanning.
* **Autism Module** 🧩: Summarizes every paragraph to reduce sensory overstimulation and simplifies the interface by removing shadows and UI noise.
* **Epilepsy & Safety Mode** ⚡: Replaces animations with static frames via `replaceGif` and `wrapVideo`. Content only plays upon deliberate user hover or click. Employs heuristics to remove aggressive advertisements and utilizes a "max-priority" CSS sheet to disable all site-wide transitions.
* **Partial Vision Mode** 🔍: Allows users to drag-select an area to be isolated and displayed in a high-clarity **Mini-Browser (iFrame)** while masking the rest of the screen.
* **Reader Mode** 📖: Transforms the page into an e-book style layout by extracting clean text and applying consistent typography..
* **Simplify Mode** 📉: Provides a fully customizable version of the page, allowing users to adjust fonts, colors, and spacing to their specific preferences.
* **Color Blindness Mode** 🎨: Uses SVG Filters to simulate and adjust how the three primary types of color blindness perceive the page.


---

### 🚀 Setup & Installation

1. Clone the repository.
2. Open `chrome://extensions/` in your browser.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `extension` folder.
