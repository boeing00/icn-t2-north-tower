// Vercel Serverless Function — 인천공항 T2 주차 현황 프록시
// 공공데이터포털 서비스키(DATA_GO_KR_KEY)는 Vercel 환경변수에만 존재하며
// 클라이언트(브라우저)나 저장소 코드에는 절대 노출되지 않습니다.
export default async function handler(req, res) {
  const key = process.env.DATA_GO_KR_KEY;
  if (!key) {
    res.status(500).json({ error: "환경변수 DATA_GO_KR_KEY 가 설정되지 않았습니다. Vercel 프로젝트 설정에서 추가하세요." });
    return;
  }
  // Encoding/Decoding 어느 키를 넣어도 되도록 정규화:
  // 한 번 디코드(이미 raw면 대부분 그대로) 후 다시 인코딩하면 항상 올바른 형태가 됨.
  let sk = key.trim();
  try { sk = decodeURIComponent(sk); } catch (_) { /* 잘못된 %시퀀스면 원본 유지 */ }
  sk = encodeURIComponent(sk);
  const url =
    "https://apis.data.go.kr/B551177/StatusOfParking/getTrackingParking" +
    "?numOfRows=100&pageNo=1&type=json&serviceKey=" + sk;
  try {
    const upstream = await fetch(url);
    const text = await upstream.text();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    // 엣지 캐시 30초(브라우저 폴링과 별개로 공공API 부하 완화)
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    res.status(200).send(text);
  } catch (e) {
    res.status(502).json({ error: "공공데이터포털 호출 실패: " + String(e) });
  }
}
