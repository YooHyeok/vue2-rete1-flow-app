<template>
  <div>
    <NumComponent/>
    <CustomComponent/>
  </div>
</template>

<script>

import NumComponent from "@/sample/components/NumComponent"
import CustomComponent from "@/components/CustomComponent"

export default {
  name: "App",
  components: {
    NumComponent,
    CustomComponent
  }
};
</script>
