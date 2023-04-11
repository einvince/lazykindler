import { BookMetaDataType, CollectionDataType } from '@/pages/data';
import { getBooksMetaByUUIDs, getMultipleCollections } from '@/services';
import SearchIcon from '@mui/icons-material/Search';
import { Box, DialogTitle, IconButton } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

import BookCardList from '../../../components/BookCardList';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    '& fieldset': {
      borderRadius: 50,
    },
  },
});

type CollectionBooksProps = {
  open: boolean;
  handleClose: any;
  collection_uuid: string;
};

export default function CollectionBooks(props: CollectionBooksProps) {
  const { open, handleClose, collection_uuid } = props;

  const intl = useIntl();

  // allBooksMeta 用于保留所有数据
  const [allBooksMeta, setAllBooksMeta] = useState<BookMetaDataType[]>([]);
  // data 用于显示过滤后的数据
  const [data, setData] = useState<BookMetaDataType[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<any>({});

  const fetchBooks = () => {
    if (collection_uuid == null) {
      return;
    }
    getMultipleCollections([collection_uuid]).then((collectionInfo: CollectionDataType[]) => {
      let coll_info = collectionInfo[0];
      setCollectionInfo(coll_info);

      let item_uuids = coll_info.item_uuids;
      if (item_uuids == null) {
        return;
      }
      getBooksMetaByUUIDs(item_uuids).then((data) => {
        let bookCollsInfo: any = {};
        let coll_uuids: any = [];

        let book_metas_info = _.map(data, (item: BookMetaDataType) => {
          if (item.coll_uuids != null) {
            coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
          }
          return Object.assign({}, item, { key: item.uuid });
        });

        coll_uuids = _.uniq(coll_uuids);

        getMultipleCollections(coll_uuids).then((bookCollInfoList: CollectionDataType[]) => {
          _.forEach(bookCollInfoList, (item: CollectionDataType) => {
            bookCollsInfo[item.uuid] = item.name;
          });

          for (let i = 0; i < book_metas_info.length; i++) {
            let names: string[] = [];
            if (book_metas_info[i].coll_uuids != null) {
              _.forEach(book_metas_info[i].coll_uuids.split(';'), (coll_uuid) => {
                names.push(bookCollsInfo[coll_uuid]);
              });
            }
            book_metas_info[i].coll_names = names.join(';');
          }

          setData(book_metas_info);
          setAllBooksMeta(book_metas_info);
        });
      });
    });
  };

  const handleSearchChange = _.debounce((keyword: string) => {
    onSearchChange(keyword);
  }, 300); // 300ms 的延迟

  useEffect(() => {
    fetchBooks();
  }, []);

  const onSearchChange = (e: any) => {
    const keyword = e.target.value;
    setData(
      _.filter(allBooksMeta, (item: BookMetaDataType) => {
        return (
          (item.name != null && item.name.includes(keyword)) ||
          (item.author != null && item.author.includes(keyword))
        );
      }),
    );
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="lg"
        style={{ zIndex: 800 }}
      >
        <DialogTitle id="alert-dialog-title">{collectionInfo.name}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
            style={{
              width: '75%',
              position: 'absolute',
              top: 20,
            }}
          >
            <CustomTextField
              variant="outlined"
              size="small"
              placeholder={intl.formatMessage({ id: 'pages.books.search' })}
              onChange={(e: any) => {
                e.preventDefault();
                handleSearchChange(e.target.value);
              }}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" size="small">
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{ width: { xs: '90%', sm: '50%', md: '40%' } }}
            />
          </Box>
          <div style={{ overflowY: 'auto', overflowX: 'hidden' }}>
            <BookCardList data={data} fetchBooks={fetchBooks} tablePaginationStyle={{}} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
