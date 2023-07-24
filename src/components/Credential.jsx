export default function Credential(credential) {
  return (
    <div>
      <div>Issuer:</div>
      <div>{credential()?.issuer || "No Issuer."}</div>
      <div>Type:</div>
      <div>{credential()?.type?.join(", ")}</div>
      <div>Id:</div>
      <div>{credential()?.id || "No credential ID."}</div>
      <div>Created:</div>
      <div>{credential()?.created || "No creation Date."}</div>
      <div>Claims:</div>
      <div>{
        cont claims = credential()?.credentialSubject || {};
        return Object.keys(claims).forEach(key => <div>key</div><div>claims[key]</div>)
        }</div>
    </div>
  );
}
