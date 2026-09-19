#!/usr/bin/env python3
"""
Script to update SVGs in frontend/public/techstack to remove black background rectangles,
making the background transparent.
"""

import os
import glob
import re

TECHSTACK_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../public/techstack'))

def remove_black_bg():
    svg_files = glob.glob(os.path.join(TECHSTACK_DIR, '*.svg'))
    modified_count = 0

    for filepath in sorted(svg_files):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove <rect ...> elements that fill with black / #0A0A0A / #000 / #000000 / black
        new_content = re.sub(
            r'\s*<rect[^>]*fill=[\"\'](?:#0A0A0A|#000000|#000|black|#0a0a0a)[\"\'][^>]*\/?>\s*',
            '\n',
            content,
            flags=re.IGNORECASE
        )

        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            modified_count += 1
            print(f"Updated {os.path.basename(filepath)} -> removed black background rect")

    print(f"\nDone! Processed {len(svg_files)} files, updated {modified_count} files.")

if __name__ == '__main__':
    remove_black_bg()
