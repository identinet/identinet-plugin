import { Navigate } from "@solidjs/router";
export default function NotFound() {
  // this is a workaround page since the chrome extension first loads index.html
  return <Navigate href="/" />;
}
