# 꼬마 세계 탐험대 — 엽서 그림 45장 제작 프롬프트·참고서

> 목적: 이후 이미지 생성 세션에서 아래 프롬프트로 남은 엽서를 나라별 한 장씩 만들고, 검수 및 앱 연결까지 관리합니다. 이 문서는 예약 실행이나 자동 생성 완료를 뜻하지 않습니다.

## 제작 수량과 범위

- 작업 대상은 **45장**입니다: 신규 국가 43장 + 기존 0바이트 그림 교체 2장(세이셸 104번, 바하마 139번).
- 전제 계산은 목표 197개국 중 정상 이미지가 확인된 152개국을 제외한 수량입니다. 45장 생성 후에도 파일 디코딩·3:2 비율·앱 연결 검수를 통과해야 전체 완료로 표시합니다.
- 기존 제작 번호와 기존에 준비된 그림은 유지합니다. 아래 순번은 작업용 임시 순서이며 카드 번호가 아닙니다.
- 원본 기준 목록: `world-atlas-remaining-45.md`; 개별 프롬프트·manifest·스타일 샘플은 `world-atlas-remaining-45-prompt-pack/`에 있습니다.

## 제작 및 검수 지침

1. 각 프롬프트로 **국가별 독립 이미지 한 장**을 생성합니다. 여러 나라를 한 캔버스에 합치지 않습니다.
2. 세션당 10장 안팎으로 진행하고 마지막 묶음은 5장입니다. 실패·중단 시 완료 수를 실제 결과물 기준으로 기록하고 다음 번호부터 재개합니다.
3. 스타일 참고 이미지는 `style-reference/korea-hanok-tower.webp`와 `style-reference/china-great-wall.webp`입니다. 두 파일을 이미지 생성 도구에 참고 이미지로 첨부합니다.
4. 결과는 가로 3:2 WEBP로 저장하고 아래의 고정 파일명을 사용합니다. 필요한 경우 변환·리사이즈 후 가로세로 비율을 다시 확인합니다.
5. 장면이 해당 국가·랜드마크와 일치하고, 글자·워터마크·국기·콜라주가 없으며, 축소해도 랜드마크가 읽히는지 눈으로 확인합니다.
6. 파일이 정상 디코딩되고 앱의 자산 경로/국가 카드에 연결되기 전까지 상태는 `image_pending` 또는 `review_pending`입니다. 검수와 연결까지 마친 후에만 완료로 기록합니다.
7. 고품질 이미지 보관 ZIP은 최대 50개국 단위로 묶습니다. 이번 묶음은 최대 45개국이며, 최종 ZIP에는 검수 통과 원본과 manifest를 함께 넣습니다.

## 권장 작업 묶음

| 묶음 | 작업 순번 | 수량 |
|---|---:|---:|
| 1차 | 1–10 | 10 |
| 2차 | 11–20 | 10 |
| 3차 | 21–30 | 10 |
| 4차 | 31–40 | 10 |
| 5차 | 41–45 | 5 |

## 나라별 프롬프트

아래 프롬프트는 각각 따로 이미지 생성 요청에 사용합니다. 파일명은 결과물 저장명이며, 작업 순번은 기존 카드 제작 번호를 변경하지 않습니다.

### 01. 콩고민주공화국 · DR Congo (CD)

- 작업 유형: 신규 국가 그림
- 장면: Virunga volcanoes and mountain gorillas — Virunga National Park, a mountain gorilla family beneath the misty volcanoes of the Albertine Rift
- 저장 파일명: `democratic-republic-of-the-congo-virunga.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Virunga National Park, a mountain gorilla family beneath the misty volcanoes of the Albertine Rift. Country: DR Congo.
```

### 02. 적도기니 · Equatorial Guinea (GQ)

- 작업 유형: 신규 국가 그림
- 장면: Pico Basilé volcano on Bioko — the forested volcanic peak of Pico Basilé above the island landscape of Bioko
- 저장 파일명: `equatorial-guinea-pico-baslie.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the forested volcanic peak of Pico Basilé above the island landscape of Bioko. Country: Equatorial Guinea.
```

### 03. 에리트레아 · Eritrea (ER)

