---
# Metadata about the presentation:
title: identinet-plugin
author: Jan Christoph Ebersbach
date: 2023-09-11
keywords: identity credentials ssi did did:web

# Presentation settings:
# URL to favicon
# favicon: ./favicon.svg
favicon: https://identinet.github.io/slidesdown-theme/images/favicon.svg
# Theme, list of supported themes: https://github.com/slidesdown/slidesdown/tree/main/docs/reveal.js/dist/theme
# theme: white
theme: https://identinet.github.io/slidesdown-theme/identinet.css
# Code highlighting theme, list of supported themes: https://github.com/slidesdown/slidesdown/tree/main/docs/reveal.js/plugin/highlight
highlight-theme: tokyo-night-dark
# Load font awesome pro icons (only works on domain slidesdown.github.io) free icons work everywhere. If both are enabled the pro icons are loaded
fontawesomePro: true
fontawesomeFree: false

# Show progress bar
progress: true
# Show controls
controls: false
# Center presentation
center: true
# Create separate pages for fragments
pdfSeparateFragments: false
# Full list of supported settings: https://revealjs.com/config/ or
# https://github.com/hakimel/reveal.js/blob/master/js/config.js
---

# DIF Presentation CRUD for did:web and Verifiable Websites

## C(R)UD for did:web

- did:web only specifies an API for the `Read/Resolve` method
- `Create`, `Update` and `Delete` need to be performed manually

- Since did:web is cost effective, simple, human-readable and doesn't require
  much infrastructure, can we make it more usable 🤔

### did-web-server Project

- did:web web service that provides an API for all CRUD methods
- Solely relies on DIDs and VCs for access control and data
- Provide some of self-sovereign features in the API

### Usage: Create DID

- DID is used to identify administrator
- Admin issues DID doc of new users as VC wrapped in a VP
- Admin sends signed VP to HTTP API of did-web-server

### Usage: Delete DID

- DID is used to identify administrator
- Admin issues VC with user's DID as subject.id wrapped in a VP
- Admin sends signed VP to HTTP API of did-web-server

### Usage: Update DID

- User is identified by his/her DID on the server
- User issues updated DID doc as VC wrapped in a VP
- User sends signed VP to HTTP API of did-web-server

(Small "self-sovereign" limitation: Admin is not allowed to update existing DID)

### Usage: Read DID

According to spec.

### Status

- did-web-server implementation exists in Rust
- JS client implementation in progress
- DID CLIs like didkit can be use to craft request data

### Other approaches

- [did-webplus https://github.com/LedgerDomain/did-webplus/](https://github.com/LedgerDomain/did-webplus/)
- Github issue with did:web 2.0 suggestion

### Feedback Welcome

- Business need?
- Technical feasibility?
- Ideas for potential next steps?
- Possibility for integration into Universal Registrar?

## Verifiable Websites

### How to make DIDs and VCs useful to people, today?

- Constraints:
  - minimal, ideally no prerequisites - no DID, no VC, no wallet
  - benefit for the people observing DIDs/VCs
  - benefit for the provider who's providing DIDs/VCs

### Proposal

Enhance websites with DIDs and VCs and provide a browser plugin / website for
inspecting the data

### Status

- ☑ [Browser plugin](https://github.com/identinet/identinet-plugin) exists that
  retrieves did:web DID and a Verifiable Presentation from a domain, verifies
  and displays it
- ☑ [did:web spec](https://w3c-ccg.github.io/did-method-web/) exists for linking
  a DNS domain to a did:web DID
- ☐
  [DIF Well Known DID Configuration](https://identity.foundation/.well-known/resources/did-configuration/)
  exists for linking any DID to a DNS domain and vice verca (not yet
  implemented)
- ❓ Verifiable Data Registries (not sure how they apply)
- 🗵 No Well Known VC/VP Configuration spec, yet

### Feedback Welcome

- Business use cases?
- Technical feasibility?
- Ideas for potential next steps?
