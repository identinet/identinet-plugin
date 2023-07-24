import { Navigate } from "solid-start";
export default function NotFound() {
  // this is a workaround page since the chrome extension first loads index.html
  return <Navigate href="/" />;
}
