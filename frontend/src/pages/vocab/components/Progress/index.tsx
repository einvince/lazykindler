import { Typography } from '@mui/material';

type ProgressProps = {
    current: number;
    total: number;
  };
  
  const Progress = ({ current, total }: ProgressProps) => {
    const percentage = total > 0 ? Math.floor((current / total) * 100) : 0;
    return (
      <Typography>
        {current}/{total} ({percentage}%)
      </Typography>
    );
  };
  
  export default Progress;
