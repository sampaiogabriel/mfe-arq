import styled from "styled-components";

export const Wrapper = styled.header`
  height: 3rem;

  background-color: #0c0c0c;

  display: flex;
  flex-direction: row;

  justify-content: space-between;
  align-items: center;

  padding: 0rem 2rem;
`;

export const Title = styled.h1`
  font-family: "Courier New", Courier, monospace;
  font-size: 14pt;
  font-weight: 700;

  color: white;
`;

export const LinksSection = styled.div`
  display: flex;
  flex-direction: row;

  gap: 2rem;
`;

export const Link = styled.a`
  font-family: "Courier New", Courier, monospace;
  font-size: 12pt;
  font-weight: 500;

  cursor: pointer;

  color: white;
  text-decoration: none;

  &:hover {
    color: lightblue;
    text-decoration: underline;
  }
`;
