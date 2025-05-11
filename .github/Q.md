# Next.js + DDD + CQRS 專案代碼生成指南

## 核心原則

### 基礎原則
- ✅ **職責分離** (Separation of Responsibility)  
  每層只負責單一職責，降低模組耦合
- ✅ **關注點分離** (Separation of Concerns)  
  清楚拆分 Domain Logic / Application Logic / Infrastructure / UI
- ✅ **最小化客戶端** (Minimal Client)  
  資料存取與邏輯集中於 Server Components
- ✅ **領域驅動設計** (Domain-Driven Design)  
  以業務核心設計 Entity / Aggregate / Repository / Service
- ✅ **命令查詢分離** (CQRS)  
  明確分離查詢與修改操作，提升維護性

## 代碼生成目標
1. 生成符合 DDD + CQRS 架構的專案模板代碼
2. 基於模板建立專案實體
3. 維持代碼品質與結構一致性

## 架構規範

### 核心原則
1. **命名規範**：
   - 檔案命名：`[模型-功能領域]-[操作/角色/用途].[副檔名]`
   - CQRS 檔案：`[model]-[query/command].[type].ts`
   - 分隔符號：除副檔名外統一使用"-"

2. **最小化客戶端**：
   - 業務邏輯集中於 Server Components
   - 使用 Server Actions 處理數據操作
   - Query 操作使用 Server Components
   - Command 操作使用 Server Actions

3. **DDD 分層架構**：
   - Interfaces Layer：
     - 查詢介面（Query）：Server Components
     - 命令介面（Command）：Server Actions
   - Application Layer：
     - QueryService：處理查詢邏輯
     - CommandService：處理修改邏輯
   - Domain Layer：
     - Entity & Value Object：領域模型
     - Domain Events：領域事件
     - Domain Services：領域服務
   - Infrastructure Layer：
     - Repository：數據持久化
     - External Services：外部服務

### 技術規範
1. **框架要求**：
   - Next.js 15
   - Prisma 6.6.0
   - TypeScript
   - Zod

2. **基礎設施規範**：
   - Prisma 引用：`import { prisma } from '@/modules/shared/infrastructure/persistence/prisma/client'`
   - 查詢模型：`import { UserQuery } from '@/modules/shared/infrastructure/persistence/queries'`
   - 命令模型：`import { UserCommand } from '@/modules/shared/infrastructure/persistence/commands'`
   - 統一使用具名匯出
   - 確保類型安全，避免 any

3. **領域層規範**：
   - 禁止引用框架庫
   - 純 TypeScript 實現
   - 聚合根管理一致性
   - 領域事件驅動設計

## CQRS 數據流程

### 查詢流程 (Query)
```
[Server Component] → [QueryService] → [QueryRepository] → [Prisma Read Model]
```

### 命令流程 (Command)
```
[Server Action] → [CommandService] → [Domain Model/Service] → [CommandRepository] → [Prisma Write Model]
```

## 檔案結構規範
```
src/
├── interfaces/
│   ├── queries/     # 查詢介面
│   └── commands/    # 命令介面
├── application/
│   ├── queries/     # 查詢服務
│   └── commands/    # 命令服務
├── domain/
│   ├── models/      # 領域模型
│   ├── events/      # 領域事件
│   └── services/    # 領域服務
└── infrastructure/
    ├── persistence/
    │   ├── queries/    # 查詢儲存庫
    │   └── commands/   # 命令儲存庫
    └── prisma/         # Prisma 配置
```

## 代碼生成檢查清單
- [ ] 檔案名稱符合命名規範
- [ ] 遵循 DDD 分層架構
- [ ] 查詢與命令職責分離
- [ ] 確保 Prisma schema 對應
- [ ] 最小化客戶端代碼
- [ ] TypeScript 類型完整性
- [ ] 領域事件正確定義
- [ ] 避免跨界限上下文依賴
- [ ] 高內聚低耦合設計
- [ ] 單一職責原則 (SRP)
- [ ] 最少代碼實現 (KISS)
- [ ] 支持漸進式解耦
- [ ] 原子性操作保證
- [ ] 考慮最終一致性
- [ ] 模組可組合性

## CQRS 實作規範
1. **查詢模型（Read Model）**:
   - 專注於數據展示需求
   - 允許非規範化以優化查詢性能
   - 使用專用的查詢 DTOs

2. **命令模型（Write Model）**:
   - 嚴格遵守領域規則
   - 確保數據一致性
   - 透過領域事件通知變更

3. **數據同步**:
   - 使用領域事件同步讀寫模型
   - 允許最終一致性
   - 實作事件處理器更新查詢模型

## DDD 核心概念實踐
1. **界限上下文** (Bounded Context)：
   - 明確劃分業務邊界
   - 獨立演進與部署
   - 統一領域語言

2. **領域事件** (Domain Events)：
   - 反映業務變更
   - 觸發後續邏輯
   - 實現鬆耦合

3. **聚合設計** (Aggregate)：
   - 確保數據一致性
   - 管理實體生命週期
   - 定義交易邊界
