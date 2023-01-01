import { ClippingDataType } from '@/pages/data';
import { addHighlight, deleteClipping, deleteHighlight, updateClipping } from '@/services';
import { handleClippingContent } from '@/util';
import { SettingOutlined } from '@ant-design/icons';
import { GridContent } from '@ant-design/pro-layout';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import TablePagination from '@mui/material/TablePagination';
import { Card } from 'antd';
import { Menu } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
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
    height: Number;
    columns: number;
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
    const { data, fetchClippings, height, columns } = props;

    const [dialogInfo, setDialogInfo] = useState<any>(initialDialogInfo);
    const [changeClippingCollInfo, setChangeClippingCollInfo] = useState<any>({
        item_uuid: '',
        open: false,
    });
    const [openDeleteClipping, setOpenDeleteClipping] = useState(false);
    const [deleteClippingUUID, setDeleteClippingUUID] = useState('');
    const [uuid, setUUID] = useState(uuidv4());
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [highlighInfo, setHighlightInfo] = useState(initialHighlightInfo);
    const [clippingDialogInfo, setClippingDialogInfo] = useState<any>(initialClippingDialogInfo);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

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
            <div style={{ paddingLeft: 5 }}>
                <div style={{ height: `${height}vh`, overflow: 'auto' }}>
                    <GridContent>
                        <ImageList variant="standard" cols={columns} gap={15}>
                            {data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((item: ClippingDataType) => (
                                    <ImageListItem key={item.uuid}>
                                        <Card
                                            className={`${hetiStyles.entry} ${hetiStyles['heti--ancient']}`}
                                            bodyStyle={{ padding: 15 }}
                                            hoverable
                                            actions={[
                                                <Menu mode="horizontal" selectable={false}>
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
                                                        修改集合
                                                    </Button>
                                                    <Divider orientation="vertical" flexItem />
                                                    <SubMenu
                                                        key="sub4"
                                                        style={{ zIndex: 10, width: '50%' }}
                                                        icon={<SettingOutlined />}
                                                        title="操作"
                                                    >
                                                        <Menu.Item
                                                            key="1"
                                                            onClick={() => {
                                                                setDialogInfo({
                                                                    title: '修改评分',
                                                                    oldValue: item.stars,
                                                                    allowEmptyStr: false,
                                                                    handleOK: (newValue: any) => {
                                                                        updateClipping(
                                                                            item.uuid,
                                                                            'stars',
                                                                            newValue,
                                                                        ).then(() => {
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
                                                                    oldValue: item.subjects,
                                                                    allowEmptyStr: true,
                                                                    handleOK: (newValue: any) => {
                                                                        updateClipping(
                                                                            item.uuid,
                                                                            'subjects',
                                                                            newValue,
                                                                        ).then(() => {
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
                                                                        updateClipping(
                                                                            item.uuid,
                                                                            'author',
                                                                            newValue,
                                                                        ).then(() => {
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
                                                            <span style={{ color: 'red' }}>
                                                                删除
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
                                                        作者:
                                                        <span style={{ paddingLeft: 5 }}>
                                                            {item.author}
                                                        </span>
                                                        <br />
                                                        时间:
                                                        <span style={{ paddingLeft: 5 }}>
                                                            {moment
                                                                .unix(~~item.addDate)
                                                                .format('yyyy-MM-DD HH:mm:ss')}
                                                        </span>
                                                        <br />
                                                        标签:
                                                        <span style={{ paddingLeft: 5 }}>
                                                            {item.subjects}
                                                        </span>
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
                                                    let selectedText = window
                                                        .getSelection()!
                                                        .toString();
                                                    if (selectedText.length > 0) {
                                                        return;
                                                    }
                                                    setClippingDialogInfo({
                                                        uuid: item.uuid,
                                                        open: true,
                                                        handleClose: () => {
                                                            setChangeClippingCollInfo(
                                                                initialClippingDialogInfo,
                                                            );
                                                        },
                                                        clippingContent: item.content,
                                                        highlights: item.highlights,
                                                        book_name: item.book_name,
                                                    });
                                                }}
                                                onMouseUp={() => {
                                                    let uuid = item.uuid;
                                                    let selectedText = window
                                                        .getSelection()!
                                                        .toString();
                                                    if (selectedText != '') {
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
                                                    textToHighlight={handleClippingContent(
                                                        item.content,
                                                    )}
                                                />
                                            </article>
                                        </Card>
                                    </ImageListItem>
                                ))}
                        </ImageList>
                    </GridContent>

                    <TablePagination
                        style={{ textAlign: 'center', position: 'fixed', bottom: 40, right: 20 }}
                        rowsPerPageOptions={[15, 25, 50, 100, 200, 300, 500]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage={<span style={{ paddingTop: 13.5 }}>每页数目</span>}
                        labelDisplayedRows={(paginationInfo: any) => (
                            <span style={{ paddingTop: 13.5 }}>
                                {paginationInfo.from}-{paginationInfo.to} 总共:
                                {paginationInfo.count}
                            </span>
                        )}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
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
                                <DialogContentText id="alert-dialog-description">
                                    确定删除摘抄吗？
                                </DialogContentText>
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
                                    请选择要进行的操作!
                                    (要删除高亮部分，请完整选择某一高亮部分。否则 "删除高亮"
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
                                        deleteHighlight(
                                            highlighInfo.uuid,
                                            highlighInfo.selectedText,
                                        ).then(() => {
                                            fetchClippings();
                                        });
                                    }}
                                >
                                    删除高亮
                                </Button>
                                <Button
                                    onClick={() => {
                                        addHighlight(
                                            highlighInfo.uuid,
                                            highlighInfo.selectedText,
                                        ).then(() => {
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
        </div>
    );
};

export default ClippingCardList;
