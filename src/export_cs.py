import os
import re
import sys
from zzz import *
import gdata
result = {}

Root = 'Z:/Assembly-CSharp/'
datadef = {
    'equip': {
        'path': 'equipstat.json',
        'src': 'scripts/equipdef.js',
        'dir': 'EItem/',
        'key': 'Equip_Script'
    },
    'relic': {
        'path': 'relicstat.json',
        'src': 'scripts/relicdef.js',
        'key': 'KeyID',
        'dir': 'PItem/'
    }
}


def loadfile(path):
    if path is None:
        return None
    if not os.path.exists(path):
        print(f"{path} not exist, return None")
        return None
    s = file.readstr(path)
    if path.endswith('json'):
        return json.loads(s)
    if path.endswith('js'):
        pos = s.find('{')
        s = s[pos:]
        try:
            return json.loads(s)
        except BaseException:
            pass
        try:
            return eval(s)
        except BaseException:
            pass
    return s


def purify(v):
    if not v:
        return None
    if v == "":
        return None
    if v[-1] == 'f':
        try:
            v = float(v[:-1])
            return v
        except BaseException:
            pass
    if reg.search(v, '^[-0-9]+$'):
        try:
            return int(v)
        except BaseException:
            pass
        try:
            return float(v)
        except BaseException:
            pass
    if reg.search(v, '^[-0-9.]+$'):
        try:
            return float(v)
        except BaseException:
            pass
    if v == "true":
        return True
    if v == "false":
        return False
    return v


def GetStatFromString(s):
    file_dict = {}
    matches = re.findall(
        r'this\.PlusStat\.([^ =]+)[ ]*=[ ]*(.+);', s)
    for match in matches:
        key = match[0]
        value = match[1]
        value = purify(value)
        file_dict[key] = value
    matches = re.findall(
        r'this\.PlusPerStat\.([^ =]+)[ ]*=[ ]*(.+);', s)
    for match in matches:
        key = match[0]
        value = match[1]
        try:
            value = purify(value)
        except BaseException:
            print(key, value)
        file_dict[key] = value
    return file_dict


def GetStatFromDef(defi, attr):
    name = attr[defi['key']] + ".cs"
    cs_file_path = os.path.join(Root, defi['dir'], name)
    if not os.path.exists(cs_file_path):
        print(f"Not exist {name} as '{cs_file_path}'")
        return
    try:
        stat = GetStatFromString(loadfile(cs_file_path))
    except BaseException:
        print(f"Cannot read {Root}")
        return
    if len(list(stat.keys())) == 0:
        return
    return stat


def ProcessDefi(defi):
    lookup = loadfile(defi['src'])
    original = loadfile(defi['path'])
    assert lookup is not None
    fn = gdata.MergeFunctions.CopyAttributesWithCompare
    if not original:
        original = {}
    for i in lookup:
        attr = lookup[i]
        stat = GetStatFromDef(defi, attr)
        if stat:
            if i not in original:
                original[i] = stat
            else:
                fn(original[i], stat)
    s = code.prettyjson(original)
    file.write(defi['path'], s)


if __name__ == '__main__':
    ProcessDefi(datadef['relic'])
