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
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Dropdown, Input, Layout, Menu as AntMenu } from 'antd';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

import ContextMenu from '../../book_list/components/ContextMenu';
import type { ClippingCollectionDataType, ClippingDataType } from '../../data';
import ClippingCardList from '../components/ClippingCardList';

const { Sider, Content } = Layout;

enum FilterType {
  All = '未分类',
  Stars = '评分',
  Subjects = '标签',
  Author = '作者',
  Book = '书名',
}

type SubHeaerType = {
  Stars: Object;
  Subjects: Object;
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
  const [firstLevelType, setFirstLevelType] = useState<string>(FilterType.All);
  // 评分或者书签下面的列表
  const [secondLevelMenuList, setSecondLevelMenuList] = useState<string[]>([]);

  // 评分或者书签下选定的某一项
  const [selectedSecondLevel, setSelectedSecondLevel] = useState<any>(null);

  const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
    Stars: {},
    Subjects: {},
    Author: {},
    Book: {},
  });

  const [formData, setFormData] = useState<any>({});

  const [openForCreateClipping, setOpenForCreateClipping] = useState(false);

  const handleClickOpenForCreateClipping = () => {
    setOpenForCreateClipping(true);
  };

  const handleCloseForCreateClipping = () => {
    setOpenForCreateClipping(false);
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

      const stars: any = {};
      const subjects: any = {};
      const authors: any = {};
      const books: any = {};

      _.forEach(data, (item: ClippingDataType) => {
        if (stars[item.stars] == null) {
          stars[item.stars] = {};
        }
        if (item.stars != null) {
          stars[item.stars][item.uuid] = null;
        }

        if (item.subjects != null) {
          let subjectsList = item.subjects.split(';');
          subjectsList.forEach((subject) => {
            if (subjects[subject] == null) {
              subjects[subject] = {};
            }
            subjects[subject][item.uuid] = null;
          });
        } else {
          if (subjects['无标签'] == null) {
            subjects['无标签'] = {};
          }
          subjects['无标签'][item.uuid] = null;
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

        if (item.book_name == null) {
          if (books['无书名'] == null) {
            books['无书名'] = {};
          }
          books['无书名'][item.uuid] = null;
        } else {
          let book_name = item.book_name;
          if (books[book_name] == null) {
            books[book_name] = {};
          }
          books[book_name][item.uuid] = null;
        }
      });

      let allInfo = {
        Stars: stars,
        Subjects: subjects,
        Author: authors,
        Book: books,
      };

      setClassifiedInfo(allInfo);

      switch (firstLevelType) {
        case FilterType.All:
          setSecondLevelMenuList([]);
          break;
        case FilterType.Stars:
          setSecondLevelMenuList(Object.keys(allInfo.Stars));
          break;
        case FilterType.Subjects:
          setSecondLevelMenuList(Object.keys(allInfo.Subjects));
          break;
        case FilterType.Author:
          setSecondLevelMenuList(Object.keys(allInfo.Author));
          break;
        case FilterType.Book:
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
      case FilterType.All:
        filteredClippings = allClippingsList;
        break;
      case FilterType.Stars:
        o = allInfo.Stars[selectedKeyword];
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
      case FilterType.Subjects:
        o = allInfo.Subjects[selectedKeyword];
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
      case FilterType.Author:
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

      case FilterType.Book:
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
      <AntMenu style={{ width: '9vw' }}>
        <AntMenu.Item key="all" icon={<DatabaseOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(FilterType.All);
              setSecondLevelMenuList([]);

              setData(allClippings);
            }}
            style={{ paddingLeft: 13 }}
          >
            未分类
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="stars" icon={<StarOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(FilterType.Stars);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Stars));
            }}
            style={{ paddingLeft: 13 }}
          >
            评分
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="subjects" icon={<TagsOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(FilterType.Subjects);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Subjects));
            }}
            style={{ paddingLeft: 13 }}
          >
            标签
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="author" icon={<UserOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(FilterType.Author);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Author));
            }}
            style={{ paddingLeft: 13 }}
          >
            作者
          </a>
        </AntMenu.Item>
        <AntMenu.Item key="book" icon={<BookOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFirstLevelType(FilterType.Book);
              setSecondLevelMenuList(Object.keys(classifiedInfo.Book));
            }}
            style={{ paddingLeft: 13 }}
          >
            书名
          </a>
        </AntMenu.Item>
      </AntMenu>
    );
  };

  const MenuHeader = () => {
    switch (firstLevelType) {
      case FilterType.All:
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
        break;
      case FilterType.Author:
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
        break;

      case FilterType.Book:
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
        break;

      case FilterType.Stars:
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
        break;

      case FilterType.Subjects:
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
        break;
      default:
        return null;
        break;
    }
  };

  const onSearchChange = (e: any) => {
    const keyword = e.target.value;
    const list = filterData(null, selectedSecondLevel, allClippings);
    setData(
      _.filter(list, (item: ClippingDataType) => {
        if (
          (item.book_name != null && item.book_name.includes(keyword)) ||
          (item.author != null && item.author.includes(keyword)) ||
          (item.subjects != null && item.subjects.includes(keyword)) ||
          (item.content != null && item.content.includes(keyword))
        ) {
          return true;
        }
        return false;
      }),
    );
  };

  const handleCreateClipping = () => {
    let book_name = formData['book_name'];
    let author = formData['author'];
    let clip_content = formData['clip_content'];

    if (book_name == null || author == null || clip_content == null) {
      return false;
    }
    book_name = book_name.trim();
    author = author.trim();
    clip_content = clip_content.trim();

    if (book_name == '' || author == '' || clip_content == '') {
      return false;
    }

    createClipping(book_name, author, clip_content).then(() => {
      fetchClippings();
    });
    return true;
  };

  return (
    <>
      <Layout>
        <Sider style={{ backgroundColor: 'initial', width: 200, paddingLeft: 0, position: "fixed" }}>
          <Input
            style={{ marginBottom: 10, marginLeft: -11, height: 45 }}
            placeholder="搜索"
            onBlur={onSearchChange}
          />
          <Button
            id="demo-customized-button"
            aria-haspopup="true"
            variant="contained"
            fullWidth
            disableElevation
            style={{ marginLeft: -13 }}
            onClick={handleClickOpenForCreateClipping}
          >
            添加笔记
          </Button>
          <List
            sx={{
              bgcolor: 'background.paper',
              width: 200,
              height: '100vh',
              marginLeft: -1.5,
              overflow: 'auto',
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            {<MenuHeader />}
            {secondLevelMenuList.map((item, index) => (
              <ContextMenu
                key={index}
                Content={
                  <ListItem
                    style={{ padding: 0 }}
                    onClick={() => {
                      filterData(null, item, allClippings);
                    }}
                  >
                    <ListItemButton
                      style={{ paddingLeft: 10, paddingRight: 10 }}
                      selected={item === selectedSecondLevel}
                    >
                      <ListItemText primary={`${index + 1}. ${item}`} />
                    </ListItemButton>
                  </ListItem>
                }
                MenuInfo={[
                  {
                    name: '修改值',
                    handler: () => {
                      setOpenDialogForUpdateClipping(true);
                      setUpdateClippingValue(selectedSecondLevel);
                    },
                    prefixIcon: <DeleteIcon />,
                  },
                  {
                    name: '复制名称',
                    handler: () => {
                      navigator.clipboard.writeText(selectedSecondLevel);
                    },
                    prefixIcon: <DeleteIcon />,
                  },
                ]}
              />
            ))}
          </List>
        </Sider>
        <Content style={{ marginLeft: 223 }}>
          <ClippingCardList data={data} fetchClippings={fetchClippings} />
        </Content>
      </Layout>

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
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{'创建书籍集合'}</DialogTitle>
        <DialogContent style={{ margin: '0 auto', height: '55vh' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& .MuiTextField-root': { width: '45ch' },
            }}
          >
            <FormControl variant="standard" sx={{ m: 3, mt: 5, width: '45ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                书名<span color="red">*</span>:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 55 }}>
                <Input
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, book_name: event.target.value });
                  }}
                  style={{ width: '190%' }}
                />
                <FormHelperText id="standard-weight-helper-text">不能为空</FormHelperText>
              </div>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 3, mt: 5, width: '45ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                作者:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 55 }}>
                <Input
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      author: event.target.value,
                    });
                  }}
                  style={{ width: '190%' }}
                />
                <FormHelperText id="standard-weight-helper-text">不能为空</FormHelperText>
              </div>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 3, mt: 5, width: '45ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                内容<span color="red">*</span>:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 55 }}>
                <TextField
                  label="笔记"
                  multiline
                  rows={4}
                  variant="outlined"
                  style={{ width: '157%' }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      clip_content: event.target.value,
                    });
                  }}
                />
                <FormHelperText id="standard-weight-helper-text">不能为空</FormHelperText>
              </div>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForCreateClipping}>取消</Button>
          <Button
            onClick={() => {
              let ok = handleCreateClipping();
              if (ok) {
                handleCloseForCreateClipping();
              }
            }}
            autoFocus
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Clippings;
