import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produc',
    defaultMessage: '天生我材必有用，千金散尽还复来',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/leowucn/lazykindler',
          blankTarget: true,
        },
        {
          key: 'leowucn',
          title: 'leowucn',
          href: 'https://github.com/leowucn/lazykindler',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
