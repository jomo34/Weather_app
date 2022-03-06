//위치 정보를 알 수 있게 해줌
import * as Location from "expo-location";
//아이콘을 사용할 수 있게해줌
import { Ionicons, Fontisto } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView, //스크롤을 할수있게 해줌
  Dimensions, //핸드폰 화면의 height, width를 알려줌
  ActivityIndicator, //로딩표시를 나타내줌
} from "react-native";
//width를 Screen_Width라고 정의
const { width: Screen_Width } = Dimensions.get("window");
//openweathermap으로부터 받아온 API 키
const API_KEY = "f50a09cb0cfc495ce2361cf83f4c897c";
//x:y x일때 y라는 아이콘을 가져옴
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning",
};
//styles.xxx로 xxx에 디자인한 스타일을 적용할 수 있다.
export default function App() {
  //세개의 state
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  //JS는 기본적으로 비동기 처리를 하지만, async&await을 사용함으로써 비동기에 대한 사고를 하지않아도 됨
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    //만약 허가를 받지않았다면 setOk를 false로 바꿔줘 허가를 받지않았음을 알 수 있음.
    if (!granted) {
      setOk(false);
    }
    //getCurrentPositionAsync로 현재 위치 중 위도와 경도를 가져옴 정확도는 5
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    //reverseGeocodeAsync로 위도와 경도로 현재 위치의 정보를 받아옴
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    //받아온 현재 위치의 정보에서 구역을 저장함
    setCity(location[0].district);
    //여태까지 저장한 위도, 경도, API 키를 사용하여 openweathermap으로부터 정보를 받아옴
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  //component가 마운트 되면 useEffect를 사용해서 getWeather 함수를 호출
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      {/*pagingEnabled : 페이지를 매겨서 한페이지씩 슬라이드 되도록 해줌 아래에 스크롤이 생김*/}
      {/*showsHorizontalScrollIndicator : false로 하면 아래에 스크롤이 생기는것을 없애줌*/}
      {/*horizontal : 옆으로 스크롤 되게 해줌*/}
      {/*contentContainerStyle : ScrollView의 스타일은 지정해줌*/}
      {/*ScrollView에 flex를 지정해주면 스크린을 넘겨서 스크롤이 되지 않는다*/}
      <ScrollView
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={styles.weather}
      >
        {/*아직 days를 받아오지 못했다면 ActivityIndicator로 로딩이미지 출력*/}
        {/*days를 받아왔다면 온도, 기후를 출력*/}
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator
              color="white"
              size="large"
              style={{ marginTop: 10 }}
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto
                  name={icons[day.weather[0].main]}
                  size={50}
                  color="white"
                />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

//styles.xxx에서 xxx에 스타일 디자인하기
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato",
  },
  city: {
    flex: 1,
    //세로축
    justifyContent: "center",
    //가로축
    alignItems: "center",
  },
  cityName: {
    marginTop: 50,
    fontSize: 68,
    color: "white",
    //글자 굵기
    fontWeight: "bold",
  },
  weather: {},
  day: {
    //Dimensions로 구한 Screen_Width를 지정해줘서 한 화면에 하루치의 온도와 묘사만 나오게 설정
    width: Screen_Width,
    alignItems: "flex-start",
    //왼쪽과 오른쪽의 padding을 설정
    paddingHorizontal: 20,
  },
  temp: {
    fontSize: 120,
    //상단 여백
    marginTop: 50,
    color: "white",
  },
  description: {
    fontSize: 40,
    marginTop: -30,
    color: "white",
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
});
