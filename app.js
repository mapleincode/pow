
/**
 * @Author: maple
 * @Date: 2019-12-16 14:46:04
 * @LastEditors: maple
 * @LastEditTime: 2021-05-15 19:48:31
 */
'use strict';

const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const path = require('path');
const onerror = require('koa-onerror');
const koaLogger = require('koa-logger');
const session = require('koa-session');

const app = new Koa({ proxy: true });
const router = require('./server/router');
const config = require('./server/config');
const logger = require('./server/libs/logger');
const JsonBody = require('./server/middleware/json-body');
const onError = require('./server/middleware/json-body-on-error');
const sessionConfig = require('./server/middleware/session-config');
const loginCheck = require('./server/middleware/login-check');

app.keys = ['diwiojsahgciwiowioowlsl'];

app.context.logger = logger;
onerror(app, onError);

app.use(JsonBody);
app.use(session(sessionConfig, app));
app.use(loginCheck);
app.use(koaBody({ multipart: true }));
app.use(koaLogger());
app.use(router.routes(), router.allowMethods);
app.use(koaStatic(path.join(__dirname, 'server/public')));

app.listen(config.server.port);
logger.info(`app listen on http://${config.server.host}:${config.server.port}`);
