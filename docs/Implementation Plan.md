# RefNest 詳細實作計畫

> 依據 PRD / Technical Spec / UI Guideline / Development Plan 制定。
> 環境前提：全部本機執行，**不用 Docker**。本機安裝 Python / Node / PostgreSQL，直接 `npm run dev` + `python manage.py runserver`。OpenAI 金鑰已具備。策展人立繪＝ `asset/98b645891dbc5085.png`。
>
> 架構：React → Django → PostgreSQL。

---

## 0. 專案結構（最終樣貌）

```
RefNest/
├─ backend/                 # Django + DRF
│  ├─ manage.py
│  ├─ .env                  # OPENAI_API_KEY、DB 連線、SECRET_KEY（不進 git）
│  ├─ requirements.txt
│  ├─ config/               # Django 專案設定 (settings/urls/wsgi)
│  ├─ museum/               # 唯一的 app：models / serializers / views / urls / services
│  │  └─ services/          # openai_tags.py、embeddings.py、curator.py
│  └─ media/                # 上傳圖片（不進 git）
├─ frontend/                # React + Vite
│  └─ src/
│     ├─ api/               # axios client
│     ├─ pages/             # Gallery / ArtworkDetail / NewArtwork
│     ├─ components/        # ArtworkCard、CuratorSidebar、TagEditor…
│     └─ styles/            # 美術館主題 tokens
├─ asset/                   # 策展人立繪等靜態素材
└─ docs/
```

**設計原則（延續 ponytail 精神）**：後端只開 **一個 app（museum）**，不預先拆成多模組；能用 DRF ModelViewSet 就不手寫 view；能用資料庫欄位選項（choices）就不另建表。

---

## 1. 資料模型（backend/museum/models.py）

```python
class Artwork(models.Model):
    image        = ImageField(upload_to="artworks/")
    artist       = CharField(blank=True)              # 先用文字欄；要做繪師頁再升成獨立表
    platform     = CharField(choices=PLATFORM_CHOICES, blank=True)  # X/Pixiv/IG/Threads/Bilibili/Other
    source_url   = URLField(blank=True)
    note         = TextField(blank=True)              # 使用者感想 = 主要知識來源
    tags         = ManyToManyField("Tag", blank=True)
    embedding    = VectorField(dimensions=1536, null=True)  # pgvector, text-embedding-3-small
    created_at   = DateTimeField(auto_now_add=True)

class Tag(models.Model):
    name = CharField(unique=True)
```

決策說明：
- **platform 用 choices（原生 enum）** 而非獨立表——集合固定且小。
- **artist 先用 CharField**；升級路徑：若要「同繪師作品聚合頁」再換成 FK。（`ponytail:` 已標於程式碼）
- **Tag 用獨立表 + M2M**：因為 AI 會建議標籤、搜尋會依標籤過濾，需要去重與共用。
- **embedding 存在 Artwork 上**：用 note + tags + artist + platform 組成的文字生成，來源改動時重算。

---

## 2. API 端點（DRF）

| Method | Path | 用途 |
|---|---|---|
| GET/POST | `/api/artworks/` | 列表牆 / 新增作品（multipart 上傳圖片） |
| GET/PATCH/DELETE | `/api/artworks/{id}/` | 詳情 / 編修 / 刪除 |
| POST | `/api/suggest-tags/` | 傳 note，回傳建議標籤陣列（Stage 3） |
| GET | `/api/search/?q=` | 語意搜尋，回傳排序後作品（Stage 5） |
| POST | `/api/curator/` | 傳訊息，回傳策展人回應 + 相關作品（Stage 6） |

CRUD 用 `ModelViewSet + DefaultRouter`；三個 AI 端點用獨立 `APIView`。

---

## Stage 1 — 專案骨架與串接

**後端**
1. `python -m venv`、裝 `django djangorestframework django-cors-headers psycopg[binary] pgvector python-dotenv openai`。
2. `django-admin startproject config backend`、`startapp museum`。
3. settings：加 `rest_framework`、`corsheaders`、`museum`；設定 PostgreSQL 連線（讀 `.env`）；`MEDIA_URL`/`MEDIA_ROOT`；CORS 允許 `localhost:5173`。
4. PostgreSQL：建 DB `refnest`，`CREATE EXTENSION vector;`（見「風險」關於 Windows pgvector 安裝）。

**前端**
5. `npm create vite@latest frontend -- --template react`，裝 `react-router-dom axios`。
6. 建 axios client（baseURL 指向 `http://localhost:8000/api`）。

**驗收**：前端呼叫一個 `/api/ping/` 或空的 `/api/artworks/` 能拿到 200 與空陣列；`vector` extension 建立成功。

---

## Stage 2 — 作品 CRUD 與圖片上傳

