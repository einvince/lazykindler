import { getBooksMeta, getMultipleCollections, getSetting } from '@/services';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import HouseIcon from '@mui/icons-material/House';
import LabelIcon from '@mui/icons-material/Label';
import SearchIcon from '@mui/icons-material/Search';
import StarsIcon from '@mui/icons-material/Stars';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu as MaterialMenu,
  MenuItem,
  Paper,
  TextField,
  IconButton,
} from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import type { BookMetaDataType, CollectionDataType } from '../../data';
import BookCardList from '../components/BookCardList';
import BookSettingMenu from '../components/BookSettingMenu';

type MenuItemType = {
  label: React.ReactNode;
  icon: React.ReactElement;
};

const settingKeyBookSortType = 'book_sort_type';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    '& fieldset': {
      borderRadius: 50,
    },
  },
});

enum FilterType {
  All,
  Star,
  Tags,
  Author,
  Publisher,
}

const filterTypeMessages = {
  [FilterType.All]: <FormattedMessage id="pages.books.uncategorized" />,
  [FilterType.Star]: <FormattedMessage id="pages.books.rating" />,
  [FilterType.Tags]: <FormattedMessage id="pages.books.labels" />,
  [FilterType.Author]: <FormattedMessage id="pages.books.authors" />,
  [FilterType.Publisher]: <FormattedMessage id="pages.books.publisher" />,
};

type SubHeaerType = {
  Star: Object;
  Tags: Object;
  Author: Object;
  Publisher: Object;
};

type BooksProps = {
  storeType: string;
};

