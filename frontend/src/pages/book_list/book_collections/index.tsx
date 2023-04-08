import { createBookCollection, getAllCollections } from '@/services';
import { preHandleSubjects, toBase64 } from '@/util';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import LabelIcon from '@mui/icons-material/Label';
import StarsIcon from '@mui/icons-material/Stars';
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
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu as MaterialMenu,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import Dropzone from 'react-dropzone';

import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';

import BookCardList from './components/CollectionList';
import { CollectionDataType } from './data';

type MenuItemType = {
  label: React.ReactNode;
  icon: React.ReactElement;
};

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
  // 选择的大的分类
  const [selectedType, setSelectedType] = useState<any>(filterTypeMessages[FilterType.All]);
  // 选择的大的分类下面的列表
  const [selectedSubType, setSelectedSubType] = useState<string[]>([]);
  // 选择的大的分类下面的列表的小条目
  const [selectedItemName, setSelectedItemName] = useState<any>(null);

  const [allBookCollections, setAllBookCollections] = useState<CollectionDataType[]>([]);

  const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
    Star: {},
    Tags: {},
  });
  const intl = useIntl();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuItems: MenuItemType[] = [
    {
      label: intl.formatMessage({ id: 'pages.books.uncategorized' }),
      icon: <FormatAlignJustifyIcon />,
    },
    { label: intl.formatMessage({ id: 'pages.books.rating' }), icon: <StarsIcon /> },
    { label: intl.formatMessage({ id: 'pages.books.labels' }), icon: <LabelIcon /> },
  ];
  const [selectedDropDownMenuItem, setSelectedDropDownMenuItem] = useState<MenuItemType>(
    menuItems[0],
  );

  const handleClickDropDownMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropDownMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item: MenuItemType) => {
    setSelectedDropDownMenuItem(item);
    handleCloseDropDownMenu();

    switch (item.label) {
      case intl.formatMessage({ id: 'pages.books.uncategorized' }):
        setSelectedType(filterTypeMessages[FilterType.All]);
        setSelectedSubType([]);

        setData(allBookCollections);
        break;
      case intl.formatMessage({ id: 'pages.books.rating' }):
        setSelectedType(filterTypeMessages[FilterType.Star]);
        setSelectedSubType(Object.keys(classifiedInfo.Star));
        break;
      case intl.formatMessage({ id: 'pages.books.labels' }):
        setSelectedType(filterTypeMessages[FilterType.Tags]);
        setSelectedSubType(Object.keys(classifiedInfo.Tags));
        break;
    }
  };

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
            if (subject == '') {
              return;
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
    fetchBookCollections();
  }, []);

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.name == null || formData.name.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.books.book.create_book_collection.alert.title' }));
      return;
    }
    if (formData.tag == null || formData.tag.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.books.book.create_book_collection.alert.title' }));
      return;
    }
    if (formData.star == null || formData.star.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.books.book.create_book_collection.alert.title' }));
      return;
    }
    if (formData.cover == null || formData.cover.trim() === '') {
      alert(intl.formatMessage({ id: 'pages.books.book.create_book_collection.alert.title' }));
      return;
    }

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

        handleClose();

        setFormData({});
      },
    );
    return true;
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
        filteredBooks = _.filter(allBookCollections, (v: CollectionDataType) => {
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
      <div>
        <div style={{ width: '23%', position: 'relative' }}>
          <Paper style={{ height: '88vh' }}>
            <List>
              <ListSubheader>
                <div>
                  <Button
                    style={{ width: '80%', fontSize: '80%' }}
                    variant="contained"
                    startIcon={selectedDropDownMenuItem.icon}
                    onClick={handleClickDropDownMenu}
                  >
                    {selectedDropDownMenuItem.label}
                  </Button>
                  <MaterialMenu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseDropDownMenu}
                    onClick={(e) => e.preventDefault()}
                  >
                    {menuItems.map((item, index) => (
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

                  <IconButton
                    style={{ left: 5 }}
                    color="primary"
                    aria-label="add to shopping cart"
                    onClick={handleClickOpen}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
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
        <div
          style={{
            width: '75%',
            position: 'absolute',
            top: 20,
            left: '24vw',
            paddingLeft: 20,
            maxHeight: '88vh',
            overflowY: 'auto',
          }}
        >
          <BookCardList data={data} fetchBookCollections={fetchBookCollections} />
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          {<FormattedMessage id="pages.books.book.create_book_collection" />}
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
                    event.preventDefault();

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
