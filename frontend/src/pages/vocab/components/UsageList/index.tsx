import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Box, List, Paper } from '@mui/material';
import Tab from '@mui/material/Tab';
import { useEffect, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';
import Progress from '../Progress';
import UsageInfo from '../UsageInfo';
import VocabCard from '../VocabCard';

type UsageListProps = {
  usageList: any;
  upsertWordAndUsageSuccessNotify: any;
  upsertWordAndUsageFailNotify: any;
};

const UsageList = (props: UsageListProps) => {
  const { usageList } = props;
  const intl = useIntl();

  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const listContainerRef = useRef<HTMLDivElement>(null);
  const [firstVisibleIndex, setFirstVisibleIndex] = useState(0);

  useEffect(() => {
    const container = listContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      const items = container.querySelectorAll('.MuiPaper-root');
      if (items[firstVisibleIndex]) {
        items[firstVisibleIndex].scrollIntoView({ block: 'start', behavior: 'auto' });
      }
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [value]);

  const handleScroll = () => {
    const container = listContainerRef.current;
    if (container) {
      const items = container.getElementsByClassName('MuiPaper-root');
      let firstVisibleIndex = -1;
      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        const rect = item.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < container.clientHeight) {
          firstVisibleIndex = i;
          break;
        }
      }
      setFirstVisibleIndex(firstVisibleIndex);
    }
  };

  const listView = () => {
    return (
      <div>
        <Paper style={{ width: '100%', height: '76.4vh' }}>
          <List
            style={{ height: '76.4vh', overflow: 'auto' }}
            ref={listContainerRef}
            // subheader={
            //   <ListSubheader component="h6" sx={{ textAlign: 'center' }}>
            //     <FormattedMessage id="pages.vocabulary.list.usage_list" />
            //   </ListSubheader>
            // }
            component="nav"
          >
            {usageList.map((usageItem: any, index: number) => {
              return (
                <div style={{ backgroundColor: '#f2cc97', marginBottom: 50 }} key={index}>
                  <UsageInfo usageItem={usageItem} />
                </div>
              );
            })}
          </List>
        </Paper>
      </div>
    );
  };

  const cardView = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <VocabCard
          data={usageList}
          index={firstVisibleIndex}
          updateOuterIndex={(i: number) => {
            setFirstVisibleIndex(i);
          }}
        />
      </div>
    );
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            style={{ display: 'flex' }}
          >
            <Tab
              label={<FormattedMessage id="pages.vocabulary.usage_list.list_view" />}
              value="1"
            />
            <Tab
              label={<FormattedMessage id="pages.vocabulary.usage_list.card_view" />}
              value="2"
            />
          </TabList>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Progress current={firstVisibleIndex} total={usageList.length} />
        </Box>
        <TabPanel value="1" style={{ padding: 0 }}>
          {listView()}
        </TabPanel>
        <TabPanel value="2" style={{ padding: 0 }}>
          {cardView()}
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default UsageList;
