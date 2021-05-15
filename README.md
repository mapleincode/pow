# 家庭物品保质期管理系统
- 支持物品录入
- 过期物品通知
  - 支持钉钉通知
  - chanify 通知
    -  [github.com/chanify/chanify/blob/main/README-zh_CN.md](http://github.com/chanify/chanify/blob/main/README-zh_CN.md)



## 安装

1. 初始化 mysql 数据库表

   - 仓库表 (repos)
     - 存储物品

     ```
     CREATE TABLE `repos` (
       `id` int unsigned NOT NULL AUTO_INCREMENT,
       `user_id` int DEFAULT NULL,
       `name` varchar(122) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
       `labels` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
       `count` int NOT NULL DEFAULT '1',
       `count_unix` varchar(63) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '个',
       `expiration_time` int DEFAULT NULL,
       `expiration_time_unix` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `expiration_time_unix_code` tinyint(1) NOT NULL DEFAULT '0',
       `expiration_time_value` int DEFAULT NULL,
       `expiration_date` datetime NOT NULL,
       `production_date` datetime DEFAULT NULL,
       `bought_date` datetime DEFAULT NULL,
       `remark` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
       `delete_status` tinyint(1) NOT NULL DEFAULT '0',
       `created_at` datetime NOT NULL,
       `updated_at` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
       PRIMARY KEY (`id`),
       KEY `name` (`name`),
       KEY `user_id` (`user_id`),
       KEY `delete_status` (`delete_status`)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
     ```

   - 物品标签表 (repos_labels)

     - 用于记录标签频率
   
     ```
     CREATE TABLE `repos_labels` (
       `id` int unsigned NOT NULL AUTO_INCREMENT,
       `label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
       `status` tinyint NOT NULL DEFAULT '0',
       `count` int DEFAULT NULL,
       `updated_at` datetime DEFAULT NULL,
       `created_at` datetime DEFAULT NULL,
       PRIMARY KEY (`id`),
       KEY `label` (`label`),
       KEY `status` (`status`)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
     ```
   
   - 物品通知表
   
     - 记录通知
   
     ```
     CREATE TABLE `repos_notices` (
       `id` int unsigned NOT NULL AUTO_INCREMENT,
       `status` tinyint(1) NOT NULL DEFAULT '0',
       `msg` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
       `at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '',
       `level` tinyint(1) DEFAULT NULL,
       `repo_id` int NOT NULL,
       `created_at` datetime DEFAULT NULL,
       PRIMARY KEY (`id`),
       KEY `level` (`level`,`repo_id`)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
     ```
   
   - 用户表
   
     - 用户表
   
     ```
     CREATE TABLE `users` (
       `id` int unsigned NOT NULL AUTO_INCREMENT,
       `name` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `username` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `dt` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `phone` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
       `chanify_tokens` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
       PRIMARY KEY (`id`)
     ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
     ```
   



2. 安装依赖 & 编译前端文件

   ```
   cnpm install
   cd client && cnpm install && npm run build && cp ./dist/* ../server/public
   ```

   

3. 配置 config

   ```bash
   cp server/config.js.default server/config.js
   vim config.js
   ```

   

   ```json
   module.exports = {
     server: { host: '0.0.0.0', port: 8002 },
     mysql: {
       arku: {
         host: '127.0.0.1',
         port: 3306,
         username: 'root',
         password: '',
         showSql: true
       }
     },
     dtRobot: {
       token: 'token',
       secret: 'secret'
     },
     chanify: {
       enable: false,
       uri: ''
     }
   }
   ```

   sever: 监听端口

   mysql: mysql 配置

   doRobot: 钉钉机器人推送配置

   chanify:  参考 [github.com/chanify/chanify/blob/main/README-zh_CN.md](http://github.com/chanify/chanify/blob/main/README-zh_CN.md)。默认可以不配置

   

   **arku 这个字段不可修改。**

4. 在数据库配置用户信息

   修改 users 表，新增一个 **id = 1** 的用户。

   ```
   INSERT INTO `users` (`id`, `name`, `username`, `password`, `dt`, `phone`, `email`, `chanify_tokens`)
   VALUES
   	(1, '张蛋蛋', 'zdd', NULL, '1111111111', NULL, NULL, '[]');
   ```

   > 推送钉钉消息会 @ id = 1 的用户的手机号

   > chanify_token 参考 [github.com/chanify/chanify/blob/main/README-zh_CN.md](http://github.com/chanify/chanify/blob/main/README-zh_CN.md)。默认可以不配置





## Start

```bash
node app.js
```



浏览器访问 http://127.0.0.1:8002 端口。

