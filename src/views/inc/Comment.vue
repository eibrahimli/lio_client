<template>
  <div>
    <slot :task="task"></slot>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: ['task','is_completed'],

  data: () => ({

  }),

  mounted() {

    if(!this.task.completed) {
      this.task.completed = this.is_completed
    }
    if(this.task.deadline != null) {
      this.task.deadline = this.task.deadline.split('-').reverse().join('-')
    }
  },
  destroyed() {
    this.$emit('component_unmounted', 0)
  }

}
</script>

<style scoped>

</style>