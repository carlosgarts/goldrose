<template>
  <div  id="second" class="content">
      <div class="secondary-title">
          <div class="diamond"></div>
          <h2>This is a simple <br> Experimental <br> Design</h2>
          <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.</p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'second'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../styles/components/variables.scss";
.secondary-title {
  position: absolute;
  bottom: 0;
  left: 0;
  max-width: 500px;
  width: calc(100% - 50px);
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
  h2 {
    font-family: 'Poppins';
    font-weight: bold;
    font-size: 36px;
    color: $color1;
    line-height: 130%;
    margin-bottom: 16px;
    margin-top: 16px;
    @media (min-width: $movil-size) {
      font-size: 42px;
    }
  }
  p {
    font-family: 'Raleway';
    line-height: 160%;
    color: $color1;
    font-size: 14px;
    @media (min-width: $movil-size) {
      font-size: 16px;
    }
  }
}

@keyframes girar {
  from {transform: rotateZ(0deg);}
  to {transform: rotateZ(360deg);}
}
</style>
