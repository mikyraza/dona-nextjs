#!/usr/bin/env python3
import os
import re

ORIGINAL_DIR = '/home/mikyraza/Documents/DONA MAGAZINE'
NEXTJS_DIR = '/home/mikyraza/Documents/dona-nextjs'

def split_styles(style_str):
    parts = []
    current = []
    in_paren = 0
    in_single_quote = False
    in_double_quote = False
    prev_char = ''
    for char in style_str:
        is_escaped = (prev_char == '\\')
        if char == '(' and not in_single_quote and not in_double_quote and not is_escaped:
            in_paren += 1
        elif char == ')' and not in_single_quote and not in_double_quote and not is_escaped:
            in_paren -= 1
        elif char == "'" and not in_double_quote and not is_escaped:
            in_single_quote = not in_single_quote
        elif char == '"' and not in_single_quote and not is_escaped:
            in_double_quote = not in_double_quote
        
        # Check if the semicolon is part of an HTML entity like &quot; or &apos;
        is_entity = False
        if char == ';':
            accumulated = ''.join(current)
            # Match entities like &quot; or &apos; or &amp; or &#123;
            if re.search(r'&[a-zA-Z0-9#]+$', accumulated):
                is_entity = True

        if char == ';' and in_paren == 0 and not in_single_quote and not in_double_quote and not is_entity:
            parts.append(''.join(current))
            current = []
        else:
            current.append(char)
        prev_char = char
    if current:
        parts.append(''.join(current))
    return parts

def convert_style_attr(style_str):
    # First, replace common HTML entity quotes back to normal quotes so the JS object compiles properly
    style_str = style_str.replace('&quot;', '"').replace('&apos;', "'")
    
    # Parses a style string into React style object safely
    parts = split_styles(style_str)
    rules = []
    for part in parts:
        part = part.strip()
        if not part or ':' not in part:
            continue
        key, val = part.split(':', 1)
        key = key.strip()
        val = val.strip().replace('"', '\\"')
        
        # Convert key to camelCase
        key_parts = key.split('-')
        camel_key = key_parts[0] + ''.join(x.capitalize() for x in key_parts[1:])
        rules.append(f'{camel_key}: "{val}"')
    return 'style={{' + ', '.join(rules) + '}}'



def normalize_svg_urls(html_str):
    # Find any url("...") or url('...') and normalize quotes inside
    def repl_url(match):
        url_content = match.group(1)
        # Clean entities and quotes inside url content to keep style attributes simple
        url_content = url_content.replace('&quot;', "'").replace('&apos;', "'")
        url_content = url_content.replace('"', "'").replace('\\"', "'")
        return f"url('{url_content}')"
    
    # Match url("...") or url('...')
    html_str = re.sub(r'url\("([^"]*)"\)', repl_url, html_str)
    html_str = re.sub(r"url\('([^']*)'\)", repl_url, html_str)
    # Also handle raw url(&quot;...&quot;) inside style attributes
    html_str = re.sub(r'url\(&quot;(.*?)&quot;\)', repl_url, html_str)
    html_str = re.sub(r'url\(&apos;(.*?)&apos;\)', repl_url, html_str)
    return html_str

