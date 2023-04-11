import { getSetting, upsertSetting } from '@/services';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'umi';

type BookSettingMenuProps = {
  fetchBooks: any;
};

const settingKeyBookSortType = 'book_sort_type';

const BookSettingMenu = (props: BookSettingMenuProps) => {
  const { fetchBooks } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [sortTypeValue, setSortTypeValue] = useState<number>(2);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSubMenuAnchorEl(event.currentTarget);
  };

  const handleSubMenuClose = () => {
    setSubMenuAnchorEl(null);
  };

  useEffect(() => {
    getSetting(settingKeyBookSortType).then((data) => {
      if (data.data == '') {
        setSortTypeValue(0);
      } else {
        setSortTypeValue(Number(data.data));
      }
    });
  }, [sortTypeValue]);

  return (
    <div>
      <IconButton onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onMouseEnter={handleSubMenuOpen}>
          <Typography>
            <FormattedMessage id="pages.books.book_sorting" />
          </Typography>
          <ListItemIcon style={{ minWidth: 'auto', marginLeft: 10 }}>
            <ArrowRightIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleSubMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        onMouseLeave={handleSubMenuClose}
      >
        <MenuItem
          selected={sortTypeValue == 1}
          onClick={() => {
            handleClose();
            setSortTypeValue(1);

            upsertSetting(settingKeyBookSortType, 1).then(() => {
              fetchBooks();
            });

            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.size.ascending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 2}
          onClick={() => {
            handleClose();
            setSortTypeValue(2);

            upsertSetting(settingKeyBookSortType, 2).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.size.descending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 3}
          onClick={() => {
            handleClose();
            setSortTypeValue(3);

            upsertSetting(settingKeyBookSortType, 3).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.import.ascending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 4}
          onClick={() => {
            handleClose();
            setSortTypeValue(4);

            upsertSetting(settingKeyBookSortType, 4).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.import.descending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 5}
          onClick={() => {
            handleClose();
            setSortTypeValue(5);

            upsertSetting(settingKeyBookSortType, 5).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.rating.ascending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 6}
          onClick={() => {
            handleClose();
            setSortTypeValue(6);

            upsertSetting(settingKeyBookSortType, 6).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.rating.descending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 7}
          onClick={() => {
            handleClose();
            setSortTypeValue(7);

            upsertSetting(settingKeyBookSortType, 7).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.author.ascending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 8}
          onClick={() => {
            handleClose();
            setSortTypeValue(8);

            upsertSetting(settingKeyBookSortType, 8).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.author.descending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 9}
          onClick={() => {
            handleClose();
            setSortTypeValue(9);

            upsertSetting(settingKeyBookSortType, 9).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.publisher.ascending" />
          </Typography>
        </MenuItem>
        <MenuItem
          selected={sortTypeValue == 10}
          onClick={() => {
            handleClose();
            setSortTypeValue(10);

            upsertSetting(settingKeyBookSortType, 10).then(() => {
              fetchBooks();
            });
            handleSubMenuClose();
          }}
        >
          <Typography>
            <FormattedMessage id="pages.books.book_sorting.publisher.descending" />
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default BookSettingMenu;
