var fs, path, print, out, say, warn, eyes, spawn, exec, sh, run, dir, ls, read, write, removeItSync, removeSync, remove, rm, removeAsync, sourceFiles, expand, isDirectoryAsync, isDirectorySync, isDirectory, isFileAsync, isFileSync, isFile, mkdirpAsync, mkdirpSync, mkdirp, coco, minify, cssmin, bundle, bundle_js, bundle_css, getVersion, writeVersionFile, mainfile, _, _ref, __slice = [].slice;
exports.fs = fs = require('fs');
exports.path = path = require('path');
exports.dirname = path.dirname, exports.basename = path.basename, exports.extname = path.extname, exports.resolve = path.resolve, exports.relative = path.relative, exports.normalize = path.normalize, exports.joinPath = path.join, exports.exists = path.existsSync;
/* * * *  plumbing  * * * {{{ */
_ = require('underscore');
_.str = require('underscore.string');
_.mixin(_.str.exports());
exports.underscore = exports.u = exports._ = exports.__ = _;
exports.Seq = require('seq');
/* }}} */
/* * * *  logging helpers  * * * {{{ */
print = exports.print = function(){
  var args;
  args = __slice.call(arguments);
  return process.stdout.write(args.join(' '));
};
say = exports.say = out = exports.out = function(){
  var args;
  args = __slice.call(arguments);
  return process.stdout.write(args.join(' ') + '\n');
};
warn = exports.warn = function(){
  var args;
  args = __slice.call(arguments);
  return process.stderr.write(args.join(' ') + '\n');
};
exports.eyes = eyes = require('eyes');
exports.inspector = eyes.inspector();
exports.inspect = function(object, showHidden, depth, colors){
  showHidden == null && (showHidden = false);
  depth == null && (depth = 1);
  colors == null && (colors = true);
  return eyes.inspect.apply(this, arguments);
};
/* }}} */
/* * * *  shell/process helpers  * * * {{{ */
_ref = (_ref = require('child_process'), spawn = _ref.spawn, exec = _ref.exec, _ref), exports.spawn = _ref.spawn, exports.exec = _ref.exec;
exports.colors = require('colors');
exports.Table = require('cli-table');
sh = exports.sh = function(cmd, options, cb){
  var opts, _ref;
  if (typeof options === 'function') {
    _ref = [options, {}], cb = _ref[0], options = _ref[1];
  }
  opts = __import({
    verbose: true,
    errors: true,
    die: true
  }, options);
  if (opts.verbose) {
    say(cmd);
  }
  return exec(cmd, function(err, stdout, stderr){
    if (opts.errors && stderr) {
      warn(stderr);
    }
    if (err) {
      if (opts.die || opts.errors) {
        warn(String(err).red);
      }
      if (opts.die) {
        process.exit(1);
      }
    }
    if (opts.verbose && stdout) {
      say(stdout);
    }
    if (cb) {
      return cb(err, stdout, stderr);
    }
  });
};
run = exports.run = function(cmd, args, options){
  var opts, proc;
  args == null && (args = []);
  options == null && (options = {});
  opts = __import({
    verbose: true,
    errors: true,
    die: true
  }, options);
  if (opts.verbose) {
    console.log(cmd, args);
  }
  if (typeof args === 'string') {
    args = args.split(/\s+/g);
  }
  proc = spawn(cmd, args);
  if (opts.verbose) {
    proc.stdout.on('data', function(it){
      return process.stdout.write(String(it));
    });
  }
  if (opts.errors) {
    proc.stderr.on('data', function(it){
      return process.stderr.write(String(it));
    });
  }
  if (opts.die) {
    proc.on('exit', function(code){
      if (code) {
        return process.exit(code);
      }
    });
  }
  return proc;
};
/* * * *  path/file helpers  * * * {{{ */
exports.glob = require('glob');
exports.commondir = require('commondir');
ls = exports.ls = dir = exports.dir = fs.readdirSync;
read = exports.read = exports.slurp = function(){
  return '' + fs.readFileSync.apply(this, arguments);
};
write = exports.write = exports.spit = function(){
  return fs.writeFileSync.apply(this, arguments);
};
removeItSync = function(f){
  if (isDirectory(f)) {
    return fs.rmdirSync(f);
  } else {
    return fs.unlinkSync(f);
  }
};
rm = exports.rm = remove = exports.remove = removeSync = exports.removeSync = function(paths, ignoreErrors){
  var f, _i, _len;
  ignoreErrors == null && (ignoreErrors = false);
  if (typeof paths === 'string') {
    paths = [paths];
  }
  for (_i = 0, _len = paths.length; _i < _len; ++_i) {
    f = paths[_i];
    if (ignoreErrors && !exists(f)) {
      continue;
    }
    try {
      removeItSync(f);
    } catch (err) {
      if (ignoreErrors) {
        console.error(err);
      } else {
        throw err;
      }
    }
  }
  return paths;
};
removeAsync = exports.removeAsync = function(paths, ignoreErrors, cb){
  var f, _ref, _i, _len;
  if (typeof paths === 'string') {
    paths = [paths];
  }
  if (typeof ignoreErrors === 'function') {
    _ref = [false, ignoreErrors], ignoreErrors = _ref[0], cb = _ref[1];
  }
  try {
    for (_i = 0, _len = paths.length; _i < _len; ++_i) {
      f = paths[_i];
      if (ignoreErrors && !exists(f)) {
        continue;
      }
      if (isDirectory(f)) {
        fs.rmdirSync(f);
      } else {
        fs.unlinkSync(f);
      }
    }
  } catch (err) {
    return cb(err);
  }
  return cb(null);
};
sourceFiles = exports.sourceFiles = function(srcPath, pattern){
  var f;
  pattern == null && (pattern = /\.co$/);
  return (function(){
    var _i, _ref, _len, _results = [];
    for (_i = 0, _len = (_ref = ls(srcPath)).length; _i < _len; ++_i) {
      f = _ref[_i];
      if (pattern.test(f) && isFileSync(f)) {
        _results.push(path.join(srcPath, f));
      }
    }
    return _results;
  }());
};
expand = exports.expand = function(){
  var parts, p, home;
  parts = __slice.call(arguments);
  p = path.normalize(path.join.apply(path, parts));
  if (p.indexOf('~') === 0) {
    home = process.env.HOME || process.env.HOMEPATH;
    p = path.join(home, p.slice(1));
  }
  return path.resolve(p);
};
isDirectoryAsync = exports.isDirectoryAsync = function(p, cb){
  p = expand(p);
  return fs.stat(p, function(err, stats){
    if (err && err.code !== 'ENOENT') {
      return cb(err);
    }
    return cb(null, stats) && stats.isDirectory();
  });
};
isDirectory = exports.isDirectory = isDirectorySync = exports.isDirectorySync = function(p){
  var stats;
  p = expand(p);
  try {
    stats = fs.statSync(p);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  return !!(stats && stats.isDirectory());
};
isFileAsync = exports.isFileAsync = function(p, cb){
  p = expand(p);
  return fs.stat(p, function(err, stats){
    if (err && err.code !== 'ENOENT') {
      return cb(err);
    }
    return cb(null, stats) && stats.isFile();
  });
};
isFile = exports.isFile = isFileSync = exports.isFileSync = function(p){
  var stats;
  p = expand(p);
  try {
    stats = fs.statSync(p);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  return !!(stats && stats.isFile());
};
mkdirpAsync = exports.mkdirpAsync = (function(){
  function mkdirpAsync(p, mode, cb){
    var _ref;
    mode == null && (mode = 493);
    if (typeof mode === 'function') {
      _ref = [mode, 493], cb = _ref[0], mode = _ref[1];
    }
    cb || (cb = function(){});
    p = expand(p);
    return path.exists(p, function(exists){
      var ps, _p;
      if (exists) {
        return cb(null);
      }
      ps = p.split('/');
      _p = ps.slice(0, -1).join('/');
      return mkdirpAsync(_p, mode, function(err){
        if ((err != null ? err.code : void 8) === 'EEXIST') {
          return cb(null);
        }
        if (err) {
          return cb(err);
        }
        return fs.mkdir(_p, function(err){
          if ((err != null ? err.code : void 8) === 'EEXIST') {
            return cb(null);
          }
          if (err) {
            return cb(err);
          }
        });
      });
    });
  }
  return mkdirpAsync;
}());
mkdirp = exports.mkdirp = mkdirpSync = exports.mkdirpSync = function(p, mode){
  var made_any, part, _p, _i, _ref, _len;
  mode == null && (mode = 493);
  made_any = false;
  _p = '';
  for (_i = 0, _len = (_ref = expand(p).slice(1).split('/')).length; _i < _len; ++_i) {
    part = _ref[_i];
    _p += '/' + part;
    if (path.existsSync(_p)) {
      continue;
    }
    made_any = true;
    fs.mkdirSync(_p, mode);
  }
  return made_any;
};
/* }}} */
/* * * *  development helpers  * * * {{{ */
coco = exports.coco = function(args, options){
  return run('coco', args, options);
};
minify = exports.minify = function(it){
  var parser, uglify, ast, _ref;
  _ref = require('uglify-js'), parser = _ref.parser, uglify = _ref.uglify;
  ast = parser.parse(it);
  ast = uglify.ast_mangle(ast);
  ast = uglify.ast_squeeze(ast);
  return uglify.gen_code(ast);
};
cssmin = (_ref = require('cssmin'), exports.cssmin = _ref.cssmin, _ref);
bundle = exports.bundle = function(outpath, sources, options){
  var paths, ext, opts, code, name, file, files, _ref, _res, _i, _len;
  options == null && (options = {});
  opts = (_ref = __import({
    paths: '',
    file_bounds: false,
    minify: true,
    minifier: null,
    ext: '',
    srccolor: 'white'
  }, options), paths = _ref.paths, ext = _ref.ext, _ref);
  if (typeof sources === 'string') {
    sources = sources.trim().split(/\s+/);
  }
  if (typeof paths === 'string') {
    paths = paths.trim().split(/\s+/);
  }
  mkdirp(dirname(outpath));
  say('Bundling up', outpath.magenta.bold + '...');
  code = '';
  _res = [];
  for (_i = 0, _len = sources.length; _i < _len; ++_i) {
    name = sources[_i];
    if (!_.endsWith(name, ext)) {
      name += ext;
    }
    file = _(paths.map(_fn)).find(exists);
    if (!file) {
      say('Cannot locate', name.red.bold, 'in paths', _.pluck(paths).join(' '), +'!');
      throw new Error("Cannot locate file " + name + "!");
    }
    try {
      if (opts.file_bounds) {
        code += "/** BEGIN:  " + file + " **/\n\n";
      }
      code += read(file) + '\n';
      if (opts.file_bounds) {
        code += "\n/** END:  " + file + " **/\n\n";
      }
    } catch (err) {
      say('Error reading', file.red.bold + '!');
      throw err;
    }
    _res.push(file);
  }
  files = _res;
  if (opts.minify && typeof opts.minifier === 'function') {
    code = opts.minifier(code);
  }
  write(outpath, code, 'utf8');
  say('...wrote', outpath.magenta.bold, 'containing files:');
  return say(files.map(function(it){
    return '\t' + it[opts.srccolor].bold;
  }).join('\n'));
  function _fn(it){
    return joinPath(it, name);
  }
};
bundle_js = exports.bundle_js = function(outpath, sources, options){
  options == null && (options = {});
  return bundle(outpath, sources, __import({
    ext: '.js',
    minifier: minify,
    srccolor: 'cyan'
  }, options));
};
bundle_css = exports.bundle_css = function(outpath, sources, options){
  options == null && (options = {});
  return bundle(outpath, sources, __import({
    ext: '.css',
    minifier: cssmin,
    srccolor: 'yellow'
  }, options));
};
getVersion = exports.getVersion = function(cb){
  return exec('git rev-parse --short HEAD', function(err, stdout){
    if (err) {
      throw err;
    }
    return cb(stdout.trim());
  });
};
writeVersionFile = exports.writeVersionFile = function(version_file){
  version_file == null && (version_file = 'lib/version.js');
  return getVersion(function(version){
    return write(version_file, "module.exports = exports = '" + version + "';\n", 'utf8');
  });
};
/* }}} */
mainfile = path.basename((_ref = require.main) != null ? _ref.filename : void 8);
if (_(['Cokefile', 'Cakefile', 'Jakefile']).contains(mainfile)) {
  __import(global, exports);
}
function __import(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}
