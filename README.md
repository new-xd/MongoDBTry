# 目的
此项目用于尝试mongoDB的数据库操作

# 简单的场景  
课程学习数据库，有用户（user），有课程（course），有用户学习的状态（courseStatus）

# 数据操作
- 更新或者插入子文档 updateUserCourse
- 获取某个子文档 getCourseStatus
- 获取某个子文档和引用的文档 getCourseDetails

# 其他
这个工程基于[express-mongoose-es6-rest-api](https://github.com/KunalKapadia/express-mongoose-es6-rest-api)

注意先启动数据库，再npm start，我的数据库用npm run db启动，路径是上级的db目录，不同位置，需要修改package.json。

    // console 1
    npm run db

    // console 2, if you need
    node-inspector

    // console 3
    npm start