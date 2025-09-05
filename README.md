# vue

## Project setup
```
vue create vue-rete-flow-app
```

## version up (2.6.14 → 2.7.14)
```
npm install vue@2.7.14
```

# rete.js

vue 전용 플러그인을 함께 설치한다.
- vue2 - rete.js v1 호환
  ```bash
  npm install rete@^1.4.4 rete-connection-plugin@^0.9.0 rete-vue-render-plugin@^0.5.0
  ```
  - rate@1.x 래퍼런스: https://rete.js.org/#/docs
- vue3 - rete.js v2 호환
  ```bash
  npm install rete rete-area-plugin rete-connection-plugin rete-render-utils rete-vue-plugin  
  ```
  - rate@2.x 래퍼런스: https://retejs.org/docs

## vue2 - rete 1.x 이슈
### regeneratorRuntime is not defined
Babel 트랜스파일러에 의해 구버전 코드로 변경되면서 rete에 구현된 코드중 async/await가 Promise 방식으로 변경되는데, 이때 regeneratorRuntime 라는 이름의 Generator 함수가 필요함.  
reGenerationRuntime은 Babel이 async/await를 변환할 때 필요한 실행 도우미 역할을 하며, 해당 메소드는 core-js polyfill(실행환경 지원)을 통해 불러올 수 있다.  

vue2 프로젝트 생성시 babel을 옵션으로 선택하여 의존성이 설치되었고, core-js도 함께 설치되었음에도 불구하고 설정이 되지 않았던 이유는 사용자 선택 여지로 남겨둔것으로 보인다.
아래와 같이 babel.config.js 파일에 해당 옵션을 설정해줌으로써 reGenerationRuntime에 대한 polyfill import가 코드에 삽입되어 해결된다.

- babel.config.js
  ```js
  module.exports = {
    presets: [
      ['@vue/cli-plugin-babel/preset',
        {
          useBuiltIns: 'entry',
          corejs: 3
        }]
    ]
  }
  ```
