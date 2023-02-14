import { backend_server_addr } from '@/services/axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useState } from 'react';
import { ReactReader } from 'react-reader';

type ReaderProps = {
  open: boolean;
  book_title: string;
  book_uuid: any;
  onClose: () => void;
};

export default function ReaderDialog(props: ReaderProps) {
  const { open, book_title, book_uuid, onClose } = props;

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
  const locationChanged = (epubcifi: any) => {
    if (!firstRenderDone) {
      setLocation(localStorage.getItem('book-progress'));
      setFirstRenderDone(true);
      return;
    }

    localStorage.setItem('book-progress', epubcifi);
    setLocation(epubcifi);
  };

  return (
    <div>
      <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth>
        <DialogContent>
          <div style={{ height: '88vh' }}>
            <ReactReader
              location={location}
              locationChanged={locationChanged}
              url={`${backend_server_addr}/api/book/read/uuid/${book_uuid}/file.epub`}
              title={title}
              showToc
              swipeable
              getRendition={(rendition) => {
                rendition.themes.register('custom', {
                  p: {
                    'font-weight': '400',
                    'line-height': 1.5,
                  },
                });
                rendition.themes.select('custom');
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
