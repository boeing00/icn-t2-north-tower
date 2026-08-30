# 인천공항 T2 · 장기 탑승장4 북측타워

제2여객터미널 장기주차장 **북측타워(탑승장4)** 전용 대시보드.

- **주차면 현황** — 공공데이터포털 주차 API (T2 P1·P2 장기주차타워), 30초 자동 갱신
- **북측타워 출발 / 2청사 출발** 공항 셔틀 — 인천공항공사 시간표(엑셀) 내장, 실시간 카운트다운
- **회사 셔틀** — 고정 시간표(04:00~21:00, 피크 10분·그 외 20분)
- **상주직원 전용 셔틀** — 인천공항공사 `26.8.20. 시행 시간표(T2 구간) 내장.
  오전 05:30~08:50 / 오후 17:40~22:20 · 20분 간격 · 소요 10분.
  North Tower 탭 = 1호차(장기탑승장4 승차), Terminal 2 탭 = 2호차(여객탑승장 1층 4~5번 게이트 승차)

## 구조

- `index.html` — 정적 프런트엔드 (셔틀 시간표는 코드에 내장)
- `api/parking.js` — Vercel 서버리스 함수. 서버에서 서비스키를 붙여 공공API를 대신 호출.
  브라우저는 `/api/parking`만 호출하므로 **서비스키가 클라이언트/저장소에 노출되지 않음.**

## 배포 (Vercel)

1. 이 저장소를 Vercel에 Import
2. **Settings → Environment Variables** 에 추가:
   - Name: `DATA_GO_KR_KEY`
   - Value: 공공데이터포털 서비스키 (**Encoding·Decoding 아무거나** — 함수가 자동 정규화)
   - Environments: Production, Preview, Development 모두 체크
3. Deploy (또는 재배포)

> 서비스키는 저장소·프런트엔드 어디에도 커밋하지 않습니다. Vercel 환경변수에만 존재합니다.

## 광고 (Kakao AdFit)

푸터 바로 위에 애드핏 배너 슬롯 1개(`320x100`)가 있다. `index.html` 안:

- 슬롯 마크업 — `<div class="adbox" id="adBox">` 의 `<ins class="kakao_ad_area">`
- 로더 — `</body>` 직전 `t1.kakaocdn.net/kas/static/ba.min.js`

**적용 절차**

1. [애드핏](https://adfit.kakao.com) 에서 매체(웹사이트) 등록 → 심사 통과
2. 광고단위 생성 (모바일 배너 `320x100`)
3. 발급된 `DAN-...` 값을 `index.html` 의 `data-ad-unit="DAN-XXXXXXXXXXXXXXXX"` 자리에 교체
4. 커밋 → Vercel 자동 재배포

**동작 규칙 (건드릴 때 주의)**

- 애드핏 SDK는 슬롯이 **화면상 보이는 상태**여야 광고를 채운다. 컨테이너를
  `display:none` 으로 숨겨두면 `Cannot visible ad on screen` 으로 아예 호출을 안 한다.
  그래서 `.adbox` 는 항상 레이아웃하고, 미노출 시엔 `ins` 가 `display:none` 이라 **높이 0**이 된다.
- 여백은 컨테이너가 아니라 `ins` 에 걸려 있다 → 광고가 안 나오면 여백까지 같이 사라진다.
- `SPONSORED` 라벨은 실제로 채워졌을 때만 붙는다(`MutationObserver` 가 `ins` 의
  `style` 변화를 감시 → `.adbox.on`). 감시가 실패해도 여백은 `ins` 에 있어 레이아웃은 정상.
- NO-AD 콜백은 `data-ad-onfail="adfitOnFail"`.
- 다른 위치에 슬롯을 추가하면 광고단위 ID와 `data-ad-onfail` 함수명을 **서로 다르게** 해야 한다.

## 시간표 갱신

인천공항공사가 시간표를 개정하면(예: 새 `260xxx~` 엑셀), 엑셀을 파싱해 `index.html`의
`DEFAULT_TT.north` / `DEFAULT_TT.t2` 배열(자정 이후 '분' 단위, `[분,"급"]`=급행)만 교체.

상주직원 전용 셔틀은 PDF 시간표를 파싱해 `RES_TT` 배열(자정 이후 '분')만 교체.
양방향(1·2호차) 출발시각이 동일해 배열 하나를 두 탭이 공유한다. 수기 전사 금지.
