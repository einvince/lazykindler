🌍
*[简体中文](README-zh.md) ∙ [繁體中文](README-zh-Hant.md)∙ [Русский](README-ru.md)∙ [Português](README-pt.md)∙ [한국어](README-ko.md)∙ [日本語](README-ja.md)∙ [Bahasa Indonesia](README-id.md)∙ [Français](README-fr.md)∙ [Deutsch](README-de.md)


# Lazy Kindler
<br>

<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">


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

Currently only adapted for the `mac` platform, there may be unknown errors when running on the `windows` platform.

# Supported eBook Formats

mobi and azw3. Other types of eBooks will be automatically ignored during import.

# Problem Solved

After downloading **thousands** of eBooks from the internet, how do you efficiently manage them?
<br />
The quality of various eBooks varies greatly, some written by ordinary authors and others by world-renowned writers. There are also many different genres, such as sci-fi, romance, fantasy, and more.
<br />
If you have to search for a book in a directory containing thousands of books each time, it's headache-inducing. Therefore, it's necessary to manage these eBooks in an appropriate way, allowing us to search for books within a smaller range based on specific preferences, quickly find the desired book, and avoid wasting too much time on searching.
<br />
`lazykindler` is born for this purpose.

# Feature Introduction

## 1. Book Import

Click the `Upload File` button, and the platform will recursively scan supported eBook files in directories like `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc. Duplicate files will not be uploaded again.
<br />
Currently, only `mobi` and `azw3` formats are supported for import, and the platform does not provide an eBook format conversion feature. It's easy to find eBooks in specific formats; I usually find them on this website: http://www.fast8.com. The advantage of this site is that it offers a wide selection of books, and multiple format options are available when downloading. Simply download the books in the desired format.

## 2. Add Metadata to Books

You can modify the book's rating, tags, collection, author, publisher, and cover. Note that these operations will not actually modify the book file itself but will add records to the database.

## 3. Book Information Parsing

After importing eBooks, the platform will automatically extract data from the eBook files for information display and book management.

## 4. Collections

You can create collections of books, such as `Science Fiction Collection`, `Fantasy Novel Collection`, `Romance Novel Collection`, and so on. Add representative covers to the collections you like, and you can `rate` and `add tags` to the collections. Each collection can have books selected and added from the library, and you can also rate, add tags, and add covers to the collections. Once you have multiple collections, you can search for books directly from these collections in the future.

## 5. Display

To support displaying books from different dimensions, you can `rate` and `add tags` to books, as well as `modify authors` and `modify publishers`. Books can be displayed from various dimensions such as `rating`, `tags`, `author`, and `publisher`. Additionally, you can `modify the book cover`.

## 6. Download

Books in the platform can be downloaded by clicking the `Download` button in the `Operation` section of the book card. The downloaded books will be saved in the user's home directory under `Download` or `下载`. Clicking `Download All Books` on the homepage will download all books to the `Documents` or `文稿` folder under the `lazykindler` directory in the user's home directory. Clicking `Download All Books` multiple times will not re-download existing books.

## 7. Reading

The platform provides basic functions for reading books. Currently, I have not found a library to implement reading `mobi` and `azw3` formats using `reactjs`. Therefore, when clicking the `Read Book` button for the first time, the platform will convert these two formats to `epub` format. The tool used for conversion is `/Applications/calibre.app/Contents/MacOS/ebook-convert`, so the computer needs to have `calibre` installed to use the book reading function properly. The conversion is only required the first time you click `Read Book`. The page may become unresponsive for a short period, which is normal. The waiting time depends on the size of the e-book, but it's usually fast. Converted books are stored in the `backend/data` directory of the main platform.
<br />

## 8. Processing Workflow

The books displayed on the `Books -> Library` page are officially stored books, while newly imported books are displayed on the `Books -> Temporary` page. (Other than the difference in page locations, there is not much difference between official and temporary books in the backend).
<br />
After a `temporary` book is added to any collection, it will be moved from `Books -> Temporary` to `Books -> Library`. The purpose of this is to **distinguish between officially stored books and temporarily imported books. Officially stored books have been filtered, unwanted books removed, and categorized, while temporarily imported books tend to be diverse.**

## 9. Backup

The database used is `sqlite3`, located at `backend/lazykindler.db`.
<br />
When the platform is first launched, the database file will be automatically created and initialized. This file contains all data information in the platform except for the books. Imported books are copied to the `backend/data` directory. Note that for easier internal platform operation, the book names in the `backend/data` directory are appended with the book's `md5` value.
<br />
To back up all books and data in the platform, simply save `backend/lazykindler.db` and `backend/data`. To start the service in another location next time, copy `backend/lazykindler.db` and `backend/data` to the corresponding positions.

## 10. Import Kindle highlights

This feature is currently only supported on the Mac platform.
<br />
The platform will automatically detect whether the `kindle` is connected. When the `kindle` is connected to the computer, the platform will import the `My Clippings.txt` file from the `kindle` for unified management and multi-dimensional display. When the `kindle`'s `My Clippings.txt` file changes, the platform will automatically import the newly added content in `My Clippings.txt`, and the old data will not be imported repeatedly. Users can see the newly added content by refreshing the page after connecting the `kindle` to the computer.
<br />
It should be noted that the `kindle` processes the user-added highlight notes into a chunk of text without line breaks, even if it is the content of multiple paragraphs. `lazykindler` cleverly recognizes and processes line breaks when importing the `kindle`'s `My Clippings.txt` file, as shown below.


<img width="505" alt="Snipaste_2023-04-11_21-45-40" src="https://user-images.githubusercontent.com/16133390/231184639-a14c988e-5460-459e-a0a9-083d2f38cf5d.png" width="66%">

## 11. Perform secondary highlighting on highlighted notes

Highlighted notes are part of the text or related paragraphs that we highlight and record when reading a book, often because a sentence or a word in it has a certain impact on us. After importing the highlighted notes into the platform, it is necessary to highlight the sentences or words that resonated with you at that time during the subsequent sorting process, making it easier to highlight and display that small section of text that resonated with you.
<br />
Using `lazykindler`, you can easily perform secondary highlighting. Just select the relevant text and click `OK` in the automatically popped-up dialog box.


<img width="513" alt="Snipaste_2023-04-11_21-46-28" src="https://user-images.githubusercontent.com/16133390/231184733-cf1b26d4-a865-4d63-8e2a-3181372e2685.png" width="66%">

## 12. Add comments to highlighted notes

You can record some thoughts about the text that resonated with you.

<img width="1344" alt="Snipaste_2023-04-11_21-52-54" src="https://user-images.githubusercontent.com/16133390/231185116-9920d704-21b4-43fd-9058-0fe772ad7888.png">


## 13. Import highlights from Jingdu Tianxia apk

`Jingdu Tianxia apk` is a popular reader on the Android platform. I currently use this software to read books on Hisense e-reader, and the software also supports adding highlighted notes. So I added support for importing highlighted notes from this software.
<br />
The format of the highlighted notes file exported from `Jingdu Tianxia apk` is `.mrexpt`. Place this file in any directory such as `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc., and the platform can automatically complete the import operation.

