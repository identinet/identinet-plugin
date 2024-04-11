#!/usr/bin/env just --justfile
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

# Install git commit hooks
githooks:
    #!/usr/bin/env nu
    $env.config = { use_ansi_coloring: false, error_style: "plain" }
    let hooks_folder = '.githooks'
    if (git config core.hooksPath) != $hooks_folder {
      print 'Installing git commit hooks'
      git config core.hooksPath $hooks_folder
      # npm install -g @commitlint/config-conventional
    }
    if not ($hooks_folder | path exists) {
      mkdir $hooks_folder
      "#!/usr/bin/env -S sh\nset -eu\njust test" | save $"($hooks_folder)/pre-commit"
      chmod 755 $"($hooks_folder)/pre-commit"
      "#!/usr/bin/env -S sh\nset -eu\n\nMSG_FILE=\"$1\"\nPATTERN='^(fix|feat|docs|style|chore|test|refactor|ci|build)(\\([a-z0-9/-]+\\))?!?: [a-z].+$'\n\nif ! head -n 1 \"${MSG_FILE}\" | grep -qE \"${PATTERN}\"; then\n\techo \"Your commit message:\" 1>&2\n\tcat \"${MSG_FILE}\" 1>&2\n\techo 1>&2\n\techo \"The commit message must conform to this pattern: ${PATTERN}\" 1>&2\n\techo \"Contents:\" 1>&2\n\techo \"- follow the conventional commits style (https://www.conventionalcommits.org/)\" 1>&2\n\techo 1>&2\n\techo \"Example:\" 1>&2\n\techo \"feat: add super awesome feature\" 1>&2\n\texit 1\nfi"| save $"($hooks_folder)/commit-msg"
      chmod 755 $"($hooks_folder)/commit-msg"
      # if not (".commitlintrc.yaml" | path exists) {
      # "extends:\n  - '@commitlint/config-conventional'" | save ".commitlintrc.yaml"
      # }
      # git add $hooks_folder ".commitlintrc.yaml"
      git add $hooks_folder
    }

# Lint extension - only the firefox extension is linted at the moment
lint: build-prod
    web-ext lint --source-dir=.build_firefox

