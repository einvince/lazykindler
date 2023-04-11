import { upsertWordAndUsage } from '@/services';

import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import _ from 'lodash';
import { useCallback, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';

type UsageListProps = {
  usageList: any;
  upsertWordAndUsageSuccessNotify: any;
  upsertWordAndUsageFailNotify: any;
};

const UsageList = (props: UsageListProps) => {
  const { usageList, upsertWordAndUsageSuccessNotify, upsertWordAndUsageFailNotify } = props;
  const intl = useIntl();

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

  // 要修改的用法条目的相关信息
  const [translatedUsage, setTranslatedUsage] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditClick = (index: any) => {
    setEditingIndex(index);
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

  return (
    <div>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
        style={{ marginBottom: 5 }}
      >
        <Button>One</Button>
        <Button>Two</Button>
      </ButtonGroup>
      <Paper style={{ width: '100%', height: '81.8vh' }}>
        <List
          style={{ height: '80vh', overflow: 'auto' }}
          subheader={
            <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
              <FormattedMessage id="pages.vocabulary.list.usage_list" />
            </ListSubheader>
          }
          component="nav"
        >
          {usageList.map((usageItem: any, index: number) => (
            <Box key={index} my={8}>
              <div key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography component="span" style={{ color: 'tomato' }}>
                        <strong>
                          <FormattedMessage id="pages.vocabulary.usage" />
                        </strong>
                        :{' '}
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
                        <strong>
                          <FormattedMessage id="pages.vocabulary.translate" />
                        </strong>
                        :{' '}
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
                                upsertWordAndUsageSuccessNotify();
                              },
                              () => {
                                upsertWordAndUsageFailNotify();
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
                          {usageItem.translated_usage || (
                            <FormattedMessage id="pages.vocabulary.save_translate.info" />
                          )}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary={
                      <Typography component="span" style={{ color: '#cf8f2f' }}>
                        <strong>
                          <FormattedMessage id="pages.vocabulary.book_name" />
                        </strong>
                        :{' '}
                      </Typography>
                    }
                    secondary={<Typography component="span">{usageItem.book}</Typography>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography component="span" style={{ color: '#498977' }}>
                        <strong>
                          <FormattedMessage id="pages.vocabulary.timestamp" />
                        </strong>
                        :{' '}
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
      </Paper>
    </div>
  );
};

export default UsageList;
