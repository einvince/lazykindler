import { createBookCollection, deleteCollectionByKeyword, getAllCollections } from '@/services';
import { preHandleSubjects, toBase64, useWindowDimensions } from '@/util';
import { DatabaseOutlined, DownOutlined, StarOutlined, TagsOutlined } from '@ant-design/icons';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListSubheader,
    Typography,
} from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Dropdown, Menu } from 'antd';
import { Layout } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';

import ContextMenu from '../components/ContextMenu';
import BookCardList from './components/CollectionList';
import { CollectionDataType } from './data';

const { Sider, Content } = Layout;

enum FilterType {
    All = '未分类',
    Stars = '评分',
    Subjects = '标签',
}

type SubHeaerType = {
    Stars: Object;
    Subjects: Object;
};

export default function BookCollections() {
    const [data, setData] = useState<any>([]);
    // 选择的大的分类
    const [selectedType, setSelectedType] = useState<string>(FilterType.All);
    // 选择的大的分类下面的列表
    const [selectedSubType, setSelectedSubType] = useState<string[]>([]);
    // 选择的大的分类下面的列表的小条目
    const [selectedItemName, setSelectedItemName] = useState<any>(null);

    const [allBookCollections, setAllBookCollections] = useState<CollectionDataType[]>([]);

    const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
        Stars: {},
        Subjects: {},
    });

    const [formData, setFormData] = useState<any>({});

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const fetchBookCollections = () => {
        getAllCollections('book').then((data: CollectionDataType[]) => {
            if (data == null) {
                data = [];
            }
            setAllBookCollections(data);
            setData(data);

            const stars = {};
            const subjects = {};
            _.forEach(data, (item: CollectionDataType) => {
                if (stars[item.stars] == null) {
                    stars[item.stars] = {};
                }
                if (item.stars != null) {
                    stars[item.stars][item.uuid] = null;
                }

                if (item.subjects != null) {
                    let subjectsList = item.subjects.split(';');
                    subjectsList.forEach((subject) => {
                        if (subjects[subject] == null) {
                            subjects[subject] = {};
                        }
                        subjects[subject][item.uuid] = null;
                    });
                }
            });

            let allInfo = {
                Stars: stars,
                Subjects: subjects,
            };

            setClassifiedInfo(allInfo);

            switch (selectedType) {
                case FilterType.All:
                    setSelectedSubType([]);
                    break;
                case FilterType.Stars:
                    setSelectedSubType(Object.keys(allInfo.Stars));
                    break;
                case FilterType.Subjects:
                    setSelectedSubType(Object.keys(allInfo.Subjects));
                    break;
            }

            filterData(allInfo, selectedItemName);
        });
    };

    useEffect(() => {
        fetchBookCollections();
    }, []);

    const handleCreate = () => {
        let name = formData['name'];
        let description = formData['description'];
        let subjects = formData['subjects'];
        let stars = formData['stars'];
        let cover = formData['cover'];

        if (name == null || name.trim() == '') {
            return false;
        }
        if (description == null || description.trim() == '') {
            description = '';
        }
        if (subjects == null || subjects.trim() == '') {
            return false;
        }
        if (stars == null || stars.trim() == '') {
            return false;
        }
        if (cover == null || cover.trim() == '') {
            return false;
        }

        name = name.trim();
        description = description.trim();
        if (isNaN(stars.trim())) {
            return false;
        }
        stars = Number(stars.trim());
        cover = cover.trim();

        createBookCollection(
            name,
            'book',
            description,
            preHandleSubjects(subjects),
            stars,
            cover,
        ).then(() => {
            fetchBookCollections();
        });
        return true;
    };

    const headerDropMenu = () => {
        return (
            <Menu style={{ width: 150 }}>
                <Menu.Item key="all" icon={<DatabaseOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.All);
                            setSelectedSubType([]);

                            setData(allBookCollections);
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        未分类
                    </a>
                </Menu.Item>
                <Menu.Item key="stars" icon={<StarOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.Stars);
                            setSelectedSubType(Object.keys(classifiedInfo.Stars));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        评分
                    </a>
                </Menu.Item>
                <Menu.Item key="subjects" icon={<TagsOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setSelectedType(FilterType.Subjects);
                            setSelectedSubType(Object.keys(classifiedInfo.Subjects));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        标签
                    </a>
                </Menu.Item>
            </Menu>
        );
    };

    const filterData = (data: any, selectedKeyword: string) => {
        let allInfo;
        if (data != null) {
            allInfo = data;
        } else {
            allInfo = classifiedInfo;
        }
        setSelectedItemName(selectedKeyword);

        let filteredBooks;
        let o = {};
        switch (selectedType) {
            case FilterType.Stars:
                o = allInfo.Stars[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBookCollections, (v: CollectionDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Subjects:
                o = allInfo.Subjects[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBookCollections, (v: CollectionDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
        }
    };

    return (
        <>
            <Layout>
                <Sider style={{ backgroundColor: 'initial', paddingLeft: 0 }}>
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'auto',
                            height: '89vh',
                            marginTop: -1.8,
                            marginLeft: -1.5,
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >
                        <ListSubheader>
                            <Dropdown overlay={headerDropMenu}>
                                <a
                                    className="ant-dropdown-link"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <DatabaseOutlined style={{ paddingRight: 13 }} />
                                    {selectedType}
                                    <DownOutlined style={{ paddingLeft: 13 }} />
                                </a>
                            </Dropdown>
                        </ListSubheader>
                        {selectedSubType.map((item, index) => (
                            <ContextMenu
                                key={index}
                                Content={
                                    <ListItem
                                        style={{ padding: 0 }}
                                        key={index}
                                        onClick={() => {
                                            filterData(null, item);
                                        }}
                                    >
                                        <ListItemButton
                                            style={{ paddingLeft: 10, paddingRight: 10 }}
                                            selected={item === selectedItemName}
                                        >
                                            <ListItemText primary={`${index + 1}. ${item}`} />
                                        </ListItemButton>
                                    </ListItem>
                                }
                                MenuInfo={[
                                    {
                                        name: '删除',
                                        handler: () => {
                                            deleteCollectionByKeyword(
                                                selectedType,
                                                selectedItemName,
                                            ).then(() => {
                                                fetchBookCollections();
                                            });
                                        },
                                        prefixIcon: <DeleteIcon />,
                                    },
                                ]}
                            />
                        ))}
                        <ListItemButton onClick={handleClickOpen}>
                            <ListItemIcon style={{ paddingLeft: 70 }}>
                                <AddIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </List>
                </Sider>
                <Content>
                    <Grid
                        item
                        xs={10}
                        style={{
                            marginTop: -13.2,
                            maxHeight: '88.8vh',
                            overflow: 'auto',
                        }}
                    >
                        <BookCardList data={data} fetchBookCollections={fetchBookCollections} />
                    </Grid>
                </Content>
            </Layout>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="alert-dialog-title">{'创建书籍集合'}</DialogTitle>
                <DialogContent style={{ margin: '0 auto' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            '& .MuiTextField-root': { width: '25ch' },
                        }}
                    >
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                名称<span color="red">*</span>:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Input
                                    id="standard-adornment-weight"
                                    aria-describedby="standard-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormData({ ...formData, name: event.target.value });
                                    }}
                                />
                                <FormHelperText id="standard-weight-helper-text">
                                    不能为空
                                </FormHelperText>
                            </div>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                描述:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Input
                                    id="standard-adornment-weight"
                                    aria-describedby="standard-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormData({
                                            ...formData,
                                            description: event.target.value,
                                        });
                                    }}
                                />
                            </div>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                标签<span color="red">*</span>:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Input
                                    id="standard-adornment-weight"
                                    aria-describedby="standard-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormData({ ...formData, subjects: event.target.value });
                                    }}
                                />
                                <FormHelperText id="standard-weight-helper-text">
                                    多个标签分号相隔。不能为空
                                </FormHelperText>
                            </div>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                评分<span color="red">*</span>:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Input
                                    id="standard-adornment-weight"
                                    aria-describedby="standard-weight-helper-text"
                                    inputProps={{
                                        'aria-label': 'weight',
                                    }}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        setFormData({ ...formData, stars: event.target.value });
                                    }}
                                />
                                <FormHelperText id="standard-weight-helper-text">
                                    整数,建议最高9分。不能为空
                                </FormHelperText>
                            </div>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                            <Typography
                                style={{ position: 'relative', paddingTop: 5 }}
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                            >
                                封面<span color="red">*</span>:
                            </Typography>
                            <div style={{ position: 'absolute', paddingLeft: 45 }}>
                                <Dropzone
                                    onDrop={async (acceptedFiles) => {
                                        let base64Str = await toBase64(acceptedFiles[0]);
                                        setFormData({ ...formData, cover: base64Str });
                                    }}
                                >
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                {formData.cover == null ? (
                                                    <Button variant="contained">上传</Button>
                                                ) : (
                                                    <Chip
                                                        label="封面"
                                                        onDelete={() => {
                                                            setFormData({
                                                                ...formData,
                                                                cover: null,
                                                            });
                                                        }}
                                                        deleteIcon={<DeleteIcon />}
                                                        variant="outlined"
                                                    />
                                                )}
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>
                                <FormHelperText id="standard-weight-helper-text">
                                    不能为空
                                </FormHelperText>
                            </div>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button
                        onClick={() => {
                            let ok = handleCreate();
                            if (ok) {
                                handleClose();
                            }
                        }}
                        autoFocus
                    >
                        确认
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
