const { defineConfig } = require('@vue/cli-service')
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,  // 원하는 포트 번호로 변경
    // open: true,  // 개발 서버가 시작될 때 브라우저를 자동으로 엽니다 (선택 사항)
    proxy: 'http://localhost:8000'
  },
  configureWebpack: {
		devtool: 'source-map',
		
		resolve: {
			alias:{
				'@': path.join(__dirname,'src/'),	
			}
		},
		performance: {
			// hints: false, // 빌드시 오류표시를 안나오게 처리함
			// maxEntrypointSize: 512000,
			// maxAssetSize: 512000
			maxEntrypointSize: 10240000,
			maxAssetSize: 10240000
		}
	}
})
