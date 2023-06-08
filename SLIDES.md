---
# Metadata about the presentation:
title: identinet
author: Jan Christoph Ebersbach
date: 2023-06-08
keywords: firefox chrome identity extension credentials ssi did

# Presentation settings:
# Theme, list of supported themes: https://github.com/slidesdown/slidesdown/tree/main/docs/reveal.js/dist/theme
# theme: https://raw.githubusercontent.com/identinet/slidesdown-theme/main/identinet.css
theme: white
# Code highlighting theme, list of supported themes: https://github.com/slidesdown/slidesdown/tree/main/docs/reveal.js/plugin/highlight
highlight-theme: tokyo-night-dark
# Load font awesome pro icons (only works on domain slidesdown.github.io) free icons work everywhere. If both are enabled the pro icons are loaded
fontawesomePro: true
fontawesomeFree: false
# URL to favicon
favicon: ./favicon.svg

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

# identinet-plugin

> A
> <img src="https://didhack.xyz/assets/images/didhack-v2.1-147x42.png"
style="padding: 0; margin: 0; position: relative; top: 0.18em" />
> project

## Motivation

How to get DIDs and VCs into the hands and lives of people?

### Approach

- Set the bar for using DIDs and VCs low so that it's easy to derive value
  <!-- .element: class="fragment" -->
- Integrate DIDs and VCs into a tool that we use every day
  <!-- .element: class="fragment" -->

## Project

- Integrate DIDs and VCs via a browser extension
  <!-- .element: class="fragment" -->
- Enable website owners to publish a DID document and a Verifiable Presentation
  <!-- .element: class="fragment" -->
- Verify and display DID and VC data to visitors
  <!-- .element: class="fragment" -->

### How it Works

<ol>
<li class="fragment"><i class="fa-duotone fa-user" style="color: #039BE5"></i> visits website
   <i class="fa-duotone fa-browser" style="color: #039BE5"></i>
</li>
<li class="fragment"><i class="fa-duotone fa-puzzle-piece-simple" style="color: #039BE5"></i>
   retrieves did:web DID document
   <i class="fa-duotone fa-fingerprint" style="color: #039BE5"></i>
</li>
<li class="fragment"><i class="fa-duotone fa-puzzle-piece-simple" style="color: #039BE5"></i>
   retrieves Verifiable Presentation
   <i class="fa-duotone fa-address-card" style="color: #039BE5"></i>
</li>
<li class="fragment"><i class="fa-duotone fa-puzzle-piece-simple" style="color: #039BE5"></i>
   verifies data and displays status
   <i class="fa-duotone fa-shield-slash" style="color: #039BE5"></i>
   <i class="fa-duotone fa-shield-check" style="color: #039BE5"></i>
   <i class="fa-duotone fa-shield-plus" style="color: #039BE5"></i>
   <i class="fa-duotone fa-shield-xmark" style="color: #039BE5"></i>
</li>
<li class="fragment"><i class="fa-duotone fa-user" style="color: #039BE5"></i> reviews details
   <i class="fa-duotone fa-puzzle-piece-simple" style="color: #039BE5"></i>
</li>
</ol>

|||

![](./images/1_no_did_information.jpeg)

|||

![](./images/2_did_information_available.jpeg)

|||

![](./images/3_did_details.jpeg)

## Status

- ✅ Plugin is functional
- ✅ Firefox Extension is published
- 💤 Chrome Extension is being reviewed
- ☐ Plugin lacks a good UI
- ☐ Verification of Credentials not yet implemented

## Next Steps

- Improve UI
- Explore potential use cases
- Create a web service that offers the same functionality as the browser
  extension but doesn't require the extension

## Potential Use Cases

- Publish business information online, e.g. VAT or bank account number
- Enhance logos and claims on websites with verifiable information, e.g.
  customer testimonials or business partnerships

## Project Information

- Repository: https://github.com/identinet/identinet-plugin

## Contact Information

Jan Christoph Ebersbach

jan-christoph.eberbach@identinet.io

## Thank You
