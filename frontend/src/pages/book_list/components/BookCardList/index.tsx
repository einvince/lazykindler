import { deleteBook, downloadBook, updateBookCover, updateBookMeta } from '@/services';
import { getAwnserFromChatgpt } from '@/services/chatgpt';
import { humanFileSize, toBase64 } from '@/util';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import StraightenIcon from '@mui/icons-material/Straighten';
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
  FormHelperText,
  Snackbar,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import { Card, Dropdown, List as AntList, Menu, Spin } from 'antd';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { BookMetaDataType } from '../../../data';
import ChangeInfo from '../ChangeInfoDialog';
import Cover from '../Cover';
import ChangeBookColl from './ChangeBookColl';
import ReaderDialog from './Reader';

const { SubMenu } = Menu;

type BookCardListProps = {
  data: any;
  fetchBooks: any;
};

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
  const { data, fetchBooks } = props;

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

  const [bookRelatedInfo, setBookRelatedInfo] = useState<string>('');
  const [openForBookRelatedInfo, setOpenForBookRelatedInfo] = useState(false);

  // 每页条目数
  const [pageNumberSize, setPageNumberSize] = useState(40);

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

  const handleClickOpen = (uuid: string) => {
    setDeleteBookUUID(uuid);
    setOpenDeleteBook(true);
  };

  const handleClose = () => {
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

  const get_book_related_info = (keyword_type: string, keyword: string) => {
    getAwnserFromChatgpt(keyword_type, keyword).then((data) => {
      setOpenForBookRelatedInfo(true);
      setBookRelatedInfo(data.data);
    });
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
          style: {
            textAlign: 'center',
            position: 'fixed',
            bottom: '1.1vh',
            right: 26,
            backgroundColor: '#bfaaf9',
          },
          defaultPageSize: 40,
          hideOnSinglePage: true,
          selectComponentClass: (e: any) => {
            return (
              <>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: '1',
                        onClick: () => {
                          e.onChange(20);
                          setPageNumberSize(20);
                        },
                        label: 20,
                      },
                      {
                        key: '2',
                        onClick: () => {
                          e.onChange(40);
                          setPageNumberSize(40);
                        },
                        label: 40,
                      },
                      {
                        key: '3',
                        onClick: () => {
                          e.onChange(60);
                          setPageNumberSize(60);
                        },
                        label: 60,
                      },
                    ],
                  }}
                  placement="top"
                  arrow
                >
                  <Button>每页数目{pageNumberSize}</Button>
                </Dropdown>
              </>
            );
          },
        }}
        dataSource={data}
        renderItem={(item: BookMetaDataType) => (
          <AntList.Item>
            <Card
              hoverable
              style={{ width: 260 }}
              cover={<Cover uuid={item.uuid} />}
              actions={[
                <Menu key={1} mode="horizontal" selectable={false}>
                  <Button
                    variant="text"
                    style={{ width: '33%' }}
                    onClick={() => {
                      setUUID(uuidv4());
                      setChangeBookCollInfo({
                        item_uuid: item.uuid,
                        open: true,
                      });
                    }}
                  >
                    集合
                  </Button>
                  <Divider orientation="vertical" flexItem />
                  <Button
                    variant="text"
                    style={{ width: '33%' }}
                    onClick={() => {
                      setOpenReadBook({
                        open: true,
                        book_uuid: item.uuid,
                        book_title: item.name,
                      });
                    }}
                  >
                    阅读
                  </Button>
                  <Divider orientation="vertical" flexItem />
                  <SubMenu
                    key="sub4"
                    // icon={<SettingOutlined />}
                    title="操作"
                    style={{
                      zIndex: 10,
                      color: 'dodgerblue',
                      width: '34%',
                      textAlign: 'center',
                    }}
                  >
                    <Menu.Item
                      key="1"
                      onClick={() => {
                        setDialogInfo({
                          title: '修改评分',
                          oldValue: item.stars,
                          allowEmptyStr: false,
                          handleOK: (newValue: any) => {
                            updateBookMeta(item.uuid, 'stars', newValue).then(() => {
                              fetchBooks();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      修改评分
                    </Menu.Item>
                    <Menu.Item
                      key="2"
                      onClick={() => {
                        setDialogInfo({
                          title: '修改标签',
                          oldValue: item.subjects,
                          allowEmptyStr: true,
                          handleOK: (newValue: any) => {
                            updateBookMeta(item.uuid, 'subjects', newValue).then(() => {
                              fetchBooks();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      修改标签
                    </Menu.Item>
                    <Menu.Item
                      key="3"
                      onClick={() => {
                        setUUID(uuidv4());
                        setChangeBookCollInfo({
                          item_uuid: item.uuid,
                          open: true,
                        });
                      }}
                    >
                      修改集合
                    </Menu.Item>
                    <Menu.Item
                      key="4"
                      onClick={() => {
                        setDialogInfo({
                          title: '修改作者',
                          oldValue: item.author,
                          allowEmptyStr: true,
                          handleOK: (newValue: any) => {
                            updateBookMeta(item.uuid, 'author', newValue).then(() => {
                              fetchBooks();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      修改作者
                    </Menu.Item>
                    <Menu.Item
                      key="5"
                      onClick={() => {
                        setDialogInfo({
                          title: '修改出版社',
                          oldValue: item.publisher,
                          allowEmptyStr: true,
                          handleOK: (newValue: any) => {
                            updateBookMeta(item.uuid, 'publisher', newValue).then(() => {
                              fetchBooks();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      修改出版社
                    </Menu.Item>
                    <Menu.Item
                      key="6"
                      onClick={() => {
                        handleOpenForEditCover();
                        setUUIDForEditCover(item.uuid);
                      }}
                    >
                      修改封面
                    </Menu.Item>
                    <Menu.Item
                      key="7"
                      onClick={() => {
                        downloadBook(item.uuid).then(() => {
                          setSnackBar({
                            message: '下载成功!',
                            open: true,
                          });
                        });
                      }}
                    >
                      下载书籍
                    </Menu.Item>
                    <Menu.Item
                      key="8"
                      onClick={() => {
                        setOpenReadBook({
                          open: true,
                          book_uuid: item.uuid,
                          book_title: item.name,
                        });
                      }}
                    >
                      阅读
                    </Menu.Item>
                    <Menu.Item
                      key="9"
                      onClick={() => {
                        get_book_related_info('作者', item.author);
                      }}
                    >
                      查询作者信息
                    </Menu.Item>
                    <Menu.Item
                      key="10"
                      onClick={() => {
                        setOpenForBookRelatedInfo(true);
                        get_book_related_info('书名', item.name);
                      }}
                    >
                      查询书籍信息
                    </Menu.Item>
                    <Menu.Item
                      key="11"
                      onClick={() => {
                        setOpenForBookRelatedInfo(true);
                        handleClickOpen(item.uuid);
                      }}
                    >
                      <span style={{ color: 'red' }}>删除</span>
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
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.stars}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <StraightenIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {humanFileSize(item.size, true)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <ArchiveIcon style={{ height: 16 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.coll_names == 'None' || item.coll_names == null
                          ? ''
                          : item.coll_names}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <LocalOfferIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.subjects == null ? '' : item.subjects}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <AccountCircleIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.author == null ? '' : item.author}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <AccountBalanceIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, paddingLeft: 15 }}>
                        {item.publisher == null ? '' : item.publisher}
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
        >
          <DialogTitle id="alert-dialog-title">警告</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">确定删除这本书吗？</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button
              onClick={() => {
                handleClose();
                deleteBook(deleteBookUUID).then(() => {
                  fetchBooks();
                });
              }}
              autoFocus
            >
              确定
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
        <DialogTitle id="alert-dialog-title">{'修改集合封面'}</DialogTitle>
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
                封面:
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
          <Button onClick={handleCloseForEditCover}>取消</Button>
          <Button
            onClick={() => {
              let ok = handleEditCollCover();
              if (ok) {
                handleCloseForEditCover();
              }
            }}
            autoFocus
          >
            确认
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

      <div>
        <Dialog
          maxWidth="sm"
          fullWidth
          open={openForBookRelatedInfo}
          onClose={() => {
            setOpenForBookRelatedInfo(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">简要信息</DialogTitle>
          <DialogContent style={{ height: 300, overflow: 'auto' }}>
            {bookRelatedInfo == '' ? (
              <div>
                <Spin size="large" style={{ display: 'block', margin: '90px auto' }} />
              </div>
            ) : (
              <DialogContentText id="alert-dialog-description">{bookRelatedInfo}</DialogContentText>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
