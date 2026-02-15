---
title: Novalens Backend
emoji: 🔥
colorFrom: indigo
colorTo: indigo
sdk: docker
pinned: false
license: mit
app_port: 7860
---
<<<<<<< chore/humanize-comments

<div align="center">

# 💎 Novalens
### The Intelligent Background Remover

![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=flat-square&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)
[![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-Live%20Demo-blue?style=flat-square)](https://yashnaiduu-novalens-backend.hf.space)

<br/>

**Give your images the focus they deserve.**
Novalens isn't just a tool; it's the easiest way to make your subjects pop. Powered by advanced AI, it strips away clutter in seconds.

[**Launch Live Demo**](https://yashnaiduu-novalens-backend.hf.space) · [Request Feature](https://github.com/yashnaiduu/Novalens/issues) · [Report Bug](https://github.com/yashnaiduu/Novalens/issues)

</div>

---

## ✨ Why Novalens?

We built Novalens because we believe professional editing shouldn't require a degree. Whether you're a designer, developer, or just someone who loves clean photos, we've got you covered.

- **🎨 Artistic Precision**: Our AI (`u2netp`) understands edges, ensuring hair and fur details aren't lost.
- **⚡ Blazing Fast**: Engineered for speed. Drop an image, blink, and it's done.
- **🔒 Private by Design**: Your images are processed in-memory and vanish instantly. We never store your data.
- **📱 Beautiful Everywhere**: A responsive, dark-mode-first interface that feels right on any device.

---
=======

<div align="center">

# Novalens - AI Background Remover

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-000?logo=flask)
![License](https://img.shields.io/badge/License-MIT-green.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**A professional, AI-powered tool to remove image backgrounds in seconds.**
Built with **Next.js 15** (Frontend) and **Flask** (Backend) running on **Hugging Face Spaces**.

[🎥 Live Demo](https://yashnaiduu-novalens-backend.hf.space) · [🐛 Report Bug](https://github.com/yashnaiduu/Novalens/issues) · [✨ Request Feature](https://github.com/yashnaiduu/Novalens/issues)

</div>

---

## ✨ Features

- **🎯 Instant AI Removal**: Powered by `u2netp` (lightweight & fast) and `rembg`.
- **🎨 Smart Editor**: Drag & drop interface with Before/After comparison.
- **⚡ Super Fast**: Optimized with global session caching for <1s processing.
- **🔒 Secure & Private**: Images are processed in memory and never stored.
- **📱 Responsive UI**: Beautiful dark/light mode interface built with Tailwind CSS.

## 🏗️ Architecture

```mermaid
graph TB
    subgraph "Frontend (Next.js)"
        UI[User Interface] -->|Upload| API_Client
        API_Client -->|POST /api| Backend
    end
    
    subgraph "Backend (Flask @ HF Spaces)"
        Backend -->|Process| Model[U2NetP AI Model]
        Model -->|Remove BG| Processor[Image Processor]
        Processor -->|Base64| Response
    end
    
    Response -->|JSON| API_Client
    API_Client -->|Preview| UI
```

## 🚀 Quick Start
>>>>>>> main

## 📸 See the Magic

<<<<<<< chore/humanize-comments
![Novalens Demo](demo.gif)
=======
- Node.js 18+
- Python 3.11+
>>>>>>> main

*Upload, Process, Download. It's that simple.*

<<<<<<< chore/humanize-comments
---

## 🛠️ Under the Hood

For the developers who love to know how things work:

### 🌟 Frontend
Built with **Next.js 15** and **TypeScript**. We use **Tailwind CSS** for that sleek look and **Framer Motion** for buttery smooth interactions.

### 🧠 Backend
A robust **Flask** API powered by **ONNX Runtime**. We use the `rembg` library with a global session strategy to ensure the AI model is always warm and ready for your requests.

### ☁️ Deployment
Dockerized and hosted on **Hugging Face Spaces**, giving us the power of cloud-grade inference without the complexity.

```mermaid
graph LR
    User[👤 You] -->|Upload| FE[Next.js Frontend]
    FE -->|POST Image| BE[Flask Backend]
    BE -->|Inference| AI[U2Net Model]
    AI -->|Clean Image| BE
    BE -->|Result| FE
    FE -->|Download| User
```

---

## 🚀 Get Started

Want to run this locally? Fantastic! Here is how you can set up your own instance.

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.11+)

### 1. Clone & Prepare
```bash
git clone https://github.com/yashnaiduu/Novalens.git
cd Novalens
```

### 2. Ignition (Backend)
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
*Your backend is now humming at `http://localhost:8000`*

### 3. Liftoff (Frontend)
```bash
cd next-frontend
npm install
npm run dev
```
*Your frontend is now live at `http://localhost:3000`*

---

## ☁️ One-Click Deploy
=======
1.  **Clone the repo**
    ```bash
    git clone https://github.com/yashnaiduu/Novalens.git
    cd Novalens
    ```

2.  **Backend Setup**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python3 app.py
    ```

3.  **Frontend Setup**
    ```bash
    cd next-frontend
    npm install
    npm run dev
    ```

4.  **Open App**
    Visit `http://localhost:3000`.
>>>>>>> main

Want your own private version? Deploy entirely to Hugging Face Spaces with a single click.

<<<<<<< chore/humanize-comments
[![Deploy to Spaces](https://huggingface.co/datasets/huggingface/badges/raw/main/deploy-to-spaces-lg.svg)](https://huggingface.co/new-space?template=yashnaiduu/Novalens)

---

## 🤝 Join the Community

We love open source. If you have an idea, a fix, or just want to say hi, check out our [CONTRIBUTING.md](CONTRIBUTING.md).

**Found a bug?** Open an [Issue](https://github.com/yashnaiduu/Novalens/issues).
**Liked the project?** Give us a ⭐️ on GitHub!
=======
We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
>>>>>>> main

---

<div align="center">
<<<<<<< chore/humanize-comments

**Made with 💙 by Yash Naidu**

[GitHub](https://github.com/yashnaiduu) · [Twitter](https://twitter.com/yourhandle)

=======
Made with ❤️ by Yash Naidu
>>>>>>> main
</div>
