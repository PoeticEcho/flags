"""Recreate the compiled v26 web-distribution ZIP from its unchanged client build."""
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
client = root / 'dist/client'
required = ['index.html', 'flags/gl.svg', 'flags/aq.svg',
            'data/countries-10m.json', 'data/learning-content-polar-edition.json',
            'assets/postcards/gl.webp', 'assets/postcards/aq.webp']
assert all((client / name).is_file() for name in required), 'Build the final client before packaging.'
files = sorted(p for p in client.rglob('*') if p.is_file())
readme = (root / 'artwork/final-web-deployment-readme.txt').read_bytes()
target = root.parent / 'flags-final-app-20261002.zip'
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for file in files:
        entry = ZipInfo(file.relative_to(client).as_posix(), date_time=(2026, 10, 2, 0, 0, 0))
        entry.compress_type = ZIP_DEFLATED
        entry.external_attr = 0o644 << 16
        archive.writestr(entry, file.read_bytes(), compresslevel=6)
    entry = ZipInfo('README-DEPLOY.txt', date_time=(2026, 10, 2, 0, 0, 0))
    entry.compress_type = ZIP_DEFLATED
    archive.writestr(entry, readme)
with ZipFile(target) as archive:
    assert archive.testzip() is None
    assert len(archive.namelist()) == len(files) + 1
    for file in files:
        assert archive.read(file.relative_to(client).as_posix()) == file.read_bytes()
release = json.loads((root / 'artwork/final-polar-release.json').read_text())
digest = hashlib.sha256(target.read_bytes()).hexdigest()
assert digest == release['clientZip']['sha256'], 'The client differs from the verified final release.'
print(f'{target}: {target.stat().st_size:,} bytes; {len(files)+1} files; exact final release reproduced.')
