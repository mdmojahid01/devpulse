<div align="center">
  <img src="./docs/images/DevPulse.png" alt="DevPulse Logo" width="200"/>
  
  # DevPulse
  
  **Your productivity hub in every new tab** 🚀
  
  A Chrome extension that transforms your new tab into a developer dashboard with GitHub activity, todos, LeetCode stats, and motivational quotes.
  
  [![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](./LICENSE)
  ![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
  
</div>

---

## Features

- **GitHub Activity** — Visualize your contributions and recent activity
- **Smart Todos** — Date-wise organization with pending task tracking
- **LeetCode Stats** — Track your coding progress
- **Motivational Quotes** — AI-generated or custom quotes based on your activity
- **Reading List** — Save articles to read later
- **Theme Support** — Light/Dark mode with HeroUI v3

---

## Quick Start

### Prerequisites

- Node.js 18+
- Chrome/Edge browser

### Installation

```bash
# Clone the repo
git clone https://github.com/mdmojahid01/devpulse.git
cd devpulse

# Install dependencies
npm install

# Build the extension
npm run build
```

### Load in Chrome

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist` folder

---

## Development

```bash
# Start dev server
npm run dev

# Lint & format
npm run lint
npm run format
```

---

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **HeroUI v3** — Modern UI components
- **Tailwind CSS v4** — Styling
- **Chrome Extension Manifest v3**

---

## Project Structure

```
src/
├── pages/         # Main page components
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── services/      # API & storage services
└── lib/           # Utilities & helpers
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

---

## License

AGPL-3.0 © [Md Mojahid](https://www.linkedin.com/in/mdmojahid01/)

---

<div align="center">
  Made with ❤️ by developers, for developers
</div>
