# 인천공항 T2 · 장기 탑승장4 북측타워

제2여객터미널 장기주차장 **북측타워(탑승장4)** 전용 대시보드.

- **주차면 현황** — 공공데이터포털 주차 API (T2 P1·P2 장기주차타워), 30초 자동 갱신
- **북측타워 출발 / 2청사 출발** 공항 셔틀 — 인천공항공사 시간표(엑셀) 내장, 실시간 카운트다운
- **회사 셔틀** — 고정 시간표(05:00~21:00, 피크 10분·그 외 20분)

## 구조

- `index.html` — 정적 프런트엔드 (셔틀 시간표는 코드에 내장)
- `api/parking.js` — Vercel 서버리스 함수. 서버에서 서비스키를 붙여 공공API를 대신 호출.
  브라우저는 `/api/parking`만 호출하므로 **서비스키가 클라이언트/저장소에 노출되지 않음.**

## 배포 (Vercel)

1. 이 저장소를 Vercel에 Import
2. **Settings → Environment Variables** 에 추가:
   - Name: `DATA_GO_KR_KEY`
   - Value: 공공데이터포털에서 발급받은 **Encoding(인코딩)** 서비스키
   - Environments: Production, Preview, Development 모두 체크
3. Deploy (또는 재배포)

> 서비스키는 저장소·프런트엔드 어디에도 커밋하지 않습니다. Vercel 환경변수에만 존재합니다.

## 시간표 갱신

인천공항공사가 시간표를 개정하면(예: 새 `260xxx~` 엑셀), 엑셀을 파싱해 `index.html`의
`DEFAULT_TT.north` / `DEFAULT_TT.t2` 배열(자정 이후 '분' 단위, `[분,"급"]`=급행)만 교체.
