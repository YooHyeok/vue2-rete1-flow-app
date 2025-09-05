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


## 구성
- Nodes  
  - 데이터와 포트의 집합으로 데이터 플로우 그래프에서 정점을 표현한다.  
  ![alt text](image.png)
  - rete 에서 Node는 블록 형태로 출력되며, 모든 Node에는 title, input, output 및 controls를 포함한다.  
    - title은 Node를 식별하고 그 목적을 명확하게 나타내야 한다.  
    - input은 왼쪽, output은 오른쪽에 위치해야한다.
      - input, output은 socket으로 표현되며 이름을 가질 수 있다.  
      - input이 1이라면 output은 N. input과 output간의 관계는 1:N 관계만 지원
    - control의 경우 Node 자체에 직접 위치하거나 특정 Input에 연결될 수 있다.  
      - Node에 위치할 경우 입력을 받을 수 있는 입력란
      - Input포트에 위치할 경우
- Sockets
- Editor
- Engine
  실제 데이터 처리를 담당.  
  노드의 스트림을 기반으로 데이터를 처리하고 출력 데이터에서 입력 데이터로 전송이 가능.  
  화면상에 보이는 Node들은 단순히 editor에 의해 출력되는 반면 실제 값이 어떻게 흐르고 결과가 나오는지는 엔진이 담당함.  



### editor
