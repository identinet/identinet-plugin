# File syntax: https://nixos.org/manual/nixos/stable/#sec-nix-syntax-summary
{
  description = "Dependencies";

  # Due to bug in version 119 https://bugs.chromium.org/p/chromium/issues/detail?id=1498558&q=pack-extension&can=2
  # Software versions: https://lazamar.co.uk/nix-versions/?channel=nixos-unstable&package=chromium
  # inputs.nixpkgs_oldchromium.url =
  #   "github:NixOS/nixpkgs?rev=e49c28b3baa3a93bdadb8966dd128f9985ea0a09";
  inputs.nixpkgs_unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs_unstable,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        unstable = nixpkgs_unstable.legacyPackages.${system};
        allOsPackages = with pkgs; [
          # Nix packages: https://search.nixos.org/packages
          # Build dependencies
          firefox # Firefox browser
          just # Simple make replacement https://just.systems/
          nodejs_22 # node used for husky installation https://nodejs.org/en/
          chromium # Chromium browser
          unstable.nushell # Nu Shell https://www.nushell.sh/

          # Development dependencies
          caddy # HTTP server https://caddyserver.com/
          htmlq # jq for HTML https://github.com/mgdm/htmlq
          mkcert # Locally trusted development certificates https://github.com/FiloSottile/mkcert
          step-cli # simplified certificate manager CLI https://smallstep.com/cli/
          watchexec # Generic file watcher and command executor https://github.com/watchexec/watchexec

          # Interactive dependencies
          bashInteractive # bash used in scripts
          yq-go # YAML and JSON CLI processor https://mikefarah.gitbook.io/yq/
          jq # JSON CLI processor https://github.com/jqlang/jq
        ];
        linuxOnlyPackages = with pkgs; [
          datree # kubernetes configuration validation and verification https://datree.io/
        ];
      in
      {
        devShell = pkgs.mkShell {
          nativeBuildInputs =
            if pkgs.system == "x86_64-linux" then allOsPackages ++ linuxOnlyPackages else allOsPackages;
          buildInputs = [ ];
        };

      }
    );
}
