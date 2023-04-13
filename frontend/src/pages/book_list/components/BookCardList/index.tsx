import { deleteBook, downloadBook, updateBookCover, updateBookMeta } from '@/services';
import { humanFileSize, toBase64 } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import StraightenIcon from '@mui/icons-material/Straighten';
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
  Snackbar,
  TablePagination,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { Card, Menu } from 'antd';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage, useIntl } from 'umi';
import { v4 as uuidv4 } from 'uuid';

import '../../../../components/Css/ItemCard.css';
import ReaderDialog from '../../../../components/Reader';
import { BookMetaDataType } from '../../../data';
import ChangeInfo from '../ChangeInfoDialog';
import Cover from '../Cover';
import ChangeBookColl from './ChangeBookColl';

import type { MenuProps } from 'antd';

type BookCardListProps = {
  data: any;
  fetchBooks: any;
  tablePaginationStyle: any;
};
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

const initialDialogInfo = {
  title: '',
  allowEmptyStr: false,
  handleOK: null,
  open: false,
};

const initialDialogInfoForReadBook = {
  open: false,
  book_title: '',
  book_uuid: null,
};

export default function BookCardList(props: BookCardListProps) {
  const { data, fetchBooks, tablePaginationStyle } = props;

  const intl = useIntl();

  const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
  const [changeBookCollInfo, setChangeBookCollInfo] = useState<any>({
    item_uuid: '',
    open: false,
  });
  const [openReadBook, setOpenReadBook] = useState<any>(initialDialogInfoForReadBook);
  const [openDeleteBook, setOpenDeleteBook] = useState(false);
  const [deleteBookUUID, setDeleteBookUUID] = useState('');
  const [uuid, setUUID] = useState(uuidv4());

  const [formData, setFormData] = useState<any>({});

  const [uuidForEditCover, setUUIDForEditCover] = useState<any>();
  const [openForEditCover, setOpenForEditCover] = useState(false);

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

  const [snackBar, setSnackBar] = useState<any>({
    message: '',
    open: false,
  });

  const handleOpenForEditCover = () => {
    setOpenForEditCover(true);
  };

  const handleCloseForEditCover = () => {
    setOpenForEditCover(false);
  };

  const handleCloseDialog = () => {
    setDialogInfo(initialDialogInfo);
  };

  const handleClickOpenForDeleteBook = (uuid: string) => {
    setDeleteBookUUID(uuid);
    setOpenDeleteBook(true);
  };

  const handleCloseOpenForDeleteBook = () => {
    setOpenDeleteBook(false);
  };

  const handleEditCollCover = () => {
    let cover = formData['cover'];

    if (cover == null || cover.trim() == '') {
      return false;
    }

    cover = cover.trim();

    updateBookCover(uuidForEditCover, cover);
    return true;
  };

  const actionMenuList = [
    getItem(<FormattedMessage id="pages.books.book.action.collection" />, 'collection'),
    getItem(<FormattedMessage id="pages.books.book.action.read" />, 'read'),
    getItem(<FormattedMessage id="pages.books.collection.action" />, 'sub4', <SettingOutlined />, [
      getItem(<FormattedMessage id="pages.books.book.action.edit_title" />, 'edit_title'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_tags" />, 'edit_tags'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_collection" />, 'edit_collection'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_author" />, 'edit_author'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_publisher" />, 'edit_publisher'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_cover" />, 'edit_cover'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_rating" />, 'edit_rating'),
      getItem(<FormattedMessage id="pages.books.book.action.read" />, 'read_book'),
      getItem(<FormattedMessage id="pages.books.book.action.delete" />, 'delete'),
    ]),
  ];

  const onClickActionMenu = (key: string, item: BookMetaDataType) => {
    switch (key) {
      case 'collection':
      case 'edit_collection':
        setUUID(uuidv4());
        setChangeBookCollInfo({
          item_uuid: item.uuid,
          open: true,
        });
        break;
      case 'read':
      case 'read_book':
        setOpenReadBook({
          open: true,
          book_uuid: item.uuid,
          book_title: item.name,
        });
        break;
      case 'edit_title':
        setDialogInfo({
          title: intl.formatMessage({ id: 'pages.books.book.action.edit_title' }),
          oldValue: item.name,
          allowEmptyStr: false,
          handleOK: (newValue: any) => {
            updateBookMeta(item.uuid, 'name', newValue).then(() => {
              fetchBooks();
            });
          },
          open: true,
        });
        break;
      case 'edit_tags':
        setDialogInfo({
          title: intl.formatMessage({ id: 'pages.books.book.action.edit_tags' }),
          oldValue: item.tags,
          allowEmptyStr: true,
          handleOK: (newValue: any) => {
            updateBookMeta(item.uuid, 'tags', newValue).then(() => {
              fetchBooks();
            });
          },
          open: true,
        });
        break;
      case 'edit_author':
        setDialogInfo({
          title: intl.formatMessage({ id: 'pages.books.book.action.edit_author' }),
          oldValue: item.author,
          allowEmptyStr: true,
          handleOK: (newValue: any) => {
            updateBookMeta(item.uuid, 'author', newValue).then(() => {
              fetchBooks();
            });
          },
          open: true,
        });
        break;
      case 'edit_rating':
        setDialogInfo({
          title: intl.formatMessage({ id: 'pages.books.book.action.edit_rating' }),
          oldValue: item.star,
          allowEmptyStr: false,
          handleOK: (newValue: any) => {
            updateBookMeta(item.uuid, 'star', newValue).then(() => {
              fetchBooks();
            });
          },
          open: true,
        });
        break;
      case 'edit_publisher':
        setDialogInfo({
          title: intl.formatMessage({
            id: 'pages.books.book.action.edit_publisher',
          }),
          oldValue: item.publisher,
          allowEmptyStr: true,
          handleOK: (newValue: any) => {
            updateBookMeta(item.uuid, 'publisher', newValue).then(() => {
              fetchBooks();
            });
          },
          open: true,
        });
        break;
      case 'edit_cover':
        handleOpenForEditCover();
        setUUIDForEditCover(item.uuid);
        break;
      case 'download':
        downloadBook(item.uuid).then(() => {
          setSnackBar({
            message: intl.formatMessage({ id: 'pages.download_success' }),
            open: true,
          });
        });
        break;
      case 'delete':
        handleClickOpenForDeleteBook(item.uuid);
        break;
    }
  };

  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '70vh',
          }}
        >
          <Box flexGrow={1}>
            <Masonry style={{ width: '100%' }} columns={4} spacing={3}>
              {data
                .slice(page * pageNumberSize, (page + 1) * pageNumberSize)
                .map((item: BookMetaDataType) => {
                  return (
                    <div className="card-container" key={item.uuid}>
                      <Card
                        hoverable
                        key={item.md5}
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
                              style={{
                                maxHeight: '40vh',
                                overflow: 'auto',
                                marginTop: 10,
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
                                <StraightenIcon style={{ height: 20 }} />
                                <Typography
                                  variant="body2"
                                  style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                >
                                  {humanFileSize(item.size, true)}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                                <ArchiveIcon style={{ height: 16 }} />
                                <Typography
                                  variant="body2"
                                  style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                >
                                  {item.coll_names == 'None' || item.coll_names == null
                                    ? ''
                                    : item.coll_names}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                                <LocalOfferIcon style={{ height: 20 }} />
                                <Typography
                                  variant="body2"
                                  style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                >
                                  {item.tags == null ? '' : item.tags}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                                <AccountCircleIcon style={{ height: 20 }} />
                                <Typography
                                  variant="body2"
                                  style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                >
                                  {item.author == null ? '' : item.author}
                                </Typography>
                              </Box>

                              <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                                <AccountBalanceIcon style={{ height: 20 }} />
                                <Typography
                                  variant="body2"
                                  style={{ paddingTop: 1.2, paddingLeft: 15 }}
                                >
                                  {item.publisher == null ? '' : item.publisher}
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
          </Box>

          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={pageNumberSize}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={<FormattedMessage id="pages.items_per_page" />}
            rowsPerPageOptions={[40, 60, 80]}
            style={tablePaginationStyle}
          />
        </Box>
      </Box>

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
          onClose={handleCloseOpenForDeleteBook}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.warning" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="pages.books.book.action.delete.info" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOpenForDeleteBook}>
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                handleCloseOpenForDeleteBook();
                deleteBook(deleteBookUUID).then(() => {
                  fetchBooks();
                });
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
          <FormattedMessage id="pages.books.book.action.edit_cover" />
        </DialogTitle>
        <DialogContent style={{ margin: '0 auto' }}>
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
                    label={<FormattedMessage id="pages.books.book.create_book_collection.cover" />}
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForEditCover}>
            <FormattedMessage id="pages.cancel" />
          </Button>
          <Button
            onClick={() => {
              let ok = handleEditCollCover();
              if (ok) {
                handleCloseForEditCover();
              }
            }}
            autoFocus
          >
            <FormattedMessage id="pages.ok" />
          </Button>
        </DialogActions>
      </Dialog>

      <ChangeBookColl
        key={uuid}
        item_uuid={changeBookCollInfo['item_uuid']}
        open={changeBookCollInfo['open']}
        fetchBooks={fetchBooks}
        handleClose={() => {
          setChangeBookCollInfo({
            item_uuid: '',
            open: false,
          });
        }}
      />

      <Snackbar
        open={snackBar.open}
        onClose={() => {
          setSnackBar({
            message: '',
            open: false,
          });
        }}
        autoHideDuration={3000}
        message={snackBar.message}
        key={snackBar.message}
      />

      <ReaderDialog
        open={openReadBook.open}
        book_title={openReadBook.book_title}
        book_uuid={openReadBook.book_uuid}
        onClose={() => {
          setOpenReadBook(initialDialogInfoForReadBook);
        }}
      />
    </div>
  );
}
