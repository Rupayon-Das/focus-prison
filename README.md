# 🔒 Focus Prison

> **Focus Prison** is a cross-platform desktop productivity engine built with Electron, designed to ruthlessly eliminate digital distractions. By combining a strict full-screen kiosk environment with an automated, focus-enforced Pomodoro workflow, it locks you out of rabbit holes and keeps you bound to your learning materials. ⏳

---

## 🍅 THE HIGHLIGHT: The Pomodoro Lockdown Engine

Focus Prison doesn't just block websites—it structures your entire cognitive flow. The application features a fully customizable **Interval Cycles System** engineered to automate your study blocks and breaks with zero room for negotiation.

[ ⏳ STUDY BLOCK ] ──(Auto-Minimizes)──> [ ☕ BREAK BLOCK ] ──(Force-Restores)──> [ ⏳ NEXT ROUND ]
Strict Kiosk Lock                       OS Control Returned                      System Re-locked


### ⚙️ How the Cycle Works:
* **Targeted Tracking (Min/Sec):** Set exact durations for both your Study and Break timers down to the second—perfect for rapid testing or custom interval blocks.
* **Progressive Rounds Tracker:** Configure a fixed number of rounds (e.g., 4 structural blocks). The interface updates dynamically (`Round 1/2`), and completely terminates the application cleanly once your final target round is conquered.
* **Automated Tray Minimization:** The exact second your study block expires, the app disables lockdown rules, shifts to a soothing green status layout, and **automatically minimizes itself to your taskbar**, granting you complete access to your system.
* **The Ruthless Relock Trap:** Driven by a non-throttled background timer engine, the exact millisecond your break block hits zero, the app **instantly restores itself from the tray, forces fullscreen kiosk layout, and steals system window focus**—no questions asked, trapping you back in your workspace.

---

## 🚀 Key Features

* 🚫 **Strict Kiosk Shield** | Boots directly into full-screen kiosk layout, overriding standard operating system exit paths and window management triggers.
* 🛡️ **Loop-Safe Ad & Tracker Purging** | Integrates an internal network-level request firewall with a loop-safe `MutationObserver` script that instantly mutes, skips, and hides YouTube ads in under 100ms without crashing web page reload cycles.
* 🔋 **Live Power Integration** | Displays live battery performance metrics directly on the control status bar and pushes system-level OS notifications at critical thresholds ($15\%$ remaining / $100\%$ charged).
* 📑 **Dynamic Custom Workspaces** | Open multiple concurrent tabs to host your learning documentations, coding platforms, and assistant windows side-by-side.
* 🔓 **Bypassed Google Authentication** | Employs a split-routing network architecture that uses pristine Chrome identifiers to maintain JavaScript stability on single-page apps (like DeepSeek) while dynamically spoofing a mobile DuckDuckGo environment to bypass Google's strict *"insecure browser"* auth blocks.
* 🐧 **Linux-Optimized Framework** | Built-in window-state observers capture HTML5 video exit parameters on GNOME/Mutter architectures, preventing application window shrinkage and correcting local graphics render borders.

---

## 🛠️ How It Works Under the Hood

### 📥 1. Non-Throttled Kiosk Lifecycles (`main.js`)
Standard browsers put hidden windows to sleep to save processing threads. Focus Prison overrides this utilizing `backgroundThrottling: false`. This keeps the internal countdown loops executing at full velocity even when minimized, allowing the IPC (Inter-Process Communication) channel to fire the system restoration event the moment your break finishes.

### 🚥 2. Disconnected DOM Cleanup Engine (`preload.js`)
Blocking ad elements dynamically often causes an "Infinite Mutation Loop" that freezes the browser thread. Focus Prison utilizes an event-driven observer that temporarily **disconnects its own tracking trigger** before altering CSS layouts (`display: none`), completely stabilizing memory performance and ensuring page reload buttons remain fully responsive.

### 🕵️‍♂️ 3. Google Bot-Detection Bypass
Google blocks traditional embedded frameworks. This application executes a three-pronged bypass strategy:
* **The DuckDuckGo Masquerade:** Intercepts authentication headers and alters signatures to match DuckDuckGo Mobile running on Android, forcing a clean mobile login fallback pipeline.
* **Native Context Isolation:** Extracts the sign-in sequence out of the restricted webview space and hands execution over to a secure, trusted parent `BrowserWindow` modal context.
* **Isolated Partitions:** Uses a persistent isolated cookie shelf (`persist:ddg_auth`) that isolates verification assets from Google's anti-bot tracking alarms.

---

## ⚡ How to Run It Locally

### 📋 Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed locally on your machine.

### ⚙️ Installation & Usage

1. **Clone the repository** to your machine:
   ```bash
   git clone [https://github.com/YourUsername/focus-prison.git](https://github.com/YourUsername/focus-prison.git)
   cd focus-prison
Install project modules:
npm install

Launch the application interface:
npm start

Compile production packages (Optional):
npm run make


⚠️ Important Note on Exiting
🚨 There are no close options or exit buttons available during study rounds. The application locks your system window completely to secure your workspace environment.

If you must emergency-abort the prison architecture early during an active study round, utilize your system's native termination shortcuts: Alt + F4 (Windows/Linux) or Cmd + Q (macOS).

The application is fully vulnerable to standard exit commands during Break Blocks, allowing you to shut down your workflow cleanly if you are done studying for the day.
