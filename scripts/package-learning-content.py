"""Create the complete bilingual education backup; Python standard library only."""
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
data = root / 'public' / 'data'
pack = json.loads((data / 'learning-content.json').read_text(encoding='utf-8'))
assert len(pack['countries']) == 197
assert pack['storyCountPerCountry'] == 5
assert all(len(c['facts']) == 5 for c in pack['countries'])
assert sum(len(c['facts']) for c in pack['countries']) == 985
assert pack['additionalStoryCount'] == 394
assert sum(len(c['keywords']) for c in pack['countries']) == 1970

def markdown(lang):
    title = '197개국 교육 콘텐츠' if lang == 'ko' else '197-country learning content'
    lines = [f'# {title}', '', f"Edition: {pack['edition']}", '']
    for country in pack['countries']:
        name = country['nameKo'] if lang == 'ko' else country['name']
        capital = country['capitalKo'] if lang == 'ko' else country['capital']
        lines += [f"## {name} · {country['code']}", '', f"{'수도·정부 소재지' if lang == 'ko' else 'Capital / seat'}: {capital}", '']
        note = country.get('capitalNote')
        if note and note.get(lang):
            lines += [note[lang], '']
        for i, fact in enumerate(country['facts'], 1):
            lines += [f"{i}. {fact[lang]}", '']
        lines += [f"{'탐험 키워드' if lang == 'ko' else 'Explorer words'}: " + ' · '.join(w[lang] for w in country['keywords']), '']
        lines += [f"{'엽서 장면' if lang == 'ko' else 'Postcard scene'}: {country['postcard'][lang]}", '']
        lines += [f"{'출처' if lang == 'ko' else 'Sources'}:", '']
        lines += ['- ' + url for url in country['sources']] + ['']
    return '\n'.join(lines).encode('utf-8')

files = {
    'learning-content.json': (data / 'learning-content.json').read_bytes(),
    'learning-content.ko.md': markdown('ko'),
    'learning-content.en.md': markdown('en'),
    'learning-enrichment-sources.json': (data / 'learning-enrichment-sources.json').read_bytes(),
    'learning-story-expansion-sources.json': (data / 'learning-story-expansion-sources.json').read_bytes(),
    'source-notices.txt': (data / 'learning-content-notice.txt').read_bytes(),
    'README.md': ('# Flags · 197-country education content\n\n'
        '197개국 · 나라별 5편 · 한영 이야기 985쌍 · 한영 탐험 키워드 1,970쌍.\n\n'
        '한글/영문 Markdown은 읽기·편집용이며 JSON은 앱 연동용입니다. '
        '이 묶음은 교육 텍스트 백업이며 실행 앱과 엽서 이미지 파일은 포함하지 않습니다.\n\n'
        '이전 교육판의 첫 세 이야기 591쌍과 키워드를 그대로 보존하고, 모든 나라에 '
        '한영 두 편씩 394쌍을 추가했습니다. 새 문단에는 자연·문화·역사·과학의 '
        '사실 설명과 비교·관찰·모형 만들기 활동이 포함됩니다. '
        '원출처의 사실과 직접 작성한 학습 활동을 구분하며, 이번 확장은 전체 수도 좌표의 '
        '독립적인 정밀 검수를 뜻하지 않습니다.\n\n'
        '출처·검토 범위·라이선스는 learning-story-expansion-sources.json, '
        '이전 보강 기록 learning-enrichment-sources.json과 '
        'source-notices.txt를 확인하세요.\n').encode('utf-8')
}
target = data / 'flags-197-learning-content-5stories-20261002.zip'
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for name, contents in files.items():
        entry = ZipInfo(name, date_time=(2026, 10, 2, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        entry.external_attr = 0o644 << 16
        archive.writestr(entry, contents, compresslevel=9)
with ZipFile(target) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == 7
    countries = json.loads(archive.read('learning-content.json'))['countries']
    assert len(countries) == len({c['code'] for c in countries}) == 197
    assert sum(len(c['facts']) for c in countries) == 985
    for lang in ['ko', 'en']:
        text = archive.read(f'learning-content.{lang}.md').decode('utf-8')
        for country in countries:
            assert all(fact[lang] in text for fact in country['facts'])
print(f'{target.name}: {target.stat().st_size:,} bytes; 7 files; CRC and all 985 bilingual stories verified.')
