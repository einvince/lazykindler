# Lazy Kindler
<br>

<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">


# ✨ 特性

- 🌈 书籍导入，并以高效的方式展示书籍列表。
- 💅 创建合集，比如科幻小说集合、武侠小说集合。
- 🚀 多维度展示，可以从书名、作者、评分、集合、标签等多维度展示书籍列表。
- 🛡 搜索书籍，可以从书名、作者、出版社等任何一个关键词搜索相关书籍。
- 📦 下载书籍，可以右键菜单下载书籍，也可以下载平台管理的所有书籍。
- 🛡 书籍阅读，平台支持书籍阅读功能。
- 📦 备份功能，平台数据库采用了 `sqlite3`，并且所有书籍都放在了指定目录，十分适合备份。
- 🎻 高亮笔记，电脑连接 `kindle` 后，平台可以自动导入高亮笔记。
- 📣 高亮笔记，安卓平台支持导入 `静读天下apk` 导出的笔记文件。
- 🎺 高亮笔记，支持对导入平台的高亮笔记做`二次高亮`、`二次高亮删除`。
- 🥁 高亮笔记，平台支持对高亮笔记添加评论。
- 🎻 高亮笔记，可以创建集合并对高亮笔记进行分类管理。
- 🚀 kindle生词本，"生词本"是kindle的一个功能, 平台支持导入kindle生词本中的书籍、单词和用例。

# 支持的平台

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目前只适配了 `mac` 平台，在 `windows` 平台运行会有未知错误。

# 支持的电子书类型

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mobi 和 azw3。其他类型的电子书在导入时会自动被忽略。