def clean_html_to_jsx(html_content):
    # 0. Pre-normalize SVG URLs in the entire HTML content
    html_content = normalize_svg_urls(html_content)

    # 1. Extract <main> content (greedy match until the last </main> before footer)
    main_match = re.search(r'<main[^>]*>(.*)</main>\s*(?:<footer|<!-- Footer|</body>|$)', html_content, re.DOTALL)
    if main_match:
        content = main_match.group(1)
    else:
        # Fallback to body content if main is not found
        body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.DOTALL)
        if body_match:
            content = body_match.group(1)
        else:
            content = html_content

    # 2. Remove any site-header or site-footer elements from body content if they exist
    content = re.sub(r'<header className="site-header">.*?</header>', '', content, flags=re.DOTALL)
    content = re.sub(r'<header class="site-header">.*?</header>', '', content, flags=re.DOTALL)
    content = re.sub(r'<footer className="site-footer">.*?</footer>', '', content, flags=re.DOTALL)
    content = re.sub(r'<footer class="site-footer">.*?</footer>', '', content, flags=re.DOTALL)

    # 3. Strip all onerror="..." and inline event handler attributes to prevent JSX errors
    content = re.sub(r'\s+onerror="[^"]*"', '', content)
    content = re.sub(r'\s+onchange="[^"]*"', '', content)
    content = re.sub(r'\s+onsubmit="[^"]*"', '', content)
    content = re.sub(r'\s+onclick="[^"]*"', '', content)

    # 4. Wrap <style> tags content in dangerouslySetInnerHTML to prevent JSX parsing errors
    def repl_style(match):
        style_content = match.group(1)
        style_content = style_content.replace('`', '\\`').replace('$', '\\$')
        return f'<style dangerouslySetInnerHTML={{{{ __html: `{style_content}` }}}} />'
    content = re.sub(r'<style[^>]*>(.*?)</style>', repl_style, content, flags=re.DOTALL)

    # 5. Wrap <script> tags content in dangerouslySetInnerHTML to prevent JSX parsing errors
    def repl_script(match):
        script_content = match.group(1)
        script_content = script_content.replace('`', '\\`').replace('$', '\\$')
        return f'<script dangerouslySetInnerHTML={{{{ __html: `{script_content}` }}}} />'
    content = re.sub(r'<script[^>]*>(.*?)</script>', repl_script, content, flags=re.DOTALL)

    # 6. Convert class="..." to className="..."
    content = re.sub(r'class="([^"]*)"', r'className="\1"', content)

    # 7. Convert for="..." to htmlFor="..."
    content = re.sub(r'for="([^"]*)"', r'htmlFor="\1"', content)

    # 8. Convert style="..." to style={{...}}
    content = re.sub(r'style="([^"]*)"', lambda m: convert_style_attr(m.group(1)), content)

    # 9. Self-close tags: img, br, input, hr, col, source
    content = re.sub(r'<(img|br|input|hr|col|source)([^>]*?)(?<!/)>', r'<\1\2 />', content)

    # 10. Convert HTML comments to JS comments
    content = re.sub(r'<!--(.*?)-->', r'{/*\1*/}', content, flags=re.DOTALL)

    # 11. Convert links e.g. href="today.html" -> href="/today"
    def repl_href(match):
        href = match.group(1)
        if href.endswith('.html') and not href.startswith('http') and not href.startswith('//'):
            page_name = href[:-5]
            if page_name == 'index':
                return 'href="/"'
            return f'href="/{page_name}"'
        return f'href="{href}"'
        
    content = re.sub(r'href="([^"]*)"', repl_href, content)

    # 12. Replace standard anchors for internal pages with Link components
    def repl_a_tag(match):
        attrs = match.group(1)
        link_content = match.group(2)
        if 'href="/"' in attrs or 'href="/' in attrs or 'href="#' in attrs:
            return f'<Link {attrs}>{link_content}</Link>'
        return match.group(0)

    content = re.sub(r'<a([^>]*?)>(.*?)</a>', repl_a_tag, content, flags=re.DOTALL)

    # 13. Clean up SVG attribute hyphens
    svg_attr_map = {
        'stroke-width': 'strokeWidth',
        'stroke-linecap': 'strokeLinecap',
        'stroke-linejoin': 'strokeLinejoin',
        'fill-rule': 'fillRule',
        'clip-rule': 'clipRule',
        'stroke-dasharray': 'strokeDasharray',
        'stroke-dashoffset': 'strokeDashoffset',
        'stroke-miterlimit': 'strokeMiterlimit',
        'font-family': 'fontFamily',
        'font-size': 'fontSize',
        'font-weight': 'fontWeight',
        'letter-spacing': 'letterSpacing',
        'text-anchor': 'textAnchor',
    }
    for k, v in svg_attr_map.items():
        content = content.replace(f' {k}=', f' {v}=')

    # 14. Convert nested <main> or </main> inside the page content to <div> or </div>
    # to avoid having duplicate <main> tags nested inside each other.
    content = re.sub(r'<main([^>]*)>', r'<div\1>', content)
    content = content.replace('</main>', '</div>')

    return content.strip()

def migrate_file(filename):
    if not filename.endswith('.html'):
        return
    
    file_basename = filename[:-5]
    if file_basename in ['index', 'readme']:
        return # Skip index (already layout page) and readme

    original_path = os.path.join(ORIGINAL_DIR, filename)
    print(f"Migrating {filename}...")

    with open(original_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    jsx_content = clean_html_to_jsx(html_content)

    # Target directory under nextjs app/
    target_route_dir = os.path.join(NEXTJS_DIR, 'app', file_basename)
    os.makedirs(target_route_dir, exist_ok=True)

    target_page_path = os.path.join(target_route_dir, 'page.jsx')

    page_code = f"""import React from 'react';
import Link from 'next/link';

export default function Page() {{
  return (
    <main>
      {jsx_content}
    </main>
  );
}}
"""

    with open(target_page_path, 'w', encoding='utf-8') as f:
        f.write(page_code)
    
    print(f"Created page at {target_page_path}")

if __name__ == '__main__':
    # List original HTML files
    files = os.listdir(ORIGINAL_DIR)
    html_files = [f for f in files if f.endswith('.html')]
    
    for html_file in html_files:
        try:
            migrate_file(html_file)
        except Exception as e:
            print(f"Error migrating {html_file}: {e}")
