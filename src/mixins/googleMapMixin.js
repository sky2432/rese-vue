export default {
  methods: {
    showGoogleMap() {
      let mapAddress;
      if (this.$route.name === "Owner") {
        if (this.shopOptionAddress === null) {
          mapAddress = this.shopMainAddress;
        } else {
          mapAddress = this.shopMainAddress + this.shopOptionAddress;
        }
      } else {
        if (this.shop.option_address === null) {
          mapAddress = this.shop.main_address;
        } else {
          mapAddress = this.shop.main_address + this.shop.option_address;
        }
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: mapAddress }, function(results, status) {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          const map = new window.google.maps.Map(
            document.getElementById("map"),
            {
              center: location,
              zoom: 16,
            }
          );
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
