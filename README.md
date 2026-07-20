<p align="center">
  <img src="assets/banner.png" alt="IndustrialBrain AI Banner" width="100%">
</p>

<h1 align="center">🏭 IndustrialBrain AI</h1>

<h3 align="center">
AI-Powered Industrial Knowledge Platform
</h3>

<p align="center">
Transforming Industrial Documents into Intelligent Knowledge using OCR, Google Gemini AI, Knowledge Graphs, and Modern Web Technologies.
</p>

<p align="center">

<img src="https://img.shields.io/badge/React-19-blue?logo=react">
<img src="https://img.shields.io/badge/SpringBoot-3.5-green?logo=springboot">
<img src="https://img.shields.io/badge/PostgreSQL (Neon)-Database-blue?logo=PostgreSQL (Neon)">
<img src="https://img.shields.io/badge/Neo4j-GraphDB-008CC1?logo=neo4j">
<img src="https://img.shields.io/badge/Google-Gemini-orange">
<img src="https://img.shields.io/badge/OCR-Tess4J-red">
<img src="https://img.shields.io/badge/JWT-Security-yellow">
<img src="https://img.shields.io/badge/Cloudinary-Storage-blue">
<img src="https://img.shields.io/badge/License-MIT-success">

</p>

---

# 📖 Project Overview

IndustrialBrain AI is an AI-powered industrial knowledge management platform that transforms traditional industrial documents into an intelligent knowledge ecosystem.

Organizations often manage thousands of technical manuals, SOPs (Standard Operating Procedures), maintenance reports, inspection reports, and engineering documents stored as PDF files. Retrieving critical information from these documents is often slow, manual, and inefficient.

IndustrialBrain AI addresses this challenge by combining **Optical Character Recognition (OCR)**, **Google Gemini AI**, **Knowledge Graph Visualization**, **Cloudinary Cloud Storage**, and **Dashboard Analytics** into a unified enterprise-ready platform.

Built using **React**, **Spring Boot**, **PostgreSQL (Neon)**, **Neo4j**, **Tess4J OCR**, **JWT Authentication**, and **Cloudinary**, the platform enables secure document management, intelligent search, AI-powered question answering, and knowledge discovery.

---

# 🎯 Problem Statement

Industrial organizations generate large volumes of technical manuals, maintenance reports, inspection documents, and engineering records.

Traditional document management systems primarily focus on storing documents rather than understanding their content.

As a result,

- Engineers spend significant time searching for information.
- Knowledge remains scattered across multiple documents.
- Relationships between entities are difficult to identify.
- Decision-making becomes slow and inefficient.

---

# 💡 Solution

IndustrialBrain AI transforms static industrial documents into an intelligent knowledge platform through AI.

The platform provides:

- 📄 OCR-based text extraction
- 🤖 AI-powered document understanding
- 💬 Context-aware AI Chat
- 🌐 Interactive Knowledge Graph
- 📊 Dashboard Analytics
- ☁️ Secure Cloud Storage
- 🔒 JWT Authentication

This enables engineers to retrieve information instantly, visualize relationships between entities, and improve operational efficiency.

---

# ✨ Key Features

- 🔐 Secure JWT Authentication
- 📄 Industrial PDF Upload
- 🔍 OCR using Tess4J
- 🤖 Google Gemini AI Assistant
- 💬 AI-powered Question Answering
- 🌐 Interactive Knowledge Graph
- 🧠 Entity Extraction & Relationship Mapping
- 📊 Dashboard Analytics
- ☁️ Cloudinary Cloud Storage
- 🌙 Dark & ☀️ Light Theme
- 📱 Responsive User Interface
- 🚀 Enterprise-ready Architecture

---

# 🛠 Technology Stack

| Category | Technology |
|-----------|------------|
| Frontend | React (Vite), Tailwind CSS, React Router, React Flow |
| Backend | Spring Boot, Spring Security, REST APIs |
| Authentication | JWT Authentication |
| Artificial Intelligence | Google Gemini AI |
| OCR | Tess4J (Tesseract OCR) |
| Database | PostgreSQL (Neon) |
| Knowledge Graph | Neo4j |
| Cloud Storage | Cloudinary |
| Build Tool | Maven |
| Version Control | Git & GitHub |

---

# 🏗️ System Architecture

IndustrialBrain AI follows a modular three-tier architecture consisting of the Presentation Layer, Business Layer, and Data Layer. This architecture ensures scalability, maintainability, security, and efficient communication between all components.

<p align="center">
  <img src="assets/01-system-architecture.png" alt="System Architecture" width="95%">
</p>

### Architecture Workflow

1. User accesses the React web application.
2. Spring Boot processes authentication and business logic.
3. Documents are uploaded securely to Cloudinary.
4. Tess4J extracts text from uploaded PDF documents.
5. Google Gemini AI analyzes the extracted content.
6. Neo4j generates Knowledge Graph relationships.
7. PostgreSQL (Neon) stores users and document metadata.
8. Dashboard visualizes analytics and AI-generated insights.

---

# 🔄 Application Workflow

The complete workflow of IndustrialBrain AI is shown below.

<p align="center">
  <img src="assets/02-application-workflow.png" alt="Application Workflow" width="90%">
</p>

### Workflow Steps

```text
User Login
      ↓
JWT Authentication
      ↓
Upload Industrial PDF
      ↓
Cloudinary Storage
      ↓
OCR using Tess4J
      ↓
Google Gemini AI
      ↓
Knowledge Graph Generation
      ↓
Dashboard Analytics
      ↓
AI Chat
```

---

# 🧠 AI Processing Pipeline

The AI engine transforms industrial documents into intelligent knowledge through multiple processing stages.

