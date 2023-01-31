import { backend_server_addr } from '@/services/axios';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import Reader from '../../../../containers/Reader';

type ReaderProps = {
    open: boolean;
    book_title: string;
    book_uuid: any;
    onClose: () => void;
};

export default function ReaderDialog(props: ReaderProps) {
    const { open, book_title, book_uuid, onClose } = props;

    let title = book_title;

    let extracted_book_name_v1 = book_title.split('(')[0];
    let extracted_book_name_v2 = book_title.split('（')[0];
    if (extracted_book_name_v1.length < extracted_book_name_v2.length) {
        title = extracted_book_name_v1;
    } else {
        title = extracted_book_name_v2;
    }

    return (
        <div>
            <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth>
                <DialogContent>
                    <div
                        // style={{ position: 'relative', height: '85vh', backgroundColor: '#ead8bc' }}
                        style={{ position: 'relative', height: '85vh' }}
                    >
                        <Reader
                            url={`${backend_server_addr}/api/book/read/uuid/${book_uuid}/file.epub`}
                            book_title={title}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
