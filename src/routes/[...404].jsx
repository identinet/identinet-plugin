import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
      <p>{document.URL}</p>
      <p>
        Visit <a href="https://identinet.io" target="_blank">identinet.io</a>
        to learn how to use Decentralized Identity.
      </p>
    </main>
  );
}
