# 数独站最终方案（v4 — 页面权重分级版）— 2026-08-09

> 作者：小K | 流程：从「数独」方向完整走 saas-keyword-research（种子词生成→SERP→量→可赢性→受众归类）
> 原则：**主站只做「数独玩家」单一受众**；词分级（大/中/小）× 页面权重（首页/栏目页/文章页）匹配
> 数据：69 词 SERP 实测 + 75 词搜索量（2026-08-09），🟢/🟡-A = 可赢，🟡-B/🔴 = 放弃

---

## 〇、页面权重架构（v4 核心修正）

```
P0 首页       ← 全站权重最高，押最大可赢词 sudoku hints
P1 一级栏目页  ← /maker、/mega、/kids、/learn（教程）
P2 文章页     ← 长尾词
```

> ⚠️ v4 修正（2026-08-09 乔克审核后）：v3 把大词（hints 66.4 / mega 63.3）放在栏目页、首页只放品牌词——权重倒挂。新站权重全堆首页，**词的大小 × 页面权重必须匹配**：大词上首页/一级栏目，小词上文章页。

---

## 一、受众判定

### 可赢词按受众归类：

| 受众 | 词数 | 代表词（量） | 判定 |
|------|:---:|------|:---:|
| **🎯 数独玩家**（新手→进阶→变体，同一群人） | 24 | hints 66.4 / mega 63.3 / what is 55.6 / maker 42.9 | ✅ **主站受众** |
| 🧒 教育人群（教师/学生/儿童） | 18 | children 32.0 / students 26.0 / classroom 17.0 | ❌ 不单独做站（/kids 顺带覆盖 children） |
| 🧠 脑健康人群 | 4 | brain training 4.1 / anxiety 1.9 | ❌ 量小+受众不同，放弃 |
| 🏆 竞技人群 | 3 | competition 20.6 / world championship 5.5 | ❌ 小众社群，P3 以后 |

**主站定位：数独玩家——从「第一次玩」（what is sudoku）到「卡住了要提示」（hints）到「玩腻了换变体」（mega/arrow）是同一群人的完整旅程，受众纯净。**

### 站点核心叙事（2026-08-09 乔克确认）：「教你玩数独的地方」

首页押 hints（数独提示）不只是权重最优，**它把全站串成一条「学数独」旅程**：

```
「什么是数独」→ 启蒙（学）
「卡住了要提示」→ 解题中学（hints = 即时教学，给线索不给答案）
「去 /learn 学技巧」→ 系统学（数独指南、数独逻辑）
「去 /maker 自己出题」→ 实践（生成题练手）
```

**不是散落的「一堆工具」，而是有教学主张的垂直站**：E-E-A-T 加分、停留/回访双循环（学完回来玩、玩卡了回来学）、内链天然闭环（hints 提示技巧名 → 链 /learn 教程；教程读完 → CTA 回首页玩 / 去 /maker 出题）。

---

## 二、页面映射（页面 → 关键词 → 中文 → 意图）

### P0 首页

| 页面 | 关键词 | 中文 | 搜索意图 |
|:---|:---|:---|:---|
| **/** | sudoku hints（主词）+ what is sudoku（内嵌区块） | 数独提示 + 什么是数独 | 求助：玩家卡住了要线索继续自己解；首页内嵌「什么是数独」入门区块承接新手 |
| /（同页同义词） | sudoku assistant / sudoku helper | 数独助手 / 数独帮手 | 求助：不玩了，要完整解答+步骤——同页双模式承接 |

> **首页 = 解题助手工具本体**：输入盘面 → 模式A「提示」（给一条线索，保留解题体验）/ 模式B「完整解」（直接给答案+步骤）。一页承接 hints(66.4)+assistant(20.6)+helper(11.9) = 98.9 可赢量。

### P1 一级栏目页（4 个）

| 页面 | 关键词 | 中文 | 搜索意图 |
|:---|:---|:---|:---|
| **/maker** | sudoku maker | 数独生成器 | 生成+玩：用户自己造题 → 生成后在线自己解（玩）→ 不想在线就打印玩。**「造 → 解 → 玩/打印」完整闭环一页承接** |
| **/mega** | mega sudoku | 巨型数独 | 娱乐：玩家玩 16x16 大棋盘，选难度计时 |
| **/kids** | sudoku for children | 儿童数独 | 家长主导：给孩子玩，4x4/6x6 简化棋盘 |
| **/learn** | sudoku guide + sudoku logic | 数独指南 + 数独逻辑 | 学习：新手搞懂数独（教程栏目页，两个词同押） |

