import { addHighlight, deleteClipping, deleteHighlight, updateClipping } from '@/services';
import { handleClippingContent } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import Masonry from '@mui/lab/Masonry';
import { Box, Button, TablePagination, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Card, Menu } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { v4 as uuidv4 } from 'uuid';

import { ClippingDataType } from '@/pages/data';
import { FormattedMessage, useIntl } from 'umi';
import ChangeInfo from '../../../book_list/components/ChangeInfoDialog';
import ChangeClippingColl from './ChangeClippingColl';
import ClippingDialog from './ClippingDialog';
import hetiStyles from './heti.min.css';

import type { MenuProps } from 'antd';

type ClippingCardListProps = {
  data: any;
  fetchClippings: any;
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

const initialHighlightInfo = {
  uuid: '',
  selectedText: '',
  open: false,
};

const initialClippingDialogInfo = {
  uuid: '',
  open: false,
  clippingContent: '',
  book_name: '',
};

const ClippingCardList = (props: ClippingCardListProps) => {
  const { data, fetchClippings, tablePaginationStyle } = props;

  const intl = useIntl();

  const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
  const [changeClippingCollInfo, setChangeClippingCollInfo] = useState<any>({
    item_uuid: '',
    open: false,
  });
  const [openDeleteClipping, setOpenDeleteClipping] = useState(false);
  const [deleteClippingUUID, setDeleteClippingUUID] = useState('');
  const [uuid, setUUID] = useState(uuidv4());
  const [highlighInfo, setHighlightInfo] = useState(initialHighlightInfo);
  const [clippingDialogInfo, setClippingDialogInfo] = useState<any>(initialClippingDialogInfo);

  // 每页条目数
  const [pageNumberSize, setPageNumberSize] = useState(40);

  const handleCloseDialog = () => {
    setDialogInfo(initialDialogInfo);
  };

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

  const handleClickOpenForDeleteClip = (uuid: string) => {
    setDeleteClippingUUID(uuid);
    setOpenDeleteClipping(true);
  };

  const handleCloseForDeleteClip = () => {
    setOpenDeleteClipping(false);
  };

  const actionMenuList = [
    getItem(<FormattedMessage id="pages.books.book.action.collection" />, 'collection'),
    getItem(<FormattedMessage id="pages.books.book.action" />, 'sub4', <SettingOutlined />, [
      getItem(<FormattedMessage id="pages.books.book.action.edit_rating" />, 'edit_rating'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_tags" />, 'edit_tags'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_collection" />, 'edit_collection'),
      getItem(<FormattedMessage id="pages.books.book.action.edit_author" />, 'edit_author'),
      getItem(<FormattedMessage id="pages.books.book.action.delete" />, 'delete'),
    ]),
  ];

  const onClickActionMenu = (key: string, item: ClippingDataType) => {
    switch (key) {
      case 'collection':
      case 'edit_collection':
        setUUID(uuidv4());
        setChangeClippingCollInfo({
          item_uuid: item.uuid,
          open: true,
        });
        break;
      case 'edit_rating':
        setDialogInfo({
          title: intl.formatMessage({ id: 'pages.books.book.action.edit_rating' }),
          oldValue: item.star,
          allowEmptyStr: false,
          handleOK: (newValue: any) => {
            updateClipping(item.uuid, 'star', newValue).then(() => {
              fetchClippings();
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
            updateClipping(item.uuid, 'tags', newValue).then(() => {
              fetchClippings();
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
            updateClipping(item.uuid, 'author', newValue).then(() => {
              fetchClippings();
            });
          },
          open: true,
        });
        break;
      case 'delete':
        handleClickOpenForDeleteClip(item.uuid);
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
                .map((item: ClippingDataType) => {
                  return (
                    <Card
                      key={item.uuid}
                      className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']}`}
                      style={{ marginRight: 15, marginBottom: 15 }}
                      bodyStyle={{ padding: 9 }}
                      hoverable
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
                        title={<a>{item.book_name}</a>}
                        description={
                          <div>
                            <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                              <AccountCircleIcon style={{ height: 20 }} />
                              <Typography
                                variant="body2"
                                style={{ paddingTop: 1.2, marginLeft: -18 }}
                              >
                                {item.author == null ? '' : item.author}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                              <MoreTimeIcon style={{ height: 20 }} />
                              <Typography
                                variant="body2"
                                style={{ paddingTop: 1.2, marginLeft: -18 }}
                              >
                                {moment.unix(~~item.addDate).format('YYYY-MM-DD HH:mm:ss')}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                              <LocalOfferIcon style={{ height: 20 }} />
                              <Typography
                                variant="body2"
                                style={{ paddingTop: 1.2, marginLeft: -18 }}
                              >
                                {item.tags == null ? '' : item.tags}
                              </Typography>
                            </Box>
                          </div>
                        }
                      />
                      <article
                        className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']} ${hetiStyles['heti-hang']} ${hetiStyles['heti-meta heti-small']} `}
                        style={{
                          maxHeight: '40vh',
                          overflow: 'auto',
                          marginTop: 8,
                          fontSize: 15,
                          whiteSpace: 'pre-wrap',
                        }}
                        onClick={() => {
                          let selectedText = window.getSelection()!.toString();
                          if (selectedText.length > 0) {
                            return;
                          }
                          setClippingDialogInfo({
                            uuid: item.uuid,
                            open: true,
                            handleClose: () => {
                              setChangeClippingCollInfo(initialClippingDialogInfo);
                            },
                            clippingContent: item.content,
                            highlights: item.highlights,
                            book_name: item.book_name,
                          });
                        }}
                        onMouseUp={() => {
                          let uuid = item.uuid;
                          let selectedText = window.getSelection()!.toString();
                          if (selectedText !== '') {
                            let info = {
                              open: true,
                              selectedText: selectedText,
                              uuid: uuid,
                            };
                            setHighlightInfo(info);
                          }
                        }}
                      >
                        <Highlighter
                          // style={{ fontSize: 17 }}
                          highlightStyle={{ color: 'red' }}
                          searchWords={item.highlights || []}
                          autoEscape={true}
                          // textToHighlight={item.content}
                          textToHighlight={handleClippingContent(item.content)}
                        />
                      </article>
                    </Card>
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

      <div>
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
            open={openDeleteClipping}
            onClose={handleCloseForDeleteClip}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
          >
            <DialogTitle id="alert-dialog-title">
              <FormattedMessage id="pages.warning" />
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <FormattedMessage id="pages.highlight.action.delete.info" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseForDeleteClip}>
                <FormattedMessage id="pages.cancel" />
              </Button>
              <Button
                onClick={() => {
                  handleCloseForDeleteClip();
                  deleteClipping(deleteClippingUUID).then(() => {
                    fetchClippings();
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
          open={highlighInfo.open}
          onClose={() => {
            setHighlightInfo(initialHighlightInfo);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.highlight.action.highlight" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="pages.highlight.action.highlight.info" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setHighlightInfo(initialHighlightInfo);
              }}
            >
              <FormattedMessage id="pages.cancel" />
            </Button>
            <Button
              onClick={() => {
                setHighlightInfo(initialHighlightInfo);
                deleteHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(() => {
                  fetchClippings();
                });
              }}
            >
              <FormattedMessage id="pages.highlight.action.highlight.delete" />
            </Button>
            <Button
              onClick={() => {
                addHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(() => {
                  fetchClippings();
                });
                setHighlightInfo(initialHighlightInfo);
              }}
              autoFocus
            >
              <FormattedMessage id="pages.ok" />
            </Button>
          </DialogActions>
        </Dialog>

        <ChangeClippingColl
          key={uuid}
          item_uuid={changeClippingCollInfo['item_uuid']}
          open={changeClippingCollInfo['open']}
          fetchClippings={fetchClippings}
          handleClose={() => {
            setChangeClippingCollInfo({
              item_uuid: '',
              open: false,
            });
          }}
        />

        <ClippingDialog
          uuid={clippingDialogInfo.uuid}
          open={clippingDialogInfo.open}
          handleClose={() => {
            setClippingDialogInfo({
              uuid: '',
              open: false,
            });
          }}
          clippingContent={clippingDialogInfo.clippingContent}
          highlights={clippingDialogInfo.highlights}
          book_name={clippingDialogInfo.book_name}
          fetchClippings={fetchClippings}
        />
      </div>
    </div>
  );
};

export default ClippingCardList;
