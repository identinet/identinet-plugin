import { Title } from "@solidjs/meta";

export default function About() {
  return (
    <>
      <Title>About</Title>
      <article class="prose">
        <h3 class="my-2">About</h3>
        <p>
          identinet-plugin was created by identinet GmbH. Visit{" "}
          <a href="https://identinet.io" target="_blank">
            identinet.io
          </a>{" "}
          to learn how to use Decentralized Identity.
        </p>
      </article>
    </>
  );
}
