import { ConfigProvider } from 'antd';
import PropTypes from 'prop-types';

const ThemeProvider = ({ children }) => {
  // seedToken
  const seedToken = {
    colorPrimary: '#00b96b', // 主题颜色
    colorPrimaryText: '#a5b6c8', // 主题文本颜色
    // colorText: '#a5b6c8', // 文本颜色
    // colorBorder: '#535f6b', // 边框颜色
    // colorBgContainer: '#30373f' // 组件背景颜色
  };

  // 自定义token
  const customToken = token => ({
    border: `1px solid ${token.colorBorder}`,
    // borderDashed: `1px dashed ${token.colorBorder}`,
    borderDashed: `1px dashed #fff`,
    borderDotted: `1px dotted ${token.colorPrimary}`,
    boxShadow: '2px 3px 6px rgb(0 0 0 / 10%)',
    headerHeight: 60, // 顶部拦高度
    sidebarWidth: 50, // 边栏宽度
    thumbBarWidth: 260, // 缩略图宽度
    stageBottom: 0, //舞台区底部位置
    settingWidth: 300, // 属性区宽度
    colorBgSidebar: '#0e1113', // 侧边栏背景颜色
    referenceBgColor: '#00ffff', // 参考线背景颜色
  });

  const theme = {
    token: {
      ...seedToken,
      ...customToken(seedToken)
    }
  };

  return (
    <ConfigProvider theme={theme}>
      {children}
    </ConfigProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default ThemeProvider;