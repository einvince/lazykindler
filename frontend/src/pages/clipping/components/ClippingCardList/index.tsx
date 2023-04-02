import { ClippingDataType } from '@/pages/data';
import { addHighlight, deleteClipping, deleteHighlight, updateClipping } from '@/services';
import { handleClippingContent } from '@/util';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import { Box, Button, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import { Card, Dropdown, List as AntList, Menu } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import Highlighter from 'react-highlight-words';
import { v4 as uuidv4 } from 'uuid';

import { FormattedMessage, useIntl } from 'umi';
import ChangeInfo from '../../../book_list/components/ChangeInfoDialog';
import ChangeClippingColl from './ChangeClippingColl';
import ClippingDialog from './ClippingDialog';
import hetiStyles from './heti.min.css';

const { SubMenu } = Menu;

type ClippingCardListProps = {
  data: any;
  fetchClippings: any;
};

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
  const { data, fetchClippings } = props;

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

  const handleClickOpen = (uuid: string) => {
    setDeleteClippingUUID(uuid);
    setOpenDeleteClipping(true);
  };

  const handleClose = () => {
    setOpenDeleteClipping(false);
  };

  return (
    <div>
      <div>
        <AntList
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
                    <Button>
                      <FormattedMessage id="pages.items_per_page" />
                      {pageNumberSize}
                    </Button>
                  </Dropdown>
                </>
              );
            },
          }}
          dataSource={data}
          renderItem={(item: ClippingDataType, index: number) => (
            <Card
              key={index}
              className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']}`}
              style={{ marginRight: 15, marginBottom: 15 }}
              bodyStyle={{ padding: 9 }}
              hoverable
              actions={[
                <Menu key={1} mode="horizontal" selectable={false}>
                  <Button
                    variant="text"
                    style={{ width: '50%' }}
                    onClick={() => {
                      setUUID(uuidv4());
                      setChangeClippingCollInfo({
                        item_uuid: item.uuid,
                        open: true,
                      });
                    }}
                  >
                    <FormattedMessage id="pages.books.book.action.collection" />
                  </Button>
                  <Divider orientation="vertical" flexItem />
                  <SubMenu
                    key="sub4"
                    style={{
                      zIndex: 10,
                      color: 'dodgerblue',
                      width: '50%',
                    }}
                    title={<FormattedMessage id="pages.books.book.action" />}
                  >
                    <Menu.Item
                      key="1"
                      onClick={() => {
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
                      }}
                    >
                      <FormattedMessage id="pages.books.book.action.edit_rating" />
                    </Menu.Item>
                    <Menu.Item
                      key="2"
                      onClick={() => {
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
                      }}
                    >
                      <FormattedMessage id="pages.books.book.action.edit_tags" />
                    </Menu.Item>
                    <Menu.Item
                      key="3"
                      onClick={() => {
                        setUUID(uuidv4());
                        setChangeClippingCollInfo({
                          item_uuid: item.uuid,
                          open: true,
                        });
                      }}
                    >
                      <FormattedMessage id="pages.books.book.action.edit_collection" />
                    </Menu.Item>
                    <Menu.Item
                      key="4"
                      onClick={() => {
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
                      }}
                    >
                      <FormattedMessage id="pages.books.book.action.edit_author" />
                    </Menu.Item>
                    <Menu.Item
                      key="6"
                      onClick={() => {
                        handleClickOpen(item.uuid);
                      }}
                    >
                      <span style={{ color: 'red' }}>
                        <FormattedMessage id="pages.books.book.action.delete" />
                      </span>
                    </Menu.Item>
                  </SubMenu>
                </Menu>,
              ]}
            >
              <Card.Meta
                title={<a>{item.book_name}</a>}
                description={
                  <div>
                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <AccountCircleIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, marginLeft: -18 }}>
                        {item.author == null ? '' : item.author}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <MoreTimeIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, marginLeft: -18 }}>
                        {moment.unix(~~item.addDate).format('YYYY-MM-DD HH:mm:ss')}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" style={{ marginBottom: 10 }}>
                      <LocalOfferIcon style={{ height: 20 }} />
                      <Typography variant="body2" style={{ paddingTop: 1.2, marginLeft: -18 }}>
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
            open={openDeleteClipping}
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
                <FormattedMessage id="pages.highlight.action.delete.info" />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                <FormattedMessage id="pages.cancel" />
              </Button>
              <Button
                onClick={() => {
                  handleClose();
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

        <div>
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
        </div>

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
