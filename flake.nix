{
  description = "HiddenAbilitree monorepo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "systems";
  };

  outputs =
    {
      nixpkgs,
      systems,
      ...
    }:
    let
      eachSystem =
        function: nixpkgs.lib.genAttrs (import systems) (system: function nixpkgs.legacyPackages.${system});
    in
    {
      devShells = eachSystem (
        pkgs:
        let
          mkScript = name: text: pkgs.writeShellScriptBin name text;

          scripts = [
            (mkScript "dev" "bun dev")
            (mkScript "lint" "oxlint && eslint_d .")
            (mkScript "lint:fix" "oxlint --fix --fix-suggestions && eslint_d . --fix")
            (mkScript "reinstall" ''
              set -euo pipefail
              root="$(git rev-parse --show-toplevel)"
              cd "$root"
              fd -HI -t d '^node_modules$' -X rm -rf && bun i
            '')
            (mkScript "checkenv" ''
              root="$(git rev-parse --show-toplevel)"
              exec bun --no-env-file "$root/scripts/check-env.ts"
            '')
            (mkScript "haod" "bunx @hiddenability/opinionated-defaults@latest")
          ];
        in
        {
          default = pkgs.mkShell {
            packages =
              with pkgs;
              [
                bun
                eslint_d
                fd
                git
                nodejs_24
                oxlint
                prettierd
              ]
              ++ scripts;
          };
        }
      );
    };
}
