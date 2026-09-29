#!/usr/bin/env python3
# Insert the careers proxy block into the vellmontservices.com site block,
# immediately before its SPA fallback `handle {`. Idempotent.
import re, sys, shutil, datetime, pathlib
p = pathlib.Path('/etc/caddy/Caddyfile')
s = p.read_text()
if '@careers' in s:
    print('already patched'); sys.exit(0)
start = s.index('vellmontservices.com {')
end = s.index('\n}', start)
block = s[start:end]
marker = '\n    handle {\n        try_files {path} /index.html'
assert marker in block, 'SPA fallback handle not found'
insert = '''
    # Careers: application intake API + private review dashboard (Node service
    # in Docker on 127.0.0.1:4010). Must come BEFORE the SPA fallback.
    @careers path /api/careers/* /careers/review /careers/review/*
    handle @careers {
        request_body {
            max_size 6MB
        }
        reverse_proxy 127.0.0.1:4010
    }
'''
new_block = block.replace(marker, insert + marker, 1)
bak = pathlib.Path.home() / 'caddy-backups' / ('Caddyfile.bak.' + datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
bak.parent.mkdir(exist_ok=True)
shutil.copy2(p, bak)
p.write_text(s[:start] + new_block + s[end:])
print('patched; backup at', bak)
