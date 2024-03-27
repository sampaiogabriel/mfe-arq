import React, { FC, ReactElement, ReactNode } from 'react';

import { AuthProvider } from 'react-oidc-context';

const oidcConfig = {
    authority: 'https://login.e-auditoria.com.br/realms/aplicacao-cliente',
    client_id: 'client-cliente',
    redirect_uri: 'http://localhost:9000',
    client_secret: 'EldjqZ7LDThiQ0f4DuLxIIf38VyilZdP',
};

interface AuthProviderComponentProps {
    children: ReactNode
}

const AuthProviderComponent: FC<AuthProviderComponentProps> = ({ children }): ReactElement => {

    return (
        <AuthProvider {...oidcConfig}>
            {children}
        </AuthProvider>
    )
};

export { AuthProviderComponent };
