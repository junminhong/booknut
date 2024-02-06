# booknut

## 當初發想
身為一個曾經的大學生，總會覺得手上的教科書好像沒人使用就發揮不了它的價值，所以就想說開發一個專注於書籍交易的平台。

由於交易平台本身是一個很普遍的主題，所以我又額外套用了區塊鏈的概念去設計堅果幣(平台內虛擬貨幣)。

## 特點
- 支援Google帳戶直接登入
- 支援註冊信箱驗證
- 支援身分證OCR驗證
- 支援手機簡訊驗證
- 堅果幣
  - 支援堅果幣錢包
  - 支援平台內直接掃描qrcode 
  - 支援錢包紀錄追查
![截圖 2022-01-20 下午1 08 18](https://user-images.githubusercontent.com/61868459/150277171-0bf764d2-1e6c-4738-987a-c3bc29cd8403.png) 

## 基於安全
1. 用戶如未經信箱認證是不可以使用平台功能(如：上架商品、交易、堅果幣錢包等)。
2. 用戶未經實名認證也是不可以使用平台功能。
3. 堅果幣錢包地址會在實名認證後產生。
4. 身分證認證不經過用戶填寫，一律使用身分證OCR由後端進行判斷，避免假資料的問題。
5. 實名認證內基本資料於第一次填寫後就不可修改。
6. 提供電話號碼更新服務，一但解除電話號碼並無再更新號碼的用戶，會被系統認定為未經實名認證。
7. 一但被系統認定為未經認證，該用戶堅果幣錢包會被自動鎖住，需經過認證後即可解除。

## 技術選用
- Vue3
- FireBase

[Live Demo](https://booknut-2d3c9.web.app/)

[影片介紹](https://www.youtube.com/watch?v=VynoXy04R68)
