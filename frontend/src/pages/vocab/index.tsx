import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { FormattedMessage } from 'umi';

import { useState } from 'react';

import AddVocab from './add_vocab';
import VocabList from './vocab_list';

const VocabComponent = () => {
  const [tabValue, setTabValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            centered
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            style={{ height: 60, marginTop: -33 }}
          >
            <Tab
              style={{ padding: 10 }}
              icon={<FormatListBulletedIcon />}
              iconPosition="start"
              label={<FormattedMessage id="pages.vocabulary.list" />}
              value="1"
            />
            <Tab
              style={{ padding: 10 }}
              icon={<DataSaverOnIcon />}
              iconPosition="start"
              label={<FormattedMessage id="pages.vocabulary.add" />}
              value="2"
            />
          </Tabs>
        </Box>
        <TabPanel style={{ padding: 0 }} value="1">
          <VocabList />
        </TabPanel>
        <TabPanel style={{ padding: 0 }} value="2">
          <AddVocab />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default VocabComponent;
