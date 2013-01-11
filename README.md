#Hulder
Hulder是一个根据URL生成自动占位图的小工具

##安装
git clone https://github.com/jserme/hulder.git 

npm install

* 如果出错, 请安装cairo http://cairographics.org/

##运行
node app.js

###开发时
node dev_app.js //监控js更改，实时重启

##图片生成器
http://localhost:8325/400x300

##示例

###宽400高300的图
http://localhost:8325/400x300

###宽400高300的图 黑色图，白色字
http://localhost:8325/400x300/fffx000

###宽400高300的图 黑色图，白色字
http://localhost:8325/400x300/fffx000/我是文字
