var fs, path, exists, ref$, fail, _, print, say, out, warn, eyes, spawn, exec, sh, run, ls, dir, read, write, removeAsync, rm, remove, removeSync, sourceFiles, expand, isDirectoryAsync, isDirectory, isDirectorySync, isFileAsync, isFile, isFileSync, mkdirpAsync, mkdirp, mkdirpSync, coco, minify, cssmin, bundle, bundle_js, bundle_css, getVersion, writeVersionFile, mainfile, slice$ = [].slice;
exports.fs = fs = require('fs');
exports.path = path = require('path');
exports.dirname = path.dirname, exports.basename = path.basename, exports.extname = path.extname, exports.resolve = path.resolve, exports.relative = path.relative, exports.normalize = path.normalize, exports.joinPath = path.join;
exports.exists = exists = (ref$ = fs.existsSync) != null
  ? ref$
  : path.existsSync;
/* * * *  task helpers  * * * {{{ */
fail = function(msg, code){
  code == null && (code = 1);
  if (!(code > 0)) {
    code = 1;
  }
  console.error(msg);
  return process.exit(code);
};
/* }}} */
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
  args = slice$.call(arguments);
  return process.stdout.write(args.join(' '));
};
say = exports.say = out = exports.out = function(){
  var args;
  args = slice$.call(arguments);
  return process.stdout.write(args.join(' ') + '\n');
};
warn = exports.warn = function(){
  var args;
  args = slice$.call(arguments);
  return process.stderr.write(args.join(' ') + '\n');
};
exports.eyes = eyes = require('eyes');
exports.inspector = eyes.inspector();
exports._inspect = function(object, showHidden, depth, colors){
  showHidden == null && (showHidden = false);
  depth == null && (depth = 1);
  colors == null && (colors = true);
  return eyes.inspect.apply(this, arguments);
};
/* }}} */
/* * * *  shell/process helpers  * * * {{{ */
ref$ = (ref$ = require('child_process'), spawn = ref$.spawn, exec = ref$.exec, ref$), exports.spawn = ref$.spawn, exports.exec = ref$.exec;
exports.colors = require('colors');
exports.Table = require('cli-table');
sh = exports.sh = function(cmd, options, cb){
  var ref$, opts;
  if (typeof options === 'function') {
    ref$ = [options, {}], cb = ref$[0], options = ref$[1];
  }
  opts = import$({
    verbose: true,
    errors: true,
    die: true
  }, options);
  if (opts.verbose) {
    say(_.isArray(cmd) ? cmd.join(' ') : cmd);
  }
  return exec(cmd, function(err, stdout, stderr){
    if (opts.errors && stderr) {
      warn(stderr);
    }
    if (err) {
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
  opts = import$({
    verbose: true,
    errors: true,
    die: true
  }, options);
  if (opts.verbose) {
    say(cmd, _.isArray(args) ? args.join(' ') : args);
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
removeAsync = exports.removeAsync = require('remove');
rm = exports.rm = remove = exports.remove = removeSync = exports.removeSync = removeAsync.removeSync;
sourceFiles = exports.sourceFiles = function(srcPath, pattern){
  var i$, ref$, len$, f, results$ = [];
  pattern == null && (pattern = /\.co$/);
  for (i$ = 0, len$ = (ref$ = ls(srcPath)).length; i$ < len$; ++i$) {
    f = ref$[i$];
    if (pattern.test(f) && isFileSync(f)) {
      results$.push(path.join(srcPath, f));
    }
  }
  return results$;
};
expand = exports.expand = function(){
  var parts, p, home;
  parts = slice$.call(arguments);
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
  var stats, err;
  p = expand(p);
  try {
    stats = fs.statSync(p);
  } catch (e$) {
    err = e$;
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
  var stats, err;
  p = expand(p);
  try {
    stats = fs.statSync(p);
  } catch (e$) {
    err = e$;
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  return !!(stats && stats.isFile());
};
mkdirpAsync = exports.mkdirpAsync = (function(){
  function mkdirpAsync(p, mode, cb){
    var ref$;
    mode == null && (mode = 493);
    if (typeof mode === 'function') {
      ref$ = [mode, 493], cb = ref$[0], mode = ref$[1];
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
  var made_any, _p, i$, ref$, len$, part;
  mode == null && (mode = 493);
  made_any = false;
  _p = '';
  for (i$ = 0, len$ = (ref$ = expand(p).slice(1).split('/')).length; i$ < len$; ++i$) {
    part = ref$[i$];
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
coco = exports.coco = function(args, options, cb){
  var cmd;
  if (cb) {
    if (_.isArray(args)) {
      cmd = args.join(' ');
    }
    return sh("coco " + cmd, options, cb);
  } else {
    if (typeof args === 'string') {
      args = args.split(/\s+/);
    }
    return run('coco', args, options);
  }
};
minify = exports.minify = function(it){
  var ref$, parser, uglify, ast;
  ref$ = require('uglify-js'), parser = ref$.parser, uglify = ref$.uglify;
  ast = parser.parse(it);
  ast = uglify.ast_mangle(ast);
  ast = uglify.ast_squeeze(ast);
  return uglify.gen_code(ast);
};
cssmin = (ref$ = require('cssmin'), exports.cssmin = ref$.cssmin, ref$);
bundle = exports.bundle = function(outpath, sources, options){
  var opts, ref$, paths, ext, code, files, res$, i$, len$, name, file, err;
  options == null && (options = {});
  opts = (ref$ = import$({
    paths: '',
    file_bounds: false,
    minify: true,
    minifier: null,
    ext: '',
    srccolor: 'white'
  }, options), paths = ref$.paths, ext = ref$.ext, ref$);
  if (typeof sources === 'string') {
    sources = sources.trim().split(/\s+/);
  }
  if (typeof paths === 'string') {
    paths = paths.trim().split(/\s+/);
  }
  mkdirp(dirname(outpath));
  say('Bundling up', outpath.magenta.bold + '...');
  code = '';
  res$ = [];
  for (i$ = 0, len$ = sources.length; i$ < len$; ++i$) {
    name = sources[i$];
    if (!_.endsWith(name, ext)) {
      name += ext;
    }
    file = _(paths.map(fn$)).find(exists);
    if (!file) {
      say('Cannot locate', name.red.bold, 'in paths', _.pluck(paths).join(' ') + '!');
      throw new Error("Cannot locate file " + name + "!");
    }
    try {
      if (opts.file_bounds) {
        code += "/** BEGIN:  " + file + " **/\n\n";
      }
      code += ';\n' + read(file) + '\n';
      if (opts.file_bounds) {
        code += "\n/** END:  " + file + " **/\n\n";
      }
    } catch (e$) {
      err = e$;
      say('Error reading', file.red.bold + '!');
      throw err;
    }
    res$.push(file);
  }
  files = res$;
  if (opts.minify && typeof opts.minifier === 'function') {
    code = opts.minifier(code);
  }
  write(outpath, code, 'utf8');
  say('...wrote', outpath.magenta.bold, 'containing files:');
  return say(files.map(function(it){
    return '\t' + it[opts.srccolor].bold;
  }).join('\n'));
  function fn$(it){
    return joinPath(it, name);
  }
};
bundle_js = exports.bundle_js = function(outpath, sources, options){
  options == null && (options = {});
  return bundle(outpath, sources, import$({
    ext: '.js',
    minifier: minify,
    srccolor: 'cyan'
  }, options));
};
bundle_css = exports.bundle_css = function(outpath, sources, options){
  options == null && (options = {});
  return bundle(outpath, sources, import$({
    ext: '.css',
    minifier: cssmin,
    srccolor: 'yellow'
  }, options));
};
getVersion = exports.getVersion = function(cb){
  return exec('git rev-parse --short HEAD', function(err, stdout){
    return cb(err, stdout.trim());
  });
};
writeVersionFile = exports.writeVersionFile = function(version_file, cb){
  version_file == null && (version_file = 'lib/version.js');
  return getVersion(function(err, version){
    if (err) {
      return typeof cb == 'function' ? cb(err) : void 8;
    }
    try {
      write(version_file, "module.exports = exports = '" + version + "';\n", 'utf8');
    } catch (e$) {
      err = e$;
    }
    return typeof cb == 'function' ? cb(err, version) : void 8;
  });
};
/* }}} */
mainfile = path.basename((ref$ = require.main) != null ? ref$.filename : void 8);
if (_(['Cokefile', 'Cakefile', 'Jakefile', 'repl']).contains(mainfile)) {
  import$(global, exports);
}
function import$(obj, src){
  var own = {}.hasOwnProperty;
  for (var key in src) if (own.call(src, key)) obj[key] = src[key];
  return obj;
}