1. 建立 `Artwork` / `Tag` model（暫不含 embedding，或先允許 null）並 migrate。
2. `ArtworkSerializer`（處理巢狀 tags 讀寫）、`ArtworkViewSet`、router。
3. 前端三頁：
   - **Gallery（首頁）**：抓 `/api/artworks/`，以作品牆呈現。
   - **NewArtwork（登錄表）**：圖片 + 繪師 + 平台 + 來源 + 筆記 + 標籤，multipart 送出。
   - **ArtworkDetail**：左大圖、右資訊。
4. media 檔案在 dev 由 Django 服務。

**驗收**：能上傳一張圖、在牆上看到、點進詳情、可編輯與刪除；圖片存在 `media/artworks/`，DB 內不存二進位。

---

> **設計調整（2026-07）**：不做「AI 幫忙建議標籤」。理由：使用者要的是**快速記錄**,沒耐心寫長文。
> - 標籤 = 使用者手動快速輸入(逗號/頓號/分號/斜線分隔)。
> - **note = 之後 RAG 檢索的主要內容來源(資料來源)**,填多填少隨意。
> - AI 的價值集中在「**用對話找圖**」——你問策展人,它去語意搜尋你的收藏並找出圖片。

## Stage 3 — Embedding 與 pgvector

1. `services/embeddings.py`：用 `text-embedding-3-small`（1536 維）將「note + tags + artist + platform」組成的文字轉向量。
2. 在 Artwork 存檔 / 更新時寫入 `embedding`（signal 或 serializer 內處理）。
3. 對既有資料補跑一支 management command 回填向量。

**驗收**：新增作品後 DB `embedding` 欄位有值；回填指令能處理舊資料。

---

## Stage 4 — 語意搜尋

1. `GET /api/search/?q=`：把查詢字串 embed → pgvector 依 **cosine distance** 排序取 Top-N。
2. 前端搜尋列（放在畫廊頂部，維持美術館調性，不做成工具列）。

**驗收**：「找有透明感眼睛的作品」「適合做 OC 的參考」能回傳語意相關作品，而非只靠關鍵字比對。

---

## Stage 5 — AI 策展人（OC）／對話式 RAG

1. `POST /api/curator/`：先把使用者訊息做語意搜尋取相關作品 → 連同訊息餵給 OpenAI chat，system prompt 設定為「美術館館員 OC」的口吻（非聊天機器人）→ 回傳文字回應 + **找到的作品圖片清單**。
2. 前端 `CuratorSidebar`：**右側常駐**，顯示 `asset/98b645891dbc5085.png` 立繪，像展場 NPC；可輸入問題、顯示回應與被引用的作品縮圖。

**驗收**：問「我存過哪些夏天氛圍的作品？」策展人以角色口吻回應並列出對應圖片；MVP 先不做串流（後續要再加）。

---

## Stage 6 — UI 打磨（美術館感）

1. 建立主題 tokens：溫暖／沉靜／高質感配色、襯線標題字、留白。
2. 畫廊牆進場動畫、hover 微互動、作品詳情過場。
3. 響應式：桌機三欄（牆 + 詳情 + 策展人）、行動裝置收合策展人。
4. 全站避開 Dashboard / Admin / ChatGPT 觀感。

**驗收**：整體視覺像藝術展館；主要頁面在桌機與手機皆可用。

---

## 執行方式

全部本機、不用 Docker：

- 前端：`cd frontend && npm run dev`（Vite，預設 5173）
- 後端：`cd backend && python manage.py runserver`（預設 8000）
- 資料庫：Docker 的 `pgvector/pgvector:pg18` 容器（對外 5433）。啟動:`docker start refnest-db`（首次用 `docker run` 建立,見 `.env.example`）。Python/Node 仍本機跑。

---

## 風險與注意事項

1. **Windows 本機安裝 pgvector（最大風險）**：全本機、不用 Docker，因此 pgvector 必須裝進本機 PostgreSQL。Windows 原生安裝通常需要用對應 Postgres 版本的預編譯 DLL，或以 MSVC 自行編譯。建議 Stage 1 前先確認你的 Postgres 版本，我再給對應安裝步驟，避免卡在 `CREATE EXTENSION vector;`。
2. **`.env` 與 `media/` 不進版控**：金鑰與上傳圖片需 `.gitignore`。
3. **OpenAI 成本控管**：embedding 只在存檔/更新時算一次；策展人呼叫做好錯誤處理，不因 API 失敗阻擋核心 CRUD。
4. **OpenAI 連線**：開發網路須連得到 `api.openai.com`（部分公司/防火牆會封鎖）。Stage 3 起才需要,若被擋可換網路或掛 VPN。
5. **CORS**：dev 明確允許 `localhost:5173`，勿用萬用開放。

---

## 執行順序建議

Stage 1 → 2 先把「能存、能看」跑通（此時產品已有基本價值），再依序疊上 AI（3 embedding → 4 語意搜尋 → 5 對話式策展人），最後才 UI 打磨（6）。每個 Stage 都有上面的驗收條件，達標才進下一階段。
```
