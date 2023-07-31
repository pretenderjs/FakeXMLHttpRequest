{
  description = "Nix environment for FakeXMLHttpRequest npm package";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  inputs.napalm.url = "github:nix-community/napalm";

  # NOTE: This is optional, but is how to configure napalm's env
  inputs.napalm.inputs.nixpkgs.follows = "nixpkgs";

  outputs = { self, nixpkgs, napalm }:
  let
    system = "x86_64-linux";
    pkgs = nixpkgs.legacyPackages."${system}";
  in {
    packages."${system}".default = napalm.legacyPackages."${system}".buildPackage ./. {
      nodejs = pkgs.nodejs_20;
      PUPPETEER_SKIP_DOWNLOAD=1;
    };

    devShells."${system}".default = pkgs.mkShell {
      nativeBuildInputs = with pkgs; [
        deno
        nodejs_20
      ];
    };
  };
}
