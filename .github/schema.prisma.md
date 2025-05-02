generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// 定義資產類型的枚舉，例如鑽石、心、氣泡和硬幣
enum AssetEnum {
  DIAMOND // 鑽石，通常用於高價值交易或獎勵
  HEART // 心，可能用於生命值或情感相關的資產
  BUBBLE // 氣泡，可能用於特殊效果或臨時資源
  COIN // 硬幣，常見的貨幣類型，用於一般交易
}

// 定義性別類型的枚舉
enum GenderEnum {
  MALE // 男性
  FEMALE // 女性
}

// 定義物品類型的枚舉，例如消耗品、裝備、裝飾品等
enum ItemEnum {
  CONSUMABLE // 消耗品
  EQUIPMENT // 裝備
  DECORATION // 裝飾品
  COLLECTIBLE // 收藏品
  MATERIAL // 材料
  SPECIAL // 特殊道具
  KEY_ITEM // 鑰匙物品
  FOOD // 食物
  POTION // 藥水
  BOOK // 書籍
  TREASURE // 寶藏
  MOUNT // 坐騎
  PET // 寵物
  TROPHY // 獎盃
  ARMOR // 護甲
  WEAPON // 武器
  GEM // 寶石
  ARTIFACT // 神器
}

// 定義物品壽命類型的枚舉，例如基於次數、時間或無限制
enum LifespanEnum {
  DRAW_COUNT // 基於次數的壽命，例如物品可以被使用或抽取的次數限制
  TIME_BASED // 基於時間的壽命，例如物品在特定時間後過期
  UNLIMITED // 無限制的壽命，物品可以永久使用
}

// 定義支付狀態的枚舉，例如待處理、成功或失敗
enum PaymentEnum {
  PENDING // 支付待處理，表示支付流程尚未完成
  SUCCESS // 支付成功，表示交易已成功完成
  FAILED // 支付失敗，表示交易未成功
}

// 定義物品稀有度的枚舉，例如普通、稀有、史詩等
enum RarityEnum {
  COMMON // 普通
  UNCOMMON // 稀有
  RARE // 珍貴
  EPIC // 史詩
  LEGENDARY // 傳說
  MYTHICAL // 神話
}

// 定義推薦狀態的枚舉，例如待處理或已完成
enum ReferralEnum {
  PENDING // 邀請處於待處理狀態
  COMPLETED // 邀請已完成
}

// 定義交易類型的枚舉，例如增加、減少、兌換等
enum TransactionEnum {
  INCREASE // 增加資產
  DECREASE // 減少資產
  EXCHANGE // 資產兌換
  REWARD // 獎勵資產
  TRANSFER // 資產轉移
  BURN // 資產銷毀
}

// 定義用戶角色的枚舉，例如普通用戶或管理員
enum UserRole {
  USER // 普通用戶
  ADMIN // 管理員
}

// 定義星座的枚舉，例如白羊座、金牛座等
enum ZodiacEnum {
  ARIES // 白羊座
  TAURUS // 金牛座
  GEMINI // 雙子座
  CANCER // 巨蟹座
  LEO // 獅子座
  VIRGO // 處女座
  LIBRA // 天秤座
  SCORPIO // 天蠍座
  SAGITTARIUS // 射手座
  CAPRICORN // 摩羯座
  AQUARIUS // 水瓶座
  PISCES // 雙魚座
}

// 定義資產模型，表示通用的資產類型和數量
model Asset {
  id          String       @id @default(auto()) @map("_id") @db.ObjectId // 資產的唯一標識符
  type        AssetEnum    // 資產的類型，例如鑽石、硬幣等
  amount      Int          @default(0) // 資產的數量，默認為 0
  userAssetId String?      @db.ObjectId // 關聯的用戶資產 ID（可選）
  userAsset   UserAsset?   @relation("UserAssetToAsset", fields: [userAssetId], references: [id]) // 反向關聯到 UserAsset
}

// 定義資產變更模型，記錄資產的變更歷史
model AssetMutation {
  id          String          @id @default(auto()) @map("_id") @db.ObjectId // 資產變更記錄的唯一標識符
  userId      String          // 發生資產變更的用戶 ID
  currency    AssetEnum       // 資產的類型，例如鑽石、硬幣等
  amount      Int             // 資產變更的數量
  reason      TransactionEnum // 資產變更的原因，例如增加、減少等
  description String?         // 資產變更的描述（可選）
  createdAt   DateTime        @default(now()) // 資產變更的創建時間
  user        User            @relation(fields: [userId], references: [id]) // 關聯的用戶對象
}

