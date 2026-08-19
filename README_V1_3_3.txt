PopShot V1.3.3
- 固定搭配改为运行时读取 public/custom-combos/custom-combos.json。
- Character 继续固定使用 public/assets/characters。
- AI-HD 删除 1152px 预缩图：直接从原始 Target3 裁剪区域逐 tile 推理。
- 模型 tile 仍保持 64px（匹配当前 Real-CUGAN 64 模型），通过顺序 tile 控制内存。
- 默认构图进一步收紧到 1.76，减少天花板/地面，让人物更大。
- AI 输出最高允许 2560px 宽。
