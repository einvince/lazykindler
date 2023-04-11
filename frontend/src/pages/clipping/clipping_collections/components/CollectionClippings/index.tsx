import { ClippingDataType, CollectionDataType } from '@/pages/data';
import { getClippingByUUIDs, getMultipleCollections } from '@/services';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl } from 'umi';

import ClippingCardList from '../../../components/ClippingCardList';

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: 50,
    '& fieldset': {
      borderRadius: 50,
    },
  },
});

type CollectionClippingsProps = {
  open: boolean;
  handleClose: any;
  collection_uuid: string;
};

export default function CollectionClippings(props: CollectionClippingsProps) {
  const { open, handleClose, collection_uuid } = props;

  const intl = useIntl();
  // allClippings 用于保留所有数据
  const [allClippings, setAllClipping] = useState<ClippingDataType[]>([]);
  // data 用于显示过滤后的数据
  const [data, setData] = useState<ClippingDataType[]>([]);
  const [collectionInfo, setCollectionInfo] = useState<any>({});

  const fetchClipping = () => {
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
      getClippingByUUIDs(item_uuids).then((data) => {
        let clippingCollsInfo: any = {};
        let coll_uuids: any = [];

        let clippings_info: any = _.map(data, (item: ClippingDataType) => {
          if (item.coll_uuids != null) {
            coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
          }
          return Object.assign({}, item, { key: item.uuid });
        });

        coll_uuids = _.uniq(coll_uuids);

        getMultipleCollections(coll_uuids).then((clippingCollInfoList: CollectionDataType[]) => {
          _.forEach(clippingCollInfoList, (item: CollectionDataType) => {
            clippingCollsInfo[item.uuid] = item.name;
          });

          for (let i = 0; i < clippings_info.length; i++) {
            let names: string[] = [];
            if (clippings_info[i].coll_uuids != null) {
              _.forEach(clippings_info[i].coll_uuids.split(';'), (coll_uuid) => {
                names.push(clippingCollsInfo[coll_uuid]);
              });
            }
            clippings_info[i].coll_names = names.join(';');
          }

          setData(clippings_info);
          setAllClipping(clippings_info);
        });
      });
    });
  };

  useEffect(() => {
    fetchClipping();
  }, []);

  const onSearchChange = (keyword: any) => {
    setData(
      _.filter(allClippings, (item: ClippingDataType) => {
        return (
          (item.book_name != null && item.book_name.includes(keyword)) ||
          (item.author != null && item.author.includes(keyword)) ||
          (item.content != null && item.content.includes(keyword))
        );
      }),
    );
  };

  const handleSearchChange = _.debounce((keyword: string) => {
    onSearchChange(keyword);
  }, 300); // 300ms 的延迟

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
            <ClippingCardList
              data={data}
              fetchClippings={fetchClipping}
              tablePaginationStyle={{}}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
