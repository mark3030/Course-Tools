import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

const ThemeProvider = ({ children }) => {

  const theme = {
    primaryColor: '#00b96b',
  };

  ConfigProvider.config({ theme });

  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default ThemeProvider;