
import Rete from "rete";
import NumInput from '@/components/NumInput';

/**
 * emitter: 
 * key: 
 * readonly: 읽기전용 여부(생략시 false)
 */
class NumControl extends Rete.Control {
    constructor(emitter, key, readonly) {
        super(key);
        this.component = NumInput; // Vue.extend 객체
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        if (this.vueContext) this.vueContext.value = val;
    }
}

export default NumControl;