### P2 文章页（长尾）

| 文章 | 关键词 | 中文 | 意图 |
|:---|:---|:---|:---|
| Sudoku Step by Step: Your First Solved Puzzle | sudoku step by step | 数独一步一步教学 | 学习：跟着解一题 |
| Arrow Sudoku: Rules and How to Play | arrow sudoku | 箭头数独 | 学习+试玩 |
| Sudoku Instructions for Complete Beginners | sudoku instructions | 数独玩法说明 | 学习 |
| Sudoku Solving Techniques: From Beginner to Pro | sudoku solving | 数独解题技巧 | 学习 |
| Consecutive Sudoku: The Hidden Sequence Variant | consecutive sudoku | 连续数独 | 学习+试玩 |
| Sudoku Patterns: The Visual Shortcuts Experts Use | sudoku patterns | 数独套路 | 学习 |
| Thermo Sudoku: Following the Heat | thermo sudoku | 温度计数独 | 学习+试玩 |
| Sandwich / Greater-Than / Anti-Knight / Girandola 系列 | 各变体词 | 三明治等变体 | 学习+试玩 |

---

## 三、功能开发规格（2026-08-09 乔克确认）

### 首页 /（解题提示工具）——最复杂，双输入 + 一套引擎

**输入方式（两种都要）：**
- 📷 **上传图片**：访客拍照/截图手上的数独 → 自动识别盘面（OCR）
- ⌨️ **手动输入**：访客点击格子手动填数（或逐格录入）

**输出：一套求解引擎，两种输出粒度（2026-08-09 乔克修正——不开发两套）**
- 「提示」按钮：给 1 条线索（下一格/候选数/技巧名）→ 用户继续自己解，**可连续点**，点一次给一条
- 「完整解」按钮：一次给全部答案 + 逐步推理

> 本质是**同一个求解引擎**，只是「给多少」不同：提示 = 一次给 1 条（手动逐步），完整解 = 一次给全部（自动）。**一个引擎、两种按钮，不是两套功能。**

> 双输入是为了适配「手上有题」的所有场景：报纸/书/别的游戏里卡住的，拍照传上来就能解；截图或纯数字的，手动填也行。

### /maker（生成 + 玩 + 打印）——单生成 + 批量打印

- **生成：每次只生成 1 个**（选难度：易/中/难/专家）
- **换题**：想玩下一个 → 点「New Game / 重新生成」（重新生成一个）
- **在线玩**：生成的棋盘直接可玩（自己解）
- **打印：批量打印**——可选择打印数量（1 / 2 / 3 / 4 / 自定义），一次打印多份，可选含答案页

> 生成逻辑：单次生成一个（不一次生成一堆），玩完想换再 New Game；打印才是批量场景（多份带走/分发给多人）。

### /mega、/kids、/learn——按字面意思开发

- **/mega**：16x16 大棋盘在线玩，选难度计时
- **/kids**：4x4/6x6 简化棋盘，大图标可爱主题
- **/learn**：教程栏目，数独指南 + 数独逻辑两个板块

---

## 四、搜索意图拆解（工具页用户下一步动作）

