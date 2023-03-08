import { observer } from 'mobx-react';
import React from "react";
import { Navigate, useRoutes } from 'react-router-dom';
import { Loadable } from './common/utils/loadable';

const CoursewarePage = Loadable('pages/Courseware');
const CoursewareTestPage = Loadable('pages/Courseware/test');
const ModulePage = Loadable('pages/Module');
const ChinesePage = Loadable('pages/Chinese');

export default observer(({ main = 'online'}) => {
  return useRoutes([
    {
      path: '/',
      element: <HomeLayout defaultSelectedKeys={[main]} />,
      children: [
        { element: <Navigate to={`/${main}`} replace />, index: true },
        { path: 'online', element: <CoursewarePage /> },
        { path: 'module', element: <ModulePage /> },
        { path: 'test', element: <CoursewareTestPage /> },
        { path: 'chinese', element: <ChinesePage /> },
      ],
    },
    // TODO: 导出单页时使用
    // {
    //   path: '/',
    //   element: <ChinesePage  />,
    //   index: true
    // },

    // {
    //   element: <CompactLayout />,
    //   children: [{ path: '404', element: <Page404 /> }],
    // },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
});