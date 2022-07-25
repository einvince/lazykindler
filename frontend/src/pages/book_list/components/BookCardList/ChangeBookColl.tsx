import { BookMetaDataType } from '@/pages/data';
import { getAllCollections, getBooksMetaByUUIDs, updateBookMeta } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import { Checkbox, Col, Row } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { useEffect, useState } from 'react';

import { CollectionDataType } from '../../book_collections/data';

type ChangeBookCollProps = {
    item_uuid: string;
    open: boolean;
    handleClose: any;
    fetchBooks: any;
};

export default function ChangeBookColl(props: ChangeBookCollProps) {
    const { item_uuid, open, handleClose } = props;

    const [allColls, setAllColls] = useState<CollectionDataType[]>([]);
    const [selectedCollUUIDs, setSelectedCollUUIDs] = useState<any>([]);

    const onChange = (checkedValues: CheckboxValueType[]) => {
        setSelectedCollUUIDs(checkedValues);
    };

    useEffect(() => {
        if (item_uuid == null || item_uuid == '') {
            return;
        }
        getBooksMetaByUUIDs(item_uuid).then((l: BookMetaDataType[]) => {
            const coll_uuids = l[0].coll_uuids;
            if (coll_uuids != null) {
                setSelectedCollUUIDs(coll_uuids.split(';'));
            }
        });
        getAllCollections('book').then((data: CollectionDataType[]) => {
            setAllColls(data);
        });
    }, []);

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
                <DialogTitle id="alert-dialog-title">修改集合</DialogTitle>
                <DialogContent>
                    <FormControl sx={{ m: 6, width: 620 }}>
                        <Checkbox.Group
                            style={{ width: '100%' }}
                            value={selectedCollUUIDs}
                            onChange={onChange}
                        >
                            <Row>
                                {allColls.map((coll_info: CollectionDataType, index: number) => (
                                    <Col key={index} span={8}>
                                        <Checkbox
                                            checked={selectedCollUUIDs.includes(coll_info.uuid)}
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
                    <Button onClick={handleClose}>取消</Button>
                    <Button
                        onClick={() => {
                            handleClose();
                            updateBookMeta(
                                item_uuid,
                                'coll_uuids',
                                selectedCollUUIDs.join(';'),
                            ).then(() => {
                                // fetchBooks();
                            });
                        }}
                        autoFocus
                    >
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
