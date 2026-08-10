# 数独站词→页映射（v4 — 按页面权重分级的最终版）— 2026-08-09

> 作者：小K | 流程：从「数独」方向完整走 saas-keyword-research（种子词生成→SERP→量→可赢性→受众归类）
> 原则：**主站只做「数独玩家」单一受众**；词分级（大/中/小）× 页面权重（首页/栏目页/文章页）匹配分配
> 数据：69 词 SERP 实测 + 75 词搜索量（2026-08-09），🟢/🟡-A = 可赢，🟡-B/🔴 = 放弃

---

## 〇、页面权重架构（v4 核心修正）

```
P0 首页       ← 全站权重最高，押最大可赢词
P1 一级栏目页  ← /maker、/mega、/kids、/learn（教程）
P2 文章页     ← 长尾词
```

> ⚠️ v4 修正（2026-08-09 乔克审核后）：v3 把大词（hints 66.4 / mega 63.3）放在栏目页，而首页只放品牌词——权重倒挂。新站权重全堆首页，栏目页权重薄，大词必须上首页或一级栏目页。**词的大小 × 页面权重必须匹配。**

---

## 一、词分级（量 × 竞争强度）

### 大词（量高 或 Top1 权重高）

| 关键词 | 中文 | 量 | Top1 | 判定 |
|:---|:---|:---:|:---|:---:|
| sudoku hints | 数独提示 | 66.4 | angusj（老牌站） | 🟢 首页 |
| what is sudoku | 什么是数独 | 55.6 | wikipedia | 🟢 首页区块 |
| mega sudoku | 巨型数独 | 63.3 | puzzlemadness（中小站） | 🟢 一级栏目 |

### 中词

| 关键词 | 中文 | 量 | Top1 | 判定 |
|:---|:---|:---:|:---|:---:|
| sudoku maker | 数独生成器 | 42.9 | sudokumaker.app（小站） | 🟢 一级栏目 |
| sudoku guide | 数独指南 | 42.4 | conceptispuzzles（老牌） | 🟢 教程栏目 |
| sudoku logic | 数独逻辑 | 34.3 | conceptispuzzles（老牌） | 🟢 教程栏目 |
| sudoku for children | 儿童数独 | 32.0 | sudokubliss（小站） | 🟡-A 一级栏目 |
| sudoku assistant | 数独助手 | 20.6 | sudokusolver.app（小站） | 🟡-A 首页同义词 |

### 小词（长尾，文章页）

| 关键词 | 中文 | 量 |
|:---|:---|:---:|
| sudoku step by step | 数独一步一步教学 | 30.6 |
| arrow sudoku | 箭头数独 | 25.7 |
| sudoku instructions | 数独玩法说明 | 14.3 |
| sudoku solving | 数独解题技巧 | 12.7 |
| sudoku helper | 数独帮手 | 11.9 |
| consecutive sudoku | 连续数独 | 9.8 |
| sudoku patterns | 数独套路 | 7.0 |
| thermo sudoku | 温度计数独 | 2.6 |
| sandwich / greater-than / anti-knight / girandola 等 | 各变体 | 0-3 |

---

## 二、页面映射（页面 → 关键词 → 中文 → 意图）

### P0 首页

| 页面 | 关键词 | 中文 | 搜索意图 |
|:---|:---|:---|:---|
| **/** | sudoku hints（主词）+ what is sudoku（内嵌区块） | 数独提示 + 什么是数独 | 求助：玩家卡住了要线索继续自己解；首页内嵌「什么是数独」入门区块承接新手 |
| /（同页同义词） | sudoku assistant / sudoku helper | 数独助手 / 数独帮手 | 求助：不玩了，要完整解答+步骤——同页同引擎承接（提示按钮/完整解按钮，一套引擎两种粒度） |

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

## 三、排除项（不混入主站）

- ❌ 脑健康受众：brain training / anxiety / benefits——量小+受众不同
- ❌ 竞技受众：competition / world championship——量小+小众社群
- ❌ 已放弃（巨头锁死）：sudoku book、sudoku for adults、killer sudoku online、samurai sudoku、killer/jigsaw solver、sudoku for dementia/elderly、sudoku calendar、sudoku puzzle books、sudoku solver with steps/explanation（量≈0）

---

## 四、交付自检（6 项）

- [x] 1. 每个页面标题词可赢性已标注（🟢/🟡-A + Top1 域名）✅
- [x] 2. 首页/栏目页标题 = 100% 🟢 或 🟡-A，零 🟡-B ✅
- [x] 3. 🟡-B 词已单独立档（排除项）✅
- [x] 4. 排序 = 可赢性 × 量 × 页面权重匹配，无权重倒挂 ✅
- [x] 5. 每个词能回答「新站凭什么赢」（Top1 无巨头 或 差异化明确）✅
- [x] 6. 放弃清单含原因 ✅

---
*数据：/tmp/niche2_serp.json（69 词 SERP）+ /tmp/niche2_done.json（75 词量）*
