/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { AuthProviderComponent } from '@sampaiogabriel/util-auth';
import { Thing } from '@sampaiogabriel/util-ui';

import AuthTeste from './components/AuthTeste';

export default function Root(props) {
  return (
    <AuthProviderComponent>
      <section>{props.name} is mounted!</section>
      <Thing />

      <div>
        <AuthTeste />
      </div>
    </AuthProviderComponent>
  );
}