```text
PDF Upload
      ↓
OCR Text Extraction
      ↓
Text Preprocessing
      ↓
Google Gemini AI Analysis
      ↓
Entity Extraction
      ↓
Knowledge Graph Generation
      ↓
Dashboard Insights
      ↓
AI Chat Response
```

---

# 📂 Project Structure

```text
IndustrialBrain-AI
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── uploads/
│
├── assets/
│   ├── banner.png
│   ├── architecture.png
│   ├── workflow.png
│   └── screenshots/
│
├── docs/
│
├── README.md
│
└── LICENSE
```

---

# 📸 Project Screenshots

## 🔐 Authentication

| Login | Register |
|-------|----------|
| ![](screenshots/01-login-page.png) | ![](screenshots/02-register-page.png) |

---

## 📊 Dashboard

| Dashboard | Search |
|-----------|--------|
| ![](screenshots/03-dashboard-overview.png) | ![](screenshots/04-dashboard-search.png) |

| Weekly Upload Trend | File Distribution |
|--------------------|-------------------|
| ![](screenshots/05-weekly-upload-trend.png) | ![](screenshots/06-file-distribution.png) |

| Recent Activity | Dashboard Statistics |
|-----------------|----------------------|
| ![](screenshots/07-recent-activity.png) | ![](screenshots/14-dashboard-statistics.png) |

---

## 📄 Document Management

| Upload | Preview |
|--------|---------|
| ![](screenshots/08-document-upload.png) | ![](screenshots/09-document-preview.png) |

| Upload Success | Document List |
|---------------|---------------|
| ![](screenshots/10-document-upload-success.png) | ![](screenshots/11-document-list.png) |

| Download | Delete |
|----------|--------|
| ![](screenshots/12-document-download-success.png) | ![](screenshots/13-document-deleted-successfully.png) |

---

## 🤖 AI Assistant

| AI Chat | Gemini Response |
|---------|-----------------|
| ![](screenshots/15-ai-chat.png) | ![](screenshots/16-gemini-ai-response-chat.png) |

| AI Response |
|-------------|
| ![](screenshots/17-gemini-ai-response-explanation.png) |

---

## 🌐 Knowledge Graph

| Knowledge Graph | Overview |
|----------------|----------|
| ![](screenshots/18-knowledge-graph.png) | ![](screenshots/19-knowledge-graph-overview.png) |

| Node Search | Node Highlight |
|-------------|----------------|
| ![](screenshots/20-node-search.png) | ![](screenshots/21-node-highlight.png) |

| AI Explanation | Export PNG |
|---------------|------------|
| ![](screenshots/22-node-ai-explanation.png) | ![](screenshots/23-export-png-successful.png) |

| Export JSON |
|-------------|
| ![](screenshots/24-export-json-successful.png) |

---

## ⚙️ Profile & Settings

| Profile | Settings |
|----------|----------|
| ![](screenshots/25-profile-menu.png) | ![](screenshots/26-settings-page.png) |

| Dark Theme | Light Theme |
|------------|-------------|
| ![](screenshots/27-dark-theme.png) | ![](screenshots/28-light-theme.png) |

---

# 🚀 Installation & Setup

## Prerequisites

Before running the project, ensure you have the following installed:

- Java 21+
- Maven
- Node.js (v18 or above)
- npm
- PostgreSQL (Neon)
- Neo4j
- Git

---

## Clone Repository

```bash
git clone https://github.com/kadirisaikumar3/IndustrialBrain-AI.git

cd IndustrialBrain-AI
```

---

## Backend Setup

```bash
cd backend

mvn clean install

mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Configure Environment Variables

Configure the following before running the application:

### Backend

- PostgreSQL (Neon) Database
- Neo4j Database
- Google Gemini API Key
- Cloudinary Credentials
- JWT Secret

### Frontend

Update API Base URL if required.

---

# ▶️ Usage

1. Register a new account.
2. Login using secure JWT authentication.
3. Upload an industrial PDF document.
4. OCR extracts machine-readable text.
5. Google Gemini AI analyzes the document.
6. Knowledge Graph is generated automatically.
7. Ask contextual questions using AI Chat.
8. View dashboard analytics.
9. Download or manage uploaded documents.

---

# 🔒 Security Features

- JWT Authentication & Authorization
- Spring Security
- BCrypt Password Encryption
- Protected REST APIs
- Secure Cloudinary Storage
- Input Validation
- Global Exception Handling
- HTTPS Ready
- Secure API Integration

---

# 📈 Future Enhancements

- Multilingual OCR Support
- Voice-based AI Assistant
- Predictive Maintenance Recommendations
- IoT Sensor Integration
- Mobile Application
- Docker Deployment
- Kubernetes Support
- Enterprise RBAC
- Advanced KPI Dashboards
- AI-powered Report Generation

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature-name
```

3. Commit your changes.

```bash
git commit -m "Added new feature"
```

4. Push your branch.

```bash
git push origin feature-name
```

5. Create a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

## Sai Kumar Kadiri

Aspiring Software Engineer

Java | Spring Boot | React

GitHub:
https://github.com/kadirisaikumar3

LinkedIn:
https://www.linkedin.com/in/saikumarkadiri/

---

# 🙏 Acknowledgements

Special thanks to:

- ET AI Hackathon 2026
- Google Gemini AI
- Spring Boot
- React
- Neo4j
- PostgreSQL (Neon)
- Cloudinary
- Tess4J
- Open Source Community

---

# ⭐ Support

If you found this project helpful,

⭐ Star this repository

🍴 Fork the project

🤝 Share your feedback

---

<p align="center">

Made with ❤️ by Sai Kumar Kadiri

</p>