var initialLocation;
var latitude;
var longitude;
var shinjuku = new google.maps.LatLng(35.709946,139.702148);
var browserSupportFlag = new Boolean();

var currentInfoWindow = null;

function getXMLHtmlRequest() {
	var req;
	try {
		req = new XMLHttpRequest();
	} catch(e) {
		try {
			req = new ActiveXObject('Msxml2.XMLHTTP');
		} catch (e) {
			req = new ActiveXObject('Microsoft.XMLHTTP');
		}
	}
	return req;
}

function asyncSend() {

	var myOptions = {
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	if (navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(
			//successCallback
			function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				map.setCenter(initialLocation);

				var markerOptions = {
					position: initialLocation,
					map: map,
				}
				var marker = new google.maps.Marker(markerOptions);

				var req = getXMLHtmlRequest();

				req.onreadystatechange = function() {
					var result = document.getElementById('result');
					if (req.readyState == 4) {
						if (req.status == 200) {
							var data = eval('(' + req.responseText + ')');

							var i = 0;
							var j = 0;

							while(j <= 10) {
								var shopinfo = document.getElementById('shopinfo' + j);
								shopinfo.innerHTML = null;
								j = j + 1;
							}

							while (i < data.length) {
								//マーカー
								var markerPost = new google.maps.LatLng(data[i].latitude, data[i].longitude);
								var content = "<div class='info'><b>" + data[i].name + "</b><br /><img src='" + data[i].shop_image1 + "' width='100px'/><br /><p>" + data[i].tel + "</p><p><a href='" + data[i].url + "' target='_blank'>ぐるなびのページはこちら</a></p><p></div>";
								createMarker(map, markerPost, content);

								//横表示
								var shopinfo = document.getElementById('shopinfo' + i);
								shopinfo.innerHTML = data[i].name;
								i = i + 1;
							}	

							function createMarker(map, latlng, content) {
								var infoWindow_Options = {
									content : content,
								};
								var infoWindow = new google.maps.InfoWindow(infoWindow_Options);

								var markerOptions = {
									position : latlng,
									map : map
								};
								var marker = new google.maps.Marker(markerOptions);
								google.maps.event.addListener(marker, "click", function(){
									//先に開いた情報ウィンドウがあれば、closeする
									if (currentInfoWindow) {
										currentInfoWindow.close();
									}
									//情報ウィンドウを開く
									infoWindow.open(map, marker);

									currentInfoWindow = infoWindow;
								});
								return marker;
							}

					}
				} else {
					result.innerHMTL = "通信中...";
				}
			}

			var url = '/main/req?latitude=' + latitude + '&longitude=' + longitude + '&range=' + document.fm.range.value;
			if (document.fm.cat_big.value != 0) {
				var url = url + '&category_l=' + document.fm.cat_big.value;
			}
			req.open('GET', url, true);
			req.send(null);
			}, 
			//errorCallback
			function() {
				handleNoGeolocation(browserSupportFlag);
			}
		);

	} else {
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}

	function handleNoGeolocation(errrFlag) {
		if (errorFlag == true) {
			alert("Geolocation service failed.");
		} else {
			alert("ブラウザ非対応");
		}
		initialLocation = shinjuku;
		map.setCenter(initialLocation);
	}
}
