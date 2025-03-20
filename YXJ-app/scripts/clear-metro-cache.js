const fs = require('fs');
const path = require('path');
const os = require('os');

// 清理 Metro 缓存目录
const metroDir = path.join(os.tmpdir(), 'metro-*');
console.log(`尝试清理 Metro 缓存目录: ${metroDir}`);

try {
  // 在 Windows 上，我们可以使用命令行来删除匹配的目录
  const { execSync } = require('child_process');
  execSync(`powershell -Command "Get-ChildItem -Path '${os.tmpdir()}' -Filter 'metro-*' -Directory | Remove-Item -Recurse -Force"`, { stdio: 'inherit' });
  console.log('Metro 缓存目录已清理');
} catch (error) {
  console.error('清理 Metro 缓存目录时出错:', error.message);
}

// 清理 node_modules/.cache 目录
const cacheDir = path.join(__dirname, '..', 'node_modules', '.cache');
console.log(`尝试清理 node_modules/.cache 目录: ${cacheDir}`);

if (fs.existsSync(cacheDir)) {
  try {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('node_modules/.cache 目录已清理');
  } catch (error) {
    console.error('清理 node_modules/.cache 目录时出错:', error.message);
  }
} else {
  console.log('node_modules/.cache 目录不存在，无需清理');
}

console.log('缓存清理完成');
