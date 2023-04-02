🌍
*[简体中文](README-zh.md) ∙ [繁體中文](README-zh-Hant.md)∙ [Русский](README-ru.md)∙ [Português](README-pt.md)∙ [한국어](README-ko.md)∙ [日本語](README-ja.md)∙ [Bahasa Indonesia](README-id.md)∙ [Français](README-fr.md)∙ [Deutsch](README-de.md)


<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# Lazy Kindler

# ✨ Features

- 🌈 Import books and display the book list efficiently.
- 💅 Create collections, such as a collection of sci-fi novels or martial arts novels.
- 🚀 Multi-dimensional display, show book list by title, author, rating, collection, tags, etc.
- 🛡 Search for books using any keyword, such as title, author, or publisher.
- 📦 Download books, either through right-click context menu or by downloading all books managed by the platform.
- 🛡 Book reading, the platform supports a book reading feature.
- 📦 Backup function, the platform uses `sqlite3` for the database and stores all books in a designated directory, making it easy to backup.
- 🎻 Import highlighted notes automatically when connecting the computer to `kindle`.
- 📣 Import highlighted notes from the `静读天下apk` (Jing Du Tian Xia) on Android devices.
- 🎺 Highlighted notes, supports `secondary highlighting` and `secondary highlighting deletion` for imported notes.
- 🥁 Add comments to highlighted notes.
- 🎻 Create collections for highlighted notes and manage them categorically.
- 🚀 Kindle Vocabulary Builder, the platform supports importing books, words, and examples from the kindle vocabulary builder.

# Supported Platforms

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Currently only adapted for the `mac` platform, there may be unknown errors when running on the `windows` platform.

# Supported eBook Formats

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;mobi and azw3. Other types of eBooks will be automatically ignored during import.

# Problem Solved

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After downloading **thousands** of eBooks from the internet, how do you efficiently manage them?
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The quality of various eBooks varies greatly, some written by ordinary authors and others by world-renowned writers. There are also many different genres, such as sci-fi, romance, fantasy, and more.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you have to search for a book in a directory containing thousands of books each time, it's headache-inducing. Therefore, it's necessary to manage these eBooks in an appropriate way, allowing us to search for books within a smaller range based on specific preferences, quickly find the desired book, and avoid wasting too much time on searching.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lazykindler` is born for this purpose.

# Feature Introduction

## 1. Book Import

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Click the `Upload File` button, and the platform will recursively scan supported eBook files in directories like `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc. Duplicate files will not be uploaded again.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Currently, only `mobi` and `azw3` formats are supported for import, and the platform does not provide an eBook format conversion feature. It's easy to find eBooks in specific formats; I usually find them on this website: http://www.fast8.com. The advantage of this site is that it offers a wide selection of books, and multiple format options are available when downloading. Simply download the books in the desired format.

## 2. Add Metadata to Books

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can modify the book's rating, tags, collection, author, publisher, and cover. Note that these operations will not actually modify the book file itself but will add records to the database.

## 3. Book Information Parsing

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After importing eBooks, the platform will automatically extract data from the eBook files for information display and book management.

## 4. Collections

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can create collections of books, such as `Science Fiction Collection`, `Fantasy Novel Collection`, `Romance Novel Collection`, and so on. Add representative covers to the collections you like, and you can `rate` and `add tags` to the collections. Each collection can have books selected and added from the library, and you can also rate, add tags, and add covers to the collections. Once you have multiple collections, you can search for books directly from these collections in the future.

## 5. Display

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To support displaying books from different dimensions, you can `rate` and `add tags` to books, as well as `modify authors` and `modify publishers`. Books can be displayed from various dimensions such as `rating`, `tags`, `author`, and `publisher`. Additionally, you can `modify the book cover`.

## 6. Download

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Books in the platform can be downloaded by clicking the `Download` button in the `Operation` section of the book card. The downloaded books will be saved in the user's home directory under `Download` or `下载`. Clicking `Download All Books` on the homepage will download all books to the `Documents` or `文稿` folder under the `lazykindler` directory in the user's home directory. Clicking `Download All Books` multiple times will not re-download existing books.

## 7. Reading

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The platform provides basic functions for reading books. Currently, I have not found a library to implement reading `mobi` and `azw3` formats using `reactjs`. Therefore, when clicking the `Read Book` button for the first time, the platform will convert these two formats to `epub` format. The tool used for conversion is `/Applications/calibre.app/Contents/MacOS/ebook-convert`, so the computer needs to have `calibre` installed to use the book reading function properly. The conversion is only required the first time you click `Read Book`. The page may become unresponsive for a short period, which is normal. The waiting time depends on the size of the e-book, but it's usually fast. Converted books are stored in the `backend/data` directory of the main platform.
<br />

