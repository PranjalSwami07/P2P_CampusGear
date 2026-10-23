# P2P Campus Equipment Sharing — Web Prototype

An interactive, blueprint-themed web prototype built for the **Design Thinking Case Study (BCE23EM01)**. This application provides a campus-exclusive platform where students and faculty can share, lend, and borrow essential academic gear (calculators, microcontrollers, drafting boards) safely and affordably.

---

## 📸 Key Features

- **Blueprint Engineering Design**: High-impact blueprint/slate UI with dark mode styling, custom background grids, and crisp typography.
- **Interactive Survey Data**: Embedded Chart.js charts rendering real survey data ($N=41$) on student lender concerns and desired safety features.
- **Scroll Animations**: Smooth intersection-observer scroll-reveal effects for seamless presentation scrolling.
- **Empathy & System Mapping**: Interactive presentation of the campus user Empathy Map (Says, Thinks, Does, Feels) and SDG alignment.
- **Live Equipment Hub**: Functional prototype interface allowing users to search gear, filter items, and dynamically post new equipment listings.

---

## 🚀 Quick Start (Commands to Open Website)

### Option 1: Start Local Server (Recommended)
Open your terminal and run:
```bash
cd ~/Desktop/P2P
python3 -m http.server 8080
```
Then open your browser to:
👉 **http://localhost:8080** (or in terminal: `open http://localhost:8080`)

---

### Option 2: Quick One-Liner (Terminal)
```bash
cd ~/Desktop/P2P && python3 -m http.server 8080 & open http://localhost:8080
```

---

### Option 3: Direct File Open (Zero Server Required)
```bash
open ~/Desktop/P2P/index.html
```
*(Or simply double-click `index.html` in macOS Finder).*

---

## 🛠️ Tech Stack

- **Core**: Semantic HTML5 & Vanilla JavaScript
- **Styling**: Bespoke Blueprint Dark Mode CSS & 3D Glassmorphism
- **3D Components**: Three.js (r128) with mouse parallax, inertia rotation, and raycasting
- **Smooth Scroll**: Lenis Smooth Momentum Engine
- **Icons**: Lucide Icons
- **Effects**: Canvas Confetti & Spring Lerp Card Tilt

---

## 📜 Authors & Acknowledgments

- **Yash Patange** (125B1B348)
- **Pranjal Swami** (125B1B141)
- **Course**: BCE23EM01 | Applied Frameworks