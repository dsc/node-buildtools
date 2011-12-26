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

- underscore: `underscore`, `_`
- node-seq: `Seq`
- eyes: `eyes`
    - `inspector`
    - `inspect`
- colors: `colors`
- cli-table: `Table`
- 


### Helpers

#### Logging

- `print(...args)` -- write to stdout without newline.
- `say(...args)` -- write to stdout and append newline.


#### Shell & Subprocess

- `sh(cmd, [cb]) -> void`
- `run(cmd, args=[], options={}) -> Process`
- `coco(args, options) -> Process`


#### Development

- `minify`
- `cssmin`


#### Paths & Files

- glob
- commondir
- read = slurp
- write = spit
- dir
- sourceFiles
- expand
- isDirectory
- isFile
- isDirectorySync
- isFileSync
- mkdirp = mkdirpSync
- mkdirpAsync


