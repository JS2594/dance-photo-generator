PopShot V1.0.8 上传顺序

1. 解压并上传 UPLOAD_1_of_4
2. 解压并上传 UPLOAD_2_of_4
3. 解压并上传 UPLOAD_3_of_4
4. 解压并上传 UPLOAD_4_of_4
5. 确认前四批全部 Commit 成功后，最后解压上传 PUBLISH_LAST

PUBLISH_LAST 内含 version.json + service-worker.js。
只有最后上传它，V1.0.8 才正式激活并清理旧 PopShot 缓存。

不要提前上传 PUBLISH_LAST。
