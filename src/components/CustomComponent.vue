<template>
  <div>
    <div class="rete" ref="reteContainer"></div>
  </div>
</template>

<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import NodeComponent from "@/rete/components/NodeComponent"
import NumControl from "@/sample/rete/NumControl"

// 소켓 정의
const numSocket = new Rete.Socket("Number value");

export default {
  name: "CustomComponent",
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
        if (!this.$refs.reteContainer) return;
        const container = this.$refs.reteContainer;

        // 에디터 생성
        const editor = new Rete.NodeEditor("demo@0.1.0", container);
        editor.use(ConnectionPlugin);
        editor.use(VueRenderPlugin);

        // 노드 컴포넌트
        const nodeComponent = new NodeComponent("Adder");
        editor.register(nodeComponent);

        // 엔진
        const engine = new Rete.Engine("demo@0.1.0");
        engine.register(nodeComponent);

        // 이벤트 바인딩
        editor.on(
            "process nodecreated noderemoved connectioncreated connectionremoved",
            async () => {
            await engine.abort();
            await engine.process(editor.toJSON());
            }
        );

        // 노드 생성 및 builder 적용
        const n1 = await nodeComponent.createNode({ num: 5 });
        nodeComponent.builder(n1, {
            inputs: [
            { key: "numI1", name: "Input 1", socket: numSocket },
            { key: "numI2", name: "Input 2", socket: numSocket }
            ],
            outputs: [
            { key: "numO1", name: "Output", socket: numSocket }
            ],
            controls: [
            { controlClass: NumControl, key: "ctrl1", initialValue: 0 }
            ]
        });
        n1.position = [80, 200];
        await editor.addNode(n1);

        const n2 = await nodeComponent.createNode({ num: 10 });
        nodeComponent.builder(n2, {
            inputs: [
            { key: "numI1", name: "Input 1", socket: numSocket },
            { key: "numI2", name: "Input 2", socket: numSocket }
            ],
            outputs: [
            { key: "numO1", name: "Output", socket: numSocket }
            ],
            controls: [
            { controlClass: NumControl, key: "ctrl2", initialValue: 0 }
            ]
        });
        n2.position = [400, 200];
        await editor.addNode(n2);

        // 노드 연결
        editor.connect(n1.outputs.get("numO1"), n2.inputs.get("numI1"));

        // 화면 갱신
        editor.view.resize();
        editor.trigger("process");

        // 상태 저장
        this.editor = editor;
        this.engine = engine;
        }
  },
};
</script>

<style>
body {
  margin: 0;
}
.rete {
  width: 100vw;
  height: 100vh;
}
</style>
