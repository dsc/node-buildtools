var Seq, coke_task, coke_invoke;
Seq = require('seq');
require('./buildtools');
if ('function' !== typeof task) {
  throw new Error("'buildtools/tasks' can only be imported into Coke/Cake/Jake environment!");
}
coke_task = task;
coke_invoke = invoke;
task('version', 'Determine git version', function(){
  return getVersion(function(version){
    return say('Version is', version.white.bold);
  });
});
task('update_version', 'Updates server/version.js', function(){
  return getVersion(function(version){
    print('Writing', 'lib/version.js'.white.bold, 'with', version.white.bold, '... ');
    mkdirp('lib');
    write('lib/version.js', "module.exports = exports = '" + version + "';\n", 'utf8');
    return say('ok!'.green.bold);
  });
});