# identinet-plugin

[identinet](https://github.com/identinet/identinet-plugin) is a browser
extension that displays and verifies decentralized identity information of
websites. The extension is a [did:hack project](https://didhack.xyz/).

## Installation

- [ ] TODO

## Usage

- [ ] TODO

## Development

Requirements:

- [just](https://just.systems/) - Task runner like make
- [nu](https://nushell.sh/) - Versatile shell (developed on version 0.80.0)
- [NodeJS](https://nodejs.org/) - (developed on version 18.16.0)
- [Google Chrome](https://www.google.com/chrome/index.html) or
  [Firefox](https://www.mozilla.org/en-US/firefox/)

Steps to start development:

1. Install node modules: `just deps`
2. Build manifest file for your browser:
   - Firefox: `just create-manifest-firefox`
   - Chrome: `just create-manifest-chrome`
3. Install plugin temporarily:
   - Firefox:
     [Load Temporary Add-on](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)
   - Chrome:
     [Loading an unpacked extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked)
4. Start changing the code

## Resources

- [Firefox browser extension documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Chrome browser extension documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
