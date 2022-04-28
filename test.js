const readline = require('readline');
const colors = require('colors');
const inquirer = require('inquirer');
const path = require('path');
const simpleGit = require('simple-git')(path.resolve());
const fs = require('fs');

/** 后缀 */
let suffix = '';
/** 版本列表 */
const versionList = [
  { name: '普通', value: 'normal' },
  { name: '国寿', value: 'gs' },
  { name: 'Release', value: 'release' },
  { name: '自定义', value: 'custom' }
]
/** 日志模板 */
const TEMPLATE = `
## {{version}} 更新说明
日期: {{date}}
tag: {{version}}
1.测试更新内容: 
{{test}}
2.需求更新内容: 
{{feat}}
3.bug更新内容: 
{{bug}}
4.chore更新内容: 
{{chore}}
`;
/** 日志模板-顶部 */
const HEADTEMPLATE = `
## {{version}} 更新说明
版本: {{version}}
日期: {{date}}
`
/** 本地日志路径 */
const OUTPUT_DIR = 'doc/{{version}}';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('请输入 tag 开始范围: ', (startTag) => {
  if (!startTag) {
    logError('请输入 tag 开始范围');
    rl.close();
    return;
  }
  const versionRegInput = /v(\d+\.){2}\d+[A|B|C|D|E]?_\d+\w*/;    // 校验输入的版本号（版本+时间戳）
  const versionReg = /^v(\d+\.){2}\d+[A|B|C|D|E]?$/;              // 校验版本号（版本）
  if (!versionRegInput.test(startTag)) {
    logError('开始范围 tag 版本号输入格式不正确');
    rl.close();
    return;
  }
  rl.question('请输入结束范围(默认为HEAD): ', (endTag) => {
    const currentHead = startTag.split('_')?.[0];
    rl.question(`新版本号(默认为${currentHead}):`, (v) => {
      let _version = v || currentHead;
      if (!_version) {
        logError('请输入新版本号');
        rl.close();
        return;
      }
      if (!versionReg.test(_version)) {
        logError('新版本号 tag 输入格式不正确');
        rl.close();
        return;
      }
      inquirer.prompt([
        {
          type: 'list',
          name: 'version',
          message: '选择版本: ',
          choices: versionList,
          default: 'normal',
        }
      ]).then((ansV) => {
        const _date = new Date();
        _version = `${_version}_${_date.getFullYear()}${padStr(_date.getMonth() + 1)}${padStr(_date.getDate())}${padStr(_date.getHours())}${padStr(_date.getMinutes())}`;
        if (ansV.version === 'custom') {
          console.log(11, ansV.version)
        }
        if (ansV.version !== 'normal') {
          _version = `${_version}_${ansV.version}`;     // v3.8.0D_202204231138_gs
          suffix = ansV.version;
        }
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'flag',
            message: '是否增加old后缀',
            default: false,
          }
        ]).then((ansSuffix) => {
          if (ansSuffix.flag) {
            _version += '_old';
          }
          inquirer.prompt([
            {
              type: 'confirm',
              name: 'flag',
              message: `确定tag为: ${_version} 吗？`,
              default: true,
            }
          ]).then((res) => {
            if (res.flag) {
              getGitLog(startTag, endTag, _version)
            }
          })
        })
      })
    })
  })
})

/** 打印错误 */
function logError(content) {
  console.log(`
    ${colors.brightRed('打包失败')}
    ${colors.brightRed(`原因：${content}`)}
  `)
}
/** 补全时间位数 */
function padStr(str, len = 2) {
  return String(str).padStart(len, '0');
}
/** 获取git日志 */
function getGitLog(startTag, endTag, version) {             // endTag：放在这里意义是什么？
  simpleGit.log({
    from: startTag,
    to: endTag || 'HEAD'
  }, (err, result) => {                                   // result：开始tag到结束tag的提交记录
    if (err) {
      console.log(colors.red('读取 Git 日志失败\n', err));
      return;
    }
    createLogFile(result.all, version);
  });
}
/** 创建日志文件 */
function createLogFile(list, version) {
  const date = new Date();
  const messageList = list.map((item) => item.message.trimStart());

  const tests = messageList.filter((el) => /test/.test(el)).map((item, index) => ` ${index + 1})${item}`);
  const feats = messageList.filter((el) => /feat/.test(el)).map((item, index) => ` ${index + 1})${item}`);
  const bugs = messageList.filter((el) => /bug/.test(el)).map((item, index) => ` ${index + 1})${item}`);
  const chores = messageList.filter((el) => /chore/.test(el)).map((item, index) => ` ${index + 1})${item}`);
  /** 日志内容路径 */
  const content = TEMPLATE
    .replace(/{{version}}/g, version)
    .replace(/{{date}}/g, [date.getFullYear(), padStr(date.getMonth() + 1), padStr(date.getDate())].join('-'))
    .replace(/{{test}}/, tests.join('\n'))
    .replace(/{{feat}}/, feats.join('\n'))
    .replace(/{{bug}}/, bugs.join('\n'))
    .replace(/{{chore}}/, chores.join('\n'));
  /** 日志文件路径 */
  const dirPath = path.resolve(`${OUTPUT_DIR.replace(/{{version}}/, version.substring(0, version.indexOf('_')))}${suffix ? `_${suffix}` : ''}`);

  if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
  }
}