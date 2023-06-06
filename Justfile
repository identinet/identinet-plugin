# Documentation: https://just.systems/man/en/

set shell := ["nu", "-c"]

# Integration with nodejs package.json scripts, see https://just.systems/man/en/chapter_65.html

export PATH := './node_modules/.bin:' + env_var('PATH')

# Print this help
help:
    @just -l

# Install dependencies
deps:
    yarn

# Format Justfile
format:
    @just --fmt --unstable

# Lint extension - only the firefox extension is linted at the moment
lint:
    @just create-manifest-firefox
    web-ext lint

# Build extension
build:
    #!/usr/bin/env nu
    # build firefox extension
    let manifest_shared = (open manifest_shared.json)
    $manifest_shared | merge (open manifest_firefox.json) | save -f manifest.json
    web-ext build
    # TODO build chrome extension

# Create extension manifest for firefox
create-manifest-firefox:
    #!/usr/bin/env nu
    # only the firefox extension is linted here
    let manifest_shared = (open manifest_shared.json)
    $manifest_shared | merge (open manifest_firefox.json) | save -f manifest.json

# Create extension manifest for chrome
create-manifest-chrome:
    #!/usr/bin/env nu
    # only the firefox extension is linted here
    let manifest_shared = (open manifest_shared.json)
    $manifest_shared | merge (open manifest_chrome.json) | save -f manifest.json
