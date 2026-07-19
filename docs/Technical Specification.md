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