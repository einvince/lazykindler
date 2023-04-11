import {
  createClipping,
  getAllClippings,
  getMultipleCollections,
  updateClippingByKeyword,
} from '@/services';
import {
  BookOutlined,
  DatabaseOutlined,
  DownOutlined,
  StarOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import LabelIcon from '@mui/icons-material/Label';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import SearchIcon from '@mui/icons-material/Search';
import StarsIcon from '@mui/icons-material/Stars';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Dropdown, Input, Menu as AntMenu } from 'antd';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import ClippingCardList from '../components/ClippingCardList';

import type { ClippingCollectionDataType, ClippingDataType } from '../../data';

enum FilterType {
  All,
  Star,
  Tags,
  Author,
  Book,
}

const filterTypeMessages = {
  [FilterType.All]: <FormattedMessage id="pages.books.uncategorized" />,
  [FilterType.Star]: <FormattedMessage id="pages.books.rating" />,
  [FilterType.Tags]: <FormattedMessage id="pages.books.labels" />,
  [FilterType.Author]: <FormattedMessage id="pages.books.authors" />,
  [FilterType.Book]: <FormattedMessage id="pages.books.book" />,
};

type MenuItemType = {
  label: React.ReactNode;
  icon: React.ReactElement;
};

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    '& fieldset': {
      borderRadius: 50,
    },
  },
});

type SubHeaerType = {
  Star: Object;
  Tags: Object;
  Author: Object;
  Book: Object;
};

