<div align="center">

  <h1><code>wasm-pack-template</code></h1>

  <sub>Built with 🦀🕸 by <a href="https://rustwasm.github.io/">The Rust and WebAssembly Working Group</a></sub>
</div>

## Web assembly for enterprise developers

This is an example repo that I used on my talk for a local meetup in Singapore.
You can watch the [full talk on YouTube](https://www.youtube.com/watch?v=xBfiYy3vECo)

## Before you start

1. Install Rust
2. Install wasm-pack
3. Install Node

Run `npm install` to pull in the dependencies.

## Compiling and running the project

1. Run `wasm-pack build` (this needs to be done every time after change in Rust code)
2. Run `npm start`
3. Go to `http://localhost:8080`

## Running a local Python server

1. Run `cd server && python3 server.py`


_____

## Downloading large files via LFS

This repo contains one big csv file with over 1 million record.

To store large files in a repository, we use [Git LFS](https://git-lfs.github.com/).

Steps to install:

- Install [Git LFS](https://git-lfs.github.com/)
- Run `sudo apt-get install git-lfs`
- Run `git lfs pull` in this repository
- The file will be downloaded in the `data` folder

## About
<div align="center">


  <strong>A template for kick starting a Rust and WebAssembly project using <a href="https://github.com/rustwasm/wasm-pack">wasm-pack</a>.</strong>

  <p>
    <a href="https://travis-ci.org/rustwasm/wasm-pack-template"><img src="https://img.shields.io/travis/rustwasm/wasm-pack-template.svg?style=flat-square" alt="Build Status" /></a>
  </p>

  <h3>
    <a href="https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html">Tutorial</a>
    <span> | </span>
    <a href="https://discordapp.com/channels/442252698964721669/443151097398296587">Chat</a>
  </h3>

</div>

[**📚 Read this template tutorial! 📚**][template-docs]

This template is designed for compiling Rust libraries into WebAssembly and
publishing the resulting package to NPM.

Be sure to check out [other `wasm-pack` tutorials online][tutorials] for other
templates and usages of `wasm-pack`.

[tutorials]: https://rustwasm.github.io/docs/wasm-pack/tutorials/index.html
[template-docs]: https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html

## 🚴 Usage

### 🐑 Use `cargo generate` to Clone this Template

[Learn more about `cargo generate` here.](https://github.com/ashleygwilliams/cargo-generate)

```
cargo generate --git https://github.com/rustwasm/wasm-pack-template.git --name my-project
cd my-project
```

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build
```

### 🔬 Test in Headless Browsers with `wasm-pack test`

```
wasm-pack test --headless --firefox
```

### 🎁 Publish to NPM with `wasm-pack publish`

```
wasm-pack publish
```

## 🔋 Batteries Included

* [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) for communicating
  between WebAssembly and JavaScript.
* [`console_error_panic_hook`](https://github.com/rustwasm/console_error_panic_hook)
  for logging panic messages to the developer console.
* [`wee_alloc`](https://github.com/rustwasm/wee_alloc), an allocator optimized
  for small code size.
