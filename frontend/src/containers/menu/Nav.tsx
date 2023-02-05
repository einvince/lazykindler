import { getArrayValueFromLocalStorage, setArrayValueToLocalStorage } from '@/util';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import { TreeItemProps } from '@mui/lab/TreeItem';
import { TreeItemContentProps, useTreeItem } from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import BookInfo from '../nav/BookInfo';
import { MenuControl } from '../../lib/hooks/useMenu';
import { RootState } from '../../slices';
import Book from '../../types/book';
import Toc from '../../types/toc';

const Nav = ({ control, onToggle, onLocation }: Props) => {
    const book = useSelector<RootState, Book>((state) => state.book.book);
    const bookToc = useSelector<RootState, Toc[]>((state) => state.book.toc);

    const [exanpandNodeIds, setExanpandNodeIds] = useState([]);

    /** Click nav item */
    const onClickItem = (loc: string) => {
        onLocation(loc);
    };

    const CustomContent = React.forwardRef(function CustomContent(
        props: TreeItemContentProps,
        ref,
    ) {
        const {
            classes,
            className,
            label,
            nodeId,
            icon: iconProp,
            expansionIcon,
            displayIcon,
        } = props;

        const {
            disabled,
            expanded,
            selected,
            focused,
            handleExpansion,
            handleSelection,
            preventSelection,
        } = useTreeItem(nodeId);

        const icon = iconProp || expansionIcon || displayIcon;

        const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            preventSelection(event);
        };

        const handleExpansionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleExpansion(event);
        };

        const handleSelectionClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            handleSelection(event);
        };

        return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
                className={clsx(className, classes.root, {
                    [classes.expanded]: expanded,
                    [classes.selected]: selected,
                    [classes.focused]: focused,
                    [classes.disabled]: disabled,
                })}
                onMouseDown={handleMouseDown}
                ref={ref as React.Ref<HTMLDivElement>}
            >
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
                <div onClick={handleExpansionClick} className={classes.iconContainer}>
                    {icon}
                </div>
                <Typography
                    onClick={handleSelectionClick}
                    component="div"
                    className={classes.label}
                >
                    {label}
                </Typography>
            </div>
        );
    });

    const CustomTreeItem = (props: TreeItemProps) => (
        <TreeItem ContentComponent={CustomContent} {...props} />
    );

    const renderTree = (node: any) => (
        <CustomTreeItem
            key={node.id}
            nodeId={node.id}
            label={
                <Typography
                    variant="overline"
                    display="block"
                    gutterBottom
                    onClick={() => onClickItem(node.href)}
                >
                    {node.label}
                </Typography>
            }
            collapseIcon={
                <ExpandMoreIcon
                    onClick={() => {
                        const nodeIds = getArrayValueFromLocalStorage(book.title);
                        const index = nodeIds.indexOf(node.id);
                        if (index > -1) {
                            nodeIds.splice(index, 1);
                        }
                        setExanpandNodeIds(nodeIds);
                        setArrayValueToLocalStorage(book.title, nodeIds);
                    }}
                />
            }
            expandIcon={
                <ChevronRightIcon
                    onClick={() => {
                        const nodeIds = getArrayValueFromLocalStorage(book.title);
                        if (nodeIds.indexOf(node.id) === -1) {
                            nodeIds.push(node.id);
                        }
                        setExanpandNodeIds(nodeIds);
                        setArrayValueToLocalStorage(book.title, nodeIds);
                    }}
                />
            }
            // icon={<DeleteIcon />}
        >
            {Array.isArray(node.subitems)
                ? node.subitems.map((subNode: any) => renderTree(subNode))
                : null}
        </CustomTreeItem>
    );

    const list = () => (
        <Box>
            <TreeView
                aria-label="rich object"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpanded={exanpandNodeIds}
                defaultExpandIcon={<ChevronRightIcon />}
                sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
            >
                {bookToc.map((t, index) => {
                    return <div key={index}>{renderTree(t)}</div>;
                })}
            </TreeView>
        </Box>
    );

    return (
        <>
            {control.display && (
                <React.Fragment>
                    <CssBaseline />
                    <Container maxWidth="sm">
                        <Box>
                            <Drawer
                                anchor={'right'}
                                open={control.open}
                                title="目录"
                                onClose={onToggle}
                                // ref={ref}
                                sx={{
                                    display: {
                                        boxSizing: 'border-box',
                                        zIndex: 100000,
                                    },
                                }}
                            >
                                <BookInfo
                                    src={book.coverURL}
                                    title={book.title}
                                    publisher={book.publisher}
                                    author={book.author}
                                />
                                {list()}
                            </Drawer>
                        </Box>
                    </Container>
                </React.Fragment>
            )}
        </>
    );
};

interface Props {
    control: MenuControl;
    onToggle: () => void;
    onLocation: (loc: string) => void;
}

export default React.forwardRef(Nav);