const Clippings: FC = () => {
  const [allClippings, setAllClippings] = useState<ClippingDataType[]>([]);
  const [data, setData] = useState<ClippingDataType[]>([]);

  // 打开对话框，使用关键字更新clipping
  const [openDialogForUpdateClipping, setOpenDialogForUpdateClipping] = useState<boolean>(false);
  // 更新clipping时填写的新值
  const [updateClippingValue, setUpdateClippingValue] = useState<string>('');

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
    Book: {},
  });
  const intl = useIntl();

  const [anchorElForTypeMenu, setAnchorElForTypeMen] = useState<null | HTMLElement>(null);

  const menuItemsForTypeMenu: MenuItemType[] = [
    {
      label: intl.formatMessage({ id: 'pages.books.uncategorized' }),
      icon: <FormatAlignJustifyIcon />,
    },
    { label: intl.formatMessage({ id: 'pages.books.rating' }), icon: <StarsIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.labels' }), icon: <LabelIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.authors' }), icon: <AccountCircleIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.book' }), icon: <LocalLibraryIcon /> },
  ];

  const handleMenuItemClick = (item: MenuItemType) => {
    setSelectedDropDownMenuItem(item);
    handleCloseDropDownMenu();

    switch (item.label) {
      case intl.formatMessage({ id: 'pages.books.uncategorized' }):
        setFirstLevelType(filterTypeMessages[FilterType.All]);
        setSecondLevelMenuList([]);

        setData(allClippings);
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
      case intl.formatMessage({ id: 'pages.books.book' }):
        setFirstLevelType(filterTypeMessages[FilterType.Book]);
        setSecondLevelMenuList(Object.keys(classifiedInfo.Book));
        break;
    }
  };

  const [selectedDropDownMenuItem, setSelectedDropDownMenuItem] = useState<MenuItemType>(
    menuItemsForTypeMenu[0],
  );

  const handleClickDropDownMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElForTypeMen(event.currentTarget);
  };

  const handleCloseDropDownMenu = () => {
    setAnchorElForTypeMen(null);
  };

  const [formData, setFormData] = useState<any>({});

  const [openForCreateClipping, setOpenForCreateClipping] = useState(false);

  const handleClickOpenForCreateClipping = () => {
    setOpenForCreateClipping(true);

    setFormData({});
  };

  const handleCloseForCreateClipping = () => {
    setOpenForCreateClipping(false);

    setFormData({});
  };

  const fetchClippings = () => {
    return getAllClippings().then((data: any) => {
      if (data == null) {
        data = [];
      }

      let coll_uuids: any = [];
      let clippingsCollsInfo: any = {};
      _.forEach(data, (item: ClippingDataType) => {
        if (item.coll_uuids == null) {
          return;
        }
        coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
      });
      coll_uuids = _.uniq(coll_uuids);

      getMultipleCollections(coll_uuids).then((collInfoList: ClippingCollectionDataType[]) => {
        _.forEach(collInfoList, (item: ClippingCollectionDataType) => {
          clippingsCollsInfo[item.uuid] = item.name;
        });

        for (let i = 0; i < data.length; i++) {
          if (data[i].coll_uuids == null) {
            continue;
          }
          let names: string[] = [];
          _.forEach(data[i].coll_uuids.split(';'), (coll_uuid) => {
            names.push(clippingsCollsInfo[coll_uuid]);
          });
          data[i].coll_names = names.join(';');
        }

        setData(data);
        setAllClippings(data);
      });

      const star: any = {};
      const tag: any = {};
      const authors: any = {};
      const books: any = {};

      _.forEach(data, (item: ClippingDataType) => {
        // 评分
        if (star[item.star] == null) {
          star[item.star] = {};
        }
        star[item.star][item.uuid] = null;

        // 标签
        item.tags.split(';').forEach((subject) => {
          if (tag[subject] == null) {
            tag[subject] = {};
          }
          tag[subject][item.uuid] = null;
        });

        // 作者
        if (authors[item.author] == null) {
          authors[item.author] = {};
        }
        authors[item.author][item.uuid] = null;

        // 书名
        if (books[item.book_name] == null) {
          books[item.book_name] = {};
        }
        books[item.book_name][item.uuid] = null;
      });

      let allInfo = {
        Star: star,
        Tags: tag,
        Author: authors,
        Book: books,
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
        case filterTypeMessages[FilterType.Book]:
          setSecondLevelMenuList(Object.keys(allInfo.Book));
          break;
      }

      filterData(allInfo, selectedSecondLevel, data);
    });
  };

  useEffect(() => {
    fetchClippings();
  }, []);

  const filterData = (data: any, selectedKeyword: any, allClippingsList: ClippingDataType[]) => {
    let allInfo;
    if (data != null) {
      allInfo = data;
    } else {
      allInfo = classifiedInfo;
    }
    setSelectedSecondLevel(selectedKeyword);

    let filteredClippings;
    let o = {};
    switch (firstLevelType) {
      case filterTypeMessages[FilterType.All]:
        filteredClippings = allClippingsList;
        break;
      case filterTypeMessages[FilterType.Star]:
        o = allInfo.Star[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredClippings);
        break;
      case filterTypeMessages[FilterType.Tags]:
        o = allInfo.Tags[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredClippings);
        break;
      case filterTypeMessages[FilterType.Author]:
        o = allInfo.Author[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredClippings);
        break;

      case filterTypeMessages[FilterType.Book]:
        o = allInfo.Book[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredClippings = _.filter(allClippingsList, (v: ClippingDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredClippings);
        break;
    }
    return filteredClippings;
  };

  const headerDropMenu = () => {
    return (
      <AntMenu>
        <AntMenu.Item key="all" icon={<DatabaseOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(filterTypeMessages[FilterType.All]);
              setSecondLevelMenuList([]);

              setData(allClippings);
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.uncategorized" />
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="star" icon={<StarOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(filterTypeMessages[FilterType.Star]);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Star));
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.rating" />
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="tag" icon={<TagsOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(filterTypeMessages[FilterType.Tags]);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Tags));
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.labels" />
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="author" icon={<UserOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(filterTypeMessages[FilterType.Author]);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Author));
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.authors" />
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="book" icon={<BookOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(filterTypeMessages[FilterType.Book]);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Book));
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.book" />
          </a>
        </AntMenu.Item>
      </AntMenu>
    );
  };

  const MenuHeader = () => {
    switch (firstLevelType) {
      case filterTypeMessages[FilterType.All]:
        return (
          <ListSubheader>
            <Dropdown overlay={headerDropMenu}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <DatabaseOutlined style={{ paddingRight: 13 }} />
                {firstLevelType}
                <DownOutlined style={{ paddingLeft: 13 }} />
              </a>
            </Dropdown>
          </ListSubheader>
        );
      case filterTypeMessages[FilterType.Author]:
        return (
          <ListSubheader>
            <Dropdown overlay={headerDropMenu}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <DatabaseOutlined style={{ paddingRight: 13 }} />
                {firstLevelType}
                <DownOutlined style={{ paddingLeft: 13 }} />
              </a>
            </Dropdown>
          </ListSubheader>
        );

      case filterTypeMessages[FilterType.Book]:
        return (
          <ListSubheader>
            <Dropdown overlay={headerDropMenu}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <DatabaseOutlined style={{ paddingRight: 13 }} />
                {firstLevelType}
                <DownOutlined style={{ paddingLeft: 13 }} />
              </a>
            </Dropdown>
          </ListSubheader>
        );

      case filterTypeMessages[FilterType.Star]:
        return (
          <ListSubheader>
            <Dropdown overlay={headerDropMenu}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <StarOutlined style={{ paddingRight: 13 }} />
                {firstLevelType}
                <DownOutlined style={{ paddingLeft: 13 }} />
              </a>
            </Dropdown>
          </ListSubheader>
        );

      case filterTypeMessages[FilterType.Tags]:
        return (
          <ListSubheader>
            <Dropdown overlay={headerDropMenu}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <TagsOutlined style={{ paddingRight: 13 }} />
                {firstLevelType}
                <DownOutlined style={{ paddingLeft: 13 }} />
              </a>
            </Dropdown>
          </ListSubheader>
        );
      default:
        return null;
    }
  };

  const onSearchChange = (keyword: any) => {
    const list = filterData(null, selectedSecondLevel, allClippings);
    setData(
      _.filter(list, (item: ClippingDataType) => {
        if (
          (item.book_name != null && item.book_name.includes(keyword)) ||
          (item.author != null && item.author.includes(keyword)) ||
          (item.tags != null && item.tags.includes(keyword)) ||
          (item.content != null && item.content.includes(keyword))
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

  const handleCreateClipping = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.book_name == null || formData.book_name.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.highlight.create.book_name.required' }));
      return;
    }
    if (formData.author == null || formData.author.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.highlight.create.author.required' }));
      return;
    }
    if (formData.clip_content == null || formData.clip_content.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.highlight.create.highlight.required' }));
      return;
    }

    let book_name = formData['book_name'].trim();
    let author = formData['author'].trim();
    let clip_content = formData['clip_content'].trim();

    createClipping(book_name, author, clip_content).then(() => {
      fetchClippings();

      handleCloseForCreateClipping();
    });
    return true;
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
                  filterData(null, item, allClippings);
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
            maxHeight: '83.2vh',
            overflowY: 'auto',
          }}
        >
          <ClippingCardList
            data={data}
            fetchClippings={fetchClippings}
            tablePaginationStyle={{
              position: 'fixed',
              marginRight: 20,
              bottom: 0,
              right: 0,
            }}
          />
        </div>
      </div>

      <Dialog
        open={openDialogForUpdateClipping}
        onClose={() => {
          setOpenDialogForUpdateClipping(false);
        }}
        fullWidth
      >
        <DialogTitle>更新高亮笔记</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="新值"
            defaultValue={selectedSecondLevel}
            fullWidth
            variant="standard"
            onChange={(e) => {
              setUpdateClippingValue(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialogForUpdateClipping(false);
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              updateClippingByKeyword(
                firstLevelType,
                updateClippingValue,
                selectedSecondLevel,
              ).then(() => {
                setOpenDialogForUpdateClipping(false);
                fetchClippings();
              });
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openForCreateClipping}
        onClose={handleCloseForCreateClipping}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="pages.highlight.create" />
        </DialogTitle>
        <DialogContent style={{ margin: '0 auto', height: '55vh' }}>
          <form onSubmit={handleCreateClipping}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <FormControl sx={{ m: 1, mt: 3, width: '50ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.highlight.create.book_name" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <Input
                  id="name"
                  onBlur={(event: any) => {
                    setFormData({ ...formData, book_name: event.target.value });
                  }}
                  style={{ marginTop: -5 }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, mt: 3, width: '50ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.highlight.create.author" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  style={{ width: '100%' }}
                  onBlur={(event: any) => {
                    setFormData({ ...formData, author: event.target.value });
                  }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, mt: 3, width: '50ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.highlight.create.highlight" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  style={{ width: '100%' }}
                  onBlur={(event: any) => {
                    setFormData({ ...formData, clip_content: event.target.value });
                  }}
                />
              </FormControl>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 1 }}>
                <FormattedMessage id="pages.books.book.create_book_collection.commit" />
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Clippings;
