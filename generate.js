const fs = require('fs')
const os = require('os')
const path = require('path')

const { fileName } = this.opt
let arr = fs.readdirSync(path.resolve())
let res = []
// 排除目录
const exclude = [
    'node_modules',
    'dist',
    'build',
    '.husky',
    '.idea',
    '.vscode',
    '.git',
    '.DS_Store'
]
for (const item of arr) {
    if (exclude.includes(item)) {
        continue
    }
    console.log('item', item)
    let cPath = path.join(__dirname, item)
    let stats = fs.statSync(cPath)
    const cItem = {
        name: item,
        path: cPath,
        children: [],
        isDirectory: true
    }
    if (stats.isDirectory()) {
        resolveChild(cPath, cItem.children)
    } else {
        cItem.isDirectory = false
    }
    res.push(cItem)
}
function resolveChild(path1, cArr) {
    let newA = fs.readdirSync(path1)
    for (const item of newA) {
        let stats = fs.statSync(path.join(path1, item))
        const cItem = {
            name: item,
            path: path1,
            children: [],
            isDirectory: true
        }
        if (stats.isDirectory()) {
            resolveChild(path.join(path1, item), cItem.children)
        } else {
            cItem.isDirectory = false
        }
        cArr.push(cItem)
    }
}
// os.EOL 兼容多系统
function resolveStr(i, rootPre) {
    debugger
    let newRootPre = '  ' + rootPre + '--'
    i.children.forEach((item) => {
        if (item.isDirectory) {
            str += `${newRootPre}${item.name}:${os.EOL}  `
            resolveStr(item, newRootPre)
        } else {
            str += `${newRootPre}${item.name}${os.EOL}  `
        }
    })
}
let str = ``
res.forEach((i) => {
    debugger
    const rootPre = '|--'
    if (i.isDirectory) {
        str += `${rootPre}${i.name}:${os.EOL}  `
        resolveStr(i, rootPre)
    } else {
        str += `${rootPre}${i.name}${os.EOL}  `
    }
})
str = `${os.EOL}\`\`\`${str}\`\`\``
fs.writeFile(
    `${fileName}`,
    str,
    { encoding: 'utf8' },
    function (err) {
        // 读取失败 err的值也是为空  null转换为布尔值还是false
        if (err) {
            return console.log(err + '写入失败的')
        }
        console.log('生成成功')
    }
)