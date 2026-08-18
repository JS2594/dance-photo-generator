# PopShot V17 Mobile Demo

本版按确认后的手机 Demo 重构，目标是让小白用户直接使用。

## 默认流程
上传课后合照 → 选择课程 → 基础美化 → 一键生成 → 默认成品组合。

## 关键规则
- 默认优先显示「成品组合」。
- 成品组合出现时，不额外叠加自定义 Q 版人物和课程文字。
- 「组合」中可切换：成品组合（推荐） / 自定义组合。
- 成品组合只调整整体大小；自定义组合可选择 Q 版人物、课程字样并拖动/缩放。
- 首页保留四个课程：Lelepop / ButtScaler / ZUMBA / ZUMBA CAMP。
- 基础美化固定单行横向滑动，不换行。
- 主操作区为：组合 / 相框 / 贴纸 / 调整照片 / 更多。
- 所有主要按钮扩大手机点击区域。
- 输出画布仍为 2525 × 1894。

## 后续人工替换成品组合
直接替换以下目录中的 PNG，文件名保持不变即可：
- public/custom-combos/lelepop/
- public/custom-combos/buttscaler/
- public/custom-combos/zumba/
- public/custom-combos/zumba-camp/

不需要自己拼接代码。

## V17.0.1 Compact
这是 GitHub 网页上传精简包。

- 贴纸功能没有删除：所有贴纸 SVG 已经内嵌到 `app.js`，不再作为几十个独立文件上传。
- Q版人物 PNG 保留。
- `public/custom-combos/` 成品组合 PNG 保留，之后仍可直接人工替换。
- 网页功能与 V17 Mobile Demo 保持一致。
- 目标：解压后全部文件一次拖入 GitHub，不触发“fewer than 100 files”提示。
