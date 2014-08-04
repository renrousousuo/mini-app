var fs = require('fs');
var input = process.argv[2];
var output = process.argv[3];
var path = require('path');

if (!input) {
  console.log('not input.');
  return;
}

if (!output) {
  console.log('not output.');
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

forceDirSync(path.dirname(output));

var body = fs.readFileSync(input);

body = String(body).
  replace(/\/\*<include\s+([\w\/\\\-\.]+)>\*\//g, function(all, file) {
    var f = path.resolve(path.dirname(input), file);
    if (fs.existsSync(f)) {
      return fs.readFileSync(f);
    } else {
      return '';
    }
  }).
  // 清除调试代码 /*<debug>*/ ... /*</debug>*/
  replace(/\/\*<debug>\*\/([\s\S]*?)\/\*<\/debug>\*\//g, '').
  // 处理函数注释字符串
  replace(
    /function\s*\(\s*\)\s*\{\s*\/\*\!([\s\S]*?)\*\/\s*\}/g,
    function(all, text) {
      return JSON.stringify(text);
    }
  );
fs.writeFileSync(output, body);