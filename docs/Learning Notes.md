# RefNest 學習筆記

> 每個階段新增了什麼、背後原理、怎麼運作。面試前可直接看這份複習。

---

## Stage 1 — 前後端骨架與連線

### 這階段建立的東西

| 位置 | 是什麼 | 作用 |
|---|---|---|
| `backend/.venv/` | Python 虛擬環境 | 把本專案的套件裝在專案自己的資料夾,不污染全域 Python |
| `backend/config/` | Django 專案設定 | 全站設定(`settings.py`)與路由總表(`urls.py`) |
| `backend/museum/` | Django app | 放我們自己的功能(view、之後的 model) |
| `backend/.env` | 環境變數(不進 git) | 存密碼、金鑰等機密 |
| `backend/museum/views.py` | `ping` view | 收到請求就回傳 JSON |
| `frontend/` | Vite + React 專案 | 使用者看到的畫面 |
| `frontend/src/api/client.js` | axios 實例 | 前端呼叫後端 API 的統一入口 |
| `frontend/src/App.jsx` | React 元件 | 開機自動 ping 後端並顯示狀態 |

---

### 核心觀念:前後端是「兩個獨立程式」

RefNest 不是一個程式,而是**兩個各自獨立執行的程式**,透過網路溝通:

- **後端 Django**:跑在 `http://localhost:8000`,負責資料與邏輯,回傳 JSON(不管畫面長怎樣)。
- **前端 React**:跑在 `http://localhost:5173`,負責畫面,跟後端要資料後渲染。

它們用 **HTTP 請求**溝通,資料格式是 **JSON**。這種「後端只給資料、前端負責畫面」的架構叫 **前後端分離 (decoupled / REST API)**。

> 面試講法:「我採用前後端分離架構,Django 提供 REST API,React 消費 API,兩者用 JSON 溝通。」

---

### 畫面出現文字的完整流程(一步步)

當你打開 `http://localhost:5173`:

1. **瀏覽器載入 React**:Vite 把 `App.jsx` 打包成 JS 送到瀏覽器執行。
2. **首次渲染**:`App` 元件的 state `status` 初始值是 `"connecting..."`,所以畫面先顯示 `Backend status: connecting...`。
3. **useEffect 觸發**:React 畫完第一次後,`useEffect` 執行,呼叫 `client.get("/ping/")`。
4. **axios 發出 HTTP 請求**:實際打到 `http://localhost:8000/api/ping/`(baseURL + 路徑)。
5. **Django 收到請求**,依路由找到對應 view:
   - `config/urls.py` 看到網址開頭是 `api/` → 交給 `museum/urls.py`
   - `museum/urls.py` 看到 `ping/` → 呼叫 `views.ping`
   - `ping` 回傳 `{"status": "ok", "service": "RefNest"}`(JSON)
6. **回應傳回瀏覽器**,axios 拿到 `res.data`。
7. **更新 state**:`setStatus("connected: ...")` 改變了 `status`。
8. **React 重新渲染**:state 一變,React 自動重畫,畫面變成 `Backend status: connected: {...}`。

所以你會看到文字**先是 connecting、瞬間變成 connected**——這就是 React 的核心:**state 改變 → 畫面自動更新**。

---

### 關鍵拼圖 1:URL 路由 (Django 怎麼知道要回什麼)

Django 收到網址後,像查電話簿一樣逐層對照:

```
請求 /api/ping/
  → config/urls.py:  path('api/', include('museum.urls'))   # 開頭 api/ 進 museum
  → museum/urls.py:  path('ping/', views.ping)              # 剩下 ping/ 對到 ping view
  → views.ping 執行,回傳 JSON
```

拆兩層(總表 include 各 app 的 urls)是為了模組化:每個 app 管自己的路由。

---

### 關鍵拼圖 2:axios 與 baseURL

`client.js` 建了一個 axios 實例,設定 `baseURL: "http://localhost:8000/api"`。

之後全站呼叫只要寫 `client.get("/ping/")`,axios 會自動補成完整網址。好處:後端網址只寫一次,將來要換(例如部署到正式站)只改這一行。

---

### 關鍵拼圖 3:CORS(為什麼需要,不然會壞)

瀏覽器有個安全規則叫 **同源政策 (Same-Origin Policy)**:一個網頁預設**只能**呼叫「同一個來源」的 API。

- 前端來源:`localhost:5173`
- 後端來源:`localhost:8000`

**埠號不同 = 不同來源**。所以瀏覽器預設會**擋掉**這個請求。

解法是 **CORS (Cross-Origin Resource Sharing)**:後端主動在回應裡加一個標頭,告訴瀏覽器「我允許 5173 來呼叫我」。我們用 `django-cors-headers` 套件,在 `settings.py` 設定:

```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
```

有這行,瀏覽器才放行。**沒有的話,畫面會顯示 `failed: Network Error`**——這是新手最常卡的地方。

> 面試講法:「因為前端 5173 和後端 8000 是不同來源,受同源政策限制,我用 django-cors-headers 在後端明確允許前端來源,避免用不安全的萬用開放。」

---

### 關鍵拼圖 4:`.env` 與機密管理

資料庫密碼、API 金鑰這種東西**絕不能寫死在程式碼裡**(會被推到 GitHub 公開)。做法:

- 真正的值放 `backend/.env`(被 `.gitignore` 擋住,不上傳)
- `settings.py` 用 `os.getenv("DB_PASSWORD")` 讀取
- 另附 `.env.example` 範本(進版控),讓別人知道要設哪些變數,但看不到實際值

> 面試講法:「機密用環境變數管理,`.env` 不進版控,附 `.env.example` 當文件。」

---

### 一句話總結 Stage 1

> React(5173)透過 axios 發 HTTP 請求到 Django(8000)的 REST API,Django 依 URL 路由找到 view 回傳 JSON,React 拿到後更新 state 觸發重新渲染;跨來源請求靠後端 CORS 放行。
