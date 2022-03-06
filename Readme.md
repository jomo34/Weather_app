# Weather_app
![](https://images.velog.io/images/jomo34/post/9f921934-f0c1-41e3-bf31-b4723bda6b30/image.png)
> Nomad coder.co의 "왕초보를 위한 React Native 101"를 시청하고 공부한 예제입니다.

### 세개의 state

+ city - 도시를 저장
+ day - 일기예보를 저장
+ ok - 권한을 저장

### 동작과정

1. component가 마운트되면 getWeather함수를 호출

2. getWeather 함수는 유저에게 location을 받을수있는 권한을 요청해서 유저가 권한을 거부한다면 ok의 state를 false로 설정

3. 만약 권한을 허락했다면 유저의 경도 위도를 받아온 후 그것을 통해 현재 위치 정보를 파악한 뒤 setCity를 통해 state를 저장

4. API를 호출해서 유저의 위치에 따른 날씨를 받아온 후 setDays를 통해 state를 저장

5. 4번에서 저장을 실패해 days가 비어있다면 ActivityIndicator가 나오고, days가 비어있지않으면, 온도와 기후를 출력

6. @expo/vector-icons에서 날씨에 맞는 아이콘을 가져와서 출력


### 참고
[React Native](https://reactnative.dev/docs/components-and-apis) <br>
[Expo](https://docs.expo.dev/versions/latest/) <br>
[날씨 API](https://openweathermap.org/) <br>
[아이콘 목록](https://icons.expo.fyi/) <br>
