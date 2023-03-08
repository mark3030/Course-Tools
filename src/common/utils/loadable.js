import { Skeleton } from 'antd';
import { lazy, Suspense } from 'react';

export const Loadable = pageName => props => {
    const Component = lazy(() => import(`@/${pageName}`));
    return (
        <Suspense fallback={<Skeleton paragraph={{ rows: 16 }} active={true} />}>
            <Component {...props} />
        </Suspense>
    )
};