## 14. Import Kindle Vocabulary Builder

Vocabulary Builder is a feature in Kindle that records words or phrases looked up while reading a book. This method can be used to read English original books and record words, which can be used for learning and reviewing these words later. The platform supports importing these vocabularies.

Based on importing these vocabularies, the platform provides a good interface for displaying this information, and you can manually create vocabulary and examples, as well as add translations to examples.

<img width="1345" alt="Snipaste_2023-04-11_21-47-16" src="https://user-images.githubusercontent.com/16133390/231185398-488b963a-28bf-47b7-a7d4-a5b069ed3fe3.png">

<img width="1279" alt="Snipaste_2023-04-11_21-53-55" src="https://user-images.githubusercontent.com/16133390/231185414-4d6742ba-7f12-4097-b38c-faf9f641e18f.png">

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

2. Execute in `frontend` directory

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

<img width="1355" alt="Snipaste_2023-04-11_20-18-13" src="https://user-images.githubusercontent.com/16133390/231187018-50f3d92a-1f45-41c1-a1c4-e8b3913491f7.png">

<img width="1321" alt="Snipaste_2023-04-11_21-58-53" src="https://user-images.githubusercontent.com/16133390/231187099-91b9ee3d-a4ff-4e7e-b6ea-f1835cb4e7e6.png">
<img width="1325" alt="Snipaste_2023-04-11_22-01-24" src="https://user-images.githubusercontent.com/16133390/231187613-041f0709-c8b6-4a96-a563-58ead760da56.png">

<img width="1353" alt="Snipaste_2023-04-11_20-19-59" src="https://user-images.githubusercontent.com/16133390/231187172-9f60516b-f925-482e-99aa-479d4cb37aaf.png">

<img width="1314" alt="Snipaste_2023-04-11_21-46-40" src="https://user-images.githubusercontent.com/16133390/231187198-7878dda1-4a64-4fae-871a-df8886e038db.png">


<br />

# Other

The most famous tool for `kindle` should be `calibre`, but the functionality of this software is more focused on "editing", and the multi-dimensional display of ebooks is relatively simple. Therefore, I plan to write a tool specifically for managing ebooks that meets practical needs.

Currently, I am developing this tool in my spare time. If you also like reading ebooks and have suggestions for ebook management features, feel free to raise an issue.

If you have any issues or feature requests, please contact the author, email: wupengcn301@gmail.com, WeChat: leowucn. Thank you.
