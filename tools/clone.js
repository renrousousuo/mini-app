var fs = require('fs');
var path = require('path');
var configFile = path.join('tools', 'app.json');

if (!fs.existsSync(configFile)) {
  console.error('"%s" not exists.', configFile);
  return;
}

try {
  var configs = JSON.parse(fs.readFileSync(configFile));
} catch(ex) {
  console.error(ex.message);
  return;
}

/*
 * 保证目录存在
 * @param{String} dir 目录
 */
function forceDirSync(dir) {
  if (!fs.existsSync(dir)) {
    forceDirSync(path.dirname(dir));
    fs.mkdirSync(dir);
  }
}

function replacer(text) {
  return String(text).replace(/__([\w$]+)__/g, function(all, key) {
    return configs[key] || '';
  });
}

function scanDir(dir, callback) {
  var files = fs.readdirSync(dir);
  files.forEach(function(file) {
    var stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      scanDir(path.join(dir, file), callback);
    } else if (stat.isFile()) {
      callback(path.join(dir, file));
    }
  });
}

// forceDirSync('apps/hello/src/css');
scanDir('src', function(file) {
  if (!/\.(css|html|js|json|txt|md|less|sass|es6)$/.test(file)) {
    return;
  }
  var from = file;
  var to = path.join('apps', configs.name, file);
  forceDirSync(path.dirname(to));
  fs.writeFileSync(to, replacer(fs.readFileSync(from)));
});

scanDir('build', function(file) {
  if (!/\.(js)$/.test(file)) {
    return;
  }
  var from = file;
  var to = path.join('apps', configs.name, file);
  forceDirSync(path.dirname(to));
  fs.writeFileSync(to, replacer(fs.readFileSync(from)));
});

[
  'package.json',
  '.editorconfig',
  '.gitignore'
].forEach(function(file) {
  var from = file;
  var to = path.join('apps', configs.name, file);
  forceDirSync(path.dirname(to));
  fs.writeFileSync(to, replacer(fs.readFileSync(from)));
})