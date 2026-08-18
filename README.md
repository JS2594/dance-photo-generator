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
