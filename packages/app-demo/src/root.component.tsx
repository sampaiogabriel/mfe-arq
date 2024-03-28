/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { Thing } from '@sampaiogabriel/util-ui';

export default function Root(props) {
  return (
    <>
      <section>{props.name} is mounted!</section>
      <Thing />

      <div />
    </>
  );
}
