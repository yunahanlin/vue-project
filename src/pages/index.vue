<template>
  <div class="wrapper">
      <HeaderBar></HeaderBar>
      <HeaderTabs class="tabs"></HeaderTabs> 
      <FooterNav></FooterNav>
  </div>
</template>

<script>
import FooterNav from '../components/FooterNav.vue'
import HeaderBar from '../components/HeaderBar.vue'
import HeaderTabs from '../components/HeaderTabs.vue'
export default {
  components: {
    HeaderBar,
    HeaderTabs,
    FooterNav
  }
}
</script>

<style lang="scss" scoped>

  .wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    .tabs {
      flex: 1;
      margin: 0.8rem 0 0.5rem 0
    }
  }

</style>


