# 🔒 Focus Prison

> **Focus Prison** is a cross-platform desktop application built with Electron, designed to ruthlessly eliminate web distractions. It locks your computer into a strict full-screen environment, allowing access *only* to a pre-approved list of educational websites or YouTube playlists for a set amount of time. ⏳

---

## 🚀 Key Features

* 🚫 **Strict Lockdown** | Boots directly into full-screen kiosk mode, overriding standard desktop exits.
* 🛡️ **Intelligent Domain Filtering** | Actively blocks attempts to navigate to distracting websites and automatically routes you back to your study materials.
* 📑 **Custom Dynamic Tabs** | Allows you to open multiple pre-approved work interfaces (e.g., your documentation, tutorial, and chat helper) concurrently.
* 🔓 **Bypassed Google Authentication** | Utilizes a custom native isolation architecture that safely bypasses Google's strict *"insecure browser"* blocks, letting you sign into Gmail, Slack or any other websites natively using a DuckDuckGo mobile wrapper configuration which is not possible with stanred Google Chrome V8 engine
* 💻 **Cross-Platform Compatibility** | Re-architected to normalize file pathways and window environments across Windows, macOS, and Linux.

---

## 🛠️ How It Works Under the Hood

### 📥 1. The Jailhouse Logic (`main.js` & `index.html`)
The app uses Electron's native `kiosk: true` configuration, which bypasses the operating system's normal window constraints. A custom timer running on a `setInterval` loop counts down your study block. When it hits zero, it triggers a clean window destruction method to set you free. 🚪

### 🚥 2. URL Traffic Control
The application monitors network requests inside the `<webview>` elements using the `will-navigate` and `new-window` listeners. Every time a link is clicked, the app parses the target domain name. If the domain doesn't match your allowed startup list, it calls `e.preventDefault()` to instantly kill the request and snaps you back to your last approved URL. 🔄

### 🕵️‍♂️ 3. Google Bot-Detection Bypass
Google normally blocks Electron apps from logging into accounts. This app defeats that block using a three-pronged bypass strategy:
* 🎭 **The DuckDuckGo Masquerade:** It intercepts authentication requests and shifts the browser fingerprint to look like DuckDuckGo Mobile running on Android. Google whitelists this signature and falls back to a lightweight mobile login page.
* 🔒 **Native Context Isolation:** It pulls the login process completely out of the restricted webview tag and passes it to a native, trusted `BrowserWindow` modal.
* 🧹 **Pristine Partitioning:** It uses an isolated cookie partition (`persist:ddg_auth`) that cleans itself up, bypassing Google's tracking cookies that trigger anti-bot alarms.

---

## ⚡ How to Run It Locally

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### ⚙️ Installation & Usage

1. **Clone the repository** (or download the source files).
2. **Open your terminal** in the project directory.
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Launch the application:**
   ```bash
   npm start
   ```

---

## ⚠️ Important Note on Exiting

🚨 **There is no close button.** Once you enter a study session, the app locks down completely. 
* To force-exit the prison early, press: `Alt + F4` (Windows/Linux) or `Cmd + Q` (macOS).