- 작업 유형: 신규 국가 그림
- 장면: 아스마라의 근대 도시 경관 — Asmara: A Modernist African City
- 저장 파일명: `eritrea-asmara.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Asmara: A Modernist African City. Country: Eritrea.
```

### 04. 기니비사우 · Guinea-Bissau (GW)

- 작업 유형: 신규 국가 그림
- 장면: 비자고스 제도의 해안과 바다 생태계 — Coastal and Marine Ecosystems of the Bijagós Archipelago – Omatí Minhô
- 저장 파일명: `guinea-bissau-bijagos.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Coastal and Marine Ecosystems of the Bijagós Archipelago – Omatí Minhô. Country: Guinea-Bissau.
```

### 05. 리비아 · Libya (LY)

- 작업 유형: 신규 국가 그림
- 장면: 렙티스마그나 유적 — Archaeological Site of Leptis Magna
- 저장 파일명: `libya-leptis-magna.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Archaeological Site of Leptis Magna. Country: Libya.
```

### 06. 모리셔스 · Mauritius (MU)

- 작업 유형: 신규 국가 그림
- 장면: 르몬의 문화 경관 — Le Morne Cultural Landscape
- 저장 파일명: `mauritius-le-morne.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Le Morne Cultural Landscape. Country: Mauritius.
```

### 07. 콩고공화국 · Republic of the Congo (CG)

- 작업 유형: 신규 국가 그림
- 장면: 상가강의 삼국 국립공원 지역 — Sangha Trinational
- 저장 파일명: `republic-of-the-congo-sangha.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Sangha Trinational. Country: Republic of the Congo.
```

### 08. 소말리아 · Somalia (SO)

- 작업 유형: 신규 국가 그림
- 장면: Mogadishu coast and historic city — the old coastal city of Mogadishu opening toward the Indian Ocean
- 저장 파일명: `somalia-mogadishu.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the old coastal city of Mogadishu opening toward the Indian Ocean. Country: Somalia.
```

### 09. 남수단 · South Sudan (SS)

- 작업 유형: 신규 국가 그림
- 장면: Sudd wetlands on the White Nile — the vast Sudd wetlands, papyrus islands and shining channels of the White Nile floodplain
- 저장 파일명: `south-sudan-sudd.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the vast Sudd wetlands, papyrus islands and shining channels of the White Nile floodplain. Country: South Sudan.
```

### 10. 수단 · Sudan (SD)

- 작업 유형: 신규 국가 그림
- 장면: 메로에섬의 고고 유적 — Archaeological Sites of the Island of Meroe
- 저장 파일명: `sudan-meroe.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Archaeological Sites of the Island of Meroe. Country: Sudan.
```

### 11. 상투메 프린시페 · São Tomé and Príncipe (ST)

- 작업 유형: 신규 국가 그림
- 장면: Pico Cão Grande and São Tomé rainforest — a lush São Tomé volcanic island with the Pico Cão Grande basalt spire rising through rainforest
- 저장 파일명: `sao-tome-pico-cao-grande.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: a lush São Tomé volcanic island with the Pico Cão Grande basalt spire rising through rainforest. Country: São Tomé and Príncipe.
```

### 12. 토고 · Togo (TG)

- 작업 유형: 신규 국가 그림
- 장면: 바탐마리바 사람들의 쿠타마쿠 경관 — Koutammakou, the Land of the Batammariba
- 저장 파일명: `togo-koutammakou.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Koutammakou, the Land of the Batammariba. Country: Togo.
```

### 13. 우간다 · Uganda (UG)

- 작업 유형: 신규 국가 그림
- 장면: 브윈디 원시림 국립공원 — Bwindi Impenetrable National Park
- 저장 파일명: `uganda-bwindi.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Bwindi Impenetrable National Park. Country: Uganda.
```

### 14. 짐바브웨 · Zimbabwe (ZW)

- 작업 유형: 신규 국가 그림
- 장면: 그레이트짐바브웨 유적 — Great Zimbabwe National Monument
- 저장 파일명: `zimbabwe-great-zimbabwe.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Great Zimbabwe National Monument. Country: Zimbabwe.
```

### 15. 바레인 · Bahrain (BH)

- 작업 유형: 신규 국가 그림
- 장면: 바레인 요새 — Qal’at al-Bahrain
- 저장 파일명: `bahrain-qalat-al-bahrain.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Qal’at al-Bahrain. Country: Bahrain.
```

