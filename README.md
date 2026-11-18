# 옥서스 송병주 디지털 명함

송병주 차장 · Brian Song · Sales Manager

## 웹사이트

GitHub Pages 공개 주소: https://seoya13.github.io/oxus-digital-card/

## 기능

- 전화: `010-5011-2605` 통화 앱 연결
- 이메일: 주소 복사 / Gmail 작성 / 네이버 메일 / 기본 메일 앱
- 홈페이지: https://www.oxus.co.kr/
- 주소: 네이버지도·카카오맵 선택 및 주소 복사
- 연락처 저장: vCard 다운로드
- 공유: 링크 복사, 지원 기기의 시스템 공유, OG 미리보기

네이버 메일은 메일 홈으로 연결합니다. 주소 복사 후 받는 사람에 붙여넣으세요.
지도 앱이 설치되지 않은 경우 웹 지도로 연결합니다. 휴대폰과 브라우저 정책에 따라 앱 실행 방식이 달라질 수 있습니다.

## Pages 설정

저장소 **Settings → Pages → Build and deployment**에서 다음처럼 설정합니다.

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/(root)**

파일 저장 후 GitHub Pages가 자동으로 갱신됩니다. 별도 빌드·패키지 설치·서버가 필요하지 않습니다.

## 파일 수정

| 파일 | 내용 |
|---|---|
| index.html | 이름, 직함, 자격, 연락처, 주소, 공유용 메타 태그 |
| styles.css | 화면 디자인과 반응형 스타일 |
| app.js | 메일/지도 선택, 복사와 공유 기능 |
| config.js | 선택 사항인 카카오 JavaScript 키 |
| assets/brian-song.vcf | 저장할 연락처 정보 |
| assets/reference-card.png | 제공받은 명함 이미지, 로고/사진 및 공유 미리보기에 사용 |

연락처를 바꾸면 index.html, app.js, assets/brian-song.vcf를 함께 수정하세요.
저장소 이름이나 도메인이 바뀌면 index.html의 canonical 및 og:url, og:image도 수정하세요.

## 카드형 카카오톡 공유 (선택)

키 없이도 명함 URL을 복사해 카톡에 붙여넣을 수 있습니다.
공유 메뉴에 별도의 카카오톡 카드형 공유 버튼을 추가하려면:

1. https://developers.kakao.com/ 에서 앱을 등록합니다.
2. JavaScript SDK 도메인에 `https://seoya13.github.io`를 등록합니다.
3. 제품 링크 관리의 웹 도메인에 `https://seoya13.github.io`와 `https://www.oxus.co.kr`를 등록합니다.
4. config.js의 kakaoJavaScriptKey에 **JavaScript 키**를 넣습니다. Admin/REST API 키는 넣지 않습니다.

공유 미리보기가 이전 이미지로 보이면 카카오디벨로퍼스의 URL 메타정보 관리에서 캐시를 초기화하세요.

## 확인한 내용

320/390/480px 화면의 레이아웃, 메일·주소·공유 선택 메뉴, 복사, HTML 링크 대상 및 vCard 내용을 확인했습니다.
실제 통화·지도 앱 실행·주소록 가져오기는 휴대폰에서 확인해야 합니다.
