#!/usr/bin/env python3
"""Чинит битый onclick у кнопки отправки квиза (одна строка, остальное не трогает).

    python3 fix-form-onclick.py index.html
    python3 fix-form-onclick.py /path/to/repo/index.html --backup

Лечит опечатки вида onclick="quizSubmit>()" и onclick="quizSubmit()>" -> onclick="quizSubmit()"
"""
import sys, re, shutil

path = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
backup = '--backup' in sys.argv

s = open(path, encoding='utf-8').read()
orig = s

def fix(m):
    return m.group(0).replace('quizSubmit>()', 'quizSubmit()').replace('quizSubmit()>', 'quizSubmit()')

s = re.sub(r'<button[^>]*id="quizSubmitBtn"[^>]*>[^<]*</button>', fix, s, count=1)

if backup and s != orig:
    shutil.copy2(path, path + '.bak')
open(path, 'w', encoding='utf-8').write(s)

bad = [o for o in re.findall(r'onclick="([^"]*)"', s) if not re.fullmatch(r'[A-Za-z_$][\w$]*\([^()"]*\)', o.strip())]
print(('ИЗМЕНЕНО → ' if s != orig else 'Изменять нечего, файл уже корректен → ') + path)
print('onclick в кнопке:', re.findall(r'onclick="([^"]*quizSubmit[^"]*)"', s))
print('битых onclick осталось:', bad if bad else 'нет')
