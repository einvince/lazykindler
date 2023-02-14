import {
  deleteAllBooks,
  deleteAllClipping,
  deleteAllTmpBooks,
  downloadAllBooks,
  uploadBooks,
} from '@/services';
import { DownOutlined } from '@ant-design/icons';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

import { SelectLang, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Dropdown, Popover, Space } from 'antd';
import React, { useState } from 'react';
import Avatar from './AvatarDropdown';

export type SiderTheme = 'light' | 'dark';

const notify = (msg: string) => toast.success(msg);

const GlobalHeaderRight: React.FC = () => {
  const [deleteType, setDeleteType] = useState<number>(0);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const onUploadFiles = () => {
    uploadBooks().then((count: number) => {
      let message = `成功上传 ${count}本 书籍!`;
      if (Number(count) === 0) {
        message = '未发现需要上传的新书籍!';
      }
      notify(message);
    });
  };

  const onDeleteAllTmpBooks = () => {
    deleteAllTmpBooks().then(() => {
      toast('成功删除所有临时书籍!');
    });
  };

  const onDownloadAllBooks = () => {
    downloadAllBooks().then(() => {
      toast('已成功下载所有书籍，请到下载目录查看新建目录 lazykindler');
    });
  };

  const className = useEmotionCss(() => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      gap: 8,
    };
  });

  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      float: 'right',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      cursor: 'pointer',
      width: 70,
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <Popover
          placement="leftBottom"
          content={
            '平台将递归扫描 ~/Download、~/下载、~/Desktop、~/桌面等目录下受支持的电子书文件。相同文件不会重复上传'
          }
          title="说明"
        >
          <a target="_blank" rel="noopener noreferrer" onClick={onUploadFiles}>
            上传文件
          </a>
        </Popover>
      ),
    },
    {
      key: '2',
      label: (
        <Popover
          placement="leftBottom"
          content={
            '所有书籍会被自动下载到 ~/Documents/lazykindler 或者 ~/文稿/lazykindler。已经存在的书籍不会被重复下载'
          }
          title="说明"
        >
          <a target="_blank" rel="noopener noreferrer" onClick={onDownloadAllBooks}>
            下载所有书籍
          </a>
        </Popover>
      ),
    },
    {
      key: '3',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setDeleteDialog(true);
            setDeleteType(1);
          }}
        >
          删除书籍
        </a>
      ),
    },
    {
      key: '4',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setDeleteDialog(true);
            setDeleteType(2);
          }}
        >
          删除所有临时书籍
        </a>
      ),
    },
    {
      key: '5',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setDeleteDialog(true);
            setDeleteType(3);
          }}
        >
          删除摘抄
        </a>
      ),
    },
    {
      key: '6',
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            setDeleteDialog(true);
            setDeleteType(4);
          }}
        >
          删除所有数据
        </a>
      ),
    },
  ];

  return (
    <>
      <div className={className}>
        <Dropdown menu={{ items }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              操作
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
        <Avatar />
        <SelectLang className={actionClassName} />

        <Toaster />
      </div>

      <div>
        <Dialog
          open={deleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
        >
          <DialogTitle id="alert-dialog-title">警告</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">确定删除吗</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleCloseDeleteDialog();
              }}
              autoFocus
            >
              取消
            </Button>
            <Button
              onClick={() => {
                handleCloseDeleteDialog();

                if (deleteType === 1) {
                  deleteAllBooks();
                } else if (deleteType === 2) {
                  onDeleteAllTmpBooks();
                } else if (deleteType === 3) {
                  deleteAllClipping();
                } else {
                  deleteAllBooks();
                  deleteAllClipping();
                }
              }}
            >
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
export default GlobalHeaderRight;
