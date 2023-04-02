import { CollectionDataType } from '@/pages/data';
import {
  deleteCollectionWithBooks,
  deleteCollectionWithoutBooks,
  updateCollection,
  updateCollectionCover,
} from '@/services';
import { countChOfStr, preHandleSubjects, toBase64 } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import ArchiveIcon from '@mui/icons-material/Archive';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import StarIcon from '@mui/icons-material/Star';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { Card, List as AntList, Menu } from 'antd';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage, useIntl } from 'umi';
import { v4 as uuidv4 } from 'uuid';

import ChangeInfo from '../../../components/ChangeInfoDialog';
import Cover from '../../../components/Cover';
import AddBooks from '../AddBooks';
import CollectionBooks from '../CollectionBooks';

const { SubMenu } = Menu;

type BookCardListProps = {
  data: any;
  fetchBookCollections: any;
};

const initialDialogInfo = {
  title: '',
  allowEmptyStr: false,
  handleOK: null,
  open: false,
};

interface OpenDialogType {
  open: boolean;
  collection_uuid: any;
  book_type?: any; // 书籍类型。 tmp  no_tmp
}

const intOpenDialogInfo: OpenDialogType = {
  open: false,
  collection_uuid: null,
  book_type: null,
};

export default function BookCardList(props: BookCardListProps) {
  const { data, fetchBookCollections } = props;
  const [uuid1, setUUID1] = useState<any>(uuidv4());
  const [uuid2, setUUID2] = useState<any>(uuidv4());
  const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
  const [openDeleteBook, setOpenDeleteBook] = useState(false);
  const [deleteBookInfo, setDeleteBookInfo] = useState<any>({});
  const [addBooksInfo, setAddBooksInfo] = useState<OpenDialogType>(intOpenDialogInfo);
  const [checkCollctionBooks, setCheckCollctionBooks] = useState<OpenDialogType>(intOpenDialogInfo);

  const [formData, setFormData] = useState<any>({});

  const [uuidForEditCover, setUUIDForEditCover] = useState<any>();
  const [openForEditCover, setOpenForEditCover] = useState(false);

  const intl = useIntl();

  const handleOpenForEditCover = () => {
    setOpenForEditCover(true);
  };

  const handleCloseForEditCover = () => {
    setOpenForEditCover(false);
  };

  // deleteType
  // 0 初始值
  // 1 删除集合时不删除书籍
  // 2 删除集合时删除书籍
  const handleClickOpen = (uuid: string, deleteType: number) => {
    setDeleteBookInfo({ uuid, deleteType });
    setOpenDeleteBook(true);
  };

  const handleClose = () => {
    setOpenDeleteBook(false);
    setDialogInfo(initialDialogInfo);
  };

  const handleCloseDialog = () => {
    setDialogInfo(initialDialogInfo);
  };

  const handleEditCollCover = () => {
    let cover = formData['cover'];

    if (cover == null || cover.trim() == '') {
      return false;
    }

    cover = cover.trim();

    updateCollectionCover(uuidForEditCover, cover).then(() => {
      fetchBookCollections();
    });
    return true;
  };

  return (
    <div>
      <AntList
        rowKey="id"
        grid={{
          gutter: 20,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 5,
        }}
        pagination={{
          position: 'top',
          defaultPageSize: 40,
          hideOnSinglePage: true,
          style: { paddingBottom: 10 },
        }}
        dataSource={data}
        renderItem={(item: CollectionDataType) => (
          <AntList.Item>
            <Card
              hoverable
              style={{ width: 200 }}
              cover={<Cover uuid={item.uuid} />}
              actions={[
                <Menu mode="vertical" key={'1'} selectable={false}>
                  <SubMenu
                    key="sub4"
                    icon={<SettingOutlined />}
                    title={<FormattedMessage id="pages.books.collection.action" />}
                  >
                    {/* <Menu.Item
                      key="1"
                      style={{ width: 280 }}
                      onClick={() => {
                        setUUID2(uuidv4());
                        setAddBooksInfo({
                          open: true,
                          collection_uuid: item.uuid,
                          book_type: 'coll',
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.manage_books" />
                    </Menu.Item> */}
                    <Menu.Item
                      key="2"
                      style={{ width: 280 }}
                      onClick={() => {
                        setUUID2(uuidv4());
                        setAddBooksInfo({
                          open: true,
                          collection_uuid: item.uuid,
                          book_type: 'no_tmp',
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.add_books_to_storage" />
                    </Menu.Item>
                    <Menu.Item
                      key="3"
                      style={{ width: 280 }}
                      onClick={() => {
                        setUUID2(uuidv4());
                        setAddBooksInfo({
                          open: true,
                          collection_uuid: item.uuid,
                          book_type: 'tmp',
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.add_books_to_tmp_storage" />
                    </Menu.Item>
                    <Menu.Item
                      key="4"
                      style={{ width: 280 }}
                      onClick={() => {
                        setDialogInfo({
                          title: intl.formatMessage({
                            id: 'pages.books.collection.action.edit_title',
                          }),
                          oldValue: item.name,
                          allowEmptyStr: false,
                          handleOK: (newValue: any) => {
                            updateCollection(item.uuid, 'name', newValue).then(() => {
                              fetchBookCollections();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.edit_title" />
                    </Menu.Item>
                    <Menu.Item
                      key="5"
                      style={{ width: 280 }}
                      onClick={() => {
                        setDialogInfo({
                          title: intl.formatMessage({
                            id: 'pages.books.collection.action.edit_rating',
                          }),
                          oldValue: item.star,
                          allowEmptyStr: false,
                          handleOK: (newValue: any) => {
                            updateCollection(item.uuid, 'star', newValue).then(() => {
                              fetchBookCollections();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.edit_rating" />
                    </Menu.Item>
                    <Menu.Item
                      key="6"
                      style={{ width: 280 }}
                      onClick={() => {
                        setDialogInfo({
                          title: intl.formatMessage({
                            id: 'pages.books.collection.action.edit_tags',
                          }),
                          oldValue: item.tags,
                          allowEmptyStr: false,
                          handleOK: (newValue: any) => {
                            updateCollection(item.uuid, 'tags', preHandleSubjects(newValue)).then(
                              () => {
                                fetchBookCollections();
                              },
                            );
                          },
                          open: true,
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.edit_tags" />
                    </Menu.Item>
                    <Menu.Item
                      key="7"
                      style={{ width: 280 }}
                      onClick={() => {
                        handleOpenForEditCover();
                        setUUIDForEditCover(item.uuid);
                      }}
                    >
                      <FormattedMessage id="pages.books.collection.action.edit_cover" />
                    </Menu.Item>
                    <Menu.Item
                      key="8"
                      style={{ width: 280 }}
                      onClick={() => {
                        handleClickOpen(item.uuid, 1);
                      }}
                    >
                      <span style={{ color: 'red' }}>
                        <FormattedMessage id="pages.books.collection.action.remove_but_keep_book" />
                      </span>
                    </Menu.Item>
                    <Menu.Item
                      key="9"
                      style={{ width: 280 }}
                      onClick={() => {
                        handleClickOpen(item.uuid, 2);
                      }}
                    >
                      <span style={{ color: 'red' }}>
                        <FormattedMessage id="pages.books.collection.action.remove_and_remove_book" />
                      </span>
                    </Menu.Item>
                  </SubMenu>
                </Menu>,
              ]}
              bodyStyle={{
                paddingTop: 8,
                paddingLeft: 4,
                paddingRight: 4,
                paddingBottom: 8,
              }}
            >
              <Card.Meta
                title={
                  <div
                    style={{
                      maxHeight: '30vh',
                      overflow: 'auto',
                      marginTop: 5,
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      display="block"
                      style={{
                        wordBreak: 'break-all',
                        whiteSpace: 'break-spaces',
                        fontSize: 13,
                      }}
                      gutterBottom
                    >
                      {item.name}
                    </Typography>
                  </div>
                }
                description={
                  <div
                    style={{ maxHeight: 150, overflow: 'auto' }}
                    onClick={() => {
                      setUUID1(uuidv4());
                      setCheckCollctionBooks({
                        open: true,
                        collection_uuid: item.uuid,
                      });
                    }}
                  >
                    <Divider style={{ marginBottom: 10 }} />
                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <StarIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.star}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <FormatListNumberedIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {countChOfStr(item.item_uuids, ';')} 本书
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <ArchiveIcon style={{ height: 16 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.tags}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <DateRangeIcon style={{ height: 16 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.create_time.split(' ')[0]}
                      </Typography>
                    </Box>
                  </div>
                }
              />
            </Card>
          </AntList.Item>
        )}
      />

      <ChangeInfo
        title={dialogInfo['title']}
        oldValue={dialogInfo['oldValue']}
        allowEmptyStr={dialogInfo['allowEmptyStr']}
        handleClose={handleCloseDialog}
        handleOK={dialogInfo['handleOK']}
        open={dialogInfo['open']}
      />

      <div>
        <Dialog
          open={openDeleteBook}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.warning" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {deleteBookInfo.deleteType == 1 ? (
                <FormattedMessage id="pages.books.collection.action.delete_without_books" />
              ) : (
                <FormattedMessage id="pages.books.collection.action.delete_with_books" />
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                handleClose();
                if (deleteBookInfo.deleteType == 1) {
                  deleteCollectionWithoutBooks(deleteBookInfo.uuid).then(() => {
                    fetchBookCollections();
                  });
                } else {
                  deleteCollectionWithBooks(deleteBookInfo.uuid).then(() => {
                    fetchBookCollections();
                  });
                }
              }}
              autoFocus
            >
              <FormattedMessage id="pages.ok" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Dialog
        open={openForEditCover}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="pages.books.collection.action.edit_cover.title" />
        </DialogTitle>
        <DialogContent style={{ margin: '0 auto' }}>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              // event.preventDefault();

              let ok = handleEditCollCover();
              if (ok) {
                handleCloseForEditCover();
              }
            }}
          >
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
                  <FormattedMessage id="pages.books.book.create_book_collection.cover" />:
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
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, ml: 1 }}>
                <FormattedMessage id="pages.books.book.create_book_collection.commit" />
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>

      <AddBooks
        key={uuid2}
        open={addBooksInfo.open}
        handleClose={() => {
          setAddBooksInfo(intOpenDialogInfo);
        }}
        collection_uuid={addBooksInfo.collection_uuid}
        book_type={addBooksInfo.book_type}
      />

      <CollectionBooks
        key={uuid1}
        open={checkCollctionBooks.open}
        handleClose={() => {
          setCheckCollctionBooks(intOpenDialogInfo);
        }}
        collection_uuid={checkCollctionBooks.collection_uuid}
      />
    </div>
  );
}