// 定義盲盒核心模型，表示盲盒的基本信息
model BlindBoxCore {
  id        String         @id @default(auto()) @map("_id") @db.ObjectId // 盲盒的唯一標識符
  name      String         // 盲盒的名稱
  price     Int            // 盲盒的價格
  currency  AssetEnum      // 盲盒的價格所使用的資產類型
  cost      Int            // 盲盒的成本
  items     BlindBoxItem[] // 盲盒內的物品配置
  draws     BlindBoxDraw[] // 盲盒的抽獎記錄
  isActive  Boolean        @default(true) // 盲盒是否處於激活狀態
  createdAt DateTime       @default(now()) // 盲盒的創建時間
  updatedAt DateTime       @updatedAt // 盲盒的最後更新時間
}

// 定義盲盒抽獎模型，記錄用戶的抽獎行為
model BlindBoxDraw {
  id         String       @id @default(auto()) @map("_id") @db.ObjectId // 抽獎記錄的唯一標識符
  userId     String       @db.ObjectId // 抽獎的用戶 ID
  user       User         @relation(fields: [userId], references: [id]) // 關聯的用戶對象
  blindBoxId String       @db.ObjectId // 關聯的盲盒 ID
  blindBox   BlindBoxCore @relation(fields: [blindBoxId], references: [id]) // 關聯的盲盒對象
  itemId     String       @db.ObjectId // 抽中的物品 ID
  item       Item         @relation(fields: [itemId], references: [id]) // 關聯的物品對象
  drawnAt    DateTime     @default(now()) // 抽獎的時間

  @@index([userId, drawnAt]) // 優化基於用戶和抽獎時間的查詢
  @@index([blindBoxId]) // 優化基於盲盒的查詢
}

// 定義盲盒物品模型，表示盲盒內的物品配置
model BlindBoxItem {
  id         String       @id @default(auto()) @map("_id") @db.ObjectId // 盲盒物品的唯一標識符
  blindBoxId String       @db.ObjectId // 關聯的盲盒 ID
  blindBox   BlindBoxCore @relation(fields: [blindBoxId], references: [id]) // 關聯的盲盒對象
  itemId     String       @db.ObjectId // 關聯的物品 ID
  item       Item         @relation(fields: [itemId], references: [id]) // 關聯的物品對象
  weight     Int          // 物品在盲盒中的權重，用於決定抽獎概率

  @@index([blindBoxId, weight]) // 優化基於盲盒和權重的查詢
}

model Combat {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
}

// 定義物品模型，表示遊戲中的各種物品
model Item {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId // 物品的唯一標識符
  blindBoxDraws BlindBoxDraw[] // 與物品相關的盲盒抽獎記錄
  name          String         // 物品的名稱
  type          ItemEnum       // 物品的類型，例如消耗品、裝備等
  rarity        RarityEnum     // 物品的稀有度
  description   String?        // 物品的描述（可選）
  imageUrl      String?        // 物品的圖片 URL（可選）
  isTrading     Boolean        @default(true) // 物品是否可交易
  stackable     Boolean        @default(true) // 物品是否可堆疊
  createdAt     DateTime       @default(now()) // 物品的創建時間
  updatedAt     DateTime       @updatedAt // 物品的最後更新時間

  // 關聯
  userItems     UserItem[]     // 使用者持有的物品
  blindBoxItems BlindBoxItem[] // 盲盒物品配置

  @@index([type]) // 優化基於物品類型的查詢
  @@index([rarity]) // 優化基於物品稀有度的查詢
}

model Inventory {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
}

// 定義 LINE Pay 支付模型，記錄支付相關信息
model LinePay {
  id                 String        @id @default(auto()) @map("_id") @db.ObjectId // 支付記錄的唯一標識符
  userId             String        // 發起支付的用戶 ID
  transactionId      String?       // LINE Pay 的交易 ID（可選）
  order_id           String        @unique // 訂單 ID，唯一標識一筆交易
  currency           String        // 支付的貨幣類型
  amount             Int           // 支付的金額
  status             PaymentEnum // 支付的狀態，例如待處理、成功或失敗
  packages           Json          // 支付的包裹信息
  redirectUrls       Json?         // 支付完成後的跳轉 URL（可選）
  options            Json?         // 支付的其他選項（可選）
  paymentUrl         Json?         // 支付的 URL 信息（可選）
  paymentAccessToken String?       // 支付的訪問令牌（可選）
  createdAt          DateTime      @default(now()) // 支付記錄的創建時間
  updatedAt          DateTime      @default(now()) // 支付記錄的最後更新時間

  user User @relation(fields: [userId], references: [id]) // 關聯的用戶對象

  @@index([userId]) // 優化基於用戶的查詢
  @@index([status]) // 優化基於支付狀態的查詢
  @@index([createdAt]) // 優化基於創建時間的查詢
  @@index([userId, createdAt]) // 優化基於用戶和創建時間的查詢
}

