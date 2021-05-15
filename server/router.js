/**
 * @Author: maple
 * @Date: 2019-12-16 15:16:13
 * @LastEditors: maple
 * @LastEditTime: 2021-05-15 19:11:40
 */
'use strict';

const Router = require('@koa/router');
const router = new Router();

const Repos = require('./constroller/repos');

module.exports = router;

// User
// router.post('/user/login', User.login);
// router.post('/user/logout', User.logout);
// router.get('/users', User.list);

// repos
router.get('/repo/list', Repos.list);
router.post('/repo/item', Repos.create);
router.delete('/repo/item', Repos.delete);
router.put('/repo/item', Repos.modify);
