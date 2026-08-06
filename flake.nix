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
