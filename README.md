# buildtools

A noseful of utilities for Coke/Cake/Jake files.

## API

### Standard Library Modules

- `fs`
- `path`
    - `dirname`
    - `basename`
    - `extname`
    - `resolve`
    - `relative`
    - `normalize`
    - `join` as `joinPath`
    - `existsSync` as `exists`
- child_process:
    - `spawn`
    - `exec`


### Third Party

- underscore: `underscore`, `u`, `_`, `__`
- underscore.string: `_.str`, `_.mixin _.str.exports()`
- node-seq: `Seq`
- eyes: `eyes`
    - `inspector`
    - `inspect`
- colors: `colors`
- cli-table: `Table`
- glob: `glob`
- commondir: `commondir`



### Helpers

#### Logging

- `print(...args)` -- write to stdout without newline.
- `say(...args)` = `out` -- write to stdout and append newline.


#### Shell & Subprocess

- `sh(cmd, [cb]) -> void`
- `run(cmd, args=[], options={}) -> Process`
- `coco(args, options) -> Process`


#### Development

- `minify`
- `cssmin`
- `bundle`
- `bundle_js`
- `bundle_css`
- `getVersion`
- `writeVersionFile`


#### Paths & Files

- read = slurp = fs.readFileSync
- write = spit = fs.writeFileSync
- remove = rm = removeSync
- removeAsync
- ls = dir = fs.readdirSync
- expand
- isFile = isFileSync
- isFileAsync
- isDirectory = isDirectorySync
- isDirectoryAsync
- mkdirp = mkdirpSync
- mkdirpAsync
- sourceFiles
- glob
- commondir


