<template>
  <div class="box">
    <div class="box__left">
      <index-sidebar></index-sidebar>
    </div>
    <div class="box__right">
      <index-header></index-header>
      <index-tabs></index-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@import '@/assets/css/base.scss';
.box{
  display: flex;
  &__left{
    width: 110px;
  }
  &__right{
    flex: 1;
  }
}
</style>