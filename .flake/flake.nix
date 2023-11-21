# File syntax: https://nixos.org/manual/nixos/stable/#sec-nix-syntax-summary
{
  description = "Dependencies";

  inputs.nixpkgs_unstable.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, nixpkgs_unstable, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        unstable = nixpkgs_unstable.legacyPackages.${system};
        allOsPackages = with pkgs; [
          # Nix packages: https://search.nixos.org/packages
          # Shared dependencies
          nodejs_20 # node used for husky installation https://nodejs.org/en/
          unstable.nushell # Nu Shell https://www.nushell.sh/
          bashInteractive # bash used in scripts
          just # Simple make replacement https://just.systems/
          yq-go # YAML and JSON CLI processor https://mikefarah.gitbook.io/yq/
          jq # JSON CLI processor https://github.com/jqlang/jq
          firefox # Firefox browser
          chromium # Chromium browser

        ];
        linuxOnlyPackages = with pkgs;
          [
            datree # kubernetes configuration validation and verification https://datree.io/
          ];
      in {
        devShell = pkgs.mkShell {
          nativeBuildInputs = if pkgs.system == "x86_64-linux" then
            allOsPackages ++ linuxOnlyPackages
          else
            allOsPackages;
          buildInputs = [ ];
        };

      });
}
