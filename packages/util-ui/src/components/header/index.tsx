import { Link, LinksSection, Title, Wrapper } from './styles';

export default function Header() {
  return (
    <Wrapper>
      <Title>Navbar</Title>

      <LinksSection>
        <Link>Home</Link>
        <Link>About</Link>
        <Link>Account</Link>
      </LinksSection>
    </Wrapper>
  );
}
