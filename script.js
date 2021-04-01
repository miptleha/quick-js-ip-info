//https://developers.google.com/maps/documentation/javascript/examples/map-latlng-literal?hl=ru#maps_map_latlng_literal-javascript
let map;

function initMap(lat, lng) {
  const mapOptions = {
    zoom: 8,
    center: { lat: lat, lng: lng },
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  const marker = new google.maps.Marker({
    // The below line is equivalent to writing:
    // position: new google.maps.LatLng(-34.397, 150.644)
    position: { lat: lat, lng: lng },
    map: map,
  });
  // You can use a LatLng literal in place of a google.maps.LatLng object when
  // creating the Marker object. Once the Marker object is instantiated, its
  // position will be available as a google.maps.LatLng object. In this case,
  // we retrieve the marker's position using the
  // google.maps.LatLng.getPosition() method.
  const infowindow = new google.maps.InfoWindow({
    content: "<p>Marker Location:" + marker.getPosition() + "</p>",
  });
  google.maps.event.addListener(marker, "click", () => {
    infowindow.open(map, marker);
  });
}

function err(msg) {
  var e = document.getElementById("error");
  e.innerHTML = msg;
}

$('#check').click(function() {
  err('');

  if (!window.navigator.onLine) {
    err('Internet connection required!');
    return;
  }
  
  var ip = $('#ip').val();
  if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
    err('Invalid IP Address!')
    return;
  }
  $.get("http://free.ipwhois.io/xml/" + ip, function(res) {
    var xmlDoc = res;
    var str = new XMLSerializer().serializeToString(xmlDoc.documentElement);
    console.log(str);

    var r = new RegExp("<continent>(.*?)</continent>(.*?)<country>(.*?)</country>(.*?)<country_flag>(.*?)</country_flag>(.*?)<region>(.*?)</region>(.*?)<city>(.*?)</city>(.*?)<currency>(.*?)</currency>");
    var m = r.exec(str);
    var continent = '-', country = '-', flag = '-', region='-', city='-', cur='-';
    if (m != null) {
      continent = m[1];
      country = m[3];
      flag = m[5];
      region = m[7];
      city = m[9];
      cur = m[11];
    }
    else {
      err('Unknown location!');
    }
    $('#continent').text(continent);
    $('#country').text(country);
    $('#flag').attr('src', flag);
    $('#region').text(region);
    $('#city').text(city);
    $('#cur').text(cur);

    var rorg = new RegExp("<org>(.*?)</org>");
    var morg = rorg.exec(str);
    if (morg != null) {
      $('#org').text(morg[1]);
    }
    else {
      $('#org').text('-');
    }

    var rloc = new RegExp("<latitude>(.*?)</latitude>(.*?)<longitude>(.*?)</longitude>");
    var mloc = rloc.exec(str);
    if (mloc != null) {
      var lat = parseFloat(mloc[1]);
      var lng = parseFloat(mloc[3]);

      $('#map').css({height: "100%"});
      initMap(lat, lng);
    }
    else {
      err('Unknown location!');
      $('#map').css({height: "0%"});
    }
  });
});
