<template>
  <div>
    <slot :task="task"></slot>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: ['task'],

  data: () => ({

  }),

  mounted() {
    if(this.task.deadline !== null) {
      this.task.deadline = this.task.deadline.split('-').reverse().join('-')
    }
  }

}
</script>

<style scoped>

</style>