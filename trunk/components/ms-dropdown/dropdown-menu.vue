<template>
  <div class="dropdown-menu">
    <slot />
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  mounted() {
    this.$on('close', this.closeDropdown)
  },
  methods: {
    closeDropdown() {
      this.$children.forEach(item => {
        item.close()
      })
    }
  }
}
</script>

<style lang="scss">
	.dropdown-menu {
		display: flex;
		// overflow: auto;
		justify-content: space-between;
		white-space: nowrap;
		width: 235.5rpx;
	}
	dropdown-item {
		// flex: 1;
	}
</style>
