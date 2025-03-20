// 这个文件用于修复 query-string 问题
// 在项目启动前执行这个脚本

const fs = require('fs');
const path = require('path');

// 尝试修复 expo-router 中的 getPathFromState.js 文件
try {
  const filePath = path.join(__dirname, '..', 'node_modules', 'expo-router', 'build', 'fork', 'getPathFromState.js');
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否包含 query-string 导入
    if (content.includes('query-string')) {
      // 替换 query-string 的导入方式
      content = content.replace(
        /import\s+(\w+)\s+from\s+['"]query-string['"]/g, 
        `import * as $1 from 'query-string'`
      );
      
      // 写回文件
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('成功修复 getPathFromState.js 文件中的 query-string 导入');
    } else {
      console.log('文件中没有找到 query-string 导入，无需修复');
    }
  } else {
    console.log(`文件不存在: ${filePath}`);
  }
} catch (error) {
  console.error('修复 query-string 问题时出错:', error);
}
