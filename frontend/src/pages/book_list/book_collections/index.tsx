import { createBookCollection, getAllCollections } from '@/services';
import { preHandleSubjects, toBase64 } from '@/util';
import { DatabaseOutlined, DownOutlined, StarOutlined, TagsOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Typography,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Dropdown, Layout, Menu } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';

import BookCardList from './components/CollectionList';
import { CollectionDataType } from './data';

const { Sider, Content } = Layout;

enum FilterType {
  All = '未分类',
  Star = '评分',
  Tags = '标签',
}

type SubHeaerType = {
  Star: Object;
  Tags: Object;
};

export default function BookCollections() {
  const [data, setData] = useState<any>([]);
  // 选择的大的分类
  const [selectedType, setSelectedType] = useState<string>(FilterType.All);
  // 选择的大的分类下面的列表
  const [selectedSubType, setSelectedSubType] = useState<string[]>([]);
  // 选择的大的分类下面的列表的小条目
  const [selectedItemName, setSelectedItemName] = useState<any>(null);

  const [allBookCollections, setAllBookCollections] = useState<CollectionDataType[]>([]);

  const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
    Star: {},
    Tags: {},
  });

  const [formData, setFormData] = useState<any>({});

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchBookCollections = () => {
    getAllCollections('book').then((data: CollectionDataType[]) => {
      if (data == null) {
        data = [];
      }
      setAllBookCollections(data);
      setData(data);

      const star: any = {};
      const tag: any = {};
      _.forEach(data, (item: CollectionDataType) => {
        if (star[item.star] == null) {
          star[item.star] = {};
        }
        if (item.star != null) {
          star[item.star][item.uuid] = null;
        }

        if (item.tags != null) {
          item.tags.split(';').forEach((subject) => {
            if (subject == "") {
              return
            }
            if (tag[subject] == null) {
              tag[subject] = {};
            }
            tag[subject][item.uuid] = null;
          });
        }
      });

      let allInfo = {
        Star: star,
        Tags: tag,
      };

      setClassifiedInfo(allInfo);

      switch (selectedType) {
        case FilterType.All:
          setSelectedSubType([]);
          break;
        case FilterType.Star:
          setSelectedSubType(Object.keys(allInfo.Star));
          break;
        case FilterType.Tags:
          setSelectedSubType(Object.keys(allInfo.Tags));
          break;
      }

      filterData(allInfo, selectedItemName);
    });
  };

  useEffect(() => {
    fetchBookCollections();
  }, []);

  const handleCreate = () => {
    let name = formData['name'];
    let description = formData['description'];
    let tag = formData['tag'];
    let star = formData['star'];
    let cover = formData['cover'];

    if (name == null || name.trim() == '') {
      return false;
    }
    if (description == null || description.trim() == '') {
      description = '';
    }
    if (tag == null || tag.trim() == '') {
      return false;
    }
    if (star == null || star.trim() == '') {
      return false;
    }
    if (cover == null || cover.trim() == '') {
      return false;
    }

    name = name.trim();
    description = description.trim();
    if (isNaN(star.trim())) {
      return false;
    }
    star = Number(star.trim());
    cover = cover.trim();

    createBookCollection(name, 'book', description, preHandleSubjects(tag), star, cover).then(
      () => {
        fetchBookCollections();
      },
    );
    return true;
  };

  const headerDropMenu = () => {
    return (
      <Menu style={{ width: 150 }}>
        <Menu.Item key="all" icon={<DatabaseOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setSelectedType(FilterType.All);
              setSelectedSubType([]);

              setData(allBookCollections);
            }}
            style={{ paddingLeft: 13 }}
          >
            未分类
          </a>
        </Menu.Item>
        <Menu.Item key="star" icon={<StarOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setSelectedType(FilterType.Star);
              setSelectedSubType(Object.keys(classifiedInfo.Star));
            }}
            style={{ paddingLeft: 13 }}
          >
            评分
          </a>
        </Menu.Item>
        <Menu.Item key="tag" icon={<TagsOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setSelectedType(FilterType.Tags);
              setSelectedSubType(Object.keys(classifiedInfo.Tags));
            }}
            style={{ paddingLeft: 13 }}
          >
            标签
          </a>
        </Menu.Item>
      </Menu>
    );
  };

  const filterData = (data: any, selectedKeyword: string) => {
    let allInfo;
    if (data != null) {
      allInfo = data;
    } else {
      allInfo = classifiedInfo;
    }
    setSelectedItemName(selectedKeyword);

    let filteredBooks;
    let o = {};
    switch (selectedType) {
      case FilterType.Star:
        o = allInfo.Star[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allBookCollections, (v: CollectionDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredBooks);
        break;
      case FilterType.Tags:
        o = allInfo.Tags[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allBookCollections, (v: CollectionDataType) => {
          if (v.uuid in o) {
            return true;
          }
          return false;
        });
        setData(filteredBooks);
        break;
    }
  };

  return (
    <>
      <Layout>
        <Sider style={{ backgroundColor: 'initial', paddingLeft: 0 }}>
          <List
            sx={{
              bgcolor: 'background.paper',
              position: 'fixed',
              overflow: 'auto',
              height: '100vh',
              width: 200,
              marginTop: -1.8,
              marginLeft: -1.5,
              '& ul': { padding: 0 },
            }}
            subheader={<li />}
          >
            <ListSubheader>
              <Dropdown overlay={headerDropMenu}>
                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                  <DatabaseOutlined style={{ paddingRight: 13 }} />
                  {selectedType}
                  <DownOutlined style={{ paddingLeft: 13 }} />
                </a>
              </Dropdown>
            </ListSubheader>
            {selectedSubType.map((item, index) => (
              <ListItem
                style={{ padding: 0 }}
                key={index}
                onClick={() => {
                  filterData(null, item);
                }}
              >
                <ListItemButton
                  style={{ paddingLeft: 10, paddingRight: 10 }}
                  selected={item === selectedItemName}
                >
                  <ListItemText primary={`${index + 1}. ${item}`} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItemButton onClick={handleClickOpen}>
              <ListItemIcon style={{ paddingLeft: 70 }}>
                <AddIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Sider>
        <Content style={{ marginLeft: -10 }}>
          <BookCardList data={data} fetchBookCollections={fetchBookCollections} />
        </Content>
      </Layout>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">{'创建书籍集合'}</DialogTitle>
        <DialogContent style={{ margin: '0 auto' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& .MuiTextField-root': { width: '25ch' },
            }}
          >
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                名称<span color="red">*</span>:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 45 }}>
                <Input
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, name: event.target.value });
                  }}
                />
                <FormHelperText id="standard-weight-helper-text">不能为空</FormHelperText>
              </div>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                描述:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 45 }}>
                <Input
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    });
                  }}
                />
              </div>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                标签<span color="red">*</span>:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 45 }}>
                <Input
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, tag: event.target.value });
                  }}
                />
                <FormHelperText id="standard-weight-helper-text">
                  多个标签分号相隔。不能为空
                </FormHelperText>
              </div>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                评分<span color="red">*</span>:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 45 }}>
                <Input
                  id="standard-adornment-weight"
                  aria-describedby="standard-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, star: event.target.value });
                  }}
                />
                <FormHelperText id="standard-weight-helper-text">
                  整数,建议最高9分。不能为空
                </FormHelperText>
              </div>
            </FormControl>
            <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
              <Typography
                style={{ position: 'relative', paddingTop: 5 }}
                variant="subtitle1"
                gutterBottom
                component="div"
              >
                封面<span color="red">*</span>:
              </Typography>
              <div style={{ position: 'absolute', paddingLeft: 45 }}>
                <Dropzone
                  onDrop={async (acceptedFiles) => {
                    let base64Str = await toBase64(acceptedFiles[0]);
                    setFormData({ ...formData, cover: base64Str });
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {formData.cover == null ? (
                          <Button variant="contained">上传</Button>
                        ) : (
                          <Chip
                            label="封面"
                            onDelete={() => {
                              setFormData({
                                ...formData,
                                cover: null,
                              });
                            }}
                            deleteIcon={<DeleteIcon />}
                            variant="outlined"
                          />
                        )}
                      </div>
                    </section>
                  )}
                </Dropzone>
                <FormHelperText id="standard-weight-helper-text">不能为空</FormHelperText>
              </div>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button
            onClick={() => {
              let ok = handleCreate();
              if (ok) {
                handleClose();
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
}
