/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/function-component-definition */
// @ts-ignore
import { useUserStore } from '@sampaiogabriel/util-state';

import { Link, LinksSection, Title, Wrapper } from './styles';

export default function Header() {
  const { logout } = useUserStore();

  return (
    <Wrapper>
      <Title>Navbar</Title>

      {/* <span style={{ color: 'white' }}>Email: {user?.profile?.email}</span> */}

      <button type="button" onClick={logout}>
        logout
      </button>

      <LinksSection>
        <Link>Home</Link>
        <Link>About</Link>
        <Link>Account</Link>
      </LinksSection>
    </Wrapper>
  );
}
