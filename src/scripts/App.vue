<template>
  <div id="app" @wheel="scrollHandler" v-pan="panHandler">
    <nav class="navigation" v-bind:class="{ centrado: position == 4, bottom: position == 0 }">
      <!-- <button class="nav-but">{{scrollLocation}}</button> -->
      <button class="nav-but" v-bind:class="{ selected: position == 0}" v-on:click="browseTo(0)" >First</button>
      <button class="nav-but" v-bind:class="{ selected: position == 1}" v-on:click="browseTo(1)" >Second</button>
      <button class="nav-but" v-bind:class="{ selected: position == 2}" v-on:click="browseTo(2)" >Third</button>
      <button class="nav-but" v-bind:class="{ selected: position == 3}" v-on:click="browseTo(3)" >Fourth</button>
      <button class="nav-but" v-bind:class="{ selected: position == 4}" v-on:click="browseTo(4)" >Fifth</button>
    </nav>
    <transition name="fade">
      <Cover v-if="position == 0" />
    </transition>
    <transition name="fade">
      <Second v-if="position == 1" />
    </transition>
    <transition name="fade">
      <Third v-if="position == 2" />
    </transition>
    <transition name="fade">
      <Fourth v-if="position == 3" />
    </transition>
    <transition name="fade">
      <Fifth v-if="position == 4" />
    </transition>
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  </div>
</template>

<script>
import Hammer from 'hammerjs';
import Cover from './components/modules/Cover.vue';
import Second from './components/modules/Second.vue';
import Third from './components/modules/Third.vue';
import Fourth from './components/modules/Fourth.vue';
import Fifth from './components/modules/Fifth.vue';
import Rose from './components/rose.js';

export default {
  name: 'app',
  components: {
    Cover,
    Second,
    Third,
    Fourth,
    Fifth
  },
  data: function () {
    return {
      position: 0,
      // scrollLocation: 0,
      cooldown: false 
    }
  },
  directives: {
    pan: {
      // Definición de directiva
      bind: function(el, binding) {
        if (typeof binding.value === "function") {
          const mc = new Hammer(el);
          mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
          mc.on("panup pandown", binding.value);
        }
      }
    }
  },
  methods: {
    browseTo: function(index) {
      this.position = index;
      Rose.methods.moveCamera(index);
    },
    init: function() {
      Rose.methods.init();
    },
    animation: function() {
      requestAnimationFrame(this.animation);
      Rose.methods.animate();
    },
    panHandler (e) {
      console.log(e.type);  // May be left / right / top / bottom
      if (e.type == "panup" && e.isFinal == true && this.position < 4) {
        console.log(e);
        this.position += 1;
        //this.position = Math.min(Math.max(0, this.scrollLocation), 4);
      } else if (e.type == "pandown" && e.isFinal == true && this.position > 0) {
        console.log(e);
        this.position -= 1;
        //this.position = Math.min(Math.max(0, this.scrollLocation), 4);
      }
    },
    scrollHandler: function(event) {
      console.log(event);
      if (this.cooldown == false ) {
        if (event.deltaY >= 3 && this.position < 4) {
          this.position += 1;  //////NOTA averiguar sobre event bubbling aqui https://www.sitepoint.com/event-bubbling-javascript/
          this.cooldown = true;
        }
        else if (event.deltaY <= -3 && this.position > 0) {
          this.position -= 1; //////NOTA controlar de que no se ejecute inmediatamente despues de activarlo por un segundo al menos
          this.cooldown = true;
        } 
      }
      //Cooldown
      setTimeout(() => this.cooldown = false, 2000);
      // event.preventDefault();

      // this.scrollLocation += event.deltaY * -0.01;

      // // Restrict scale
      // this.scrollLocation = Math.min(Math.max(-1.5, this.scrollLocation), 0);

      // Apply scale transform
      //el.style.transform = `scale(${scale})`;
    }
  },
  watch: {
    position: function(val){
      if (val < 0) {
        this.position = 0;
      }
      else if (val > 4) {
        this.position = 4;
      }
      else {
        Rose.methods.moveCamera(val);
      }
    }
    // scrollLocation: function(val){
    //   if (val <= 0 && val > -0.3){
    //     this.position = 0; this.browseTo(this.position);
    //   }
    //   if (val <= -0.3 && val > -0.6) {
    //     this.position = 1; this.browseTo(this.position);
    //   }
    //   if (val <= -0.6 && val > -0.9) {
    //     this.position = 2; this.browseTo(this.position);
    //   }
    //   if (val <= -0.9 && val > -1.2) {
    //     this.position = 3; this.browseTo(this.position);
    //   }
    //   if (val <= -1.2 && val > -1.5) {
    //     this.position = 4; this.browseTo(this.position);
    //   }
    // }
  },
  mounted() {
      this.init('rose');
      this.animation();
  }
}
</script>

<style lang="scss">
  @import "../styles/components/variables.scss";
  .navigation {
        transition: 0.5s top linear;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        right: 20px;
        top: 0;
        z-index: 20;
        -ms-transform: rotate(-90deg); /* IE 9 */
        -ms-transform-origin: 100% 50%; /* IE 9 */
        transform: rotate(-90deg);
        transform-origin: 100% 50%;
        margin-bottom: 25px;
        @media (min-width: $movil-size) {
          transition: width transform linear 0.5s;
          right: 0;
          -ms-transform: rotate(0deg); /* IE 9 */
          -ms-transform-origin: 50% 50%; /* IE 9 */
          transform: rotate(0deg);
          transform-origin: 50% 50%;
          margin-bottom: 0;
        }
        .nav-but {
          position: relative;
          transition: 0.5s;
          background-color: transparent;
          color: $color1;
          border: none;
          font-family: 'Poppins', sans-serif;
          font-weight: 300;
          font-size: 16px;
          @media (min-width: $movil-size) {
            font-size: 20px;
          }
          &::after {
            transition: 0.5s;
            content: '';
            height: 10px;
            width: 0%;
            background-color: blanchedalmond;
            position: absolute;
            left: 0;
            bottom: 5px;
            mix-blend-mode: difference;
          }
          &:hover {
            &::after {
              width: 25%;
            }
          }
          &.selected {
            &::after {
              width: 75%;
            }
          }
          &::before {
            content: '';
            width: 1px;
            height: 120%;
            background-color: $color1;
            position: absolute;
            left: 0;
            top: -10%;
            @media (min-width: $movil-size) {
              display: none;
            }
          }
          &:nth-child(1) {
            &::before {
              display: none;
            }
          }
        }
        &.centrado {
          transition: transform linear 0.5s;
          -ms-transform: rotate(0deg);
          transform: rotate(0deg);
          width: 90%;
          flex-wrap: wrap;
          width: 80%;
          @media (min-width: $movil-size) {
            transition: width linear 0.5s;
            width: 100%;
          }
        }
        &.bottom {
          transition: 0.5s top linear;
          top: calc(100% - 350px);
          @media (min-width: $movil-size) {
            top: 0;
          }
        }
  }
  .fade-enter-active {
    //transition-delay: 1s;
    transition: opacity 2s cubic-bezier(.86,0,.67,.52);
  }
  .fade-leave-active {
    transition: opacity .5s; 
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>