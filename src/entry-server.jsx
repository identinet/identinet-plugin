import { createHandler, StartServer } from "@solidjs/start/server";

const isDevEnv = process.env.NODE_ENV === "development";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html
        lang="en"
        classList={{ isDev: isDevEnv }}
        style="scrollbar-width: none;"
      >
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
