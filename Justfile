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
lint: build
    web-ext lint --source-dir=.build_firefox

# Build extension
build:
    #!/usr/bin/env nu
    let dist_dir = dist
    rm -rf $dist_dir
    mkdir $dist_dir
    let manifest_shared = (open src/manifest_shared.json)
    [firefox chrome] | par-each {|browser|
      let build_dir = $".build_($browser)"
      rm -rf $build_dir
      mkdir $build_dir
      cp -r src/icons $build_dir
      ls src/*.js | par-each {|it| yarn run rollup -i $it.name --file $"($build_dir)/($it.name | path basename)" --format esm  -p @rollup/plugin-commonjs -p @rollup/plugin-node-resolve -p rollup-plugin-polyfill-node}
      cp src/*.html $build_dir
      cp LICENSE $build_dir
      $manifest_shared | merge (open $"src/manifest_($browser).json") | save -f $"($build_dir)/manifest.json"
      if $browser == "firefox" {
        web-ext build --overwrite-dest -s $build_dir -a $dist_dir
        $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version).zip"
      } else {
        # build chrome extension
        $manifest_shared | merge (open src/manifest_chrome.json) | save -f $"($build_dir)/manifest.json"
        # See https://peter.sh/experiments/chromium-command-line-switches/
        chromium $"--pack-extension=($build_dir)" --pack-extension-key=./identinet-plugin.pem
        mv $"($build_dir).crx" $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version).crx"
        cd $build_dir
        ^zip -q -0 $"../($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_chrome.zip" *
        $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      }
    }

# Watch changes and rebuild appliaction
watch:
    watch src  {|| just build}
