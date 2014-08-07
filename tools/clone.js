var fs = require('fs');
var path = require('path');

var input = process.argv[2] || 'values.json';
var valueFile = path.join('tools', input);

if (!fs.existsSync(valueFile)) {
  console.error('"%s" not exists.', valueFile);
  return;
}

try {
  var values = JSON.parse(fs.readFileSync(valueFile));
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

/**
 * HTML编码
 * @param {String} text
 */
function encodeHTML(text){
  return String(text).replace(/["<>& ]/g, function(all){
    return "&" + {
      '"': 'quot',
      '<': 'lt',
      '>': 'gt',
      '&': 'amp',
      ' ': 'nbsp'
    }[all] + ";";
  });
}

function replacer(text) {
  return String(text).replace(/__([#@]?)([\w$-]+)__/g, function(all, flag, key) {
    var value = values[key] || '';
    switch (flag) {
      case '@':
        value = encodeHTML(value);
        break;
      case '#':
        value = JSON.stringify(value).slice(1, -1);
        break;
    }
    return value;
  });
}

for (var key in values) {
  values[key] = replacer(values[key]);
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
  var from = file;
  var to = replacer(path.join('apps', values.name, file));
  forceDirSync(path.dirname(to));
  if (/\.(css|html|js|json|txt|md|less|sass|es6)$/.test(file)) {
    fs.writeFileSync(to, replacer(fs.readFileSync(from)));
  } else { // 二进制文件复制
    fs.writeFileSync(to, fs.readFileSync(from), {
      encoding: null
    });
  }
});

scanDir('build', function(file) {
  if (!/\.(js)$/.test(file)) {
    return;
  }
  var from = file;
  var to = replacer(path.join('apps', values.name, file));
  forceDirSync(path.dirname(to));
  fs.writeFileSync(to, replacer(fs.readFileSync(from)));
});

[
  'package.json',
  '.editorconfig',
  '.gitignore'
].forEach(function(file) {
  var from = file;
  var to = path.join('apps', values.name, file);
  forceDirSync(path.dirname(to));
  fs.writeFileSync(to, replacer(fs.readFileSync(from)));
});