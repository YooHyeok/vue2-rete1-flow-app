<template>
  <input type="number" :value="value" @input="change($event)" @dblclick.stop=""/>
</template>

<script>
export default {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  data() { return { value: 0 }; },
  methods: {
    change(e) {
      this.value = +e.target.value;
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
}
</script>