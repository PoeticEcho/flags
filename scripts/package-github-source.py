"""Package tracked app source and assets without dependencies or build output."""
import argparse
import hashlib
import subprocess
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
target = Path(args.output).resolve()
assert not target.is_relative_to(root), 'Write the ZIP outside the source checkout.'
paths = subprocess.check_output(['git', 'ls-files', '-z'], cwd=root).decode().split('\0')
excluded = {'.git', 'node_modules', 'dist', '.sites-runtime', '.sites-checkout', '.agents', '.codex', '__pycache__'}
files = []
for name in paths:
    if not name:
        continue
    relative = Path(name)
    if any(part in excluded or part.startswith('.sites-checkout-') for part in relative.parts):
        continue
    if relative.name.startswith('.env') and relative.name != '.env.example':
        continue
    # Historical UI screenshots are review evidence, not application assets.
    if relative.parts[0] == 'artwork' and relative.suffix.lower() in {'.png', '.jpg', '.jpeg'}:
        continue
    file = root / relative
    if file.is_file():
        files.append(file)
required = {'package.json', 'package-lock.json', 'README.md', 'src/FlagStudio.jsx', 'src/country-names.js'}
assert required <= {str(file.relative_to(root)) for file in files}
target.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(target, 'w', compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for file in sorted(files):
        archive.write(file, file.relative_to(root).as_posix())
with ZipFile(target) as archive:
    assert archive.testzip() is None
    for file in files:
        assert archive.read(file.relative_to(root).as_posix()) == file.read_bytes()
print(f'{target}: {len(files)} files, {target.stat().st_size} bytes, sha256={hashlib.sha256(target.read_bytes()).hexdigest()}')
