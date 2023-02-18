import { ClippingDataType } from '@/pages/data';
import { addHighlight, deleteClipping, deleteHighlight, updateClipping } from '@/services';
import { handleClippingContent } from '@/util';
import Button from '@mui/material/Button';
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
  // handleClose
  clippingContent: '',
  // highlights: [],
  book_name: '',
};

const ClippingCardList = (props: ClippingCardListProps) => {
  const { data, fetchClippings } = props;

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
                    <Button>每页数目{pageNumberSize}</Button>
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
                    集合
                  </Button>
                  <Divider orientation="vertical" flexItem />
                  <SubMenu
                    key="sub4"
                    style={{
                      zIndex: 10,
                      color: 'dodgerblue',
                      width: '50%',
                      // textAlign: 'center',
                    }}
                    // icon={<SettingOutlined />}
                    title="操作"
                  >
                    <Menu.Item
                      key="1"
                      onClick={() => {
                        setDialogInfo({
                          title: '修改评分',
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
                      修改评分
                    </Menu.Item>
                    <Menu.Item
                      key="2"
                      onClick={() => {
                        setDialogInfo({
                          title: '修改标签',
                          oldValue: item.tag,
                          allowEmptyStr: true,
                          handleOK: (newValue: any) => {
                            updateClipping(item.uuid, 'tag', newValue).then(() => {
                              fetchClippings();
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
                        setChangeClippingCollInfo({
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
                            updateClipping(item.uuid, 'author', newValue).then(() => {
                              fetchClippings();
                            });
                          },
                          open: true,
                        });
                      }}
                    >
                      修改作者
                    </Menu.Item>
                    <Menu.Item
                      key="6"
                      onClick={() => {
                        handleClickOpen(item.uuid);
                      }}
                    >
                      <span style={{ color: 'red' }}>删除</span>
                    </Menu.Item>
                  </SubMenu>
                </Menu>,
              ]}
            >
              <Card.Meta
                title={<a>{item.book_name}</a>}
                description={
                  <div>
                    作者:
                    <span style={{ paddingLeft: 5 }}>{item.author}</span>
                    <br />
                    时间:
                    <span style={{ paddingLeft: 5 }}>
                      {moment.unix(~~item.addDate).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                    <br />
                    标签:
                    <span style={{ paddingLeft: 5 }}>{item.tag}</span>
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
            <DialogTitle id="alert-dialog-title">警告</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">确定删除摘抄吗？</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>取消</Button>
              <Button
                onClick={() => {
                  handleClose();
                  deleteClipping(deleteClippingUUID).then(() => {
                    fetchClippings();
                  });
                }}
                autoFocus
              >
                确定
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
            <DialogTitle id="alert-dialog-title">高亮操作</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                请选择要进行的操作! (要删除高亮部分，请完整选择某一高亮部分。否则 删除高亮
                操作不会成功执行)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setHighlightInfo(initialHighlightInfo);
                }}
              >
                取消
              </Button>
              <Button
                onClick={() => {
                  setHighlightInfo(initialHighlightInfo);
                  deleteHighlight(highlighInfo.uuid, highlighInfo.selectedText).then(() => {
                    fetchClippings();
                  });
                }}
              >
                删除高亮
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
                确定
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
