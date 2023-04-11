import { getVocabBookList, getVocabWordsByBookKeyList } from '@/services';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import {
  Badge,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  Tooltip,
} from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import Notify from '../../components/Notify';
import UsageList from './components/UsageList';

const VocabList = () => {
  const intl = useIntl();

  const [bookList, setBookList] = useState<any[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [wordList, setWordList] = useState([]);
  const [selectedWordsItem, setSelectedWordsItem] = useState<any[]>([]);
  const [usageList, setUsageList] = useState<any[]>([]);

  const [notificationColor, setNotificationColor] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // 要修改的用法条目的相关信息
  const [translatedUsage, setTranslatedUsage] = useState('');

  useEffect(() => {
    getVocabBookList(selectedBooks).then((data) => {
      setBookList(data.data);
    });
  }, []);

  const mergeArraysV1 = (arr1: string[], arr2: string[]) => {
    arr2.forEach((item) => {
      const index = arr1.indexOf(item);
      if (index === -1) {
        arr1.push(item);
      } else {
        arr1.splice(index, 1);
      }
    });
    return arr1;
  };

  const mergeObjectArrays = (arr1: any[], arr2: any[], key: string) => {
    arr2.forEach((obj) => {
      const existingObj = arr1.find((item) => item[key] === obj[key]);
      if (existingObj) {
        existingObj.usage = _.uniq(existingObj.usage.concat(obj.usage));
      } else {
        arr1.push(obj);
      }
    });
    return arr1;
  };

  const mergeUsageByWord = (arr: any[]) => {
    const result: any = [];

    arr.forEach((item) => {
      const existingItem = result.find((i: any) => i.word === item.word);
      if (existingItem) {
        existingItem.usage = existingItem.usage.concat(item.usage);
      } else {
        result.push(item);
      }
    });

    return result;
  };

  const handleNotificationClose = () => {
    setNotificationMessage('');
    setNotificationColor('');
  };

  const handleBookSelect = (bookKeyList: string[]) => {
    let newSelectedBooks: string[] = [];
    if (bookKeyList.length > 0) {
      newSelectedBooks = mergeArraysV1(selectedBooks, bookKeyList);
    }
    setSelectedBooks(newSelectedBooks);
    getVocabWordsByBookKeyList(newSelectedBooks).then((data) => {
      setWordList(mergeUsageByWord(data.data));
    });
    setSelectedWordsItem([]); // Reset selected words and usage list
    setUsageList([]);
  };

  const handleBookSelectAll = () => {
    const newSelectedBooks = bookList.map((book) => book.key);
    setSelectedBooks(newSelectedBooks);
    getVocabWordsByBookKeyList(newSelectedBooks).then((data) => {
      setWordList(mergeUsageByWord(data.data));
    });
    setSelectedWordsItem([]); // Reset selected words and usage list
    setUsageList([]);
  };

  const handleWordSelect = (wordItemList: any[]) => {
    let newSelectedWordsItem: any[] = [];
    if (wordItemList.length > 0) {
      newSelectedWordsItem = mergeObjectArrays(selectedWordsItem, wordItemList, 'word');
    }
    setSelectedWordsItem(newSelectedWordsItem);

    let book_key_m: any = {};
    _.forEach(bookList, (bookItem) => {
      book_key_m[bookItem.key] = bookItem.title;
    });

    let usageList: any = [];
    _.forEach(newSelectedWordsItem, (wordItem) => {
      _.forEach(wordItem.usage, (usageItem) => {
        usageItem['word'] = wordItem.word;
        usageItem['book'] = book_key_m[wordItem.book_key];
        usageList.push(usageItem);
      });
    });

    setUsageList(usageList);
  };

  const countWordsInBook = (bookKey: string) => {
    const book = bookList.find((book) => book.key === bookKey);
    return book ? book.wordCount : 0;
  };

  const selectAllBooks = () => {
    handleBookSelectAll();
  };

  const resetBooks = () => {
    handleBookSelect([]);
  };

  const selectAllWords = () => {
    handleWordSelect(wordList);
  };

  const resetWords = () => {
    handleWordSelect([]);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substr(0, maxLength - 1) + '...' : text;
  };

  const countUsagesInWord = (wordItem: any) => {
    return wordItem.usage.length;
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '86vh' }}>
      {/* 渲染书籍列表 */}
      <div style={{ width: '20%', height: '86vh' }}>
        <Paper style={{ width: '100%', height: '86vh' }}>
          <List
            style={{ height: '86vh', overflow: 'auto' }}
            subheader={
              <>
                <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
                  <FormattedMessage id="pages.vocabulary.list.book_list" />
                </ListSubheader>
                <ButtonGroup
                  sx={{ display: 'flex', justifyContent: 'center', marginBottom: 1 }}
                  variant="outlined"
                  size="small"
                >
                  <Button onClick={selectAllBooks}>
                    <FormattedMessage id="pages.vocabulary.select_all" />
                  </Button>
                  <Button onClick={resetBooks}>
                    <FormattedMessage id="pages.vocabulary.reset" />
                  </Button>
                </ButtonGroup>
              </>
            }
            component="nav"
          >
            {bookList.map((book, index) => (
              <ListItem key={index}>
                <Tooltip title={book['title']}>
                  <ListItemButton
                    selected={selectedBooks.includes(book.key)}
                    onClick={() => handleBookSelect([book.key])}
                    key={book.key}
                  >
                    <ListItemText
                      primary={truncateText(book['title'], 20)}
                      style={{ paddingRight: 20 }}
                    />
                    <Badge color="secondary" badgeContent={countWordsInBook(book.key)} showZero>
                      <MenuBookIcon />
                    </Badge>
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
      {/* 渲染单词列表 */}
      <div style={{ width: '19%', height: '86vh', paddingLeft: 10 }}>
        <Paper style={{ width: '100%', height: '86vh' }}>
          <List
            style={{ height: '86vh', overflow: 'auto' }}
            subheader={
              <>
                <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
                  <FormattedMessage id="pages.vocabulary.list.vocabulary_list" />
                </ListSubheader>
                <ButtonGroup
                  sx={{ display: 'flex', justifyContent: 'center', marginBottom: 1 }}
                  variant="outlined"
                  size="small"
                >
                  <Button onClick={selectAllWords}>
                    <FormattedMessage id="pages.vocabulary.select_all" />
                  </Button>
                  <Button onClick={resetWords}>
                    <FormattedMessage id="pages.vocabulary.reset" />
                  </Button>
                </ButtonGroup>
              </>
            }
            component="nav"
          >
            {wordList.map((wordItem: any, index: number) => (
              <ListItem key={index}>
                <ListItemButton
                  selected={selectedWordsItem.some((obj) => obj.word === wordItem.word)}
                  onClick={() => handleWordSelect([wordItem])}
                  key={wordItem.word}
                >
                  <ListItemText primary={wordItem.word} style={{ paddingRight: 20 }} />
                  <Badge color="secondary" badgeContent={countUsagesInWord(wordItem)} showZero>
                    <LibraryBooksIcon />
                  </Badge>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
      {/* 渲染用法 */}
      <div style={{ width: '61%', paddingLeft: 10, position: 'relative' }}>
        <UsageList
          usageList={usageList}
          upsertWordAndUsageSuccessNotify={() => {
            setNotificationColor('#4caf50');
            setNotificationMessage(
              intl.formatMessage({
                id: 'pages.vocabulary.save_translate.success',
              }),
            );

            setTranslatedUsage('');
          }}
          upsertWordAndUsageFailNotify={() => {
            setNotificationColor('tomato');
            setNotificationMessage(
              intl.formatMessage({
                id: 'pages.vocabulary.save_translate.fail',
              }),
            );

            setTranslatedUsage('');
          }}
        />
      </div>

      <Notify
        message={notificationMessage}
        duration={6000}
        onClose={handleNotificationClose}
        color={notificationColor}
      />
    </div>
  );
};

export default VocabList;
