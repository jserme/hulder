#Hulder
Hulder是一个根据ＵＲＬ生成自动占位图的小工具

##安装
git clone xxxx
npm install

node server.js

##图片生成器
http://localhost:8325/400:300

##示例

###宽400高300的图
http://localhost:8325?img={w:400,h:300}

###宽400高300的图 黑色图，白色字
http://localhost:8325?img={bc:'#000', fc:'#fff', w:400, h:300}

###宽400高300的图 黑色图，白色字
http://localhost:8325?img={bc:'#000', fc:'#fff', w:400, h:300, t:'我是文字'}