model Leaderboard {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
}

// 定義筆記核心模型，表示用戶創建的筆記
model NoteCore {
  id           String        @id @default(auto()) @map("_id") @db.ObjectId // 筆記的唯一標識符
  content      String        // 筆記的內容
  createdAt    DateTime      @default(now()) // 筆記的創建時間
  createdBy    String        // 創建筆記的用戶 ID
  isActive     Boolean       @default(true) // 筆記是否處於激活狀態
  submitCost   Int?          // 提交筆記的資產成本
  submitAsset  AssetEnum?    // 提交筆記所需的資產類型
  drawCost     Int?          // 抽取筆記的資產成本
  drawAsset    AssetEnum?    // 抽取筆記所需的資產類型
  submitLimit  Int?          // 筆記的提交次數限制
  drawLimit    Int?          // 筆記的抽取次數限制
  lifespan     LifespanEnum? // 筆記的壽命類型，例如基於次數或時間
  maxDraws     Int?          // 筆記的最大抽取次數
  expiresAt    DateTime?     // 筆記的過期時間
  currentDraws Int           @default(0) // 筆記當前的抽取次數
  NoteSubmits  NoteSubmit[]  // 與筆記相關的提交記錄
  NoteDraws    NoteDraw[]    // 與筆記相關的抽獎記錄

  @@index([isActive]) // 優化基於激活狀態的查詢
  @@index([lifespan, currentDraws]) // 優化基於壽命類型和當前抽取次數的查詢
  @@index([lifespan, expiresAt]) // 優化基於壽命類型和過期時間的查詢
  @@index([isActive, lifespan, currentDraws]) // 優化基於多條件的查詢
  @@index([isActive, lifespan, expiresAt]) // 優化基於多條件的查詢
}

// 定義筆記抽獎模型，記錄用戶對筆記的抽獎行為
model NoteDraw {
  id         String    @id @default(auto()) @map("_id") @db.ObjectId // 抽獎記錄的唯一標識符
  userId     String    // 抽獎的用戶 ID
  noteId     String    @db.ObjectId // 關聯的筆記 ID
  note       NoteCore  @relation(fields: [noteId], references: [id]) // 關聯的筆記對象
  drawnAt    DateTime  @default(now()) // 抽獎的時間
  costAmount Int       // 抽獎消耗的資產數量
  costType   AssetEnum // 抽獎消耗的資產類型

  @@unique([userId, noteId], name: "unique_user_note") // 保證用戶對同一筆記的唯一抽獎記錄
  @@index([userId, drawnAt]) // 優化基於用戶和抽獎時間的查詢
  @@index([noteId]) // 優化基於筆記的查詢
}

// 定義筆記提交模型，記錄用戶提交的筆記
model NoteSubmit {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId // 提交記錄的唯一標識符
  userId      String    // 提交筆記的用戶 ID
  noteId      String    @db.ObjectId // 關聯的筆記 ID
  note        NoteCore  @relation(fields: [noteId], references: [id]) // 關聯的筆記對象
  submittedAt DateTime  @default(now()) // 提交的時間
  costAmount  Int       // 提交消耗的資產數量
  costType    AssetEnum // 提交消耗的資產類型

  @@index([userId, submittedAt]) // 優化基於用戶和提交時間的查詢
  @@index([noteId]) // 優化基於筆記的查詢
}

// 定義推薦模型，記錄用戶之間的推薦關係
model Referral {
  id        String         @id @default(auto()) @map("_id") @db.ObjectId // 推薦記錄的唯一標識符
  inviterId String         // 邀請者的用戶 ID
  inviteeId String         // 被邀請者的用戶 ID
  status    ReferralEnum @default(PENDING) // 推薦的狀態，例如待處理或已完成
  createdAt DateTime       @default(now()) // 推薦的創建時間

  inviter User @relation("Inviter", fields: [inviterId], references: [id]) // 關聯的邀請者對象
  invitee User @relation("Invitee", fields: [inviteeId], references: [id]) // 關聯的被邀請者對象

  @@index([inviterId]) // 優化基於邀請者的查詢
  @@index([inviteeId]) // 優化基於被邀請者的查詢
}