## 8. Processing Workflow

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The books displayed on the `Books -> Library` page are officially stored books, while newly imported books are displayed on the `Books -> Temporary` page. (Other than the difference in page locations, there is not much difference between official and temporary books in the backend).
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;After a `temporary` book is added to any collection, it will be moved from `Books -> Temporary` to `Books -> Library`. The purpose of this is to **distinguish between officially stored books and temporarily imported books. Officially stored books have been filtered, unwanted books removed, and categorized, while temporarily imported books tend to be diverse.**

## 9. Backup

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The database used is `sqlite3`, located at `backend/lazykindler.db`.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;When the platform is first launched, the database file will be automatically created and initialized. This file contains all data information in the platform except for the books. Imported books are copied to the `backend/data` directory. Note that for easier internal platform operation, the book names in the `backend/data` directory are appended with the book's `md5` value.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To back up all books and data in the platform, simply save `backend/lazykindler.db` and `backend/data`. To start the service in another location next time, copy `backend/lazykindler.db` and `backend/data` to the corresponding positions.

## 10. Import Kindle highlights

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;This feature is currently only supported on the Mac platform.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The platform will automatically detect whether the `kindle` is connected. When the `kindle` is connected to the computer, the platform will import the `My Clippings.txt` file from the `kindle` for unified management and multi-dimensional display. When the `kindle`'s `My Clippings.txt` file changes, the platform will automatically import the newly added content in `My Clippings.txt`, and the old data will not be imported repeatedly. Users can see the newly added content by refreshing the page after connecting the `kindle` to the computer.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;It should be noted that the `kindle` processes the user-added highlight notes into a chunk of text without line breaks, even if it is the content of multiple paragraphs. `lazykindler` cleverly recognizes and processes line breaks when importing the `kindle`'s `My Clippings.txt` file, as shown below.

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">

## 11. Perform secondary highlighting on highlighted notes

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Highlighted notes are part of the text or related paragraphs that we highlight and record when reading a book, often because a sentence or a word in it has a certain impact on us. After importing the highlighted notes into the platform, it is necessary to highlight the sentences or words that resonated with you at that time during the subsequent sorting process, making it easier to highlight and display that small section of text that resonated with you.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Using `lazykindler`, you can easily perform secondary highlighting. Just select the relevant text and click `OK` in the automatically popped-up dialog box.

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. Add comments to highlighted notes

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;You can record some thoughts about the text that resonated with you.

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">

## 13. Import highlights from Jingdu Tianxia apk

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`Jingdu Tianxia apk` is a popular reader on the Android platform. I currently use this software to read books on Hisense e-reader, and the software also supports adding highlighted notes. So I added support for importing highlighted notes from this software.
<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The format of the highlighted notes file exported from `Jingdu Tianxia apk` is `.mrexpt`. Place this file in any directory such as `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc., and the platform can automatically complete the import operation.

## 14. Import Kindle Vocabulary Builder

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Vocabulary Builder is a feature in Kindle that records words or phrases looked up while reading a book. This method can be used to read English original books and record words, which can be used for learning and reviewing these words later. The platform supports importing these vocabularies.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Based on importing these vocabularies, the platform provides a good interface for displaying this information, and you can manually create vocabulary and examples, as well as add translations to examples.

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">
<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550-8c321a41-7df4-41af-9bd0-fd765e113a1f.png">

# System Requirements

`python 3.10.4`

`nodejs v19.6.0`

`Calibre`

Other versions are untested

# Start the Service

## Install Dependencies

1. Execute in `backend` directory

```
pip3 install -r requirements.txt
```

2. If you need to use the `chatgpt` feature, please configure the `chatgpt` key in `backend/config.ini`. The address to generate the key on the OpenAi official website is `https://platform.openai.com/account/api-keys`.

3. Execute in `frontend` directory

```
yarn install
```

## Start the Service

```
./start.sh
```

Then visit http://localhost:8000 in your browser

## Stop the Service

```
./stop.sh
```

## Note

The platform is designed for individuals and does not have features like login and registration.

# Platform Showcase

Below are screenshots of my local setup after uploading books and configuring collections

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

# Other

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The most famous tool for `kindle` should be `calibre`, but the functionality of this software is more focused on "editing", and the multi-dimensional display of ebooks is relatively simple. Therefore, I plan to write a tool specifically for managing ebooks that meets practical needs.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Currently, I am developing this tool in my spare time. If you also like reading ebooks and have suggestions for ebook management features, feel free to raise an issue.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;If you have any issues or feature requests, please contact the author, email: wupengcn301@gmail.com, WeChat: leowucn. Thank you.
