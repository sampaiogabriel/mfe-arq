/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { useAuth } from '@sampaiogabriel/util-auth';
import React, { FC, ReactElement } from 'react';

const AuthTeste: FC = (): ReactElement => {
  const auth = useAuth();

  console.log('auth', auth);

  return <button onClick={() => auth.signinRedirect()}>Log in</button>;
};

export default AuthTeste;
