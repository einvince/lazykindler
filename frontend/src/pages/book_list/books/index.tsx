import { deleteBookByKeyword, getBooksMeta, getMultipleCollections } from '@/services';
import {
    BankOutlined,
    DatabaseOutlined,
    DownOutlined,
    StarOutlined,
    TagsOutlined,
    UserOutlined,
} from '@ant-design/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Grid, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';
import Button from '@mui/material/Button';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { OutlinedInputProps } from '@mui/material/OutlinedInput';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import { Menu as AntMenu, Dropdown } from 'antd';
import _ from 'lodash';
import { FC, useEffect, useState } from 'react';

import type { BookMetaDataType, CollectionDataType } from '../../data';
import BookCardList from '../components/BookCardList';
import ContextMenu from '../components/ContextMenu';

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

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

enum FilterType {
    All = '未分类',
    Stars = '评分',
    Subjects = '标签',
    Author = '作者',
    Publisher = '出版社',
}

type SubHeaerType = {
    Stars: Object;
    Subjects: Object;
    Author: Object;
    Publisher: Object;
};

type BooksProps = {
    storeType: string;
};

const Books: FC<BooksProps> = (props: BooksProps) => {
    const { storeType } = props;

    const [sortTypeValue, setSortTypeValue] = useState<number>(2);
    const [allBooksMeta, setAllBooksMeta] = useState<BookMetaDataType[]>([]);
    const [data, setData] = useState<BookMetaDataType[]>([]);

    // 评分或者作者等等大类
    const [firstLevelType, setFirstLevelType] = useState<string>(FilterType.All);
    // 评分或者书签下面的列表
    const [secondLevelMenuList, setSecondLevelMenuList] = useState<string[]>([]);

    // 评分或者书签下选定的某一项
    const [selectedSecondLevel, setSelectedSecondLevel] = useState<any>(null);

    const [classifiedInfo, setClassifiedInfo] = useState<SubHeaerType>({
        Stars: {},
        Subjects: {},
        Author: {},
        Publisher: {},
    });

    const CustomizedMenus = () => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
        const open = Boolean(anchorEl);
        const handleClick = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <div>
                <Button
                    id="demo-customized-button"
                    aria-controls={open ? 'demo-customized-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    variant="contained"
                    disableElevation
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                >
                    书籍排序方式
                </Button>
                <StyledMenu
                    id="demo-customized-menu"
                    MenuListProps={{
                        'aria-labelledby': 'demo-customized-button',
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem
                        selected={sortTypeValue == 1}
                        onClick={() => {
                            handleClose();
                            fetchBooks(1);
                            setSortTypeValue(1);
                        }}
                        disableRipple
                    >
                        {'大小 (小->大)'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 2}
                        onClick={() => {
                            handleClose();
                            fetchBooks(2);
                            setSortTypeValue(2);
                        }}
                        disableRipple
                    >
                        {'大小 (大->小)'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 3}
                        onClick={() => {
                            handleClose();
                            fetchBooks(3);
                            setSortTypeValue(3);
                        }}
                        disableRipple
                    >
                        {'导入时间 (新->旧)'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 4}
                        onClick={() => {
                            handleClose();
                            fetchBooks(4);
                            setSortTypeValue(4);
                        }}
                        disableRipple
                    >
                        {'导入时间 (旧->新)'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 5}
                        onClick={() => {
                            handleClose();
                            fetchBooks(5);
                            setSortTypeValue(5);
                        }}
                        disableRipple
                    >
                        {'评分 (高->低)'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 6}
                        onClick={() => {
                            handleClose();
                            fetchBooks(6);
                            setSortTypeValue(6);
                        }}
                        disableRipple
                    >
                        {'评分 (低->高)'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 7}
                        onClick={() => {
                            handleClose();
                            fetchBooks(7);
                            setSortTypeValue(7);
                        }}
                        disableRipple
                    >
                        {'作者'}
                    </MenuItem>
                    <MenuItem
                        selected={sortTypeValue == 8}
                        onClick={() => {
                            handleClose();
                            fetchBooks(8);
                            setSortTypeValue(8);
                        }}
                        disableRipple
                    >
                        {'出版社'}
                    </MenuItem>
                </StyledMenu>
            </div>
        );
    };

    const fetchBooks = (sortTypeValue: number) => {
        if (sortTypeValue == null) {
            sortTypeValue = 3;
        }
        getBooksMeta(storeType, sortTypeValue).then((data) => {
            if (data == null) {
                data = [];
            }

            let coll_uuids: any = [];
            let bookCollsInfo = {};
            _.forEach(data, (item: BookMetaDataType) => {
                if (item.coll_uuids == null) {
                    return;
                }
                coll_uuids = coll_uuids.concat(item.coll_uuids.split(';'));
            });
            coll_uuids = _.uniq(coll_uuids);

            getMultipleCollections(coll_uuids).then((bookCollInfoList: CollectionDataType[]) => {
                _.forEach(bookCollInfoList, (item: CollectionDataType) => {
                    bookCollsInfo[item.uuid] = item.name;
                });

                for (let i = 0; i < data.length; i++) {
                    if (data[i].coll_uuids == null) {
                        continue;
                    }
                    let names: string[] = [];
                    _.forEach(data[i].coll_uuids.split(';'), (coll_uuid) => {
                        names.push(bookCollsInfo[coll_uuid]);
                    });
                    data[i].coll_names = names.join(';');
                }

                setData(data);
                setAllBooksMeta(data);
            });

            const stars = {};
            const subjects = {};
            const authors = {};
            const publisher = {};

            _.forEach(data, (item: BookMetaDataType) => {
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
                } else {
                    if (subjects['无标签'] == null) {
                        subjects['无标签'] = {};
                    }
                    subjects['无标签'][item.uuid] = null;
                }

                if (item.author == null) {
                    if (authors['无作者'] == null) {
                        authors['无作者'] = {};
                    }
                    authors['无作者'][item.uuid] = null;
                } else {
                    if (authors[item.author] == null) {
                        authors[item.author] = {};
                    }
                    authors[item.author][item.uuid] = null;
                }

                if (item.publisher == null) {
                    if (publisher['无出版社'] == null) {
                        publisher['无出版社'] = {};
                    }
                    publisher['无出版社'][item.uuid] = null;
                } else {
                    if (publisher[item.publisher] == null) {
                        publisher[item.publisher] = {};
                    }
                    publisher[item.publisher][item.uuid] = null;
                }
            });

            let allInfo = {
                Stars: stars,
                Subjects: subjects,
                Author: authors,
                Publisher: publisher,
            };

            setClassifiedInfo(allInfo);

            switch (firstLevelType) {
                case FilterType.All:
                    setSecondLevelMenuList([]);
                    break;
                case FilterType.Stars:
                    setSecondLevelMenuList(Object.keys(allInfo.Stars));
                    break;
                case FilterType.Subjects:
                    setSecondLevelMenuList(Object.keys(allInfo.Subjects));
                    break;
                case FilterType.Author:
                    setSecondLevelMenuList(Object.keys(allInfo.Author));
                    break;
                case FilterType.Publisher:
                    setSecondLevelMenuList(Object.keys(allInfo.Publisher));
                    break;
            }

            filterData(allInfo, selectedSecondLevel, data);
        });
    };

    useEffect(() => {
        fetchBooks(2);
    }, []);

    const filterData = (data: any, selectedKeyword: any, allBooksMetaList: BookMetaDataType[]) => {
        let allInfo;
        if (data != null) {
            allInfo = data;
        } else {
            allInfo = classifiedInfo;
        }
        setSelectedSecondLevel(selectedKeyword);

        let filteredBooks;
        let o = {};
        switch (firstLevelType) {
            case FilterType.All:
                filteredBooks = allBooksMetaList;
                break;
            case FilterType.Stars:
                o = allInfo.Stars[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
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
                filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Author:
                o = allInfo.Author[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
            case FilterType.Publisher:
                o = allInfo.Publisher[selectedKeyword];
                if (o == null) {
                    o = {};
                }
                filteredBooks = _.filter(allBooksMetaList, (v: BookMetaDataType) => {
                    if (v.uuid in o) {
                        return true;
                    }
                    return false;
                });
                setData(filteredBooks);
                break;
        }
        return filteredBooks;
    };

    const headerDropMenu = () => {
        return (
            <AntMenu style={{ width: '9vw' }}>
                <AntMenu.Item key="all" icon={<DatabaseOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.All);
                            setSecondLevelMenuList([]);

                            setData(allBooksMeta);
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        未分类
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="stars" icon={<StarOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Stars);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Stars));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        评分
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="subjects" icon={<TagsOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Subjects);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Subjects));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        标签
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="author" icon={<UserOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Author);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Author));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        作者
                    </a>
                </AntMenu.Item>
                <AntMenu.Item key="publisher" icon={<BankOutlined />}>
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                            setFirstLevelType(FilterType.Publisher);
                            setSecondLevelMenuList(Object.keys(classifiedInfo.Publisher));
                        }}
                        style={{ paddingLeft: 13 }}
                    >
                        出版社
                    </a>
                </AntMenu.Item>
            </AntMenu>
        );
    };

    const MenuHeader = () => {
        switch (firstLevelType) {
            case FilterType.All:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <DatabaseOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;
            case FilterType.Author:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <DatabaseOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;

            case FilterType.Publisher:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <BankOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;

            case FilterType.Stars:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <StarOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;

            case FilterType.Subjects:
                return (
                    <ListSubheader>
                        <Dropdown overlay={headerDropMenu}>
                            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                                <TagsOutlined style={{ paddingRight: 13 }} />
                                {firstLevelType}
                                <DownOutlined style={{ paddingLeft: 13 }} />
                            </a>
                        </Dropdown>
                    </ListSubheader>
                );
                break;
            default:
                return null;
                break;
        }
    };

    const onSearchChange = (e: any) => {
        const keyword = e.target.value;
        const bookList = filterData(null, selectedSecondLevel, allBooksMeta);
        setData(
            _.filter(bookList, (item: BookMetaDataType) => {
                if (
                    (item.name != null && item.name.includes(keyword)) ||
                    (item.author != null && item.author.includes(keyword)) ||
                    (item.publisher != null && item.publisher.includes(keyword)) ||
                    (item.subjects != null && item.subjects.includes(keyword))
                ) {
                    return true;
                }
                return false;
            }),
        );
    };

    return (
        <div>
            <div>
                <RedditTextField
                    label="搜索 书名、作者、出版社、标签"
                    id="reddit-input"
                    variant="filled"
                    style={{
                        width: '100%',
                        marginBottom: 25,
                        marginTop: -15,
                        marginLeft: -13.5,
                    }}
                    onChange={onSearchChange}
                />
            </div>

            <Grid container spacing={2}>
                <Grid item xs={2} style={{ paddingLeft: 3, paddingTop: 0 }}>
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            position: 'relative',
                            height: '83vh',
                            overflow: 'auto',
                            '& ul': { padding: 0 },
                        }}
                        subheader={<li />}
                    >
                        {CustomizedMenus()}
                        {<MenuHeader />}

                        {secondLevelMenuList.map((item, index) => (
                            <ContextMenu
                                key={index}
                                Content={
                                    <ListItem
                                        style={{ padding: 0 }}
                                        onClick={() => {
                                            filterData(null, item, allBooksMeta);
                                        }}
                                    >
                                        <ListItemButton
                                            style={{ paddingLeft: 10, paddingRight: 10 }}
                                            selected={item === selectedSecondLevel}
                                        >
                                            <ListItemText primary={`${index + 1}. ${item}`} />
                                        </ListItemButton>
                                    </ListItem>
                                }
                                MenuInfo={[
                                    {
                                        name: '删除',
                                        handler: () => {
                                            deleteBookByKeyword(
                                                storeType,
                                                firstLevelType,
                                                selectedSecondLevel,
                                            ).then(() => {
                                                fetchBooks(sortTypeValue);
                                            });
                                        },
                                        prefixIcon: <DeleteIcon />,
                                    },
                                ]}
                            />
                        ))}
                    </List>
                </Grid>
                <Grid
                    item
                    xs={10}
                    style={{
                        paddingTop: 0,
                        paddingLeft: 5,
                    }}
                >
                    <BookCardList data={data} fetchBooks={fetchBooks} height={83} />
                </Grid>
            </Grid>
        </div>
    );
};

export default Books;
