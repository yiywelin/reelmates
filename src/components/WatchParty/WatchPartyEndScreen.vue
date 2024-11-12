<template>
  <div class="curtain fixed inset-0 z-50" v-if="show">
    <div class="curtain__wrapper">
      <!-- Removed the checkbox input since we don't want to reopen -->
      <div class="curtain__panel curtain__panel--left">
        <button @click="$router.push('/home')" 
          class="px-8 py-4 bg-[#675FF2] text-[#D0CCE3] rounded-lg hover:bg-[#DB3DCF] transition-colors text-xl font-bold">
          Return Home
        </button>
      </div>
      
      <div class="curtain__content bg-[#0A0A1F]">
        <div class="space-y-8 text-center">
          <h2 class="text-3xl font-bold text-[#DB3DCF] mb-8">Watch Party Ended!</h2>
        </div>
      </div>
      
      <div class="curtain__panel curtain__panel--right">
        <button @click="$router.push('/friends')" 
          class="px-8 py-4 bg-[#675FF2] text-[#D0CCE3] rounded-lg hover:bg-[#DB3DCF] transition-colors text-xl font-bold">
          New Watch Party
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WatchPartyEndScreen',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.curtain {
  margin: 0 auto;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.curtain__wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.curtain__panel {
  display: flex;
  align-items: center;
  background: #13132b;
  float: left;
  position: relative;
  width: 50%;
  height: 100vh;
  transition: all 1s ease-out;
  z-index: 2;
}

.curtain__panel--left {
  justify-content: center;
  animation: slideInLeft 1s forwards;
  border-right: 2px solid #DB3DCF;
}

.curtain__panel--right {
  justify-content: center;
  animation: slideInRight 1s forwards;
  border-left: 2px solid #DB3DCF;
}

.curtain__content {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  padding: 1rem 0;
  position: absolute;
  text-align: center;
  z-index: 1;
  width: 100%;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>