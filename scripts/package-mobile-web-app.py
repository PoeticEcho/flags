"""Package an exact compiled web update while preserving earlier release ZIPs."""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

parser = argparse.ArgumentParser()
parser.add_argument('--source-commit', required=True)
parser.add_argument('--version', required=True, type=int)
parser.add_argument('--test-count', required=True, type=int)
parser.add_argument('--name', default='flags-mobile-update-20261002.zip')
parser.add_argument('--readme', default='artwork/mobile-web-deployment-readme.txt')
parser.add_argument('--record', default='artwork/mobile-update-client-zip.json')
parser.add_argument('--browser-qa', default='Unverified: supervised preview infrastructure unavailable.')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
assert re.fullmatch('[0-9a-f]{40}', args.source_commit)
assert subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip() == args.source_commit, 'Package immediately after pushing and building the release source.'
client = root / 'dist/client'
required = ['index.html', 'flags/gl.svg', 'flags/aq.svg',
            'data/countries-10m.json', 'data/learning-content-polar-edition.json',
            'assets/postcards/gl.webp', 'assets/postcards/aq.webp']
assert all((client / name).is_file() for name in required), 'Build the client before packaging.'
files = sorted(p for p in client.rglob('*') if p.is_file())
assert Path(args.name).name == args.name and args.name.endswith('.zip')
readme_path = (root / args.readme).resolve()
record_path = (root / args.record).resolve()
assert readme_path.is_relative_to(root) and record_path.is_relative_to(root)
readme = readme_path.read_text()
readme += f'\n출처 커밋: {args.source_commit}\n공개 버전: v{args.version}\n자동 검사: {args.test_count}개 통과\n'
target = root.parent / args.name
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for file in files:
        entry = ZipInfo(file.relative_to(client).as_posix(), date_time=(2026, 10, 2, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        entry.external_attr = 0o644 << 16
        archive.writestr(entry, file.read_bytes(), compresslevel=6)
    entry = ZipInfo('README-DEPLOY.txt', date_time=(2026, 10, 2, 0, 0, 0))
    entry.compress_type = ZIP_DEFLATED
    entry.external_attr = 0o644 << 16
    archive.writestr(entry, readme.encode())
with ZipFile(target) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(files) + 1
    for file in files:
        assert archive.read(file.relative_to(client).as_posix()) == file.read_bytes()
    assert archive.read('README-DEPLOY.txt') == readme.encode()
digest = hashlib.sha256(target.read_bytes()).hexdigest()
record = {'edition': f'v{args.version}', 'sourceCommit': args.source_commit,
          'clientZip': {'filename': target.name, 'bytes': target.stat().st_size,
                        'files': len(files) + 1, 'sha256': digest,
                        'checks': ['CRC', 'every ZIP client file matches the built client exactly']},
          'automatedTests': args.test_count,
          'browserQA': args.browser_qa}
record_path.write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps({'path': str(target), **record['clientZip']}, indent=2))
