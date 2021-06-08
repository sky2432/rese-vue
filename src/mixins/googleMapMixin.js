export default {
  methods: {
    showGoogleMap() {
      let mapAddress;
      if (this.$route.name === "Owner") {
        mapAddress = this.shopAddress;
      } else {
        mapAddress = this.shop.address;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: mapAddress }, function(results, status) {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          const map = new window.google.maps.Map(document.getElementById("map"), {
            center: location,
            zoom: 16,
          });
          const marker = new window.google.maps.Marker({
            position: location,
            map: map,
          });
          const infoWindow = new window.google.maps.InfoWindow({
            content: results[0].formatted_address,
            pixelOffset: new window.google.maps.Size(0, 5),
          });
          marker.addListener("click", function() {
            infoWindow.open(map, marker);
          });
        } else {
          alert("失敗しました。理由: " + status);
          return;
        }
      });
    },
  },
};
