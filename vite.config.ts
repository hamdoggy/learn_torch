import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 加载当前目录下的所有环境变量，不限于 VITE_ 前缀
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    define: {
      // 将 process.env.API_KEY 替换为构建时的具体值
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // 防止其他库访问 process.env 时报错
      'process.env': {}
    }
  };
});