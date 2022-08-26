const address = document.querySelector(".infos > span").innerText;
const mapLayer = document.getElementById("map");

const searchAddressToCoordinate = (address) => {
  naver.maps.Service.geocode(
    {
      query: address,
    },
    function (status, response) {
      if (status === naver.maps.Service.Status.ERROR) {
        return alert("Something Wrong!");
      }

      (item = response.v2.addresses[0]),
        (point = new naver.maps.Point(item.x, item.y));

      map.setCenter(point);
      marker.setPosition(point);
    }
  );
};

var map = new naver.maps.Map("map", {
  zoom: 15,
});

var marker = new naver.maps.Marker({
  map: map,
});

const openNaverMap = () => {
  window.open(mapLayer.dataset.href);
};

const addMapLayerEvent = () => {
  map.setOptions({
    //지도 인터랙션 끄기
    draggable: false,
    pinchZoom: false,
    scrollWheel: false,
    keyboardShortcuts: false,
    disableDoubleTapZoom: true,
    disableDoubleClickZoom: true,
    disableTwoFingerTapZoom: true,
  });
  mapLayer.addEventListener("click", openNaverMap);
};

searchAddressToCoordinate(address);
addMapLayerEvent();
