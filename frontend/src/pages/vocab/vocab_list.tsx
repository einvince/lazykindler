import { getVocabBookList, getVocabWordsByBookKeyList, upsertWordAndUsage } from '@/services';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import MenuBookIcon from '@mui/icons-material/MenuBook';

import {
  Badge,
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import Notify from '../../components/Notify';

const VocabList = () => {
  const [bookList, setBookList] = useState<any[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [wordList, setWordList] = useState([]);
  const [selectedWordsItem, setSelectedWordsItem] = useState<any[]>([]);
  const [usageList, setUsageList] = useState<any[]>([]);

  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('');

  // 要修改的用法条目的相关信息
  const [translatedUsage, setTranslatedUsage] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditClick = (index: any) => {
    setEditingIndex(index);
  };

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

  const highlightWordsInUsage = (wordList: string[], usage: string) => {
    let highlightedUsage = usage;

    wordList.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'g');
      highlightedUsage = highlightedUsage.replace(
        regex,
        '<span style="background-color: orangered; color: white; padding: 0 4px;">$1</span>',
      );
    });

    return highlightedUsage;
  };

  // 使用 useCallback 和 debounce 创建一个防抖函数
  const debouncedSetTranslatedUsage = useCallback(
    _.debounce((value) => setTranslatedUsage(value), 300),
    [],
  );

  const handleInputChange = (event: any) => {
    debouncedSetTranslatedUsage(event.target.value);
  };

  const humanReadableTimestamp = (timestamp: any) => {
    timestamp = Number(timestamp);
    if (timestamp.toString().length == 10) {
      timestamp = timestamp * 1000;
    }

    const date = new Date(timestamp); // 将时间戳转换为毫秒

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleNotificationClose = () => {
    setNotificationMessage('');
    setNotificationColor('');
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '86vh' }}>
      {/* 渲染书籍列表 */}
      <div style={{ width: '30%', height: '86vh' }}>
        <Paper style={{ width: '100%', height: '86vh' }}>
          <List
            style={{ height: '86vh', overflow: 'auto' }}
            subheader={
              <>
                <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
                  书籍列表
                </ListSubheader>
                <ButtonGroup
                  sx={{ display: 'flex', justifyContent: 'center', marginBottom: 1 }}
                  variant="outlined"
                  size="small"
                >
                  <Button onClick={selectAllBooks}>全选</Button>
                  <Button onClick={resetBooks}>重置</Button>
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
      <div style={{ width: '20%', height: '86vh', paddingLeft: 10 }}>
        <Paper style={{ width: '100%', height: '86vh' }}>
          <List
            style={{ height: '86vh', overflow: 'auto' }}
            subheader={
              <>
                <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
                  单词列表
                </ListSubheader>
                <ButtonGroup
                  sx={{ display: 'flex', justifyContent: 'center', marginBottom: 1 }}
                  variant="outlined"
                  size="small"
                >
                  <Button onClick={selectAllWords}>全选</Button>
                  <Button onClick={resetWords}>重置</Button>
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
      <div style={{ width: '50%', paddingLeft: 10 }}>
        <Paper style={{ width: '100%', height: '86vh' }}>
          <List
            style={{ height: '86vh', overflow: 'auto' }}
            subheader={
              <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
                用法
              </ListSubheader>
            }
            component="nav"
          >
            {usageList.map((usageItem, index) => (
              <Box key={index} my={8}>
                <div key={index}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography component="span" style={{ color: 'tomato' }}>
                          <strong>用法</strong>:{' '}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          style={{ marginLeft: 8 }}
                          component="span"
                          dangerouslySetInnerHTML={{
                            __html: highlightWordsInUsage([usageItem['word']], usageItem.usage),
                          }}
                        />
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <Grid container alignItems="center">
                      <Grid item>
                        <Typography component="span" style={{ color: '#ee8e70' }}>
                          <strong>翻译</strong>:{' '}
                        </Typography>
                      </Grid>
                      <Grid item xs>
                        {editingIndex === index ? (
                          <TextField
                            style={{ marginLeft: 10, width: '95%' }}
                            defaultValue={usageItem.translated_usage}
                            onChange={handleInputChange}
                            onBlur={() => {
                              setEditingIndex(null);

                              upsertWordAndUsage(
                                usageItem.book_key,
                                usageItem.word,
                                usageItem.usage,
                                translatedUsage,
                              ).then(
                                () => {
                                  setNotificationColor('#4caf50');
                                  setNotificationMessage('提交成功');

                                  setTranslatedUsage('');
                                },
                                () => {
                                  setNotificationColor('tomato');
                                  setNotificationMessage('出现错误');

                                  setTranslatedUsage('');
                                },
                              );
                            }}
                            multiline
                            fullWidth
                          />
                        ) : (
                          <Typography
                            style={{
                              marginLeft: 10,
                              width: '95%',
                              cursor: 'text',
                              color: usageItem.translated_usage ? 'inherit' : '#aaa',
                            }}
                            onClick={() => handleEditClick(index)}
                          >
                            {usageItem.translated_usage ||
                              '点击此处以添加翻译, 添加完毕后移开指针自动保存'}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </ListItem>

                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography component="span" style={{ color: '#cf8f2f' }}>
                          <strong>书名</strong>:{' '}
                        </Typography>
                      }
                      secondary={<Typography component="span">{usageItem.book}</Typography>}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography component="span" style={{ color: '#498977' }}>
                          <strong>时间</strong>:{' '}
                        </Typography>
                      }
                      secondary={
                        <Typography style={{ marginLeft: 6 }} component="span">
                          {humanReadableTimestamp(usageItem.timestamp)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  <Divider />
                </div>
              </Box>
            ))}
          </List>

          <Notify
            message={notificationMessage}
            duration={6000}
            onClose={handleNotificationClose}
            color={notificationColor}
          />
        </Paper>
      </div>
    </div>
  );
};

export default VocabList;
