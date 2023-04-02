import { CollectionDataType } from '@/pages/data';
import { createBookCollection, getAllCollections } from '@/services';
import { preHandleSubjects, toBase64, useWindowDimensions } from '@/util';
import { DatabaseOutlined, DownOutlined, StarOutlined, TagsOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
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
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'umi';

import ContextMenu from '../../book_list/components/ContextMenu';
import CollectionList from './components/CollectionList';

const { Sider, Content } = Layout;

enum FilterType {
  All = '未分类',
  Star = '评分',
  Tags = '标签',
}

const filterTypeMessages = {
  [FilterType.All]: <FormattedMessage id="pages.books.uncategorized" />,
  [FilterType.Star]: <FormattedMessage id="pages.books.rating" />,
  [FilterType.Tags]: <FormattedMessage id="pages.books.labels" />,
};

type SubHeaerType = {
  Star: Object;
  Tags: Object;
};

export default function BookCollections() {
  const [data, setData] = useState<any>([]);
  const { width, height } = useWindowDimensions();
  // 选择的大的分类
  const [selectedType, setSelectedType] = useState<any>(filterTypeMessages[FilterType.All]);
  // 选择的大的分类下面的列表
  const [selectedSubType, setSelectedSubType] = useState<string[]>([]);
  // 选择的大的分类下面的列表的小条目
  const [selectedItemName, setSelectedItemName] = useState<any>(null);

  const [allClippingCollections, setAllClippingCollections] = useState<CollectionDataType[]>([]);

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

  const fetchClippingCollections = () => {
    getAllCollections('clipping').then((data: CollectionDataType[]) => {
      if (data == null) {
        data = [];
      }
      setAllClippingCollections(data);
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
          let subjectsList = item.tags.split(';');
          subjectsList.forEach((subject) => {
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
        case filterTypeMessages[FilterType.All]:
          setSelectedSubType([]);
          break;
        case filterTypeMessages[FilterType.Star]:
          setSelectedSubType(Object.keys(allInfo.Star));
          break;
        case filterTypeMessages[FilterType.Tags]:
          setSelectedSubType(Object.keys(allInfo.Tags));
          break;
      }

      filterData(allInfo, selectedItemName);
    });
  };

  useEffect(() => {
    fetchClippingCollections();
  }, []);

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    createBookCollection(name, 'clipping', description, preHandleSubjects(tag), star, cover).then(
      () => {
        fetchClippingCollections();

        handleClose();
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
              setSelectedType(filterTypeMessages[FilterType.All]);
              setSelectedSubType([]);

              setData(allClippingCollections);
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.uncategorized" />
          </a>
        </Menu.Item>
        <Menu.Item key="star" icon={<StarOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setSelectedType(filterTypeMessages[FilterType.Star]);
              setSelectedSubType(Object.keys(classifiedInfo.Star));
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.rating" />
          </a>
        </Menu.Item>
        <Menu.Item key="tag" icon={<TagsOutlined />}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setSelectedType(filterTypeMessages[FilterType.Tags]);
              setSelectedSubType(Object.keys(classifiedInfo.Tags));
            }}
            style={{ paddingLeft: 13 }}
          >
            <FormattedMessage id="pages.books.labels" />
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
      case filterTypeMessages[FilterType.Star]:
        o = allInfo.Star[selectedKeyword];
        if (o == null) {
          o = {};
        }
        filteredBooks = _.filter(allClippingCollections, (v: CollectionDataType) => {
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
        filteredBooks = _.filter(allClippingCollections, (v: CollectionDataType) => {
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
              <ContextMenu
                key={index}
                MenuInfo={[]}
                Content={
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
                }
              />
            ))}
            <ListItemButton onClick={handleClickOpen}>
              <ListItemIcon style={{ paddingLeft: 70 }}>
                <AddIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Sider>
        <Content style={{ marginLeft: -10 }}>
          <CollectionList data={data} fetchClippingCollections={fetchClippingCollections} />
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
        <DialogTitle id="alert-dialog-title">
          {<FormattedMessage id="pages.highlight.create_collection" />}
        </DialogTitle>
        <DialogContent style={{ margin: '0 auto' }}>
          <form onSubmit={handleCreate}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <FormControl sx={{ m: 1, mt: 3, width: '25ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.books.book.create_book_collection.name" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, name: event.target.value });
                  }}
                  style={{ marginTop: -5 }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, mt: 3, width: '25ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.books.book.create_book_collection.description" />:
                </Typography>
                <Input
                  id="description"
                  value={formData.age}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({
                      ...formData,
                      description: event.target.value,
                    });
                  }}
                  style={{ marginTop: -5 }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, mt: 3, width: '25ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.books.book.create_book_collection.labels" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <Input
                  id="tag"
                  value={formData.age}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, tag: event.target.value });
                  }}
                  style={{ marginTop: -5 }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, mt: 3, width: '25ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.books.book.create_book_collection.rating" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <Input
                  id="star"
                  value={formData.age}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFormData({ ...formData, star: event.target.value });
                  }}
                  style={{ marginTop: -5 }}
                />
              </FormControl>
              <FormControl sx={{ m: 1, mt: 3, width: '25ch' }}>
                <Typography variant="subtitle1" gutterBottom component="div">
                  <FormattedMessage id="pages.books.book.create_book_collection.cover" />
                  <span style={{ color: 'red', paddingLeft: 5 }}>*</span>:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                          <IconButton color="primary" aria-label="upload picture" component="span">
                            <CloudUploadIcon />
                          </IconButton>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  {formData.cover && (
                    <Chip
                      label={
                        <FormattedMessage id="pages.books.book.create_book_collection.cover" />
                      }
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
                </Box>
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
}
