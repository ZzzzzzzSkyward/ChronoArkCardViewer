from zzz import *
import json
import os
base_path = file.d(
    r'D:\Steam\steamapps\common\Chrono Ark\ChronoArk_Data\StreamingAssets')
'''
gdata.json contains the info of cards
{
    "card_id"={card_def}
}
card_id is a string like S_Card0_0
card_def is an object with key-value pairs
card_def specifies the card's information
'''
gdata_path = 'gdata.json'
'''
LangDataDB.csv contains the Chinese translation of a card's name and description.
It has columns Key,Type,Desc,Korean,English,Japanese,Chinese,Chinese-TW [zh-tw]
For example, Skill/S_LBossFirst_LucySwordremove_Name,Text,,환영검 부수기,Destroy Illusion Sword,幻影の刃破り,摧毁幻影剑,摧毀幻影劍
Only Chinese is needed here.
The Key starts with Skill/, and then is succeeded by the card_id.
'''
bom = '\ufeff'
Key, Type, Desc, Korean, English, Japanese, Chinese, ChineseTW = f'{bom}Key', 'Type', 'Desc', 'Korean', 'English', 'Japanese', 'Chinese', 'Chinese-TW [zh-tw]'
translation_path = 'LangDataDB.csv'
'''
The stored full source data
'''
full_path = 'carddef.json'


def require():
    try:
        import rich
        from rich.traceback import install
        install()
        global pretty_error
        pretty_error = True
    except BaseException as e:
        pass


require()


def get_trans(data, key, item, value=None):
    K = f"Skill/{key}_{item.capitalize()}"
    if K in data:
        return data[K][Chinese]
    for k in data:
        d = data[k]
        if d[Korean] == value:
            data[K] = d
            return d[Chinese]
    return None


def clean_cards(d):
    for i in list(d.keys()):
        if i.find('_gde') == 0:
            del d[i]
            continue
        info = d[i]
        for k in list(info.keys()):
            if k.find('_gde') == 0:
                del info[k]


attr_to_remove = set(['Image_1', 'Image_2', 'Particle', 'SubParticle'])


def complete_cards(d):
    for i in list(d.keys()):
        info = d[i]
        info['KeyID'] = info['KeyID'] or i
        for k in list(info.keys()):
            if k in attr_to_remove:
                del info[k]
            elif info[k] == "null":
                info[k] = None


def main():
    # load data
    data = json.loads(file.readstr(os.path.join(base_path, gdata_path)))
    # load csv
    translation = code.csv(os.path.join(base_path, translation_path))
    t = {i[Key]: i for i in translation}
    # get all cards out of data
    # only those containing Image_0 is needed
    cards = {}
    for i in data:
        info = data[i]
        if 'Image_0' in info:
            cards[i] = info
    # translate Name and Description
    for i in cards:
        info = cards[i]
        Name = info['Name']
        Description = info['Description']
        translation_chs = get_trans(t, i, 'Name', Name)
        if translation_chs:
            info['Name'] = translation_chs
        translation_chs = get_trans(t, i, 'Description', Description)
        if translation_chs:
            info['Description'] = translation_chs

    # export
    clean_cards(cards)
    complete_cards(cards)
    cards_string = code.prettyjson(cards)
    file.write(full_path, cards_string)


merge_path = 'scripts/carddef.js'


false = False
true = True
image = "image"


def merge_inner(target, source):
    keys = set(target.keys()).union(set(source.keys()))
    for k in keys:
        if k in target:
            target_v = target[k]
            source_v = source[k] if k in source else None
            if target_v is None:
                target[k] = source_v
            else:
                if target_v == source_v:
                    pass
                else:
                    print(
                        f'{target["KeyID"]}[{k}]={target_v}, but source is {source_v}')
                    if input("Merge?(input anything)").strip() != "":
                        target[k] = source_v
        else:
            target[k] = source[k]


def merge(target, source):
    for k in source:
        if k not in target:
            target[k] = source[k]
        else:
            merge_inner(target[k], source[k])


def merge_into():
    merge_string = file.readstr(merge_path)
    source_data = json.loads(file.readstr(full_path))
    pos = merge_string.find('{')
    merge_string = merge_string[pos:]
    cards = eval(merge_string)
    merge(cards, source_data)
    clean_cards(cards)
    complete_cards(cards)
    cards_string = code.prettyjson(cards)
    file.write("carddef.json", cards_string)


if __name__ == '__main__':
    merge_into()