# 解决的问题

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;从网上下载了**数千本**电子书以后，如何高效的管理这些电子书？
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;各种电子书的质量参差不齐，有普通作家写的，也有世界大文豪写的。种类也很多，有科幻类、言情类、玄幻类型等等。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果每次找书都在一个包含了几千本书的目录里查找，想想都脑壳疼。因此有必要对这些电子书使用恰当的方式管理起来，方便我们使用特定的偏好在一个小范围里查找电子书，从而快速找到希望寻找的书籍，避免浪费过多查找时间。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lazykindler`因此横空出世。

# 功能介绍

## 1. 书籍导入

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击`上传文件`按钮，平台将递归扫描 `~/Download`、`~/下载`、`~/Desktop`、`~/桌面` 等目录下受支持的电子书文件。相同文件不会重复上传。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目前仅支持导入 `mobi` 和 `azw3` 格式的电子书, 平台不提供电子书格式转换功能。其实要找指定格式的电子书很容易，我一般在这个网站找电子书 http://www.fast8.com 。 这个网站的好处是书籍全，同时下载时提供了多种格式选择，直接下载指定格式的书籍即可。

## 2. 给书籍添加元数据
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可以对书籍执行 修改评分、标签、集合、作者、出版社、封面 等操作。需要注意的是这些操作并不会真正去修改书籍文件本身，而是在数据库添加记录。

## 3. 书籍信息解析

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;导入电子书以后，平台会自动从电子书文件里提取数据用于信息展示和书籍管理。

## 4. 集合

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可以创建书籍的集合，比如 `科幻小书集合`、`奇幻小说集合`、`言情小说集合`等等，并给集合添加自己喜欢的有代表性的封面，可以给集合`打分`、`添加标签`。每个集合都可以从书库中选择并添加书籍，还可以对集合进行打分、添加标签、添加封面等等操作。当我们有了多个集合，以后可以直接从这些集合中寻找书籍。

## 5. 展示

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了支持从不同维度展示书籍，我们可以给书籍`打分`和`添加标签`，还可以`修改作者`以及`修改出版社`，书籍可以从`评分`、`标签`、`作者`、`出版社`等不同维度进行展示。另外还可以`修改书籍封面`。

## 6. 下载

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台里的书籍都可以在书籍卡片的`操作`里点击`下载`，然后书籍会被下载并存放到用户主目录的 `下载` 或者 `Download`。在平台首页点击`下载所有书籍`会把书籍下载到用户主目录的`文稿` 或者 `Documents`下的 `lazykindler`目录。多次点击`下载所有书籍`并不会重复下载已经存在的书籍。

## 7. 阅读

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台提供了阅读书籍的基本功能。目前我没有找到使用 `reactjs` 实现的阅读`mobi`和`azw3`这两种格式电子书的库，因此在第一次点击`阅读书籍`的按钮时，平台会把这两种格式转换为 `epub`格式，使用的工具是 `/Applications/calibre.app/Contents/MacOS/ebook-convert`，因此使用平台时要求电脑要安装 `calibre`，否则阅读书籍功能将无法正常工作。只有在第一次点击`阅读书籍`时涉及格式转换，此时页面可能出现短暂的无法响应的问题，这是正常的，等待时间和电子书大小相关，一般都很快，后面再次打开就快了。转换后的书籍被存放到了平台主目录下的 `backend/data`。
<br />

## 8. 处理流程

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在 `书籍 -> 书库` 页面下展示的书籍属于正式存储的书籍，刚导入的书籍会被展示在 `书籍 -> 临时` 页面。(除了页面上位置的区分，正式的和临时的书籍在后台没有多大区别)。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`临时`书籍被添加到任意集合以后，会从`书籍 -> 临时` 转移到 `书籍 -> 书库` 。这样做的目的是**区分正式存储的书籍和临时导入的书籍。正式存储的书籍经过了筛选，删掉了不喜欢的书籍，并且进行了分类，而临时导入的书籍一般五花八门。**

## 9. 备份

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数据库采用的是 `sqlite3`，位置是 `backend/lazykindler.db`。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;初次启动平台时，会自动创建并初始化该数据库文件。该文件包含了平台除书籍外的其余所有数据信息。往平台导入的书籍被复制到了 `backend/data` 目录下。需要注意的是，为了方便平台内部操作，`backend/data` 目录下的书籍名后面都被添加了 书籍的`md5`值。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果要对平台里所有书籍以及数据进行备份，只需要保存 `backend/lazykindler.db` 和 `backend/data` ，下次在其他地方启动服务前，把`backend/lazykindler.db` 和 `backend/data` 复制到对应位置即可。

## 10. 导入 kindle 高亮笔记

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这个功能目前只支持 mac 平台。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;平台会自动检测 `kindle` 是否连接，`kindle` 连接电脑后，平台会把 `kindle` 的 `My Clippings.txt` 导入到系统，用于统一管理和多维度展示。当 `kindle` 的 `My Clippings.txt` 文件发生变化，平台会自动导入 `My Clippings.txt` 里新增的部分，旧的数据不会重复导入。用户只要在在电脑连接`kindle`后刷新一下页面就可以看到新增内容了。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;需要指出的是，`kindle` 会把用户添加的高亮笔记处理成一坨没有换行的文字，即使这是多个段落的内容。`layerkindler` 通过巧妙的方式，在导入 `kindle` 的 `My Clippings.txt`文件时，自动识别并进行了换行处理，如下所示。

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">


## 11. 对高亮笔记进行二次高亮操作

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高亮笔记是我们在读书时对有感触的文字进行高亮操作后记录下来的部分文字或者相关段落，往往是因为其中一句话或者一个词对我们有某种触动。当我们把高亮笔记导入平台后，在后期整理时，有必要对当时引起你共鸣的句或词进行高亮操作，方便高亮显示引起你共鸣那一小段文字。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用 `lazykindler`，你可以很轻易的做二次高亮操作。只要选中相关文字，接着在自动弹出的对话框里点击`确定`即可。

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. 对高亮笔记添加评论

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可以记录一下引起你共鸣的这段文字的一些想法。

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">


## 13. 导入 静读天下 apk 高亮笔记

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`静读天下apk`是一个安卓平台较为流行的阅读器，目前我在海信阅读器上使用这款软件看书，该软件也支持添加高亮笔记。于是我对该软件高亮笔记的导入也做了支持。
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;从`静读天下apk`导出的高亮笔记文件的格式是`.mrexpt`。将该文件放在`~/Download`、`~/下载`、`~/Desktop`、`~/桌面` 等任何一个目录下，平台可以自动完成导入操作。



## 14. 导入 kindle 生词本
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;生词本是kindle中的一个功能，用于记录阅读书籍过程查询过的字或者词，通过这种方式阅读英文原版书籍记录单词，后续可以用来学习和复习这些单词。平台支持导入这些生词。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在支持导入这些生词的基础上，平台提供了良好的界面用于展示这些信息，还可以手动创建生词和用例，同时可以给用例增加翻译。

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">
<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550-8c321a41-7df4-41af-9bd0-fd765e113a1f.png">


# 运行环境要求

`python 3.10.4` 

`nodejs v19.6.0`

`Calibre`

其他版本未经测试

# 启动服务

## 安装依赖

1. 在 `backend` 目录执行
```
pip3 install -r requirements.txt
```
2. 在 `frontend` 目录执行

```
yarn install
```

## 启动服务

```
./start.sh
```

然后浏览器访问 http://localhost:8000

## 停止服务

```
./stop.sh
```

## 注意

平台仅为个人设计，没有登陆注册等功能。

# 平台展示

下面是我本地自己上传了书籍并配置了集合后的截图

<img width="1418" alt="1" src="https://user-images.githubusercontent.com/16133390/216806475-97ee4960-40cc-4649-b414-0687724bb6ad.png">
<br />
<img width="1398" alt="Xnip2023-02-05_15-13-49" src="https://user-images.githubusercontent.com/16133390/216806612-dc1baf4f-7ed5-4b3d-ab44-73c7f07c73a7.png">
<br />
<img width="1418" alt="2" src="https://user-images.githubusercontent.com/16133390/216806480-def76f45-f8ba-41fc-9512-a448e9fbce32.png">
<br />
<img width="1418" alt="3" src="https://user-images.githubusercontent.com/16133390/216806485-caf74fe2-0cef-45f8-9a29-47780e72132d.png">
<br />
<img width="1799" alt="Xnip2023-02-14_12-36-20" src="https://user-images.githubusercontent.com/16133390/218640667-ba74048a-3b78-41c6-a772-dc1e56485b56.png">

<br />
<img width="1801" alt="Xnip2023-02-14_12-36-38" src="https://user-images.githubusercontent.com/16133390/218640680-263195c2-7ac3-4947-b7a5-b70375074e9c.png">

<br />

# 其他

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用于 `kindle` 的相关工具最有名的应该是 `calibre`，但是这个软件的功能偏向于 "编辑"，对于电子书的多维度展示做的相对简陋，因此打算自己写一个贴合实际需求的专门用来管理电子书的工具。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;目前正在抽空开发，如果您也喜欢看电子书，并且对管理电子书有功能建议，不妨提一下 issue。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有任何使用上的问题或者功能需求，请联系作者，邮箱: wupengcn301@gmail.com，微信: leowucn。谢谢
