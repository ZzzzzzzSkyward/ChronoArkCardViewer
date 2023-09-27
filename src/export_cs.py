import os
import re
import sys
from zzz import *
result = {}

path = './'
def purify(v):
    if not v:
        return None
    if v=="":
        return None
    if v[-1]=='f':
        try:
            v=float(v[:-1])
            return v
        except:
            pass
    if reg.search(v,'^[-0-9]+$'):
        try:
            return int(v)
        except:
            pass
        try:
            return float(v)
        except:
            pass
    if reg.search(v,'^[-0-9.]+$'):
        try:
            return float(v)
        except:
            pass
    if v=="true":
        return True
    if v=="false":
        return False
    return v
def main():
    for filename in os.listdir(path):
        if filename.endswith('.cs'):
            file_dict = {}
            contents=file.readstr(os.path.join(path, filename))
            matches = re.findall(r'this\.PlusStat\.([^ =]+)[ ]*=[ ]*(.+);', contents)
            for match in matches:
                key = match[0]
                value = match[1]
                value=purify(value)
                file_dict[key] = value
            matches = re.findall(r'this\.PlusPerStat\.([^ =]+)[ ]*=[ ]*(.+);', contents)
            for match in matches:
                key = match[0]
                value = match[1]
                try:
                    value=purify(value)
                except:
                    print(key,value)
                file_dict[key] = value
            result[filename[:-3]] = file_dict
    file.write("exp.json",code.prettyjson(result))
    file.write("equipstat.js","window.equip_stat="+code.prettyjson(result))
if __name__=='__main__':
    main()