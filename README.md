# OpenCVCaptcha

![分割](https://github.com/user-attachments/assets/2261039e-6bec-42d9-9211-10aea18d3c33)

# splitLetter.html
## 介紹
本專案是一個基於 **OpenCV.js** 的字母分割工具，通過圖像處理技術提取字符並當作識別參考。

## 功能
- 上傳類似驗證碼字型的字符圖片
- 支援常見圖像格式（PNG、JPG、JPEG）
- 設定參數
- 顯示處理後的圖像(辨識不準確調整參數後重試)
- 各別或全部下載(放進./alphabet)
---

![驗證](https://github.com/user-attachments/assets/3b331033-41ac-467b-98ec-cd22bbf42bb2)
# identification.html

## 介紹
基於 **OpenCV.js** 的驗證碼識別系工具，通過圖像處理技術提取驗證碼字符並進行識別。

## 功能
- 上傳圖片進行驗證碼識別
- 支援常見圖像格式（PNG、JPG、JPEG）
- 提供多種圖像處理方式，包括：
  - **腐蝕操作**
  - **高斯模糊**
  - **Canny 邊緣檢測**
  - **膨脹操作**
  - **輪廓檢測**
- 顯示處理後的圖像
- 輸出識別結果
  
## 安裝與運行
### 1. 下載專案
```sh
git clone https://github.com/YD1234564789/OpenCVCaptcha.git
cd OpenCVCaptcha
```

### 2. 安裝依賴（若有後端）
本專案目前無需額外安裝後端，若未來加入後端，可使用以下方式安裝依賴：
```sh
npm install
```

### 3. 運行專案
直接在瀏覽器打開 `identification.html` 、`splitLetter.html`即可。

## 主要技術
- **OpenCV.js**：負責圖像處理（腐蝕、模糊、邊緣檢測等）
- **HTML/CSS/JavaScript**：前端 UI 與互動
- **File API**：讀取本地圖片

## 聯絡作者
如有任何問題或建議，請提交 Issue 或聯繫作者。

---
**版本:** 1.0.0  
**作者:** YD1234564789
