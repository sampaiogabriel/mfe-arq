import { Thing } from "@sampaiogabriel/util-ui";

export default function Root(props) {
  return (
    <>
      <section>{props.name} is mounted!</section>
      <Thing />
    </>
  );
}