| 页面 | 搜索意图 | 用户下一步动作 | 页面设计含义 |
|------|:---:|:---|:---|
| /（首页=hints） | 求助：卡住了要提示 | 输入盘面 → 模式A 拿下一步提示 / 模式B 拿完整解答 | 双模式一页承接 hints+assistant+helper；棋盘输入（手动/拍照）+ 逐步提示 |
| /maker | 生成定制谜题 + 自己玩 | **造 → 解 → 玩/打印**：生成谜题 → 在线棋盘自己解（玩）→ 不想在线就打印玩 | 生成后**棋盘直接可玩**（在线自解），另给「打印 PDF」出口；两个出口都必须在，不能只做一个 |
| /mega | 直接玩大棋盘 | 选难度 → 开玩 → 计时/完成 | 纯游戏页：零摩擦开局，注册/收费放游戏后 |
| /kids | 给孩子玩（家长主导） | 选 4x4/6x6 → 陪玩 | 大图标、可爱主题、无干扰 |
| /learn | 学习数独 | 读教程 → 去玩（CTA /maker /mega） | 教程栏目：指南+逻辑两个板块，内链闭环 |

> **hints vs solver 意图辨析**：`hints`（66.4 🟢）=「给我一点点提示继续自己解」；`solver with steps`（≈0 🟡）=「直接给完整答案」——量≈0 不做单独页；`assistant`（20.6）+`helper`（11.9）= 中间地带「帮我解」，由首页模式B 承接。**solver 纯词没量不单独做页。**

> **maker 意图分裂**：Top3 = sudokumaker.app（生成+导出）/ sudoku9x9（在线玩）/ amuselabs（双支持）——用户需求分裂，**不能押单一出口**。

---

## 四、排除项（不混入主站）

- ❌ 脑健康受众：brain training / anxiety / benefits——量小+受众不同
- ❌ 竞技受众：competition / world championship——量小+小众社群
- ❌ 已放弃（巨头锁死）：sudoku book、sudoku for adults、killer sudoku online、samurai sudoku、killer/jigsaw solver、sudoku for dementia/elderly、sudoku calendar、sudoku puzzle books、sudoku solver with steps/explanation（量≈0）

---

## 五、开发顺序建议

### Phase 1（MVP，上线即做）
1. **首页 = 解题提示工具**（hints 66.4 大词，双模式：提示 + 完整解）——纯解题，不带玩
2. **/maker 生成+玩闭环页**（42.9，生成 → 在线棋盘自解 → 打印 PDF）
3. **/mega 巨型数独玩法页**（63.3）
4. **/kids 儿童数独玩法页**（32.0，4x4/6x6）
5. **/learn 教程栏目页**（guide 42.4 + logic 34.3 两个板块）
6. 首页「什么是数独」区块（what is sudoku 55.6）

### Phase 2（快速跟进）
- 长尾文章（step by step / arrow / consecutive / thermo / instructions / solving / patterns / sandwich 等）
- 内链网络：文章 ↔ 栏目页 ↔ 首页互相引用

### Phase 3（储备）
- 竞技内容（competition / world championship）——P3，量小不急
- 脑健康内容——已放弃

---

## 六、交付自检（6 项）

- [x] 1. 每个页面标题词可赢性已标注（🟢/🟡-A + Top1 域名）✅
- [x] 2. 首页/栏目页标题 = 100% 🟢 或 🟡-A，零 🟡-B ✅
- [x] 3. 🟡-B 词已单独立档（§四排除项）✅
- [x] 4. 排序 = 可赢性 × 量 × 页面权重匹配，无权重倒挂 ✅
- [x] 5. 每个词能回答「新站凭什么赢」（Top1 无巨头 或 差异化明确）✅
- [x] 6. 放弃清单含原因 ✅

---
*数据：/tmp/niche2_serp.json（69 词 SERP）+ /tmp/niche2_done.json（75 词量）*
*关联：知识库 `2026-08-09-new-site-cold-start.md`（3 类页面 + 90 天节奏）*
