import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRef, useState } from 'react';
import AwesomeCard from '../AwesomeCard';

type VocabCardProp = {
  data: any;
  index: number;
  updateOuterIndex: any;
};

const initialUsageItem = {
  usage: '开始',
};
const endUsageItem = {
  usage: '完结',
};

export default function locabCard(props: VocabCardProp) {
  const { data, index, updateOuterIndex } = props;

  const [hasClickAnswer, setHasClickAnswerButton] = useState<boolean>(false);

  const [currentIndex, setCurrentIndex] = useState<any>(index);
  const [currentItem, setCurrentItem] = useState<any>(data[currentIndex] || initialUsageItem);

  const isProcessing = useRef(false);

  const nextUsageItem = (newIndex: number) => {
    if (isProcessing.current) {
      return;
    }
    isProcessing.current = true;

    if (currentIndex >= data.length - 1) {
      setCurrentItem(endUsageItem);
    } else {
      setCurrentItem(data[newIndex]);
      setCurrentIndex(newIndex);
      updateOuterIndex(newIndex);
    }

    setTimeout(() => {
      isProcessing.current = false;
    }, 300);
  };

  const onClickRememberActionButton = () => {
    nextUsageItem(currentIndex + 1);
    setHasClickAnswerButton(false);
  };

  const rememberAction = () => {
    return (
      <Stack spacing={2} direction="row" style={{ display: 'flex' }}>
        <Button
          variant="outlined"
          onClick={() => {
            onClickRememberActionButton();
          }}
        >
          <Typography variant="button" component="div" color={'red'}>
            Again
          </Typography>
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            onClickRememberActionButton();
          }}
        >
          <Typography variant="button" component="div" color={'orange'}>
            Hard
          </Typography>
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            onClickRememberActionButton();
          }}
        >
          <Typography variant="button" component="div" color={'green'}>
            Good
          </Typography>
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            onClickRememberActionButton();
          }}
        >
          <Typography variant="button" component="div" color={'blue'}>
            Easy
          </Typography>
        </Button>
      </Stack>
    );
  };

  const itemAction = () => {
    return (
      <Stack spacing={2} direction="row" style={{ display: 'flex' }}>
        <Button
          variant="contained"
          onClick={() => {
            nextUsageItem(currentIndex + 1);
            setHasClickAnswerButton(true);
          }}
        >
          <Typography variant="button" component="div">
            Skip
          </Typography>
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            setHasClickAnswerButton(true);
          }}
        >
          <Typography variant="button" component="div">
            Show Answer
          </Typography>
        </Button>
      </Stack>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <AwesomeCard data={data} currentIndex={currentIndex} />

      {hasClickAnswer ? rememberAction() : itemAction()}
    </div>
  );
}
