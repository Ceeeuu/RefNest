# RefNest - Product Requirement Document (PRD)

## Project Overview

RefNest is an AI-powered inspiration management platform designed for artists and illustrators.

The goal is **NOT** to build another AI chatbot or image management system.

Instead, RefNest aims to become a personal inspiration museum where users can easily store, organize and retrieve artistic references through natural language.

---

# Target Users

- Illustrators
- Digital artists
- Designers
- Anyone collecting inspiration images

---

# Problem Statement

Artists often save hundreds or even thousands of reference images from platforms such as:

- Twitter / X
- Pixiv
- Instagram
- Threads
- Bilibili

However, after months of collecting references, users frequently encounter problems:

- Cannot find previously saved images
- Forget the artist
- Forget where the image came from
- Forget why they saved it
- Traditional folders become difficult to maintain

---

# Product Vision

RefNest is designed as a **Personal AI Inspiration Museum**, not an image manager.

Each saved image becomes an exhibit inside the user's personal gallery.

An AI Curator helps organize and retrieve inspirations.

---

# Core Principle

**Images are NOT the knowledge.**

The knowledge comes from:

- User notes
- Personal thoughts
- Tags
- Artist information
- Platform information

The AI understands text instead of analyzing images.

---

# MVP Features

## Save Artwork

Each artwork contains:

- Image
- Artist
- Platform
- Source URL
- Created Time
- Tags
- User Note

---

## AI Tag Suggestion

User writes:

"I love the transparent eyes and hair lighting."

LLM suggests:

- Eyes
- Hair
- Lighting
- Transparency
- Cold Color

Users can:

- Accept
- Delete
- Edit
- Add new tags

The AI only suggests tags.

The final decision belongs to the user.

---

## Semantic Search (RAG)

Users may ask:

"Find artworks with transparent eyes."

"Show me references suitable for OC."

"What summer atmosphere artworks have I saved?"

The system retrieves the most relevant artworks through vector search.

---

## AI Curator

A custom OC is permanently displayed on the right side.

The OC is NOT a chatbot.

She is a museum curator.

Responsibilities:

- Search artworks
- Suggest tags
- Answer collection questions
- Help organize inspirations

---

# UI Style

The entire website should look like:

Museum

Gallery

Art Exhibition

NOT

Dashboard

Admin Panel

ChatGPT

---

# Non Goals

The first version will NOT include:

- Image Recognition
- OCR
- Artist Recognition
- Auto Crawling
- Recommendation System
- Social Features
- Multiple Users

---

# Success Criteria

Users can:

Save artworks.

Search artworks using natural language.

Never lose references again.

Experience an artistic museum-like interface.