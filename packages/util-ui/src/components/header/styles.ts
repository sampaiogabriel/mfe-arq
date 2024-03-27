import styled from "styled-components";

export const Wrapper = styled.header`
  width: 100%;
  height: 4rem;

  background-color: #0c0c0c;

  display: flex;
  flex-direction: row;

  justify-content: space-between;

  padding: 0rem 4rem;
`;

export const Title = styled.h1`
  font-family: "Courier New", Courier, monospace;
  font-size: 16pt;
  font-weight: 700;
`;

export const LinksSection = styled.div`
  display: flex;
  flex-direction: row;

  gap: 2rem;
`;

export const Link = styled.a`
  font-family: "Courier New", Courier, monospace;
  font-size: 14pt;
  font-weight: 500;

  color: white;
  text-decoration: none;

  &:hover {
    color: lightblue;
    text-decoration: underline;
  }
`;
