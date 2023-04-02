import { BookToClippingBookType } from '@/pages/data';
import { getBooksMetaByUUIDs, getClippingCountByBookName } from '@/services';
import { getAllbookClipping, updateBookClipping } from '@/services/book_clipping';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';
import ReaderDialog from '../../../components/Reader';

const initialDialogInfoForReadBook = {
  open: false,
  book_title: '',
  book_uuid: null,
};

const App: React.FC = () => {
  const [data, setData] = useState<BookToClippingBookType[]>([]);
  const [openReadBook, setOpenReadBook] = useState<any>(initialDialogInfoForReadBook);

  const columns: any = [
    {
      title: <FormattedMessage id="pages.book_to_highlight.book_name" />,
      dataIndex: 'book_meta_name',
      key: 'book_meta_name',
      align: 'center',
      width: '30%',
      render: (_: any, record: any) => {
        return (
          <a
            style={{ wordBreak: 'break-word' }}
            onClick={() => {
              setOpenReadBook({
                open: true,
                book_uuid: record.book_meta_uuid,
                book_title: record.clipping_book_name,
              });
            }}
          >
            {record.book_meta_name}
          </a>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.book_to_highlight.highlight_book_name" />,
      dataIndex: 'clipping_book_name',
      align: 'center',
      width: '30%',
      key: 'clipping_book_name',
      render: (_: any, record: BookToClippingBookType) => {
        return <p style={{ wordBreak: 'break-word' }}>{record.clipping_book_name}</p>;
      },
    },
    {
      title: <FormattedMessage id="pages.book_to_highlight.highlight_Counts" />,
      dataIndex: 'clipping_count',
      align: 'center',
      key: 'clipping_count',
    },
    {
      title: <FormattedMessage id="pages.book_to_highlight.status" />,
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_: any, record: any) => {
        return getStatusText(record.status);
      },
    },
    {
      title: <FormattedMessage id="pages.book_to_highlight.action" />,
      key: 'action',
      align: 'center',
      width: '18%',
      render: (_: any, record: any) => {
        return getRelationActions(record);
      },
    },
  ];

  const getRelationActions = (record: BookToClippingBookType) => {
    if (record.status == 0) {
      return (
        <div>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button
              onClick={() => {
                updateBookClippingData(record, 'save');
              }}
            >
              <FormattedMessage id="pages.book_to_highlight.action.save" />
            </Button>
            <Button
              onClick={() => {
                updateBookClippingData(record, 'delete');
              }}
            >
              <FormattedMessage id="pages.book_to_highlight.action.delete" />
            </Button>
          </ButtonGroup>
        </div>
      );
    } else if (record.status == 1) {
      return (
        <div>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button
              onClick={() => {
                updateBookClippingData(record, 'delete');
              }}
            >
              <FormattedMessage id="pages.book_to_highlight.action.delete" />
            </Button>
          </ButtonGroup>
        </div>
      );
    } else if (record.status == 2) {
      return (
        <div>
          <ButtonGroup variant="contained" aria-label="outlined primary button group">
            <Button
              onClick={() => {
                updateBookClippingData(record, 'save');
              }}
            >
              <FormattedMessage id="pages.book_to_highlight.action.save" />
            </Button>
          </ButtonGroup>
        </div>
      );
    } else {
      return null;
    }
  };

  const updateBookClippingData = (bookClipping: BookToClippingBookType, action: string) => {
    updateBookClipping(bookClipping.book_meta_uuid, bookClipping.clipping_book_name, action).then(
      () => {
        getData();
      },
    );
  };

  const getStatusText = (status: number) => {
    if (status == 0) {
      return (
        <a>
          <FormattedMessage id="pages.book_to_highlight.status.pending" />
        </a>
      );
    } else if (status == 1) {
      return (
        <a>
          <FormattedMessage id="pages.book_to_highlight.status.saved" />
        </a>
      );
    } else if (status == 2) {
      return (
        <a>
          <FormattedMessage id="pages.book_to_highlight.status.deleted" />
        </a>
      );
    } else {
      return '';
    }
  };

  const getData = () => {
    getAllbookClipping().then((data: any[]) => {
      let allPromises: any = [];
      for (let i = 0; i < data.length; i++) {
        data[i]['key'] = i;
        allPromises.push(getBooksMetaByUUIDs(data[i].book_meta_uuid));
      }
      Promise.all(allPromises).then((responses: any[]) => {
        let allPromises: any = [];
        for (let i = 0; i < data.length; i++) {
          data[i]['book_meta_name'] = responses[i][0]['name'];
          allPromises.push(getClippingCountByBookName(data[i].clipping_book_name));
        }
        Promise.all(allPromises).then((responses: any[]) => {
          for (let i = 0; i < data.length; i++) {
            data[i]['clipping_count'] = responses[i];
          }
          setData(data);
        });
      });
    });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={data} />

      <ReaderDialog
        open={openReadBook.open}
        book_title={openReadBook.book_title}
        book_uuid={openReadBook.book_uuid}
        onClose={() => {
          setOpenReadBook(initialDialogInfoForReadBook);
        }}
      />
    </>
  );
};

export default App;
