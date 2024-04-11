# Changelog

All notable changes to this project will be documented in this file.

## [0.3.0] - 2024-04-11

### Bug Fixes

- Use old chromium version due to bug in version 119
- Update lock
- Correct certificate names
- Correct did-configuration icon
- Switch verification method and proof types
- Correct notification command parameters
- Correct certificate names
- Correct did-configuration icon
- Switch verification method and proof types
- Correct notification command parameters
- Correct references to build task
- Correct popup size on chrome
- Toggle menu upon click and close menu upon navigation
- Increase logo size and move logo to the start
- Correct presentation suite
- Remove dependency on challenge and domain
- Disable development data since it break builds
- Correct detection of chrome in dev mode
- Make it a standard link and not a button
- Add custom protocol error type to bail out graciously
- Ignore loading events without a url to avoid double-setting the icon
- Don't fail on parser errors
- Make app scrollable without showing scroll bars

### Documentation

- Add linkedin clip
- Update examples
- Update examples
- Replace example.com with localhost domain
- Add linked-vp and .well-known DID config spec
- Update screenshot
- Update intro

### Features

- Add test websites
- Add did-configuration website
- Add credential handling script and presentations
- Add test websites
- Add did-configuration website
- Add credential handling script and presentations
- Add editorconfig
- Speed up builds by accepting browser as argument
- Add support for linked-vp service endpoints
- Visually separate dev mode from ui
- Add fold toggle
- Add new icons
- Add link to demo pages
- Reduce the number of corners in shield icon to 12
- Add business credential
- Optimize display of claims

### Miscellaneous Tasks

- Bump version
- Remove unused popup implementation
- Update messages
- Remove unused components
- Add flake configuration with build dependencies
- Update information
- Delete files without putting them in the trash first
- Use format data to accommodate for nu 0.87.0
- Replace pico css with unocss and daisyui
- Update keywords
- Set page title to identinet-plugin
- Add watchexec dependency
- Add DIDs
- Update dependencies
- List websites when starting caddy
- Format Caddyfile
- Add links to files
- Disable caching for the moment
- Add DIDs
- Update dependencies
- List websites when starting caddy
- Format Caddyfile
- Add links to files
- Disable caching for the moment
- Migrate to @solid/start
- Minify background.js
- Rename targets test-websites and dev
- Update dependencies
- Switch to .localhost domain since it requires no adjust of /etc/hosts
- Update dependencies
- Minor adjustments
- Remove debug output
- Add commit hooks
- Update ignore list
- Add release task
- Replace ownyourdata.eu with direct link to did document

## [0.2.2] - 2023-08-10

### Documentation

- Correct references to icons
- Add additional installation instructions

### Features

- Add link to logo

### Miscellaneous Tasks

- Bump version
- Update screenshots

## [0.2.1] - 2023-08-08

### Documentation

- Add changelog
- Add reference to web stores

### Features

- Add references to external services
- Diplay credential details

### Miscellaneous Tasks

- Remove empty .solid directory from build

## [0.2.0] - 2023-07-24

### Bug Fixes

- Add icons to chrome extension zip file
- Migrate presentation to authentication proof purpose
- Correct icon if no diddoc is present

### Documentation

- Add did:hack presentation
- Correct links to presentation and video
- Add scaled versions of the screenshots
- Add plugin link to chrome web store
- Change theme to identinet

### Features

- Update screenshot
- Implement verification of credentials
- Make logged value inspectable
- Implement verification of presentation
- Implement presentation verification
- [**breaking**] Introduce solidjs as UI framework
- Migrate UI to solidjs

### Miscellaneous Tasks

- Create source archive for every build
- Remove unsued webpack integration
- Remove debug output
- Display notification on build completion
- Bump version to 0.2.0

## [0.1.2] - 2023-06-08

### Features

- Add link to DID linting service
- Switch to local store hide DID if not in store

### Miscellaneous Tasks

- Bump version to v0.1.2

## [0.1.1] - 2023-06-08

### Bug Fixes

- Update requested permissions to meet requirements
- Correct link to slideshow

### Documentation

- Add development instructions
- Describe usage and add status icons
- List example pages
- Update plugin development instructions
- Add sample pages and instructions for creating a DID and VC/VP
- Fix link to firefox add-on page
- Cleanup examples
- Add slideshow
- Streamline slides
- Add another status

### Features

- Add bundler
- Add sanctuary library
- Implement basic functionality of showing did:web availability
- Implement functional background task
- Add initial implementation of popup

### Miscellaneous Tasks

- Add extension skaffolding
- Add and unify chrome and firefox build
- Restructure application folder
- Generate png icons
- Remove unused resources
- Bump version to 0.1.1

<!-- generated by git-cliff -->
