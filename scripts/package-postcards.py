"""Package one completed range of the stable 197-country postcard catalog."""
import csv
import io
import json
import sys
import zipfile
from pathlib import Path

project = Path(__file__).resolve().parents[1]
workspace = project.parent
queue = json.loads((workspace / 'postcard-generation/queue.json').read_text())
catalog = queue['existing'] + queue['missing']
start, end = map(int, sys.argv[1:3])
if not (1 <= start <= end <= 197 and end-start < 50):
    raise ValueError('Choose a valid completed range of at most 50 postcards')
assets = json.loads((project / 'src/postcard-assets.json').read_text())
selected = [row for row in catalog if start <= row['number'] <= end]
output = workspace / f'country-postcards-{start:03}-{end:03}-20261001.zip'
records = []
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
    for row in selected:
        code = row['code']
        entry = assets.get(code) or row
        image = entry.get('image')
        if not image:
            raise ValueError(f'Country {code} is not completed')
        full = workspace / 'postcard-generation/export' / f'{code.lower()}.webp'
        if code in assets and not full.exists():
            raise FileNotFoundError(f'Restore the full-size export for {code} from its saved postcard ZIP before packaging')
        source = full if code in assets else project / 'public' / image.lstrip('/')
        if not source.exists():
            raise FileNotFoundError(source)
        filename = f"images/{row['number']:03}-{code.lower()}.webp"
        bundle.write(source, filename)
        record = {key: row[key] for key in ['number', 'code', 'name', 'nameKo']}
        record.update(file=filename, landmark=entry['landmark'], landmarkKo=entry['landmarkKo'],
                      origin='new generation' if code in assets else 'existing app asset')
        metadata = project / 'artwork/postcards' / f'{code.lower()}.json'
        if metadata.exists():
            info = json.loads(metadata.read_text())
            record.update(width=info['width'], height=info['height'])
            bundle.write(metadata, f"generation/{code.lower()}.json")
        records.append(record)
    table = io.StringIO()
    writer = csv.DictWriter(table, fieldnames=['number','code','nameKo','name','landmarkKo','landmark','file','origin'])
    writer.writeheader()
    writer.writerows({k:r[k] for k in writer.fieldnames} for r in records)
    bundle.writestr('country-index.csv', '\ufeff'+table.getvalue())
    bundle.writestr('manifest.json', json.dumps(records, ensure_ascii=False, indent=2))
    bundle.writestr('README.txt', f'''나라별 포스트카드 에셋 {start:03}–{end:03} / 197

이 묶음에는 실제 완성된 {len(records)}개국의 그림만 들어 있습니다.
images/: 원래 크기를 유지한 고품질 WebP. 새 생성본은 품질 94,
기존 앱 에셋 40개는 현재 파일을 그대로 보존했습니다.
country-index.csv / manifest.json: 국가 코드와 한글·영문 장면명.
generation/: 새 이미지의 최종 프롬프트, 사실 참고 출처, 검수 기록.

모든 그림은 어린이 학습용 삽화이며 실제 사진이나 정밀 건축 도면이 아닙니다.
새 그림은 내장 이미지 생성으로 제작했습니다. 국기 그림은 포함하지 않습니다.
국가별 텍스트 설명과 맞는 유적·자연·수도 풍경을 사용했습니다.

번호 001–040은 이번 작업 시작 시 확보된 기존 40개국입니다.
번호 041–197은 누락 국가를 영문 나라명순으로 추가한 고정 목록입니다.
같은 ISO 코드를 가진 나라가 다른 묶음에 중복되지 않습니다.
''')
with zipfile.ZipFile(output) as bundle:
    assert bundle.testzip() is None
    assert len([name for name in bundle.namelist() if name.startswith('images/')]) == len(selected)
print(json.dumps({'path':str(output),'countries':len(records),'bytes':output.stat().st_size}))
