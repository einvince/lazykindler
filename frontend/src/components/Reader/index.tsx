import { getClippingsByBookMetaUuid } from '@/services';
import { backend_server_addr } from '@/services/axios';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import { Button, Drawer } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useEffect, useRef, useState } from 'react';
import { ReactReader } from 'react-reader';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

type ReaderProps = {
  open: boolean;
  book_title: string;
  book_uuid: any;
  onClose: () => void;
};

export default function ReaderDialog(props: ReaderProps) {
  const [page, setPage] = useState('');
  const { open, book_title, book_uuid, onClose } = props;
  const [clippingList, setClippingList] = useState([]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (isOpen: boolean) => () => {
    setIsDrawerOpen(isOpen);
  };

  const tocRef = useRef<any>(null);

  let title: string;
  let extracted_book_name_v1 = book_title.split('(')[0];
  let extracted_book_name_v2 = book_title.split('（')[0];
  if (extracted_book_name_v1.length < extracted_book_name_v2.length) {
    title = extracted_book_name_v1;
  } else {
    title = extracted_book_name_v2;
  }

  const [location, setLocation] = useState<any>(null);
  const [firstRenderDone, setFirstRenderDone] = useState(false);

  const [selections, setSelections] = useState<any>([]);
  const renditionRef = useRef<any>(null);

  const locationChanged = (epubcifi: any) => {
    if (renditionRef.current && tocRef.current) {
      const { displayed, href } = renditionRef.current.location.start;
      const chapter = tocRef.current.find((item: any) => item.href === href);
      setPage(`${chapter ? chapter.label : 'n/a'} / ${displayed.total} / ${displayed.page}`);
    }
  };

  const getClippings = () => {
    getClippingsByBookMetaUuid(book_uuid).then((data) => {
      setClippingList(data);
    });
  };

  useEffect(() => {
    getClippings();
  }, [book_uuid]);

  useEffect(() => {
    if (renditionRef.current) {
      function setRenderSelection(cfiRange: any, contents: any) {
        setSelections(
          selections.concat({
            text: renditionRef.current.getRange(cfiRange).toString(),
            cfiRange,
          }),
        );
        renditionRef.current.annotations.add('highlight', cfiRange, {}, null, 'hl', {
          fill: 'red',
          'fill-opacity': '0.5',
          'mix-blend-mode': 'multiply',
        });
        contents.window.getSelection().removeAllRanges();
      }
      renditionRef.current.on('selected', setRenderSelection);
      return () => {
        renditionRef.current.off('selected', setRenderSelection);
      };
    }
  }, [setSelections, selections]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth>
        <DialogContent>
          <IconButton style={{ paddingLeft: 13 }} onClick={toggleDrawer(true)} aria-label="cart">
            <StyledBadge badgeContent={clippingList.length} color="secondary">
              <AlignHorizontalLeftIcon />
            </StyledBadge>
          </IconButton>
          <div style={{ height: '82vh' }}>
            <ReactReader
              location={location}
              locationChanged={locationChanged}
              url={`${backend_server_addr}/api/book/read/uuid/${book_uuid}/file.epub`}
              title={title}
              showToc
              tocChanged={(toc) => (tocRef.current = toc)}
              getRendition={(rendition) => {
                renditionRef.current = rendition;
                renditionRef.current.themes.default({
                  '::selection': {
                    background: 'tomato',
                  },
                });
                setSelections([]);
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
                left: '1rem',
                textAlign: 'center',
                zIndex: 1,
              }}
            >
              {page}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Drawer
        style={{ zIndex: 1000000000 }}
        anchor="right"
        open={isDrawerOpen}
        onClose={toggleDrawer(false)}
      >
        <div style={{ width: 700 }}>
          <h2>这是一个从右侧弹出的抽屉</h2>
          <p>抽屉中可以放置任何您想要的内容。</p>
          <Button onClick={toggleDrawer(false)}>关闭抽屉</Button>
        </div>
      </Drawer>
    </div>
  );
}
