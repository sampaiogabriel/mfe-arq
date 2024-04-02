// @ts-ignore
import { useUserStore } from '@sampaiogabriel/util-state';
import React, { FC, ReactElement } from 'react';
import './index.css';

const Root: FC = (): ReactElement => {
    const { user } = useUserStore();

    if (!user) {
        return (
            <div className="body">
                <span className="loader" />
            </div>
        );
    }

    return <></>;
};

export default Root;
