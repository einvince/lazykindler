// components
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

const Footer = ({ title, nowPage, totalPage, onPageMove }: Props) => {
    return (
        <div style={{ display: 'flex' }}>
            <Typography variant="body2" gutterBottom>
                {title}
            </Typography>
            <Typography
                variant="body2"
                gutterBottom
                style={{ position: 'absolute', float: 'right', right: 600 }}
            >
                {`${nowPage} / ${totalPage}`}
            </Typography>

            <div style={{ position: 'absolute', right: 10, paddingBottom: 5 }}>
                <IconButton
                    style={{ paddingBottom: 5 }}
                    color="primary"
                    aria-label="add to shopping cart"
                    onClick={() => onPageMove('PREV')}
                >
                    <ChevronLeftIcon />
                </IconButton>
                <IconButton
                    style={{ paddingBottom: 5 }}
                    color="primary"
                    aria-label="add to shopping cart"
                    onClick={() => onPageMove('NEXT')}
                >
                    <ChevronRightIcon />
                </IconButton>
            </div>
        </div>
    );
};

interface Props {
    title: string;
    nowPage: number;
    totalPage: number;
    onPageMove: (type: 'PREV' | 'NEXT') => void;
}

export default Footer;
