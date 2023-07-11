# Dawnchecker

https://dawnlight.fly.dev/

부트캠프 시작 전 토이프로젝트를 만들어보자! 하며 만든 토이프로젝트

작업을 한 번 시작하면 끝을 봐야하는 성격 때문에 새벽에 밤샘을 하는 경우가 잦는데 이러한 점에서 아이디어를 따와 새벽에 공부한 것들, 활동한 것들을 기록할 수 있는 사이트를 만들었다.

### 프로젝트 기능

1. Record 탭 (/main)
<br>
<img width="1707" alt="스크린샷 2023-07-12 오전 1 37 39" src="https://github.com/insidepixce/Dawnchecker/assets/126161716/3afc1a02-c512-46e8-8abd-e683308031b0">
<br>
새벽에 한 활동들, 공부한 것들을 인증할 수 있다.<br>
submit 버튼을 누르면 이미지 , 글 , 업로드한 시각(자동) 이 데이터베이스에 저장된다.<br>
이미지는 s3에 저장된다 .<br><br><br>

2. whatidid 탭(/Gong) <br>
<img width="1705" alt="스크린샷 2023-07-12 오전 1 38 05" src="https://github.com/insidepixce/Dawnchecker/assets/126161716/e695fb20-2157-4757-b670-87e07d4a3d70">
<br>
record 탭에서 작성한 게시물을 모아서 볼 수 있다. <br>
delete버튼을 누르면 삭제된다.<br>
s3에 이미지를 저장하고, Url을 db에 저장해 가지고 온다<br><br><br>

3. Planner 탭 (/views/write.html)<br>
<img width="1697" alt="스크린샷 2023-07-12 오전 1 39 34" src="https://github.com/insidepixce/Dawnchecker/assets/126161716/8eaf0f6c-e47a-4fae-9273-eba0607f1f86">
<br>
오늘 할 일과 날짜를 기입하면 데이터베이스에 저장된다<br>
저장된 할 일은 Planlist에서 볼 수 있다.<br><br><br>

4. Planlist 탭 (/list)<br>
<img width="1672" alt="스크린샷 2023-07-12 오전 1 40 48" src="https://github.com/insidepixce/Dawnchecker/assets/126161716/56496b67-8e65-4648-b32e-da24eb68fe5d"><br>
  
planner 탭에서 작성한 계획을 이곳에서 볼 수 있다.<br>
사용자가 편하게 볼 수 있도록 최근에 쓴 계획이 상단에 위치할 수 있도록 하였다. <br>
체크를 하고 update를 하면 체크 여부가 데이터베이스에 저장된다.<br>
delete를 누르면 삭제된다.<br>
<br>
<br>
사이트 주소 : https://dawnlight.fly.dev/
Behind story -> https://www.insidepixce.com/dawnchecker
