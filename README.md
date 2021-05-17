# POW

HRP (Home Resource Planning) 。**[手动狗头]**

家庭资源管理系统。



已有的功能:

- 物品录入
- 物品标签
- 物品搜索
- 物品临期 & 过期预警通知



其中支持功能支持:

- 钉钉机器人通知
- chanify 通知



未来可能支持:

- 用户注册
- 用户登录
- 用户配置通知
- imessage 通知



## 数据库表

> 需要 mysql-server 支持

   - 仓库表 (repos)
     - 存储物品

     ```sql
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
     
     ```sql
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
     
     ```sql
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
     
     ```sql
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



## 配置用户信息

修改 users 表，新增一个 **id = 1** 的用户。

```sql
INSERT INTO `users` (`id`, `name`, `username`, `password`, `dt`, `phone`, `email`, `chanify_tokens`)
VALUES
	(1, '张蛋蛋', 'zdd', NULL, '1111111111', NULL, NULL, '[]');
```

> 推送钉钉消息会 @ id = 1 的用户的手机号 (实际上，所有资源都是以 user.id = 1 的用户创建的，你也可以修改前端文件，接入用户系统)

> chanify_token 参考 [github.com/chanify/chanify/blob/main/README-zh_CN.md](http://github.com/chanify/chanify/blob/main/README-zh_CN.md)。
>
> json 字符串方式。
>
> 默认可以不配置。



## 配置 config.js

复制 `config.js.default`  > `config.js`

```bash
cp server/config.js.default server/config.js
vim config.js
```



修改 `config.js`

```js
module.exports = {
  server: {
    host: '0.0.0.0',
    port: 8002 // 监听端口
  },
  mysql: {
    arku: { // mysql 配置 p.s. arku 字段目前暂不支持修改
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: '',
      showSql: true
    }
  },
  dtRobot: { // 钉钉机器人配置
    token: 'token',
    secret: 'secret'
  },
  chanify: { // chanify 配置
    enable: false,
    uri: ''
  }
}
```



> chanify:  参考 [github.com/chanify/chanify/blob/main/README-zh_CN.md](http://github.com/chanify/chanify/blob/main/README-zh_CN.md)。
>
> 默认可以不配置



## 安装

```bash
# 安装后端依赖
cnpm install # 也可以使用 npm install

# 安装前端依赖
cd client && cnpm install

# 编译前端文件
npm run build

# 复制文件到 server public 文件夹
cp ./dist/* ../server/public
```



## 启动 (test)

```bash
node app.js
```

浏览器访问 http://127.0.0.1:8002 端口。



## 启动 (prod)

建议使用 pm2 进行管理:

```
cnpm install pm2 -g	
```



启动方式: 

```bash
cd pow
pm2 start app.js --name=pow-server
pm2 start crontab.js --name=pow-crontab # 定时任务，钉钉通知，可以不启动
```

