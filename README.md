# PopShot V1.3.4 CLEAN RESET

这是用于完全清空 GitHub 仓库后重新部署的唯一干净基线。

## 根目录只应看到
- index.html
- app.js
- styles.css
- manifest.webmanifest
- popshot-config.json
- service-worker.js
- version.json
- README.md
- public/
- vendor/

## 正式资源路径
- Character: `public/assets/characters/`
- 固定搭配: `public/custom-combos/`
- 固定搭配清单: `public/custom-combos/custom-combos.json`

禁止再保留根目录旧的：
`assets/`、`characters/`、`custom-combos/`、`icons/`、`sticker-library/`

当前资源检查：
- Character PNG: 47
- 固定搭配 PNG: 21
- 缺失静态引用: 0

部署方法：
1. 删除旧仓库全部文件。
2. 解压 `PopShot_V1_3_4_CLEAN_RESET_FULL.zip`。
3. 将解压后第一层的所有文件/文件夹一次性上传到 GitHub 仓库根目录。
4. 等 GitHub Pages 部署完成。
5. 先在浏览器确认页面明确显示 v1.3.4。
6. 再删除手机旧 PWA / 站点缓存并重新添加到主屏幕。