const Books: FC<BooksProps> = (props: BooksProps) => {
  const { storeType } = props;

  const intl = useIntl();

  const menuItemsForTypeMenu: MenuItemType[] = [
    {
      label: intl.formatMessage({ id: 'pages.books.uncategorized' }),
      icon: <FormatAlignJustifyIcon />,
    },
    { label: intl.formatMessage({ id: 'pages.books.rating' }), icon: <StarsIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.labels' }), icon: <LabelIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.authors' }), icon: <AccountCircleIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.publisher' }), icon: <HouseIcon /> },
  ];

  const [anchorElForTypeMenu, setAnchorElForTypeMen] = useState<null | HTMLElement>(null);

  const [selectedDropDownMenuItem, setSelectedDropDownMenuItem] = useState<MenuItemType>(
    menuItemsForTypeMenu[0],
  );

  const handleClickDropDownMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElForTypeMen(event.currentTarget);
  };

  const handleCloseDropDownMenu = () => {
    setAnchorElForTypeMen(null);
  };

  const [allBooksMeta, setAllBooksMeta] = useState<BookMetaDataType[]>([]);
  const [data, setData] = useState<BookMetaDataType[]>([]);

  // 评分或者作者等等大类
  const [firstLevelType, setFirstLevelType] = useState<any>(filterTypeMessages[FilterType.All]);
  // 评分或者书签下面的列表
  const [secondLevelMenuList, setSecondLevelMenuList] = useState<string[]>([]);

  // 评分或者书签下选定的某一项
  const [selectedSecondLevel, setSelectedSecondLevel] = useState<any>(null);

  const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
    Star: {},
    Tags: {},
    Author: {},
    Publisher: {},
  });

  const handleMenuItemClick = (item: MenuItemType) => {
    setSelectedDropDownMenuItem(item);
    handleCloseDropDownMenu();

    switch (item.label) {
      case intl.formatMessage({ id: 'pages.books.uncategorized' }):
        setFirstLevelType(filterTypeMessages[FilterType.All]);
        setSecondLevelMenuList([]);

        setData(allBooksMeta);
        break;
      case intl.formatMessage({ id: 'pages.books.rating' }):
        setFirstLevelType(filterTypeMessages[FilterType.Star]);
        setSecondLevelMenuList(Object.keys(classifiedInfo.Star));
        break;
      case intl.formatMessage({ id: 'pages.books.labels' }):
        setFirstLevelType(filterTypeMessages[FilterType.Tags]);
        setSecondLevelMenuList(Object.keys(classifiedInfo.Tags));
        break;
      case intl.formatMessage({ id: 'pages.books.authors' }):
        setFirstLevelType(filterTypeMessages[FilterType.Author]);
        setSecondLevelMenuList(Object.keys(classifiedInfo.Author));
        break;
      case intl.formatMessage({ id: 'pages.books.publisher' }):
        setFirstLevelType(filterTypeMessages[FilterType.Publisher]);
        setSecondLevelMenuList(Object.keys(classifiedInfo.Publisher));
        break;
    }
  };

  const onSearchChange = (keyword: any) => {
    const bookList = filterData(null, selectedSecondLevel, allBooksMeta);
    setData(
      _.filter(bookList, (item: BookMetaDataType) => {
        if (
          (item.name != null && item.name.includes(keyword)) ||
          (item.author != null && item.author.includes(keyword)) ||
          (item.publisher != null && item.publisher.includes(keyword)) ||
          (item.tags != null && item.tags.includes(keyword))
        ) {
          return true;
        }
        return false;
      }),
    );
  };

  const handleSearchChange = _.debounce((keyword: string) => {
    onSearchChange(keyword);
  }, 300); // 300ms 的延迟

  const fetchBooks = () => {
    getSetting(settingKeyBookSortType).then((data) => {
      let bookSortType = 0;
      if (data.data != '') {
        bookSortType = Number(data.data);
      }

      getBooksMeta(storeType, bookSortType).then((data) => {
        if (data == null) {
          data = [];
        }

        let coll_uuids: any = [];
        let bookCollsInfo: any = {};
        _.forEach(data, (item: BookMetaDataType) => {
          if (item.coll_uuids == null) {
            return;
          }
          coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
        });
        coll_uuids = _.uniq(coll_uuids);

        getMultipleCollections(coll_uuids).then((bookCollInfoList: CollectionDataType[]) => {
          _.forEach(bookCollInfoList, (item: CollectionDataType) => {
            bookCollsInfo[item.uuid] = item.name;
          });

          for (let i = 0; i < data.length; i++) {
            if (data[i].coll_uuids == null) {
              continue;
            }
            let names: string[] = [];
            _.forEach(data[i].coll_uuids.split(';'), (coll_uuid) => {
              names.push(bookCollsInfo[coll_uuid]);
            });
            data[i].coll_names = names.join(';');
          }

          setData(data);
          setAllBooksMeta(data);
        });

        const star: any = {};
        const tag: any = {};
        const authors: any = {};
        const publisher: any = {};

        _.forEach(data, (item: BookMetaDataType) => {
          if (star[item.star] == null) {
            star[item.star] = {};
          }
          if (item.star != null) {
            star[item.star][item.uuid] = null;
          }

          if (item.tags != null) {
            item.tags.split(';').forEach((subject) => {
              if (subject == '') {
                return;
              }
              if (tag[subject] == null) {
                tag[subject] = {};
              }
              tag[subject][item.uuid] = null;
            });
          } else {
            if (tag['无标签'] == null) {
              tag['无标签'] = {};
            }
            tag['无标签'][item.uuid] = null;
          }

          if (item.author == null) {
            if (authors['无作者'] == null) {
              authors['无作者'] = {};
            }
            authors['无作者'][item.uuid] = null;
          } else {
            if (authors[item.author] == null) {
              authors[item.author] = {};
            }
            authors[item.author][item.uuid] = null;
          }

          if (item.publisher == null) {
            if (publisher['无出版社'] == null) {
              publisher['无出版社'] = {};
            }
            publisher['无出版社'][item.uuid] = null;
          } else {
            if (publisher[item.publisher] == null) {
              publisher[item.publisher] = {};
            }
            publisher[item.publisher][item.uuid] = null;
          }
        });

        let allInfo = {
          Star: star,
          Tags: tag,
          Author: authors,
          Publisher: publisher,
        };

        setClassifiedInfo(allInfo);

        switch (firstLevelType) {
          case filterTypeMessages[FilterType.All]:
            setSecondLevelMenuList([]);
            break;
          case filterTypeMessages[FilterType.Star]:
            setSecondLevelMenuList(Object.keys(allInfo.Star));
            break;
          case filterTypeMessages[FilterType.Tags]:
            setSecondLevelMenuList(Object.keys(allInfo.Tags));
            break;
          case filterTypeMessages[FilterType.Author]:
            setSecondLevelMenuList(Object.keys(allInfo.Author));
            break;
          case filterTypeMessages[FilterType.Publisher]:
            setSecondLevelMenuList(Object.keys(allInfo.Publisher));
            break;
        }

        filterData(allInfo, selectedSecondLevel, data);
      });
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const filterData = (data: any, selectedKeyword: any, allBooksMetaList: BookMetaDataType[]) => {
    let allInfo;
    if (data != null) {
      allInfo = data;
    } else {
      allInfo = classifiedInfo;
    }
    setSelectedSecondLevel(selectedKeyword);

    let filteredBooks;
    let o = {};
    switch (firstLevelType) {
      case filterTypeMessages[FilterType.All]:
        filteredBooks = allBooksMetaList;
        break;
      case filterTypeMessages[FilterType.Star]:
        o = allInfo.Star[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredBooks);
        break;
      case filterTypeMessages[FilterType.Tags]:
        o = allInfo.Tags[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredBooks);
        break;
      case filterTypeMessages[FilterType.Author]:
        o = allInfo.Author[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredBooks);
        break;
      case filterTypeMessages[FilterType.Publisher]:
        o = allInfo.Publisher[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredBooks);
        break;
    }
    return filteredBooks;
  };

  return (
    <>
      <div style={{ width: '23%', position: 'relative' }}>
        <Paper style={{ height: '88vh', overflowY: 'auto' }}>
          <List>
            <ListSubheader>
              <div>
                <Button
                  style={{ width: '100%', fontSize: '80%' }}
                  variant="contained"
                  startIcon={selectedDropDownMenuItem.icon}
                  onClick={handleClickDropDownMenu}
                >
                  {selectedDropDownMenuItem.label}
                </Button>
                <MaterialMenu
                  anchorEl={anchorElForTypeMenu}
                  open={Boolean(anchorElForTypeMenu)}
                  onClose={handleCloseDropDownMenu}
                  onClick={(e) => e.preventDefault()}
                >
                  {menuItemsForTypeMenu.map((item, index) => (
                    <MenuItem
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        handleMenuItemClick(item);
                      }}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
                </MaterialMenu>
              </div>
            </ListSubheader>
            {secondLevelMenuList.map((item, index) => (
              <ListItem
                style={{ padding: 0 }}
                key={index}
                onClick={() => {
                  filterData(null, item, allBooksMeta);
                }}
              >
                <ListItemButton
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                  selected={item === selectedSecondLevel}
                >
                  <ListItemText
                    primary={`${index + 1}. ${item}`}
                    style={{ wordBreak: 'break-all' }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
      <div>
        <Box
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
          style={{
            width: '75%',
            position: 'absolute',
            top: 20,
            left: '24vw',
            paddingLeft: 20,
          }}
        >
          <BookSettingMenu fetchBooks={fetchBooks} />
          <CustomTextField
            variant="outlined"
            size="small"
            placeholder={intl.formatMessage({ id: 'pages.books.search' })}
            onChange={(e: any) => {
              e.preventDefault();
              handleSearchChange(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" size="small">
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{ width: { xs: '90%', sm: '50%', md: '40%' } }}
          />
        </Box>
        <div
          style={{
            width: '75%',
            position: 'absolute',
            top: 65,
            left: '24vw',
            paddingLeft: 20,
            maxHeight: '83.5vh',
            overflowY: 'auto',
          }}
        >
          <BookCardList
            data={data}
            fetchBooks={fetchBooks}
            tablePaginationStyle={{
              position: 'fixed',
              marginRight: 20,
              bottom: 0,
              right: 0,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Books;