### 16. 이스라엘 · Israel (IL)

- 작업 유형: 신규 국가 그림
- 장면: 하이파와 갈릴리 서부의 바하이 성지 — Bahá’i Holy Places in Haifa and the Western Galilee
- 저장 파일명: `israel-bahai-haifa.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Bahá’i Holy Places in Haifa and the Western Galilee. Country: Israel.
```

### 17. 쿠웨이트 · Kuwait (KW)

- 작업 유형: 신규 국가 그림
- 장면: 쿠웨이트시티와 주변 풍경 — Kuwait City and its surroundings
- 저장 파일명: `kuwait-kuwait-city.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Kuwait City and its surroundings. Country: Kuwait.
```

### 18. 키르기스스탄 · Kyrgyzstan (KG)

- 작업 유형: 신규 국가 그림
- 장면: 술라이만 성산 — Sulaiman-Too Sacred Mountain
- 저장 파일명: `kyrgyzstan-sulaiman-too.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Sulaiman-Too Sacred Mountain. Country: Kyrgyzstan.
```

### 19. 레바논 · Lebanon (LB)

- 작업 유형: 신규 국가 그림
- 장면: 바알베크 유적 — Baalbek
- 저장 파일명: `lebanon-baalbek.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Baalbek. Country: Lebanon.
```

### 20. 북한 · North Korea (KP)

- 작업 유형: 신규 국가 그림
- 장면: Mount Paektu and crater lake — the sacred volcanic crater lake of Mount Paektu, framed by high mountain slopes
- 저장 파일명: `north-korea-mount-paektu.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the sacred volcanic crater lake of Mount Paektu, framed by high mountain slopes. Country: North Korea.
```

### 21. 팔레스타인 · Palestine (PS)

- 작업 유형: 신규 국가 그림
- 장면: Ancient Jericho and Tell es-Sultan — the ancient stone settlement mound of Tell es-Sultan at Jericho, with palms and desert hills
- 저장 파일명: `palestine-jericho-tell-es-sultan.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the ancient stone settlement mound of Tell es-Sultan at Jericho, with palms and desert hills. Country: Palestine.
```

### 22. 카타르 · Qatar (QA)

- 작업 유형: 신규 국가 그림
- 장면: 알주바라 유적 — Al Zubarah Archaeological Site
- 저장 파일명: `qatar-al-zubarah.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Al Zubarah Archaeological Site. Country: Qatar.
```

### 23. 시리아 · Syria (SY)

- 작업 유형: 신규 국가 그림
- 장면: 보스라 고대 도시 — Ancient City of Bosra
- 저장 파일명: `syria-bosra.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Ancient City of Bosra. Country: Syria.
```

### 24. 대만 · Taiwan (TW)

- 작업 유형: 신규 국가 그림
- 장면: Taipei 101 and Taipei basin — Taipei 101 above the city with forested Elephant Mountain and layered green hills
- 저장 파일명: `taiwan-taipei-101.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Taipei 101 above the city with forested Elephant Mountain and layered green hills. Country: Taiwan.
```

### 25. 동티모르 · Timor-Leste (TL)

- 작업 유형: 신규 국가 그림
- 장면: Dili and Cristo Rei hill — Dili waterfront with Cristo Rei hill overlooking the blue Timor Sea
- 저장 파일명: `timor-leste-dili-cristo-rei.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Dili waterfront with Cristo Rei hill overlooking the blue Timor Sea. Country: Timor-Leste.
```

### 26. 투르크메니스탄 · Turkmenistan (TM)

- 작업 유형: 신규 국가 그림
- 장면: 메르브의 옛 오아시스 도시 — State Historical and Cultural Park “Ancient Merv”
- 저장 파일명: `turkmenistan-ancient-merv.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: State Historical and Cultural Park “Ancient Merv”. Country: Turkmenistan.
```

### 27. 아랍에미리트 · United Arab Emirates (AE)

- 작업 유형: 신규 국가 그림
- 장면: 알아인의 오아시스와 문화 유적 — Cultural Sites of Al Ain (Hafit, Hili, Bidaa Bint Saud and Oases Areas)
- 저장 파일명: `united-arab-emirates-al-ain-oasis.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Cultural Sites of Al Ain (Hafit, Hili, Bidaa Bint Saud and Oases Areas). Country: United Arab Emirates.
```

