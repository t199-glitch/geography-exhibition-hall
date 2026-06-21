# 地理探究與實作期末成果展示大廳

這是一個針對高中地理探究與實作課程設計的成果展示大廳。此 SPA（單網頁應用程式）特別針對 **Google 協作平台 (Google Sites)** 嵌入環境進行最佳化，透過 **Google Sheets + Google Apps Script (GAS)** 雲端資料庫解決 Iframe Sandboxing 導致 LocalStorage 遺失的問題，並強制採用 **JSONP 跨網域協定** 通訊。

---

## 🌟 核心特色
1. **地圖風視覺**：深青綠色 (Teal)、天藍色 (Cyan) 與靛藍色 (Indigo) 漸層現代 UI。
2. **班級動態統計**：頂部 Tabs 分類「全部成果」、「202 班」、「207 班」，並即時統計上傳數量。
3. **智慧封面擷取**：
   - 輸入 Google 簡報或雲端硬碟 PDF 連結，系統會自動透過 API 解析出簡報第一頁作為卡片封面。
   - 非 Google 連結或載入失敗時，將自動產生優雅的「幾何地理風模擬封面」，確保卡片排版整齊不破版。
4. **自主編輯功能**：每張卡片皆有「編輯」按鈕，輸入上傳時設定的 4 位數密碼即可進行修改。
5. **防鎖死預覽視窗**：點擊卡片彈出預覽視窗。針對沙盒限制，上方特別設計亮黃色閃爍動畫的「🚀 立即在新分頁開啟簡報」按鈕。
6. **防洗讚機制**：點擊點讚後立刻禁用按鈕，並同時存入記憶體與 `sessionStorage` 進行雙軌防禦，即便重整網頁也無法重複洗讚。
7. **隱藏式管理員功能**：頁尾有隱密「管理員登入」，密碼為 `geo123`，登入後可一鍵刪除任何作品。

---

## 🛠️ 快速部署與設定指南

### 第一步：設定 Google 試算表與 Google Apps Script (GAS)

1. 新增一個全新的 **Google 試算表**。
2. 在試算表頂部選單點選 **「延伸功能」 -> 「Apps Script」**。
3. 清空編輯器中的預設程式碼，並將本專案中的 `google-apps-script.js` 程式碼複製並貼上。
4. 儲存專案（可點選上方的磁碟圖示或按 `Ctrl + S`）。

### 第二步：發布 GAS 為網頁應用程式 (Web App)

1. 在 Apps Script 頁面右上方，點擊 **「部署」 -> 「新增部署」**。
2. 點選左側的齒輪圖示，選擇 **「網頁應用程式」** (Web App)。
3. 設定參數：
   - **說明**：例如 `Geography Exhibit Webapp`
   - **專案執行身分**：選擇 **「我」 (Me)**
   - **誰有權限存取**：務必選擇 **「所有人」 (Anyone)** （否則學生存取時會因為沒有登入你的帳號而被拒絕連線）。
4. 點擊 **「部署」**。
5. 首次部署時，系統會要求「授予存取權限」：
   - 點擊 **「授予存取權」** (Authorize access)。
   - 選擇你的 Google 帳號。
   - 出現「Google 尚未驗證此應用程式」警告時，點選 **「進階」 (Advanced) -> 「前往『未命名專案』（不安全）」**。
   - 點擊 **「允許」 (Allow)**。
6. 部署完成後，複製產生的 **「網頁應用程式 URL」** （網址格式通常為 `https://script.google.com/macros/s/.../exec`）。

### 第三步：更新前端 index.html 的連結

1. 開啟本專案的 `index.html`。
2. 尋找第 644 行左右的 `GAS_WEB_APP_URL` 常數：
   ```javascript
   const GAS_WEB_APP_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. 將其替換為您在第二步中複製的 **網頁應用程式 URL**：
   ```javascript
   const GAS_WEB_APP_URL = "https://script.google.com/macros/s/xxxxxxxxx/exec";
   ```
4. 儲存 `index.html` 檔案。

### 第四步：部署至 GitHub Pages 並發布給學生

1. 將修改後的專案推送到您的 GitHub 儲存庫。
2. 前往儲存庫首頁的 **「Settings」 -> 「Pages」**。
3. 在 **「Build and deployment」** 底下：
   - **Source** 選擇 `Deploy from a branch`。
   - **Branch** 選擇 `master` (或 `main`)，目錄選擇 `/ (root)`。
4. 點擊 **Save**。
5. 等待 1~2 分鐘後，重新整理該頁面，頂部將會顯示您的專屬發布網址：
   `https://<你的用戶名>.github.io/<倉庫名>/`
6. 您現在可以將這個網址直接分享給學生，或是透過 iframe 的方式嵌入 Google 協作平台中！
