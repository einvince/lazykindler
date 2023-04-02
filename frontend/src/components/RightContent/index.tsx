import {
  deleteAllBooks,
  deleteAllClipping,
  deleteAllCollections,
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
import { FormattedMessage, useIntl } from 'umi';

import { SelectLang, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Dropdown, Popover, Space } from 'antd';
import React, { useState } from 'react';

export type SiderTheme = 'light' | 'dark';

const notify = (msg: string) => toast.success(msg);

const GlobalHeaderRight: React.FC = () => {
  const [deleteType, setDeleteType] = useState<number>(0);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const intl = useIntl();

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const onUploadFiles = () => {
    uploadBooks().then((count: number) => {
      let message = intl.formatMessage(
        { id: 'pages.menu.action.list.upload.result' },
        { n: count },
      );
      if (Number(count) === 0) {
        message = intl.formatMessage({ id: 'pages.menu.action.list.upload.no_new_books' });
      }
      notify(message);
    });
  };

  const onDeleteAllTmpBooks = () => {
    deleteAllTmpBooks().then(() => {
      toast(intl.formatMessage({ id: 'pages.menu.action.list.delete.delete_all_tmp_books' }));
    });
  };

  const onDownloadAllBooks = () => {
    downloadAllBooks().then(() => {
      toast(
        intl.formatMessage(
          { id: 'pages.menu.action.list.download.result.info' },
          { directory: 'lazykindler' },
        ),
      );
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
          content={<FormattedMessage id="pages.menu.action.list.upload.info" />}
          title={<FormattedMessage id="pages.menu.action.hint" />}
        >
          <a target="_blank" rel="noopener noreferrer" onClick={onUploadFiles}>
            <FormattedMessage id="pages.menu.action.list.upload" />
          </a>
        </Popover>
      ),
    },
    {
      key: '2',
      label: (
        <Popover
          placement="leftBottom"
          content={<FormattedMessage id="pages.menu.action.list.download.info" />}
          title={<FormattedMessage id="pages.menu.action.hint" />}
        >
          <a target="_blank" rel="noopener noreferrer" onClick={onDownloadAllBooks}>
            <FormattedMessage id="pages.menu.action.list.download_all_books" />
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
          <FormattedMessage id="pages.menu.action.list.delete_all_books" />
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
          <FormattedMessage id="pages.menu.action.list.delete_all_temporary_books" />
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
          <FormattedMessage id="pages.menu.action.list.delete_highlights" />
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
          <FormattedMessage id="pages.menu.action.list.delete_all_data" />
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
              <FormattedMessage id="pages.books.collection.action" />
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
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
          <DialogTitle id="alert-dialog-title">
            <FormattedMessage id="pages.warning" />
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <FormattedMessage id="pages.menu.action.list.delete.warning" />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleCloseDeleteDialog();
              }}
              autoFocus
            >
              <FormattedMessage id="pages.cancel" />
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
                  deleteAllCollections();
                }
              }}
            >
              <FormattedMessage id="pages.ok" />
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
export default GlobalHeaderRight;
