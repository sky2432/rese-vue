<template>
  <v-app id="background">
    <router-view />
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      width: window.innerWidth,
    };
  },

  watch: {
    $route(routeInstance) {
      this.createTitleDesc(routeInstance);
    },

    width() {
      this.setProperty();
    },
  },

  created() {
    this.setGoogleMapApi();
    this.setProperty();
  },

  mounted() {
    let routeInstance = this.$route;
    this.createTitleDesc(routeInstance);
    window.addEventListener("resize", this.handleResize);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    handleResize() {
      this.width = window.innerWidth;
    },

    setProperty() {
      let height = window.innerHeight;
      document.documentElement.style.setProperty("--vh", height / 100 + "px");
    },

    setGoogleMapApi() {
      let script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_GOOGLE_MAP_API_KEY}`;
      script.setAttribute("async", "");
      script.setAttribute("defer", "");
      script.type = "text/javascript";
      document.body.appendChild(script);
    },

    createTitleDesc: function(routeInstance) {
      if (routeInstance.meta.title) {
        let setTitle = routeInstance.meta.title + " | Rese";
        document.title = setTitle;
      } else {
        document.title = "Rese";
      }
      if (routeInstance.meta.desc) {
        let setDesc = routeInstance.meta.desc + " | Rese";
        document
          .querySelector("meta[name='description']")
          .setAttribute("content", setDesc);
      } else {
        document
          .querySelector("meta[name='description']")
          .setAttribute("content", "description is not set");
      }
    },
  },
};
</script>

<style>
html,
body,
div,
span,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
abbr,
address,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
samp,
small,
strong,
sub,
sup,
var,
b,
i,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  font-size: 100%;
  background: transparent;
}

body {
  line-height: 1;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

nav ul {
  list-style: none;
}

blockquote,
q {
  quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}

a {
  margin: 0;
  padding: 0;
  font-size: 100%;
  vertical-align: baseline;
  background: transparent;
}

ins {
  background-color: #ff9;
  color: #000;
  text-decoration: none;
}

mark {
  background-color: #ff9;
  color: #000;
  font-style: italic;
  font-weight: bold;
}

del {
  text-decoration: line-through;
}

abbr[title],
dfn[title] {
  border-bottom: 1px dotted;
  cursor: help;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid #cccccc;
  margin: 1em 0;
  padding: 0;
}

input,
select {
  vertical-align: middle;
}

* {
  box-sizing: border-box;
}

ul,
li {
  list-style: none;
}

#background {
  background-color: aliceblue;
}

.wrapper {
  height: calc(var(--vh) * 100 - 64px);
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 2rem;
}

.setting-card {
  height: 400px;
}

.setting-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-line {
  line-height: 50px;
}

.table-header {
  margin: 18px 16px 0 16px;
  font-weight: bold;
  font-size: 12px;
  color: #000000de;
}

.header-txt {
  cursor: pointer;
}

#map {
  width: 100%;
  height: 500px;
}

@media screen and (max-width: 600px) {
  #map {
    height: 300px;
  }
}

.data-table-header {
  margin-top: 12px;
}

@media screen and (min-width: 600px) {
  .data-table-header {
    margin-top: 0px;
  }
}
</style>
