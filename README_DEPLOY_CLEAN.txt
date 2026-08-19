PopShot V1.3.2 CLEAN

这是用于“清空 GitHub 仓库后重新部署”的干净基线包。

保留：
- AI-HD 实验链路
- public/assets/characters（Character 唯一正式资源）
- public/custom-combos（固定搭配唯一正式资源）
- 当前页面运行所需代码/资源

已清理：
- 历史 V1.0/V1.1/V1.2 QA / Release / Test / Fix 说明
- 根目录重复 characters / custom-combos 等旧资源目录
- macOS 元数据与临时文件
- 无引用的根目录历史文件

部署：
1. 清空旧仓库内容。
2. 解压本包。
3. 把“包内第一层全部文件和文件夹”上传到 GitHub 仓库根目录。
4. GitHub 根目录应直接看到 index.html / app.js / public / vendor 等。
5. 等 GitHub Pages 绿色部署完成后再打开页面。
