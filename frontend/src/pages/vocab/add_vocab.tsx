import { getVocabBookList, upsertWordAndUsage } from '@/services';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  Badge,
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import Notify from '../../components/Notify';

const AddVocab = () => {
  const intl = useIntl();

  const [bookList, setBookList] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<string>('');

  const [word, setWord] = useState('');
  const [usage, setUsage] = useState('');
  const [translatedUsage, setTranslatedUsage] = useState('');

  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationColor, setNotificationColor] = useState('');

  const handleNotificationClose = () => {
    setNotificationMessage('');
    setNotificationColor('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response: any = await upsertWordAndUsage(selectedBook, word, usage, translatedUsage);
      if (response.status === 200) {
        setNotificationColor('#4caf50');
        setNotificationMessage(
          intl.formatMessage({ id: 'pages.vocabulary.save_translate.success' }),
        );

        handleReset();
      }
    } catch (error: any) {
      if (error.status !== 200) {
        setNotificationColor('tomato');
        setNotificationMessage(intl.formatMessage({ id: 'pages.vocabulary.save_translate.fail' }));
      }
    }
  };

  const handleReset = () => {
    setWord('');
    setUsage('');
    setTranslatedUsage('');
  };

  useEffect(() => {
    getVocabBookList([]).then((data) => {
      setBookList(data.data);
    });
  }, []);

  const countWordsInBook = (bookKey: string) => {
    const book = bookList.find((book) => book.key === bookKey);
    return book ? book.wordCount : 0;
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substr(0, maxLength - 1) + '...' : text;
  };

  const add_vocab_form = () => {
    return (
      <>
        {selectedBook == '' ? null : (
          <div style={{ width: '70%', paddingLeft: 10 }}>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  label={<FormattedMessage id="pages.vocabulary.vocabulary" />}
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  inputProps={{ style: { height: '10vh' } }}
                />
                <TextField
                  label={<FormattedMessage id="pages.vocabulary.usage" />}
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  inputProps={{ style: { height: '30vh' } }}
                />
                <TextField
                  label={<FormattedMessage id="pages.vocabulary.translate" />}
                  value={translatedUsage}
                  onChange={(e) => setTranslatedUsage(e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                  inputProps={{ style: { height: '30vh' } }}
                />
                <Box display="flex" justifyContent="center" gap={10}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleReset}
                    style={{
                      width: 100,
                    }}
                  >
                    <FormattedMessage id="pages.vocabulary.create.clear" />
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    style={{
                      width: 100,
                    }}
                  >
                    <FormattedMessage id="pages.vocabulary.create.commit" />
                  </Button>
                </Box>
              </Box>
            </form>
          </div>
        )}
      </>
    );
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
              </>
            }
            component="nav"
          >
            {bookList.map((book, index) => (
              <ListItem key={index}>
                <Tooltip title={book['title']}>
                  <ListItemButton
                    selected={selectedBook == book.key}
                    onClick={() => {
                      setSelectedBook(book.key);
                    }}
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
      {add_vocab_form()}
      <Notify
        message={notificationMessage}
        duration={6000}
        onClose={handleNotificationClose}
        color={notificationColor}
      />
    </div>
  );
};

export default AddVocab;
