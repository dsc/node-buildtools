({
  name: 'buildtools',
  version: '0.1.1',
  description: 'Utilities for use in Jake/Cake/Coke build files.',
  homepage: 'http://dsc.github.com/node-buildtools/',
  keywords: ['build', 'buildtools', 'jake', 'coke', 'cake', 'tools', 'util', 'server'],
  author: 'David Schoonover <dsc@less.ly> (http://less.ly)',
  dependencies: {
    'coco': '== 0.7.x',
    'eyes': '== 0.1.x',
    'colors': '== 0.6.x',
    'remove': '== 0.1.x',
    'glob': '== 3.1.x',
    'commondir': '== 0.0.x',
    'cli-table': '== 0.0.x',
    'underscore': '== 1.3.x',
    'underscore.string': '== 2.0.x',
    'seq': '== 0.3.x',
    'uglify-js': '== 1.2.x',
    'cssmin': '== 0.3.x'
  },
  repository: {
    type: 'git',
    url: 'git://github.com/dsc/node-buildtools.git'
  },
  bugs: {
    url: 'http://github.com/dsc/node-buildtools/issues'
  },
  engine: {
    node: '>= 0.8.x'
  },
  license: 'MIT'
});