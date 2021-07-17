<template>
  <div  id="fifth" class="content">
      <h1>GOLD <br> ROSE</h1>
      <p class="sub">by <a href="">Carlos Gamez</a></p>

      <p class="mail">carlos@artmixa.com</p>
  </div>
</template>

<script>
export default {
  name: 'fifth'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../styles/components/variables.scss";
  #fifth {
    align-items: center;
    justify-content: center;
    flex-flow: column;
    h1 {
        font-family: 'Poppins';
        font-weight: bold;
        font-size: 87px;
        color: $color1;
        margin-bottom: 20px;
        margin-top: 20px;
        line-height: 94%;
      }
    .sub {
      font-family: 'Poppins';
      font-size: 18px;
      color: $color1;
      margin: 0;
      a {
        color: $color1;
        text-decoration: none;
      }
    }
    .mail {
      position: absolute;
      bottom: -25px;
      font-family: 'Poppins';
      color: $color1;
    }
  }

</style>
