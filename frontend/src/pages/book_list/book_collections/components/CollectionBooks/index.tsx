import { BookMetaDataType, CollectionDataType } from '@/pages/data';
import { getBooksMetaByUUIDs, getMultipleCollections } from '@/services';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import BookCardList from '../../../components/BookCardList';

const RedditTextField = styled((props: TextFieldProps) => (
    <TextField InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>} {...props} />
))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        border: '1px solid #e2e2e1',
        overflow: 'hidden',
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
        transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused': {
            backgroundColor: 'transparent',
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
            borderColor: theme.palette.primary.main,
        },
    },
}));

type CollectionBooksProps = {
    open: boolean;
    handleClose: any;
    collection_uuid: string;
};

export default function CollectionBooks(props: CollectionBooksProps) {
    const { open, handleClose, collection_uuid } = props;

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
                let bookCollsInfo = {};
                let coll_uuids: any = [];

                let book_metas_info = _.map(data, (item: BookMetaDataType) => {
                    if (item.coll_uuids != null) {
                        coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
                    }
                    return Object.assign({}, item, { key: item.uuid });
                });

                coll_uuids = _.uniq(coll_uuids);

                getMultipleCollections(coll_uuids).then(
                    (bookCollInfoList: CollectionDataType[]) => {
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
                    },
                );
            });
        });
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const onSearchChange = (e: any) => {
        const keyword = e.target.value;
        setData(
            _.filter(allBooksMeta, (item: BookMetaDataType) => {
                return item.name.includes(keyword) || item.author.includes(keyword);
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
                    <RedditTextField
                        label="搜索书名或作者"
                        id="reddit-input"
                        variant="filled"
                        style={{
                            width: '100%',
                            marginTop: 11,
                            marginBottom: 20,
                        }}
                        onBlur={onSearchChange}
                    />
                    <BookCardList data={data} fetchBooks={fetchBooks} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