### 28. 예멘 · Yemen (YE)

- 작업 유형: 신규 국가 그림
- 장면: 사나 구시가지 — Old City of Sana’a
- 저장 파일명: `yemen-old-sanaa.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Old City of Sana’a. Country: Yemen.
```

### 29. 안도라 · Andorra (AD)

- 작업 유형: 신규 국가 그림
- 장면: Pyrenees mountain valley — a dramatic glacial valley in the Pyrenees with stone shepherd huts and high peaks
- 저장 파일명: `andorra-pyrenees.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: a dramatic glacial valley in the Pyrenees with stone shepherd huts and high peaks. Country: Andorra.
```

### 30. 벨라루스 · Belarus (BY)

- 작업 유형: 신규 국가 그림
- 장면: 미르성 — Mir Castle Complex
- 저장 파일명: `belarus-mir-castle.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Mir Castle Complex. Country: Belarus.
```

### 31. 보스니아 헤르체고비나 · Bosnia and Herzegovina (BA)

- 작업 유형: 신규 국가 그림
- 장면: 모스타르의 옛 다리 지역 — Old Bridge Area of the Old City of Mostar
- 저장 파일명: `bosnia-mostar-old-bridge.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Old Bridge Area of the Old City of Mostar. Country: Bosnia and Herzegovina.
```

### 32. 코소보 · Kosovo (XK)

- 작업 유형: 신규 국가 그림
- 장면: 프리슈티나와 주변 풍경 — Pristina and its surroundings
- 저장 파일명: `kosovo-pristina.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Pristina and its surroundings. Country: Kosovo.
```

### 33. 리히텐슈타인 · Liechtenstein (LI)

- 작업 유형: 신규 국가 그림
- 장면: Vaduz Castle and Alpine Rhine Valley — Vaduz Castle perched above the Rhine Valley beneath the Alps
- 저장 파일명: `liechtenstein-vaduz-castle.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Vaduz Castle perched above the Rhine Valley beneath the Alps. Country: Liechtenstein.
```

### 34. 룩셈부르크 · Luxembourg (LU)

- 작업 유형: 신규 국가 그림
- 장면: 룩셈부르크의 옛 시가지와 요새 — City of Luxembourg: its Old Quarters and Fortifications
- 저장 파일명: `luxembourg-old-quarter.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: City of Luxembourg: its Old Quarters and Fortifications. Country: Luxembourg.
```

### 35. 모나코 · Monaco (MC)

- 작업 유형: 신규 국가 그림
- 장면: Monaco harbor and Mediterranean coast — the compact Monaco harbor, pastel buildings and Mediterranean cliffs
- 저장 파일명: `monaco-harbor.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the compact Monaco harbor, pastel buildings and Mediterranean cliffs. Country: Monaco.
```

### 36. 몬테네그로 · Montenegro (ME)

- 작업 유형: 신규 국가 그림
- 장면: 코토르의 자연과 역사 지구 — Natural and Culturo-Historical Region of Kotor
- 저장 파일명: `montenegro-kotor.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Natural and Culturo-Historical Region of Kotor. Country: Montenegro.
```

### 37. 산마리노 · San Marino (SM)

- 작업 유형: 신규 국가 그림
- 장면: 산마리노 구시가지와 티타노산 — San Marino Historic Centre and Mount Titano
- 저장 파일명: `san-marino-mount-titano.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: San Marino Historic Centre and Mount Titano. Country: San Marino.
```

### 38. 슬로바키아 · Slovakia (SK)

- 작업 유형: 신규 국가 그림
- 장면: 스피시성의 역사 유적 — Levoča, Spišský Hrad and the Associated Cultural Monuments
- 저장 파일명: `slovakia-spis-castle.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Levoča, Spišský Hrad and the Associated Cultural Monuments. Country: Slovakia.
```

### 39. 슬로베니아 · Slovenia (SI)

- 작업 유형: 신규 국가 그림
- 장면: 슈코치안 동굴 — Škocjan Caves
- 저장 파일명: `slovenia-skocjan-caves.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Škocjan Caves. Country: Slovenia.
```

### 40. 바티칸 · Vatican City (VA)

