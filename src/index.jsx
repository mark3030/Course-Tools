import { Skeleton } from 'antd';
import 'antd/dist/antd.css';
import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { RouterSwitch } from './router';
import './styles/index.less';

// React 18.x
const container = document.getElementById("container");
container.className = 'themes-default-color';
createRoot(container).render(
    <Suspense fallback={<Skeleton paragraph={{ rows: 16 }} active={true} />}>
        <HashRouter>
            <RouterSwitch />
        </HashRouter>
    </Suspense>
);