# Build extension
_build BROWSER="all":
    #!/usr/bin/env nu
    # workaround for vite's build process that triggers the wrong code path for sanctuary modules
    # This issue has been fixed in currently unrelease sanctuary versions
    sed -i -e 's/util\.inspect\.custom/util?.inspect?.custom/g' node_modules/sanctuary*/*.js
    # workaround the not yet existing support of package.json/browser in rollup - webpack supports it but uses eval which breaks browser plugins
    # See: https://docs.npmjs.com/cli/v6/configuring-npm/package-json#browser
    # See: https://github.com/rollup/rollup/issues/185
    # See: https://github.com/webpack/webpack/issues/5627
    let platform_bak = './node_modules/jsonld/lib/platform.js.bak'
    let platform = './node_modules/jsonld/lib/platform.js'
    let platform_browser = './node_modules/jsonld/lib/platform-browser.js'
    if ($platform_browser | path exists) {
      mv $platform $platform_bak
      mv $platform_browser $platform
    }
    ## build manifest
    let package = (open package.json)
    let manifest_shared = (open manifest/manifest_shared.json | upsert version $package.version)
    ## compile code
    let build_dir = $env.BUILD_DIR
    rm -rpf $build_dir
    mkdir $build_dir
    [rollup frontend] | par-each {|type|
      if $type == "rollup" {
        ## backend build
        yarn run rollup -c
        mv .build_background.js .build/background.js
        # ls *.js | par-each {|it| yarn run rollup -i $it.name --file $"($build_dir)/($it.name | path basename)" --format iife --inlineDynamicImports -p @rollup/plugin-commonjs -p rollup-plugin-polyfill-node -p @rollup/plugin-node-resolve}
      } else {
        ## frontend build
        yarn build
        ^cp -r ./.output/public/* $build_dir # solid-start always builds everything in the dist directory
        rm -rvpf $"($build_dir)/assets"
        ^find $build_dir -name '*.gz' -exec rm -v {} +
        ^find $build_dir -name '*.br' -exec rm -v {} +
        ^find $build_dir -name '*.wasm' -exec rm -v {} +
        ^find $build_dir -name '*.json' -exec rm -v {} +
        # INFO: workaround for https://github.com/solidjs/solid-start/issues/1263
        htmlq -f $"($build_dir)/index.html" -o $"($build_dir)/manifest.js" --text 'body > script:first-of-type'
        htmlq -f $"($build_dir)/index.html" -r 'body > script:first-of-type' | sed -e 's#</div>#</div><script src="/manifest.js"></script>#' | save -f $"($build_dir)/index.html.new"
        mv -f $"($build_dir)/index.html.new" $"($build_dir)/index.html"
      }
    }

    ## prepare additional files
    let dist_dir = $env.DIST_DIR
    rm -rpf $dist_dir
    mkdir $dist_dir
    cp LICENSE $build_dir
    ## package plugin
    if "{{ BROWSER }}" == "all" {[firefox chrome source]} else {"{{ BROWSER }}" | split words} | par-each {|browser|
      let build_dir_browser = $"($env.BUILD_DIR)_($browser)"
      rm -rpf $build_dir_browser
      cp -r $build_dir $build_dir_browser
      if ($"manifest/manifest_($browser).json" | path exists) {$manifest_shared | merge (open $"manifest/manifest_($browser).json") | save -f $"($build_dir_browser)/manifest.json"}
      if $browser == "firefox" {
        let res = (do {web-ext build --overwrite-dest -s $build_dir_browser -a $dist_dir} | complete)
        if $res.exit_code != 0 {
          print $res
          exit $res.exit_code
        }
        mv $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version).zip" $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      } else if $browser == "chrome" {
        ## build chrome extension
        $manifest_shared | merge (open manifest/manifest_chrome.json) | save -f $"($build_dir_browser)/manifest.json"
        # See https://peter.sh/experiments/chromium-command-line-switches/
        chromium $"--pack-extension=($build_dir_browser)" --pack-extension-key=./identinet-plugin.pem
        mv $"($build_dir_browser).crx" $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).crx"
        cd $build_dir_browser
        ^zip -q -r -0 $"../($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip" *
      } else if $browser == "source" {
        git archive --format=zip HEAD -o $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      } else {
        print -e $"Unknown browser, only source, firefox, chrome and all are supported: ($browser)"
      }
      print $"($browser) package ready: ($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
      $"($dist_dir)/($manifest_shared.name)-($manifest_shared.version)_($browser).zip"
    }
    print "done."

# Build extension for development
build-dev BROWSER="all":
    NODE_ENV=development just _build {{ BROWSER }}

# Build extension for production
build-prod BROWSER="all":
    NODE_ENV=production just _build {{ BROWSER }}

_build-notify BROWSER="all":
    #!/usr/bin/env nu
    let start = (date now)
    NODE_ENV=development just _build {{ BROWSER }}
    notify-send -a identinet-plugin $"(date now | format date "%H:%M") - built, duration: ((date now) - $start)"

# Watch changes and rebuild appliaction
build-watch BROWSER="all":
    # FIXME: this isn't optimal - not all files are being watched,
    # ./background.js and ./public are missing. Furthermore, it would be great
    # to perform the build when the task is started
    # watch src {|| let start = (date now); just build; notify-send -a identinet-plugin $"(date now | format date "%H:%M:%S") - build complete - it took ((date now) - $start)"}
    watchexec -r -w src -w ./Justfile -w ./src-background -w ./public -w ./package.json -w ./vite.config.js -w ./rollup.config.js -w ./uno.config.ts -w ./manifest just _build-notify {{ BROWSER }}

# Run local test websites
run-websites:
    #!/usr/bin/env nu
    let directory = "./test/website-certificates"
    mkdir $directory
    let domains = ["id-broken.localhost", "id-plus.localhost", "id-did-configuration.localhost", "id-web.localhost", "no-id.localhost"]
    $domains | each {|domain|
      if not ($"($directory)/($domain).pem" | path exists) {
        mkcert -cert-file $"($directory)/($domain).pem" -key-file $"($directory)/($domain).pem" $domain
      }
    }
    print "Test websites are up and running. Visit:"
    $domains | each {|it| print $"- https://($it):8443"}
    print ""
    caddy run

# Runt tests
test:
    yarn run vitest run --dir test

# Start preview server
run-preview:
    yarn run dev

# Update changelog
changelog:
    git cliff | save -f CHANGELOG.md

# Cleanup everything
clean:
    rm -rpf  $env.DIST_DIR $env.BUILD_DIR
    glob $"($env.BUILD_DIR)_*" | each {|it| rm -rpf $it}
