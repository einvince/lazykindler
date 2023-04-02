import { BookMetaDataType, CollectionDataType } from '@/pages/data';
import { getAllCollections, getClippingByUUIDs, updateClipping } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { Checkbox, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';

type ChangeClippingCollProps = {
  item_uuid: string;
  open: boolean;
  handleClose: any;
  fetchClippings: any;
};

export default function ChangeClippingColl(props: ChangeClippingCollProps) {
  const { item_uuid, open, handleClose, fetchClippings } = props;

  const [allColls, setAllColls] = useState<CollectionDataType[]>([]);
  const [selectedClippingUUIDs, setSelectedClippingUUIDs] = useState<any>([]);

  useEffect(() => {
    if (item_uuid == null || item_uuid == '') {
      return;
    }
    getClippingByUUIDs(item_uuid).then((l: BookMetaDataType[]) => {
      const coll_uuids = l[0].coll_uuids;
      if (coll_uuids != null) {
        setSelectedClippingUUIDs(coll_uuids.split(';'));
      }
    });
    getAllCollections('clipping').then((data: CollectionDataType[]) => {
      setAllColls(data);
    });
  }, []);

  const onChange = (checkedValues: CheckboxValueType[]) => {
    setSelectedClippingUUIDs(checkedValues);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        // fullWidth
        maxWidth="md"
      >
        <DialogTitle id="alert-dialog-title">
          <FormattedMessage id="pages.books.book.action.edit_collection" />
        </DialogTitle>
        <DialogContent>
          <FormControl sx={{ m: 6, width: 620 }}>
            <Checkbox.Group
              style={{ width: '100%' }}
              value={selectedClippingUUIDs}
              onChange={onChange}
            >
              <Row>
                {allColls.map((coll_info: CollectionDataType, index: number) => (
                  <Col key={index} span={8}>
                    <Checkbox
                      checked={selectedClippingUUIDs.includes(coll_info.uuid)}
                      value={coll_info.uuid}
                    >
                      {coll_info.name}
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <FormattedMessage id="pages.cancel" />
          </Button>
          <Button
            onClick={() => {
              handleClose();
              updateClipping(item_uuid, 'coll_uuids', selectedClippingUUIDs.join(';')).then(() => {
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
  );
}
