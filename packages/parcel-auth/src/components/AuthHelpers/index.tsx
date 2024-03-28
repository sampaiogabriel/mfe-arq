import React, { useEffect, useState } from 'react';
import { hasAuthParams, useAuth } from 'react-oidc-context';
// @ts-ignore
import { useUserStore } from '@sampaiogabriel/util-state';

const AuthHelpers = () => {
    const auth = useAuth();
    const { setUser } = useUserStore();
    const [hasTriedSignin, setHasTriedSignin] = useState(false);

    useEffect(() => {
        if (!hasAuthParams() &&
            !auth.isAuthenticated && !auth.activeNavigator && !auth.isLoading &&
            !hasTriedSignin
        ) {
            auth.signinRedirect();
            setHasTriedSignin(true);
        }

        if (auth.isAuthenticated) {
            const { id_token, access_token, refresh_token, profile } = auth.user;

            const user = {
                id_token: id_token,
                access_token: access_token,
                refresh_token: refresh_token,
                profile: {
                    email: profile.email,
                    name: profile.name,
                    given_name: profile.given_name,
                    family_name: profile.family_name,
                }
            }

            setUser(user)
        }
    }, [auth, hasTriedSignin]);

    return <></>;
};

export default AuthHelpers;
