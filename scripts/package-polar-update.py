"""Package the complete education edition and two original polar postcards."""
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
data = root / 'public/data'
originals = root.parent / 'polar-postcard-generation'
pack = json.loads((data / 'learning-content-polar-edition.json').read_text())
places = pack['countries'] + pack['additionalDestinations']
assert len(pack['countries']) == 197 and len(places) == 199
assert sum(len(p['facts']) for p in places) == 995
assert sum(len(p['keywords']) for p in places) == 1990

def original_bytes(name):
    source = originals / name
    if source.exists():
        return source.read_bytes()
    # The committed release preserves originals when opening a fresh checkout.
    with ZipFile(data / 'flags-final-learning-update-20261002.zip') as archive:
        return archive.read('postcards/' + name)

def markdown(lang):
    ko = lang == 'ko'
    lines = ['# ' + ('세계 탐험 최종 교육판 · 199곳' if ko else 'World explorer final learning edition · 199 places'), '',
             '197개국 + 그린란드 자치 지역 + 남극 대륙' if ko else '197 countries + Greenland territory + Antarctica continent', '']
    for place in places:
        name = place['nameKo'] if ko else place['name']
        capital = (place['capitalKo'] if ko else place['capital']) or ('없음' if ko else 'None')
        lines += [f"## {name} · {place['code']}", '', f"{'수도·정부 소재지' if ko else 'Capital / seat'}: {capital}", '']
        if place.get('kindLabel'):
            lines += [place['kindLabel'][lang], '']
        if (place.get('capitalNote') or {}).get(lang):
            lines += [place['capitalNote'][lang], '']
        for i, fact in enumerate(place['facts'], 1):
            lines += [f"{i}. {fact[lang]}", '']
        lines += [('탐험 키워드: ' if ko else 'Explorer words: ') + ' · '.join(w[lang] for w in place['keywords']), '',
                  ('엽서 장면: ' if ko else 'Postcard scene: ') + place['postcard'][lang], '',
                  '출처:' if ko else 'Sources:', '']
        lines += ['- ' + url for url in place['sources']] + ['']
    return '\n'.join(lines).encode('utf-8')

files = {
    'learning-content.json': (data / 'learning-content-polar-edition.json').read_bytes(),
    'learning-content.ko.md': markdown('ko'),
    'learning-content.en.md': markdown('en'),
    'polar-destinations.json': (data / 'polar-destinations.json').read_bytes(),
    'antarctica-quiz.json': (data / 'antarctica-quiz.json').read_bytes(),
    'learning-enrichment-sources.json': (data / 'learning-enrichment-sources.json').read_bytes(),
    'learning-story-expansion-sources.json': (data / 'learning-story-expansion-sources.json').read_bytes(),
    'source-notices.txt': (data / 'learning-content-notice.txt').read_bytes(),
    'polar-learning-notice.txt': (data / 'polar-learning-notice.txt').read_bytes(),
    'postcard-prompts.json': (root / 'artwork/polar-postcard-prompts.json').read_bytes(),
    'postcard-provenance.json': (root / 'artwork/polar-postcards.json').read_bytes(),
    'README.md': ('# Flags · Final learning update\n\n'
        '197개국 + 그린란드(GL) + 남극(AQ), 총 199곳. 장소별 한영 이야기 5편, '
        '총 995쌍과 키워드 1,990쌍. 기존 197개국 원고와 기존 ZIP은 그대로 보존했습니다.\n\n'
        '이 ZIP은 교육 원고와 신규 극지 이미지 묶음입니다. 실행 앱은 포함하지 않습니다. '
        'JSON의 countries에는 기존 197개국, additionalDestinations에는 추가 두 지역이 들어 있습니다. '
        '그린란드는 덴마크 왕국의 자치 지역이며 수도는 누크입니다. '
        '남극은 수도가 없는 대륙이며 지도 핀은 세종과학기지입니다.\n\n'
        '그린란드 퀴즈는 누크를 정답으로 같은 북아메리카 대륙의 실제 수도 두 곳을 섞는 앱 기능입니다. '
        '남극 퀴즈는 antarctica-quiz.json의 한영 과학·자연 문제 5종입니다.\n\n'
        'postcards/에는 built-in image_gen으로 제작한 1536×1024 PNG 원본 두 장, '
        'web/에는 앱용 큰 WebP와 미리보기, flags/에는 제공하신 PNG 세 장과 색칠용 SVG 두 장이 있습니다. '
        '남극 그림은 비공식 상징과 남극조약 표장으로 구분하며 공식 국가 국기로 표시하지 않습니다. '
        '정확한 프롬프트·검수 범위·출처는 동봉 JSON과 notices에 있습니다. '
        '그림은 수채화 교육 삽화이며 실제 사진이나 정확한 현장 실측도가 아닙니다.\n\n'
        '앱: https://flags.zap15.chatgpt.site\n').encode('utf-8'),
}
for name in ['greenland-ilulissat-icefjord.png', 'antarctica-peninsula-gentoo.png']:
    files['postcards/' + name] = original_bytes(name)
for name in ['gl-user.png', 'aq-proposal-user.png', 'aq-treaty-user.png']:
    files['flags/' + name] = (root / 'public/assets/polar-flags' / name).read_bytes()
for code in ['gl', 'aq']:
    files[f'flags/{code}.svg'] = (root / f'public/flags/{code}.svg').read_bytes()
    files[f'web/{code}.webp'] = (root / f'public/assets/postcards/{code}.webp').read_bytes()
    files[f'web/{code}-preview.webp'] = (root / f'public/assets/postcards/preview/{code}.webp').read_bytes()
target = data / 'flags-final-learning-update-20261002.zip'
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for name, contents in files.items():
        entry = ZipInfo(name, date_time=(2026, 10, 2, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        entry.external_attr = 0o644 << 16
        archive.writestr(entry, contents, compresslevel=9)
with ZipFile(target) as archive:
    assert archive.testzip() is None
    checked = json.loads(archive.read('learning-content.json'))
    assert checked == pack
    for lang in ['ko', 'en']:
        text = archive.read(f'learning-content.{lang}.md').decode('utf-8')
        assert all(fact[lang] in text for place in places for fact in place['facts'])
print(f'{target.name}: {target.stat().st_size:,} bytes; {len(files)} files; CRC and 995 bilingual stories verified.')
