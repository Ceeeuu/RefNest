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

---
---

# 中文翻譯

# RefNest - 產品需求文件 (PRD)

## 專案概述

RefNest 是一個為插畫家與藝術家打造的 AI 靈感管理平台。

目標**不是**再做一個 AI 聊天機器人或圖片管理系統。

RefNest 想成為一座「個人靈感美術館」,讓使用者能透過自然語言輕鬆儲存、整理與找回藝術參考資料。

---

# 目標使用者

- 插畫家
- 數位藝術家
- 設計師
- 任何在收集靈感圖片的人

---

# 問題陳述

藝術家常從以下平台儲存數百甚至數千張參考圖:

- Twitter / X
- Pixiv
- Instagram
- Threads
- Bilibili

但收集幾個月後,常遇到這些問題:

- 找不到之前存過的圖
- 忘了繪師是誰
- 忘了圖片來源
- 忘了當初為什麼要存
- 傳統資料夾越來越難維護

---

# 產品願景

RefNest 定位為**個人 AI 靈感美術館**,而非圖片管理器。

每張存下的圖都成為使用者私人展館裡的一件展品。

由一位 AI 策展人協助整理與找回靈感。

---

# 核心原則

**圖片本身不是知識。**

知識來自:

- 使用者筆記
- 個人想法
- 標籤
- 繪師資訊
- 平台資訊

AI 理解的是文字,而非分析圖片。

---

# MVP 功能

## 儲存作品

每件作品包含:

- 圖片
- 繪師
- 平台
- 來源網址
- 建立時間
- 標籤
- 使用者筆記

---

## AI 標籤建議

使用者寫下:

「我喜歡這透明感的眼睛和頭髮的光澤。」

LLM 建議:

- 眼睛
- 頭髮
- 光影
- 透明感
- 冷色調

使用者可以:

- 接受
- 刪除
- 編輯
- 新增標籤

AI 只負責建議標籤。

最終決定權在使用者手上。

---

## 語意搜尋 (RAG)

使用者可以問:

「找出有透明感眼睛的作品。」

「給我適合做 OC 的參考。」

「我存過哪些有夏天氛圍的作品?」

系統透過向量搜尋找回最相關的作品。

---

## AI 策展人

一位自訂 OC 常駐在畫面右側。

這位 OC **不是**聊天機器人。

她是一位美術館策展人。

職責:

- 搜尋作品
- 建議標籤
- 回答收藏相關問題
- 協助整理靈感

---

# UI 風格

整個網站應該看起來像:

美術館

畫廊

藝術展覽

而**不是**:

儀表板 (Dashboard)

後台管理介面

ChatGPT

---

# 非目標

第一版**不會**包含:

- 影像辨識
- OCR
- 繪師辨識
- 自動爬蟲
- 推薦系統
- 社群功能
- 多使用者

---

# 成功標準

使用者能夠:

儲存作品。

用自然語言搜尋作品。

再也不會弄丟參考資料。

體驗到藝術美術館般的介面。