# EduCore — Learning Management System

> A full-stack, commercial-grade Learning Management System built with the MERN stack. Educators publish courses. Students enroll, learn, and track progress — all in one platform.

[![GitHub Repo](https://img.shields.io/badge/GitHub-prodesk--capstone--EduCore-black?style=flat-square&logo=github)](https://github.com/AkshatJain0802/prodesk-capstone-EduCore.git)

---

## Table of Contents

- [Project Description](#-project-description)
- [Track](#-track)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [Future Scope](#-future-scope)
- [UI Wireframes](#-ui-wireframes-figma)
- [ER Diagram](#-er-diagram)
- [Author](#-author)

---

## 📌 Project Description

**EduCore** is a Udemy/Coursera-inspired Learning Management System where educators can create and publish online courses, and students can browse, purchase, and learn at their own pace.

The platform supports two distinct user roles:

- **Educators** — Create courses with chapters and video lectures, set pricing, manage content, and track earnings via a dedicated dashboard.
- **Students** — Browse the course catalog, purchase courses via Stripe, watch lectures through a video player, and monitor their learning progress.

This project was built as a **Capstone Project** for the ProDesk Internship Program, designed to demonstrate full-stack engineering capabilities across authentication, payment integration, media management, and RESTful API design.

---

## 👨‍💻 Track

**Fullstack Intern** — Frontend (React.js + Tailwind CSS) + Backend (Node.js + Express + MongoDB)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js (Vite) | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB + Mongoose | NoSQL data storage |
| Authentication | Clerk | User auth & session management |
| Payments | Stripe | Course purchase & checkout |
| Media Storage | Cloudinary | Video & image hosting |
| Frontend Deploy | Vercel | Frontend hosting |
| Backend Deploy | Render | API server hosting |
| DB Hosting | MongoDB Atlas | Cloud database |

---

## 🎯 Core Features

### Authentication & User Management
- [x] Role-based sign up — Student or Educator
- [x] Login / logout via Clerk (supports Google OAuth)
- [x] Profile page with avatar and account details

### Student Features
- [x] Browse and search the course catalog
- [x] View course detail page with curriculum preview
- [x] Purchase courses via Stripe checkout
- [x] "My Learning" dashboard showing all enrolled courses
- [x] Video player with chapter/lecture navigation sidebar
- [x] Progress tracking with completion percentage per course
- [x] "Continue Watching" — resumes from last watched lecture

### Educator Features
- [x] Educator dashboard with revenue and enrollment stats
- [x] Create a course with title, description, category, thumbnail, and price
- [x] Add chapters and upload video lectures (via Cloudinary)
- [x] Set free preview lectures to attract students
- [x] Publish / unpublish toggle for course visibility
- [x] View list of published courses 

### Platform
- [x] Fully responsive design — mobile, and desktop
- [x] Stripe Webhook handling for reliable payment confirmation
- [x] Protected routes — API enforces access control on every request
- [x] Course enrollment gated behind payment verification

---

## 🔮 Future Scope

Features planned for future development sprints:

| Feature | Description |
|---|---|
| Ratings & Reviews | Students rate courses (1–5 stars) with text reviews; average computed on course card |
| Certificate of Completion | Auto-generated PDF certificate when student reaches 100% progress |
| Q&A Discussion | Per-lecture comment thread; educators can reply to student questions |
| MCQ Quiz per Chapter | Educator creates multiple-choice quizzes; students must pass to unlock next chapter |
| Email Notifications | Nodemailer sends emails on purchase confirmation, new lecture uploads, quiz results |
| Admin Analytics Panel | Platform-wide stats — total users, revenue, top courses, enrollment trends with charts |
| Wishlist | Students can save courses to a wishlist before purchasing |
| Coupon / Discount Codes | Educators can generate discount codes for promotional campaigns |

---

## 🎨 UI Wireframes (Figma)

All core screens were designed in Figma before implementatio, following a design-first workflow.

**[→ View Figma Design File](https://www.figma.com/design/TTi1UOoD2TYiqTK8Vbe8WR/LMS-project-design?node-id=0-1&t=bYx73bBR2kzZ41Zr-1)**

### Screens Designed

| Screen | Description |
|---|---|
| Homepage / Landing | Hero banner, featured courses, category filters, navbar with login CTA |
| Course Detail Page | Curriculum preview, instructor info, pricing, enroll button |
| Educator Panel | Create course form, chapter builder, revenue stats |

---

## 🗄️ ER Diagram

The database schema is designed around **6 MongoDB collections** organized into 3 architectural layers:

- **Content Layer** — `users → courses → chapters → lectures` (curriculum tree)
- **Business Layer** — `purchases` (many-to-many enrollment junction)
- **Tracking Layer** — `course_progress` (per-student learning state)

<img width="1397" height="775" alt="ER diagram" src="https://github.com/user-attachments/assets/d1deabd0-b994-4232-a02e-bc0cd9813da1" />

### Collections at a Glance

| Collection | Role |
|---|---|
| `users` | All platform users — role field distinguishes student vs educator |
| `courses` | Course metadata owned by one educator |
| `chapters` | Ordered sections within a course |
| `lectures` | Individual video lessons within a chapter |
| `purchases` | Junction table resolving student ↔ course many-to-many |
| `course_progress` | Per student per course — tracks completed lectures and last watched |

---

## 👨‍💻 Author

**Akshat Jain**
Fullstack Intern — ProDesk Capstone Program

[![GitHub](https://img.shields.io/badge/GitHub-@AkshatJain0802-black?style=flat-square&logo=github)](https://github.com/AkshatJain0802)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/akshat-jain-70233324a)

---


