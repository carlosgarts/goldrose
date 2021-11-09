<template>
  <div  id="third" class="content">
      <div class="two-grid">
          <h2>The quest for <br> developing a vision</h2>
          <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eu tempus felis. Aliquam mattis varius odio in malesuada.
              Pellentesque congue risus quis vulputate porttitor. Pellentesque semper scelerisque augue, vitae fringilla purus finibus sed.
              Donec eleifend velit sit amet libero pharetra, nec lobortis nibh fringilla.
              <br><br/>
              Phasellus ac lorem vulputate, faucibus ligula nec, imperdiet orci. Praesent finibus mi tellus, 
              vitae facilisis nisi aliquam a. Pellentesque pharetra id libero non suscipit. Aliquam sollicitudin, 
              tellus a sagittis congue, dolor felis fringilla erat, ac pulvinar ligula arcu id neque. Cras accumsan volutpat nisi, 
              sollicitudin ultrices lacus blandit nec.
            </p>
      </div>
  </div>
</template>

<script>
export default {
  name: 'third'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../styles/components/variables.scss";
#third {
  justify-content: flex-start;
  align-items: flex-end;
  @media (min-width: $movil-size) {
    justify-content: center;
    align-items: center;
  }
}
.two-grid {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 10%;
  width: calc(100% - 50px);
  @media (min-width: $movil-size) {
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }
  h2 {
    font-family: 'Poppins';
    font-weight: bold;
    font-size: 35px;
    margin-top: 0;
    color: $color1;
    @media (min-width: $movil-size) {
      font-size: 50px;
    }
  }
  p {
    font-family: 'Raleway';
    line-height: 165%;
    margin-top: 0;
    color: $color1;
    font-size: 12px;
    @media (min-width: $tablet-size) {
      font-size: 14px;
    }
    @media (min-width: $movil-size) {
      font-size: 16px;
      margin-left: 25px;
      margin-right: 25px;
    }
  }
}
</style>