- 작업 유형: 신규 국가 그림
- 장면: 바티칸시국 — Vatican City
- 저장 파일명: `vatican-city.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Vatican City. Country: Vatican City.
```

### 41. 세인트키츠 네비스 · Saint Kitts and Nevis (KN)

- 작업 유형: 신규 국가 그림
- 장면: 브림스톤힐 요새 국립공원 — Brimstone Hill Fortress National Park
- 저장 파일명: `saint-kitts-brimstone-hill.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Brimstone Hill Fortress National Park. Country: Saint Kitts and Nevis.
```

### 42. 세인트루시아 · Saint Lucia (LC)

- 작업 유형: 신규 국가 그림
- 장면: 피통의 자연 경관 — Pitons Management Area
- 저장 파일명: `saint-lucia-pitons.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Pitons Management Area. Country: Saint Lucia.
```

### 43. 세인트빈센트 그레나딘 · Saint Vincent and the Grenadines (VC)

- 작업 유형: 신규 국가 그림
- 장면: 킹스타운와 주변 풍경 — Kingstown and its surroundings
- 저장 파일명: `saint-vincent-grenadines-kingstown.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Kingstown and its surroundings. Country: Saint Vincent and the Grenadines.
```

### 44. 세이셸 · Seychelles (SC)

- 작업 유형: 기존 0바이트 이미지 교체
- 장면: Vallée de Mai palm forest — the Vallée de Mai palm forest on Praslin, with endemic coco de mer palms arching over a shaded path
- 저장 파일명: `seychelles-vallee-de-mai.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: the Vallée de Mai palm forest on Praslin, with endemic coco de mer palms arching over a shaded path. Country: Seychelles.
```

### 45. 바하마 · Bahamas (BS)

- 작업 유형: 기존 0바이트 이미지 교체
- 장면: Dean’s Blue Hole on Long Island — Dean's Blue Hole on Long Island, a deep sapphire-blue ocean sinkhole beside pale limestone shore and turquoise shallows
- 저장 파일명: `bahamas-deans-blue-hole.webp`
- 상태: `image_pending`

```text
어린이 세계지도 앱에 들어갈 여행 엽서 일러스트 한 장. 가로 3:2 구도, 장면의 대표 랜드마크가 작은 카드에서도 즉시 알아보이도록 선명하게 배치. 사용자가 제공한 한국·중국 엽서와 같은 시각 방향: 따뜻하고 밝은 손그림 여행 그림, 수채화와 과슈의 부드러운 색면, 섬세한 색연필 질감, 햇살이 비치는 구름과 자연스러운 원근, 풍부하지만 부드러운 녹색·청록색·하늘색·따뜻한 돌색. 풍경을 사실감 있게 단순화한 고급 어린이 그림책 삽화. 랜드마크와 지형의 실제 형태를 존중하고 나라별 장면을 서로 뚜렷이 구분. 글자·문자·표지판·워터마크·테두리·국기·국장·지도·콜라주 없이 한 장면만 그릴 것.

장면: Dean's Blue Hole on Long Island, a deep sapphire-blue ocean sinkhole beside pale limestone shore and turquoise shallows. Country: Bahamas.
```

## 세션 완료 기록 양식

| 작업 순번 | 국가 코드 | 파일 생성 | 디코딩·비율 검수 | 앱 연결 | ZIP 포함 | 상태 |
|---:|---|---|---|---|---|---|
| 1–45 | 위 manifest 기준 | 미실행 | 미실행 | 미실행 | 미실행 | image_pending |

완료 수는 생성 시도 수가 아니라 **파일 생성 + 실제 파일 검수 + 앱 연결을 모두 통과한 국가 수**로 셉니다. 기존 번호와 자산 경로는 manifest 기준을 유지합니다.

## 참고 파일

- [45개국 작업 목록](world-atlas-remaining-45.md)
- [프롬프트 패키지 README](world-atlas-remaining-45-prompt-pack/README.md)
- 개별 프롬프트: `world-atlas-remaining-45-prompt-pack/prompts/`
- 파일명·상태 매니페스트: `world-atlas-remaining-45-prompt-pack/manifest.csv`
- 스타일 샘플: `world-atlas-remaining-45-prompt-pack/style-reference/`
