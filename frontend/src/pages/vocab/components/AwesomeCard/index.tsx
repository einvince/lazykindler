import Card from '@mui/material/Card';
import _ from 'lodash';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import UsageInfo from '../UsageInfo';

type AwesomeProps = {
  data: any;
  currentIndex: number;
};

export default function AwosomeCard(props: AwesomeProps) {
  const { data, currentIndex } = props;

  return (
    <AwesomeSlider
      animation="fallAnimation"
      organicArrows={false}
      selected={currentIndex}
      style={{
        marginTop: 20,
        height: '69vh',
        width: '88%',
        // backgroundColor: 'tomato'
      }}
    >
      {_.map(data, (item, index) => {
        return (
          <Card style={{ backgroundColor: 'inherit' }} >
            <UsageInfo key={index} usageItem={item} />
          </Card>
        );
      })}
    </AwesomeSlider>
  );
}
