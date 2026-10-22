#!/usr/bin/env python3
"""Package up to 50 reviewed guide postcards with the user's fixed filenames."""
import argparse, csv, io, json, zipfile
from pathlib import Path
from PIL import Image
ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('output', type=Path)
parser.add_argument('--codes', help='Comma-separated country codes; default: all 45')
args = parser.parse_args()
reconciliation = json.loads((ROOT/'artwork/user-backup-reconciliation.json').read_text())
wanted = set(args.codes.split(',')) if args.codes else {e['code'] for e in reconciliation['guideEntries']}
entries = sorted((e for e in reconciliation['guideEntries'] if e['code'] in wanted), key=lambda e:e['guideWorkOrder'])
if len(entries) != len(wanted) or not 1 <= len(entries) <= 50:
    raise SystemExit('Unknown, empty or excessive country selection')
exports = ROOT.parent/'postcard-generation/export'
records = []
files = []
for entry in entries:
    code = entry['code']
    if entry['status'] not in ('generated_reviewed_connected', 'reuse_approved'):
        raise SystemExit(f"{code}: not reviewed and connected")
    if not entry['appConnectionVerifiedForGuideScene']:
        raise SystemExit(f"{code}: guide scene is not connected")
    metadata_name = entry.get('guideMetadataFile', code.lower()+'.json')
    record = json.loads((ROOT/'artwork/postcards'/metadata_name).read_text())
    export_name = entry.get('guideExportFile', record.get('exportFile', code.lower()+'.webp'))
    original = exports/export_name
    with Image.open(original) as image:
        image.load()
        width, height = image.size
        if width < 1000 or width * 2 != height * 3 or image.format != 'WEBP':
            raise SystemExit(f"{code}: invalid high-quality 3:2 WebP")
    app_image = ROOT/'public'/entry['currentAppImage'].lstrip('/')
    with Image.open(app_image) as image:
        image.load()
    name = entry['guideFilename']
    if '/' in name or not name.endswith('.webp'):
        raise SystemExit(f"{code}: invalid fixed filename")
    origin = 'reused' if entry['status'] == 'reuse_approved' else 'new_generation'
    records.append({
        'code':code, 'nameKo':entry['nameKo'], 'name':entry['name'],
        'guideWorkOrder':entry['guideWorkOrder'],
        'catalogueNumber':entry['currentAppCatalogueNumber'],
        'externalCatalogueNumberFromGuide':entry.get('externalCatalogueNumberFromGuide'),
        'filename':name, 'origin':origin, 'width':width, 'height':height,
        'landmark':record['landmark'], 'landmarkKo':record['landmarkKo'],
        'appImage':entry['currentAppImage'], 'reviewNote':entry.get('reviewNote'),
        'sources':record.get('sources',[]),
        'metadataFile':f"metadata/{code.lower()}.json"
    })
    files.append((original, 'postcards/'+name, record, code))
if len({r['filename'] for r in records}) != len(records):
    raise SystemExit('Duplicate fixed filename')
manifest = {'createdAt':'2026-10-01','count':len(records),'newGenerationCount':sum(r['origin']=='new_generation' for r in records),'reusedCount':sum(r['origin']=='reused' for r in records),'countries':records,'browserCardReview':'pending: supervised preview infrastructure unavailable'}
table = io.StringIO(newline='')
columns = ['guideWorkOrder','catalogueNumber','externalCatalogueNumberFromGuide','code','nameKo','name','filename','origin','landmark','appImage','width','height']
writer = csv.DictWriter(table, fieldnames=columns, extrasaction='ignore')
writer.writeheader()
writer.writerows(records)
readme = """# 꼬마 세계 탐험대 — 45개국 가이드 엽서
국가별 독립 이미지이며 검수한 고품질 WebP 원본을 포함합니다.
postcards/에는 사용자 가이드의 고정 파일명을 그대로 사용했습니다.
manifest.json 및 manifest.csv의 guideWorkOrder는 제작 순서이고 catalogueNumber는 기존 앱 번호입니다. 서로 바꾸지 않습니다.
metadata/에는 생성 프롬프트, 사실 확인 출처와 검수 기록을 보존했습니다.
새로 만든 그림과 재사용한 그림은 origin으로 구분합니다.
그림 육안 검수와 디코딩·작업본 자산 연결을 완료했습니다. 실제 브라우저의 카드 표시·손 조작 검수는 별도 잔여 업무입니다.
이 묶음만으로 사용자 백업 87개국의 실제 이미지 파일이 앱에 들어온 것은 아닙니다.
"""
args.output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(args.output,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for original,name,record,code in files:
        archive.write(original,name)
        archive.writestr(f'metadata/{code.lower()}.json',json.dumps(record,ensure_ascii=False,indent=2)+'\n')
    archive.writestr('manifest.json',json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    archive.writestr('manifest.csv', '\ufeff'+table.getvalue())
    archive.writestr('README.md', readme)
with zipfile.ZipFile(args.output) as archive:
    if archive.testzip() is not None:
        raise SystemExit('ZIP integrity failure')
print(json.dumps({'file':str(args.output.resolve()),'countries':len(records),'bytes':args.output.stat().st_size}))
