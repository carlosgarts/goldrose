<template>
  <div  id="cover" class="content">
    <div class="title">
      <h1>GOLD<br>ROSE</h1>
      <div class="diamond"></div>
      <p>There's only space.</p>
    </div>
    <div class="credit">
      <p class="date">2021/03/07</p>
      <p class="me">by <a href="">Carlos Gamez</a></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cover'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import "../../../styles/components/variables.scss";
.title {
  position: absolute;
  top: 0;
  left: 0;
  h1 {
    font-family: 'Poppins';
    font-weight: bold;
    color: $color1;
    font-size: 70px;
    margin-top: 0;
    margin-bottom: 5px;
    @media (min-width: $movil-size) {
     font-size: 65px   
    }
  }
  p {
    color: $color1;
    font-family: 'Poppins';
    margin-top: 15px;
    font-size: 19px;
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
.credit {
  position: absolute;
  bottom: 0;
  left: 0;
  color: $color1;
  font-family: 'Poppins';
  font-size: 19px;
  &::before {
    content: '';
    display: block;
    height: 6px;
    width: 50px;
    background-color: $color1;
    margin-bottom: 14px;
  }
  p {
    margin-top: 7px;
    margin-bottom: 7px;
  }
  a {
    color: $color1;
    text-decoration: none;
  }
}

@keyframes girar {
  from {transform: rotateZ(0deg);}
  to {transform: rotateZ(360deg);}
}
</style>
