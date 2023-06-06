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
    let dist_dir = dist
    rm -rf $dist_dir
    mkdir $dist_dir
    let manifest_shared = (open manifest_shared.json)
    [firefox chrome] | each {|browser|
      let build_dir = $".build_($browser)"
      rm -rf $build_dir
      mkdir $build_dir
      cp -r icons $build_dir
      cp *.js $build_dir
      cp *.html $build_dir
      cp LICENSE $build_dir
      $manifest_shared | merge (open $"manifest_($browser).json") | save -f $"($build_dir)/manifest.json"
      if $browser == "firefox" {
        web-ext build --overwrite-dest -s $build_dir -a $dist_dir
        $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version).zip"
      } else {
        # build chrome extension
        $manifest_shared | merge (open manifest_chrome.json) | save -f $"($build_dir)/manifest.json"
        # See https://peter.sh/experiments/chromium-command-line-switches/
        chromium $"--pack-extension=($build_dir)" --pack-extension-key=./identinet-plugin.pem
        mv $"($build_dir).crx" $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version).crx"
        cd $build_dir
        ^zip -q -0 $"../($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_chrome.zip" *
        $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      }
    }

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
