# baitgameel
Repository for baitgameel.com website. Based on [Hugo Cards Theme][https://github.com/hbstack/theme-cards]

# Requirements
- Hugo Extended
- Go Programming Language
- Node.js 16+ (18+ for Yarn 2 support)

# Installation (Linux Debian)
## Go Programming Language
Go installation is required to download and upgrade Hugo Modules.
1. Downlod [Go installation package](https://go.dev/dl/) for your system
2. Extract the archive to `/usr/local/`
    ```
    sudo tar -C /usr/local -xzf go1.23.5.linux-amd64.tar.gz
    ```
3. Add `/usr/local/go/bin` to the `PATH` environment variable
    ```
    sudo echo "export PATH=$PATH:/usr/local/go/bin" >> /etc/profile
    ```
4. Refresh the `PATH` environment variable
    ```
    sudo source /etc/profile
    ```
## Hugo Extended
1. Download Hugo Extended Debian package [from the release page](https://github.com/gohugoio/hugo/releases). Make sure to get the Extended version by clicking "Show all assets".
2. Install the package using the system debian package installer
    ```
    dpkg -i hugo_extended_*.deb
    ```
## Node.js 18+
It's highly recommended to install Node.js through nvm, the following instructions assume such.
1. Follow the [instructions to install nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) and a compatible node version.
2. Install yarn as a package manager
    - Run `corepack enable` to activate corepack
    - Go into your project directory
    - Run `yarn set version berry`
    - Run `yarn install` to migrate the lockfile
