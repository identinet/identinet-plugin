# Documentation: https://just.systems/man/en/

set shell := ["nu", "-c"]

# Integration with nodejs package.json scripts, see https://just.systems/man/en/chapter_65.html

export PATH := './node_modules/.bin:' + env_var('PATH')
export DIST_DIR := "dist"
export BUILD_DIR := ".build"

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
_build:
    #!/usr/bin/env nu
    let dist_dir = $env.DIST_DIR
    rm -rf $dist_dir
    mkdir $dist_dir
    let package = (open package.json)
    let manifest_shared = (open src/manifest_shared.json | upsert version $package.version)
    let build_dir = $env.BUILD_DIR
    rm -rf $build_dir
    mkdir $build_dir
    cp src/*.html $build_dir
    cp -r src/icons $build_dir
    cp LICENSE $build_dir
    # npx webpack
    # workaround the not yet existing support of package.json/browser in rollup - webpack supports it but uses eval which breaks browser plugins
    # See: https://docs.npmjs.com/cli/v6/configuring-npm/package-json#browser
    # See: https://github.com/rollup/rollup/issues/185
    # See: https://github.com/webpack/webpack/issues/5627
    let platform_bak = ./node_modules/jsonld/lib/platform.js.bak
    let platform = ./node_modules/jsonld/lib/platform.js
    let platform_browser = ./node_modules/jsonld/lib/platform-browser.js
    if ($platform_browser | path exists) {
      mv $platform $platform_bak
      mv $platform_browser $platform
    }
    yarn run rollup -c
    # ls src/*.js | par-each {|it| yarn run rollup -i $it.name --file $"($build_dir)/($it.name | path basename)" --format iife --inlineDynamicImports -p @rollup/plugin-commonjs -p rollup-plugin-polyfill-node -p @rollup/plugin-node-resolve}
    [firefox chrome] | par-each {|browser|
      let build_dir_browser = $"($env.BUILD_DIR)_($browser)"
      rm -rf $build_dir_browser
      cp -r $build_dir $build_dir_browser
      $manifest_shared | merge (open $"src/manifest_($browser).json") | save -f $"($build_dir_browser)/manifest.json"
      if $browser == "firefox" {
        let res = (do {web-ext build --overwrite-dest -s $build_dir_browser -a $dist_dir} | complete)
        if $res.exit_code != 0 {
          print $res
          exit $res.exit_code
        }
        mv $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version).zip" $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      } else {
        # build chrome extension
        $manifest_shared | merge (open src/manifest_chrome.json) | save -f $"($build_dir_browser)/manifest.json"
        # See https://peter.sh/experiments/chromium-command-line-switches/
        chromium $"--pack-extension=($build_dir_browser)" --pack-extension-key=./identinet-plugin.pem
        mv $"($build_dir_browser).crx" $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).crx"
        cd $build_dir_browser
        ^zip -q -r -0 $"../($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip" *
      }
      print $"($browser) package ready: ($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
    }
    # yarn run rollup -c
    git archive HEAD -o $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_source.tar.gz"
    print $"Source package ready: ($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_source.tar.gz"
    print "done."

# Build extension
build:
    NODE_ENV=development just _build

# Build extension for production
build-prod:
    NODE_ENV=production just _build

# Watch changes and rebuild appliaction
watch:
    watch src  {|| just build}

# Cleanup everything
clean:
    rm -rf  $env.DIST_DIR $env.BUILD_DIR
    glob $"($env.BUILD_DIR)_*" | each {|it| rm -rf $it}
