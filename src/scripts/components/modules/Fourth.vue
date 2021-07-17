<template>
  <div  id="fourth" class="content">
      <div class="two-grid">
          <div class="images">
            <div class="gallery">
              <transition name="slide-fade">
                 <img id="slide-one" class="slide" v-if="currentSlide == 0" src="./assets/imagen1.png" alt="portfolio photo">
              </transition>
              <transition name="slide-fade">
                <img id="slide-two" class="slide" v-if="currentSlide == 1" src="./assets/imagen2.png" alt="portfolio photo">
              </transition>
              <transition name="slide-fade">
                <img id="slide-three" class="slide" v-if="currentSlide == 2" src="./assets/imagen3.png" alt="portfolio photo">
              </transition>
            </div>
          </div>
          <div class="more-info">
            <div class="diamond"></div>
            <h2>Check out my portfolio at Artmixa.com</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu tempus felis. Aliquam mattis varius odio in malesuada. 
              Pellentesque congue risus quis vulputate porttitor. Pellentesque semper scelerisque augue, vitae fringilla purus finibus sed. 
              Donec eleifend velit sit amet libero pharetra, nec lobortis nibh fringilla.</p>
          </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'fourth',
  data: function(){
    return {
      currentSlide: 0,
      time: 5000
    }
  },
  methods: {
    changeSlide: function() {
      if (this.currentSlide >= 2) {
        this.currentSlide = 0
      }
      else {
        this.currentSlide += 1;
      }
      setTimeout(this.changeSlide, this.time);
    }
  },
  mounted: function() {
    this.changeSlide();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../styles/components/variables.scss";
  #fourth {
    justify-content: flex-start;
    align-items: flex-end;
    @media (min-width: $movil-size) {
      justify-content: center;
      align-items: center;
    }
  }
  .images {
    display: flex;
    .portal {
      color: $color1;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .gallery {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 95%;
      max-height: 90%;
      position: relative;
      bottom: -111px;
      @media (min-width: $movil-size) {
        width: 80%;
        bottom: unset;
      }
      .slide {
        width: 100%;
        height: auto;
        //max-height: 100%;
        object-fit: cover;
        position: absolute;
      }
    }
  }
  .two-grid {
    display: grid;
    grid-template-columns: 1fr;
    column-gap: 10%;
    width: calc(100% - 50px);
    height: 100%;
    grid-template-rows: 1fr auto;
    @media (min-width: $movil-size) {
      width: 100%;
      grid-template-columns: 1fr 1fr;
      height: auto;
      grid-template-rows: unset;
    }
    .more-info {
      margin-left: 0;
      margin-right: 0;
      @media (min-width: $movil-size) {
        margin-left: 25px;
        margin-right: 25px;
      }
      h2 {
        font-family: 'Poppins';
        font-weight: bold;
        font-size: 33px;
        color: $color1;
        margin-bottom: 16px;
        margin-top: 20px;
        z-index: 5;
        position: relative;
        @media (min-width: $movil-size) {
          font-size: 50px;
        }
      }
      p {
        font-family: 'Raleway';
        line-height: 165%;
        margin-top: 0;
        margin-bottom: 0;
        color: $color1;
        font-size: 16px;
        @media (min-width: $movil-size) {
          font-size: 14px;
        }
      }
      .diamond {
        display: block;
        background-color: $color1;
        height: 25px;
        width: 25px;
        transform: rotateZ(45deg);
        animation-name: girar;
        animation-duration: 15s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
      }
    }
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-leave-active {
    transition: all 1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-leave-to {
    transform: translateX(-100px);
    opacity: 0;
  }

  .slide-fade-enter {
    transform: translateX(100px);
    opacity: 0;
  }

  @keyframes girar {
    from {transform: rotateZ(0deg);}
    to {transform: rotateZ(360deg);}
  }
</style>
