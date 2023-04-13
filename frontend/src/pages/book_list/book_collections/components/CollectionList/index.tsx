import {
  deleteCollectionWithBooks,
  deleteCollectionWithoutBooks,
  updateCollection,
  updateCollectionCover,
} from '@/services';
import { countChOfStr, preHandleSubjects, toBase64 } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import ArchiveIcon from '@mui/icons-material/Archive';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import StarIcon from '@mui/icons-material/Star';
import Masonry from '@mui/lab/Masonry';
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
  IconButton,
  TablePagination,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import type { MenuProps } from 'antd';
import { Card, Menu } from 'antd';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage, useIntl } from 'umi';
import { v4 as uuidv4 } from 'uuid';

import { CollectionDataType } from '@/pages/data';
import '../../../../../components/Css/CollCard.css';
import ChangeInfo from '../../../components/ChangeInfoDialog';
import Cover from '../../../components/Cover';
import AddBooks from '../AddBooks';
import CollectionBooks from '../CollectionBooks';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  theme?: 'light' | 'dark',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    theme,
  } as MenuItem;
}

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

export default function BookCollectionCardList(props: BookCardListProps) {
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

  // 每页条目数
  const [pageNumberSize, setPageNumberSize] = useState(40);
  const [page, setPage] = useState(0);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setPageNumberSize(parseInt(event.target.value, 10));
    setPage(0);
  };

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
  const handleClickOpenForDeleteBook = (uuid: string, deleteType: number) => {
    setDeleteBookInfo({ uuid, deleteType });
    setOpenDeleteBook(true);
  };

  const handleCloseForDeleteBook = () => {
    setOpenDeleteBook(false);
  };

  const handleCloseDialogForChangeValue = () => {
    setDialogInfo(initialDialogInfo);
  };

  const handleEditCollCover = () => {
    let cover = formData['cover'];

    if (cover === undefined || cover.trim() === '') {
      return false;
    }

    cover = cover.trim();

    updateCollectionCover(uuidForEditCover, cover).then(() => {
      fetchBookCollections();
    });
    return true;
  };

  const actionMenuList = [
    getItem(<FormattedMessage id="pages.books.collection.action" />, 'sub4', <SettingOutlined />, [
      getItem(
        <FormattedMessage id="pages.books.collection.action.add_books_to_storage" />,
        'add_books_to_storage',
      ),
      getItem(
        <FormattedMessage id="pages.books.collection.action.add_books_to_tmp_storage" />,
        'add_books_to_tmp_storage',
      ),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_title" />, 'edit_title'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_rating" />, 'edit_rating'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_tags" />, 'edit_tags'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_cover" />, 'edit_cover'),
      getItem(
        <span style={{ color: 'red' }}>
          <FormattedMessage id="pages.books.collection.action.remove_but_keep_book" />
        </span>,
        'remove_but_keep_book',
      ),
      getItem(
        <span style={{ color: 'red' }}>
          <FormattedMessage id="pages.books.collection.action.remove_and_remove_book" />
        </span>,
        'remove_and_remove_book',
      ),
    ]),
  ];

  const onClickActionMenu = (key: string, item: CollectionDataType) => {
    switch (key) {
      case 'add_books_to_storage':
        setUUID2(uuidv4());
        setAddBooksInfo({
          open: true,
          collection_uuid: item.uuid,
          book_type: 'no_tmp',
        });
        break;
      case 'add_books_to_tmp_storage':
        setUUID2(uuidv4());
        setAddBooksInfo({
          open: true,
          collection_uuid: item.uuid,
          book_type: 'tmp',
        });
        break;
      case 'edit_title':
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
        break;
      case 'edit_rating':
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
        break;
      case 'edit_tags':
        setDialogInfo({
          title: intl.formatMessage({
            id: 'pages.books.collection.action.edit_tags',
          }),
          oldValue: item.tags,
          allowEmptyStr: false,
          handleOK: (newValue: any) => {
            updateCollection(item.uuid, 'tags', preHandleSubjects(newValue)).then(() => {
              fetchBookCollections();
            });
          },
          open: true,
        });
        break;
      case 'edit_cover':
        handleOpenForEditCover();
        setUUIDForEditCover(item.uuid);
        break;
      case 'remove_but_keep_book':
        handleClickOpenForDeleteBook(item.uuid, 1);
        break;
      case 'remove_and_remove_book':
        handleClickOpenForDeleteBook(item.uuid, 2);
        break;
    }
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Masonry style={{ width: '100%' }} columns={4} spacing={3}>
          {data
            .slice(page * pageNumberSize, (page + 1) * pageNumberSize)
            .map((item: CollectionDataType) => {
              return (
                <div className="card-container" key={item.uuid}>
                  <Card
                    hoverable
                    cover={<Cover uuid={item.uuid} />}
                    actions={[
                      <Menu
                        onClick={({ key, domEvent }) => {
                          domEvent.preventDefault();

                          onClickActionMenu(key, item);
                        }}
                        items={actionMenuList}
                        mode="vertical"
                        key={'1'}
                        selectable={false}
                      ></Menu>,
                    ]}
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
                            <Typography
                              variant="body2"
                              style={{ paddingTop: 1.2, paddingLeft: 15 }}
                            >
                              {item.star}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                            <FormatListNumberedIcon style={{ height: 20 }} />
                            <Typography
                              variant="body2"
                              style={{ paddingTop: 1.2, paddingLeft: 15 }}
                            >
                              {countChOfStr(item.item_uuids, ';')}{' '}
                              <FormattedMessage id="pages.books.books" />
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                            <ArchiveIcon style={{ height: 16 }} />
                            <Typography
                              variant="body2"
                              style={{ paddingTop: 1.2, paddingLeft: 15, wordBreak: 'break-all' }}
                            >
                              {item.tags}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                            <DateRangeIcon style={{ height: 16 }} />
                            <Typography
                              variant="body2"
                              style={{ paddingTop: 1.2, paddingLeft: 15 }}
                            >
                              {item.create_time.split(' ')[0]}
                            </Typography>
                          </Box>
                        </div>
                      }
                    />
                  </Card>
                </div>
              );
            })}
        </Masonry>

        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageNumberSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={<FormattedMessage id="pages.items_per_page" />}
          rowsPerPageOptions={[40, 60, 80]}
          style={{
            position: 'fixed',
            marginRight: 20,
            bottom: 0,
            right: 0,
          }}
        />
      </Box>

      <ChangeInfo
        title={dialogInfo['title']}
        oldValue={dialogInfo['oldValue']}
        allowEmptyStr={dialogInfo['allowEmptyStr']}
        handleClose={handleCloseDialogForChangeValue}
        handleOK={dialogInfo['handleOK']}
        open={dialogInfo['open']}
      />

      <div>
        <Dialog
          open={openDeleteBook}
          onClose={handleCloseForDeleteBook}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.warning" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {deleteBookInfo.deleteType === 1 ? (
                <FormattedMessage id="pages.books.collection.action.delete_without_books" />
              ) : (
                <FormattedMessage id="pages.books.collection.action.delete_with_books" />
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForDeleteBook}>
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                handleCloseForDeleteBook();
                if (deleteBookInfo.deleteType === 1) {
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
        onClose={handleCloseForEditCover}
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
              event.preventDefault();

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
              <FormControl sx={{ m: 1, mt: 3, width: '25ch' }}>
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

      <AddBooks
        key={uuid2}
        open={addBooksInfo.open}
        handleClose={() => {
          setAddBooksInfo(intOpenDialogInfo);
        }}
        collection_uuid={addBooksInfo.collection_uuid}
        book_type={addBooksInfo.book_type}
        fetchBookCollections={fetchBookCollections}
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
