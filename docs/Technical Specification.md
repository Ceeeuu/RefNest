# Technical Specification

## Frontend

Framework

- React
- Vite

Libraries

- React Router
- Axios

---

## Backend

Framework

- Django
- Django REST Framework

---

## Database

PostgreSQL

Store:

- Artwork
- Artist
- Platform
- Tags
- Notes

---

## Vector Search

Use

pgvector

Do NOT use ChromaDB unless necessary.

---

## AI

LLM

OpenAI API

Functions

- Tag Suggestion
- AI Curator

Embedding Model

text-embedding-3-small

---

## Image Storage

Store uploaded images inside Django Media folder.

Images should NOT be stored inside PostgreSQL.

---

## Deployment

Run everything locally. No Docker.

- React: npm run dev
- Django: python manage.py runserver
- PostgreSQL: local install

---

## Architecture

React

↓

Django

↓

PostgreSQL

---

No Docker.

No Firebase.

No Supabase.

No Next.js.

No LangChain unless explicitly required.

---
---

# 中文翻譯

# 技術規格

## 前端

框架

- React
- Vite

函式庫

- React Router
- Axios

---

## 後端

框架

- Django
- Django REST Framework

---

## 資料庫

PostgreSQL

儲存:

- 作品 (Artwork)
- 繪師 (Artist)
- 平台 (Platform)
- 標籤 (Tags)
- 筆記 (Notes)

---

## 向量搜尋

使用

pgvector

非必要不使用 ChromaDB。

---

## AI

LLM

OpenAI API

功能

- 標籤建議
- AI 策展人

Embedding 模型

text-embedding-3-small

---

## 圖片儲存

上傳的圖片存在 Django 的 Media 資料夾。

圖片**不**存進 PostgreSQL。

---

## 部署

全部本機執行,不用 Docker。

- React:npm run dev
- Django:python manage.py runserver
- PostgreSQL:本機安裝

---

## 架構

React

↓

Django

↓

PostgreSQL

---

不用 Docker。

不用 Firebase。

不用 Supabase。

不用 Next.js。

非明確需要不使用 LangChain。