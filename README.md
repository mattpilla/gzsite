# GZM Analyzer (project is WIP)
> https://gz.kaztalek.com

## About
This is a utility for [gz](https://github.com/glankk/gz), the wonderful Ocarina of Time trainer by glank.\
With gz, you can record and play back [macros](https://github.com/glankk/gz/blob/master/USAGE.md#27-macro). The macro is saved as a file with the `.gzm` extension.\
This site allows you to easily edit these `.gzm` macro files to aid in TAS or LOTAD development.

## Usage
todo

## .gzm File Format Documentation
todo

---

## Building

### Prerequisites
- [Node.js](https://nodejs.org/en) v18 or higher
- [Yarn](https://yarnpkg.com/)

### Running
- `yarn` to install dependencies
- `yarn start` or `yarn dev` to run the site locally

### Testing
- `yarn test` to run tests

### Other Scripts
- `yarn prettier` to format the code
- `yarn lint` to lint
- `yarn tsc` to type check
- `yarn tidy` to do all of the above at once

### Deploying
This is set up using gh-pages and my custom URL, so handle accordingly if you wish to host this elsewhere.
- modify [CNAME](CNAME) to your target url
- `yarn build` to build the site to the `dist/` directory
- `yarn preview` to test the built site
- `yarn deploy` to push to the `dist/` directory to the `gh-pages` branch
  - modify the `deploy` script in [package.json](package.json) if you wish to deploy elsewhere
  - always `yarn build` to create the build before `yarn deploy`
