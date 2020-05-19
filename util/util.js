/**
 * 常见的几个投影坐表间的转换
 */
var x_PI = 3.14159265358979324 * 3000.0 / 180.0;
var x_PI_N = 3.1415926535897932384626;
var x_a = 6378245.0;
var x_ee = 0.00669342162296594323;
function bd09togcj02(coordinate) {
	var bd_lon = coordinate[0];
	var bd_lat = coordinate[1];
	if (out_of_china(bd_lon, bd_lat)) {
		return [bd_lon, bd_lat]
	}
	var x_pi = 3.14159265358979324 * 3000.0 / 180.0;
	var x = bd_lon - 0.0065;
	var y = bd_lat - 0.006;
	var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
	var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
	var gg_lng = z * Math.cos(theta);
	var gg_lat = z * Math.sin(theta);
	return [gg_lng, gg_lat]
}
function gcj02tobd09(coordinate) {
	var lng = coordinate[0];
	var lat = coordinate[1];
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	}
	var z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
	var theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
	var bd_lng = z * Math.cos(theta) + 0.0065;
	var bd_lat = z * Math.sin(theta) + 0.006;
	return [bd_lng, bd_lat]
}
function wgs84togcj02(coordinate) {
	var lng = coordinate[0];
	var lat = coordinate[1];
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * x_PI_N;
		var magic = Math.sin(radlat);
		magic = 1 - x_ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((x_a * (1 - x_ee)) / (magic * sqrtmagic) * x_PI_N);
		dlng = (dlng * 180.0) / (x_a / sqrtmagic * Math.cos(radlat) * x_PI_N);
		var mglat = lat + dlat;
		var mglng = lng + dlng;
		return [mglng, mglat]
	}
}
function gcj02towgs84(coordinate) {
	var lng = coordinate[0];
	var lat = coordinate[1];
	if (out_of_china(lng, lat)) {
		return [lng, lat]
	} else {
		var dlat = transformlat(lng - 105.0, lat - 35.0);
		var dlng = transformlng(lng - 105.0, lat - 35.0);
		var radlat = lat / 180.0 * x_PI_N;
		var magic = Math.sin(radlat);
		magic = 1 - x_ee * magic * magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat * 180.0) / ((x_a * (1 - x_ee)) / (magic * sqrtmagic) * x_PI_N);
		dlng = (dlng * 180.0) / (x_a / sqrtmagic * Math.cos(radlat) * x_PI_N);
		mglat = lat + dlat;
		mglng = lng + dlng;
		return [lng * 2 - mglng, lat * 2 - mglat]
	}
}
function transformlat(lng, lat) {
	var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * x_PI_N) + 20.0 * Math.sin(2.0 * lng * x_PI_N)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lat * x_PI_N) + 40.0 * Math.sin(lat / 3.0 * x_PI_N)) * 2.0 / 3.0;
	ret += (160.0 * Math.sin(lat / 12.0 * x_PI_N) + 320 * Math.sin(lat * x_PI_N / 30.0)) * 2.0 / 3.0;
	return ret
}
function transformlng(lng, lat) {
	var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
	ret += (20.0 * Math.sin(6.0 * lng * x_PI_N) + 20.0 * Math.sin(2.0 * lng * x_PI_N)) * 2.0 / 3.0;
	ret += (20.0 * Math.sin(lng * x_PI_N) + 40.0 * Math.sin(lng / 3.0 * x_PI_N)) * 2.0 / 3.0;
	ret += (150.0 * Math.sin(lng / 12.0 * x_PI_N) + 300.0 * Math.sin(lng / 30.0 * x_PI_N)) * 2.0 / 3.0;
	return ret
}
function out_of_china(lng, lat) {
	return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false)
}
