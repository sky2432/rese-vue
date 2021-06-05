export default {
  watch: {
    shop() {
      const geocoder = new google.maps.Geocoder();

      let timer = setInterval(() => {
        if (window.google) {
          clearInterval(timer);
          geocoder.geocode({ address: this.shop.address }, function(
            results,
            status
          ) {
            if (status === "OK" && results[0]) {
              const location = results[0].geometry.location;
              const map = new google.maps.Map(document.getElementById("map"), {
                center: location,
                zoom: 16,
              });
              const marker = new google.maps.Marker({
                position: location,
                map: map,
              });
              const infoWindow = new google.maps.InfoWindow({
                content: results[0].formatted_address,
                pixelOffset: new google.maps.Size(0, 5),
              });
              marker.addListener("click", function() {
                infoWindow.open(map, marker);
              });
            } else {
              alert("失敗しました。理由: " + status);
              return;
            }
          });
        }
      }, 500);
    },
  },
};
