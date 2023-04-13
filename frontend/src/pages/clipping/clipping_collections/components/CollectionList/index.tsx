import { CollectionDataType } from '@/pages/data';
import {
  deleteCollectionWithBooks,
  deleteCollectionWithoutBooks,
  updateCollection,
  updateCollectionCover,
} from '@/services';
import { countChOfStr, preHandleSubjects, toBase64 } from '@/util';
import { SettingOutlined, TagOutlined } from '@ant-design/icons';
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
import { Card, Menu } from 'antd';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { FormattedMessage, useIntl } from 'umi';
import { v4 as uuidv4 } from 'uuid';

import '../../../../../components/Css/CollCard.css';
import ChangeInfo from '../../../../book_list/components/ChangeInfoDialog';
import Cover from '../../../../book_list/components/Cover';
import CollectionClippings from '../CollectionClippings';

import type { MenuProps } from 'antd';

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

type ClippingListProps = {
  data: any;
  fetchClippingCollections: any;
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
}

const intOpenDialogInfo: OpenDialogType = {
  open: false,
  collection_uuid: null,
};

export default function CollectionList(props: ClippingListProps) {
  const { data, fetchClippingCollections } = props;
  const [uuid1, setUUID1] = useState<any>(uuidv4());
  const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
  const [openDeleteClipping, setOpenDeleteClipping] = useState(false);
  const [deleteClippingInfo, setDeleteClippingInfo] = useState<any>({});
  const [checkCollctionClippings, setCheckCollctionClippings] =
    useState<OpenDialogType>(intOpenDialogInfo);

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

  const actionMenuList = [
    getItem(<FormattedMessage id="pages.books.collection.action" />, 'sub4', <SettingOutlined />, [
      getItem(<FormattedMessage id="pages.clipping.action.open" />, 'open'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_title" />, 'edit_title'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_rating" />, 'edit_rating'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_tags" />, 'edit_tags'),
      getItem(<FormattedMessage id="pages.books.collection.action.edit_cover" />, 'edit_cover'),
      getItem(
        <span style={{ color: 'red' }}>
          <FormattedMessage id="pages.clipping.action.remove_but_keep_clipping" />
        </span>,
        'remove_but_keep_clipping',
      ),
      getItem(
        <span style={{ color: 'red' }}>
          <FormattedMessage id="pages.clipping.action.remove_and_remove_clipping" />
        </span>,
        'remove_and_remove_clipping',
      ),
    ]),
  ];

  const onClickActionMenu = (key: string, item: CollectionDataType) => {
    switch (key) {
      case 'open':
        setUUID1(uuidv4());
        setCheckCollctionClippings({
          open: true,
          collection_uuid: item.uuid,
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
              fetchClippingCollections();
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
              fetchClippingCollections();
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
            updateCollection(item.uuid, 'tag', preHandleSubjects(newValue)).then(() => {
              fetchClippingCollections();
            });
          },
          open: true,
        });
        break;
      case 'edit_cover':
        handleOpenForEditCover();
        setUUIDForEditCover(item.uuid);
        break;
      case 'remove_but_keep_clipping':
        handleClickOpenForDeleteColl(item.uuid, 1);
        break;
      case 'remove_and_remove_clipping':
        handleClickOpenForDeleteColl(item.uuid, 2);
        break;
    }
  };

  // deleteType
  // 0 初始值
  // 1 删除集合时不删除摘抄
  // 2 删除集合时删除摘抄
  const handleClickOpenForDeleteColl = (uuid: string, deleteType: number) => {
    setDeleteClippingInfo({ uuid, deleteType });
    setOpenDeleteClipping(true);
  };

  const handleCloseForDeleteColl = () => {
    setOpenDeleteClipping(false);
  };

  const handleCloseDialogForChangeCollInfo = () => {
    setDialogInfo(initialDialogInfo);
  };

  const handleEditCollCover = () => {
    let cover = formData['cover'];

    if (cover == null || cover.trim() == '') {
      return false;
    }

    cover = cover.trim();

    updateCollectionCover(uuidForEditCover, cover).then(() => {
      fetchClippingCollections();
    });
    return true;
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
                            setCheckCollctionClippings({
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
                              {countChOfStr(item.item_uuids, ';')}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                            <TagOutlined style={{ height: 16, paddingLeft: 4.5 }} />
                            <Typography
                              variant="body2"
                              style={{ paddingTop: 1.2, paddingLeft: 15 }}
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
        handleClose={handleCloseDialogForChangeCollInfo}
        handleOK={dialogInfo['handleOK']}
        open={dialogInfo['open']}
      />

      <div>
        <Dialog
          open={openDeleteClipping}
          onClose={handleCloseForDeleteColl}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.warning" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {deleteClippingInfo.deleteType == 1 ? (
                <FormattedMessage id="pages.books.collection.action.delete_without_clippings" />
              ) : (
                <FormattedMessage id="pages.books.collection.action.delete_with_clippings" />
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForDeleteColl}>
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                handleCloseForDeleteColl();
                if (deleteClippingInfo.deleteType == 1) {
                  deleteCollectionWithoutBooks(deleteClippingInfo.uuid).then(() => {
                    fetchClippingCollections();
                  });
                } else {
                  deleteCollectionWithBooks(deleteClippingInfo.uuid).then(() => {
                    fetchClippingCollections();
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

                fetchClippingCollections();
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

      <CollectionClippings
        key={uuid1}
        open={checkCollctionClippings.open}
        handleClose={() => {
          setCheckCollctionClippings(intOpenDialogInfo);
        }}
        collection_uuid={checkCollctionClippings.collection_uuid}
      />
    </div>
  );
}
