# 🔒 Focus Prison

> **A distraction-free Electron browser that enforces deep work through website allow-listing and an automated Pomodoro workflow.**

Focus Prison transforms your computer into a dedicated study environment by allowing access only to websites you approve before your session begins. Combined with fullscreen lockdown and automatic study/break transitions, it removes the temptation to wander away from your work.

---

## ✨ Why Focus Prison?

Most productivity apps ask you to resist distractions.

Focus Prison removes them.

Instead of relying on self-control, it creates an environment where your attention stays exactly where you intended it to be.

---

## 🚀 Features

### 🔒 Website Allow-listing

Before every study session, choose exactly which websites you're allowed to access.

Everything else is blocked.

---

### 🍅 Automated Pomodoro Engine

Configure

- Study duration
- Break duration
- Number of rounds

Focus Prison automatically manages every transition.

```
Study
   ↓
Break
   ↓
Resume
   ↓
Repeat
```

No restarting timers.

No remembering to come back.

---

### 📚 Fullscreen Lockdown

During study sessions Focus Prison enters a fullscreen kiosk mode that keeps your workspace dedicated to learning.

---

### 📑 Multi-tab Workspace

Keep multiple approved websites open simultaneously.

Examples include

- ChatGPT
- GitHub
- YouTube playlists
- Documentation
- DeepSeek
- LeetCode

---

### 🛡 Built-in Ad Filtering

Includes a lightweight loop-safe DOM observer that removes YouTube advertisements while keeping the page responsive.

---

### 🔋 Battery Monitoring

Displays battery percentage directly inside the application and sends desktop notifications for

- Low battery
- Fully charged battery

---

## ⚙️ How It Works

```
Configure Session
        │
        ▼
Start Lockdown
        │
        ▼
Study
        │
        ▼
Study Timer Ends
        │
        ▼
Break Begins
        │
        ▼
Application Minimizes
        │
        ▼
Break Ends
        │
        ▼
Application Restores Automatically
        │
        ▼
Next Study Round
```

---

## 📊 Comparison

| Feature | Traditional Browser | Focus Prison |
|----------|--------------------|--------------|
| Website Allow-list | ❌ | ✅ |
| Automatic Pomodoro | ❌ | ✅ |
| Auto Resume | ❌ | ✅ |
| Fullscreen Lockdown | ❌ | ✅ |
| Battery Monitor | ❌ | ✅ |
| Multi-tab Study | ✅ | ✅ |

---

## 🏗 Technical Highlights

- Electron-based desktop application
- Background timers that continue running during break mode
- Loop-safe `MutationObserver` implementation
- Fullscreen kiosk management
- Multi-tab architecture
- Desktop notifications
- Cross-platform support

---

## 📦 Installation

Clone the repository

```bash
git clone https://github.com/Rupayon-Das/focus-prison.git
```

Move into the project

```bash
cd focus-prison
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm start
```

Build production packages

```bash
npm run make
```

---

## 🛣 Roadmap

- [x] Website allow-listing
- [x] Fullscreen lockdown
- [x] Automated Pomodoro workflow
- [x] Multi-tab browsing
- [x] Battery monitoring
- [x] YouTube ad filtering
- [ ] Session statistics
- [ ] Cloud synchronization
- [ ] Custom themes
- [ ] Browser extensions

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are always welcome.

Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you found Focus Prison useful, consider giving the repository a ⭐.

It helps others discover the project and motivates future development.
