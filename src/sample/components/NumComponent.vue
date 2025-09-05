<template>
  <div>
    <hr>
    <div class="rete" ref="initContainer"></div>
    <hr>
  </div>
</template>
<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import NumControl from "@/sample/rete/NumControl"

// 소켓 정의
const numSocket = new Rete.Socket("Number value");

// 컴포넌트 정의
class NumComponent extends Rete.Component {
  constructor() {
    super("Number");
  }

  builder(node) { // 노드 실행시 한번만 실행된다.
    console.log(node)
    let in1 = new Rete.Input ('numI1', 'Number', numSocket);
    let in2 = new Rete.Input ('numI2', 'Number', numSocket);
    let out1 = new Rete.Output("numO1", "Number", numSocket);
    // return node;
    node.addInput(in1);
    node.addInput(in2);

    var numControl = new NumControl("noderemove", "4321");
    node.addControl(numControl);
    node.addOutput(out1);
  }

  worker(node, inputs, outputs) { // 매 처리시마다 실행
    outputs["numO1"] = node.data.num;
  }
}

export default {
  name: "NumComponent",
  data() {
    return {
      editor: null,
      engine: null,
    };
  },
  mounted() {
    this.initRete();
  },
  methods: {
    async initRete() {
      if (!this.$refs.initContainer) return;
      const container = this.$refs.initContainer;

      /* 에디터 생성 - 노드를 등록받고 노드를 출력하는 역할 */
      const editor = new Rete.NodeEditor("demo@0.1.0", container);
      editor.use(ConnectionPlugin); // 연결 플러그인
      editor.use(VueRenderPlugin); // Vue 렌더링 플러그인

      /* 노드 생성 - Rete.Component(Node의 설계도)를 상속, 인스턴스 생성시 노드 객체가 생성됨 */
      const numComponent = new NumComponent();
      editor.register(numComponent); // 에디터에 노드 등록

      /* 엔진 생성 - 노드간 계산, 데이터 흐름 처리 */
      const engine = new Rete.Engine("demo@0.1.0");
      engine.register(numComponent); // 엔진에 노드 등록

      /* 에디터에 이벤트 바인딩 */
      editor.on(
        "process nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
          await engine.abort();
          await engine.process(editor.toJSON()); // 엔진 실행
        }
      );

      // ======================
      // 노드 생성 및 추가
      // ======================
      const n1 = await numComponent.createNode({ num: 5 });
      n1.position = [80, 200]; // x, y 좌표
      await editor.addNode(n1);

      const n2 = await numComponent.createNode({ num: 10 });
      n2.position = [400, 200];
      await editor.addNode(n2);

      // 노드 연결 (v1 방식)
      // editor.connect(n1.outputs.get("num"), n2.inputs.get("num"));

      // 화면 갱신 - 화면 중심으로 줌/이동
      editor.view.resize();
      editor.trigger("process");

      // 상태 저장
      this.editor = editor;
      this.engine = engine;
    },
  },
};
</script>

<style>
.rete {
  width: 500px;
  height: 500px;
}
</style>
