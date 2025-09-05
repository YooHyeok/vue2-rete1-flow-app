
import Rete from "rete";

const defaultSocket = new Rete.Socket("Default value");

export default class NodeComponent extends Rete.Component {
  constructor(name = "Node") {
    super(name); // 노드 이름
  }

  /**
   * @param {Rete.Node} node - 노드 인스턴스
   * @param {Object} options - 동적 설정
   * @param {Array} options.inputs - [{key, name, socket}]
   * @param {Array} options.outputs - [{key, name, socket}]
   * @param {Array} options.controls - [{controlClass, key, initialValue}]
   */
  builder(node, options = {}) {
    // 입력 추가
    if (options.inputs) {
      options.inputs.forEach(input => {
        const inSocket = input.socket || defaultSocket; // 기본 소켓
        const inputObj = new Rete.Input(input.key, input.name, inSocket);
        node.addInput(inputObj);
      });
    }

    // 출력 추가
    if (options.outputs) {
      options.outputs.forEach(output => {
        const outSocket = output.socket || defaultSocket;
        const outputObj = new Rete.Output(output.key, output.name, outSocket);
        node.addOutput(outputObj);
      });
    }

    // 컨트롤 추가
    if (options.controls) {
      options.controls.forEach(ctrl => {
        const control = new ctrl.controlClass(ctrl.key, ctrl.initialValue);
        node.addControl(control);
      });
    }
  }

  worker(node, inputs, outputs) {
    // inputs: { inputKey: [값들] }
    // outputs: { outputKey: 값을 넣는 객체 }

    // 모든 입력 합산해서 첫 번째 출력에 할당 (예시)
    const inputKeys = Object.keys(inputs);
    const sum = inputKeys.reduce((acc, key) => {
      const val = inputs[key]?.[0] ?? 0; // 연결 없으면 0
      return acc + val;
    }, 0);

    // 첫 번째 출력에 결과 넣기
    const outputKeys = Object.keys(outputs);
    if (outputKeys.length > 0) {
      outputs[outputKeys[0]] = sum;
    }
  }
}