// 定義用戶模型，表示應用中的用戶信息
model User {
  id            String         @id @default(auto()) @map("_id") @db.ObjectId // 用戶的唯一標識符
  blindBoxDraws BlindBoxDraw[] // 用戶的盲盒抽獎記錄
  lineUserId    String         @unique // LINE 用戶的唯一標識符
  displayName   String         // 用戶的顯示名稱
  pictureUrl    String?        // 用戶的頭像 URL（可選）
  accessToken   String         // 用於身份驗證的存取令牌
  idToken       String         // 用於身份驗證的 ID 令牌
  statusMessage String?        // 用戶的狀態消息（可選）
  createdAt     DateTime       @default(now()) // 用戶創建時間
  updatedAt     DateTime       @default(now()) // 用戶更新時間

  genderId String?     @db.ObjectId // 用戶性別的關聯 ID（可選）
  gender   UserGender? @relation(fields: [genderId], references: [id]) // 用戶性別的關聯對象

  zodiacSignId String?     @db.ObjectId // 用戶星座的關聯 ID（可選）
  zodiacSign   UserZodiac? @relation(fields: [zodiacSignId], references: [id]) // 用戶星座的關聯對象

  role UserRole @default(USER) // 用戶的角色（默認為普通用戶）

  assets    UserAsset?      @relation("UserAssets") // 用戶的資產關聯對象
  referrals Referral[]      @relation("Inviter") // 用戶作為邀請者的推薦記錄
  invitedBy Referral[]      @relation("Invitee") // 用戶作為被邀請者的推薦記錄
  mutations AssetMutation[] // 用戶的資產變更記錄
  payments  LinePay[]       // 用戶的支付記錄
  userItems UserItem[]      @relation // 用戶擁有的物品記錄

  @@index([role]) // 依角色分類快速查詢
}

// 定義用戶資產模型，記錄用戶的資產數量
model UserAsset {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId // 資產的唯一標識符
  userId    String   @unique // 關聯的用戶 ID
  user      User     @relation("UserAssets", fields: [userId], references: [id]) // 關聯的用戶對象
  diamonds  Int      @default(0) // 用戶擁有的鑽石數量（默認為 0）
  hearts    Int      @default(0) // 用戶擁有的心數量（默認為 0）
  bubbles   Int      @default(0) // 用戶擁有的氣泡數量（默認為 0）
  coins     Int      @default(0) // 用戶擁有的硬幣數量（默認為 0）
  updatedAt DateTime @updatedAt // 資產的最後更新時間

  assets Asset[] @relation("UserAssetToAsset") // 用戶資產的詳細關聯記錄
}

model UserCombat {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
}

// 定義用戶性別模型，表示用戶的性別信息
model UserGender {
  id    String @id @default(auto()) @map("_id") @db.ObjectId // 性別的唯一標識符
  name  String @unique // 性別名稱，例如 "Male" 或 "Female"
  users User[] // 關聯的用戶列表
}

// 定義用戶物品模型，記錄用戶擁有的物品
model UserItem {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId // 用戶物品的唯一標識符
  userId    String   @db.ObjectId // 關聯的用戶 ID
  user      User     @relation(fields: [userId], references: [id]) // 關聯的用戶對象
  itemId    String   @db.ObjectId // 關聯的物品 ID
  item      Item     @relation(fields: [itemId], references: [id]) // 關聯的物品對象
  quantity  Int      // 用戶擁有的物品數量
  createdAt DateTime @default(now()) // 用戶物品的創建時間
  updatedAt DateTime @default(now()) // 用戶物品的最後更新時間

  @@index([userId, itemId]) // 優化用戶與物品的查詢
}

model UserInventory {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
}

model UserLeaderboard {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
}

// 定義用戶星座模型，表示用戶的星座信息
model UserZodiac {
  id    String @id @default(auto()) @map("_id") @db.ObjectId // 星座的唯一標識符
  name  String @unique // 星座名稱，例如 "Aries" 或 "Taurus"
  users User[] // 關聯的用戶列表
}
