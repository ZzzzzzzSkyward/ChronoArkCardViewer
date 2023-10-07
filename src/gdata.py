from zzz import *
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
Key, Type, Desc, Korean, English, Japanese, Chinese, ChineseTW = f'Key', 'Type', 'Desc', 'Korean', 'English', 'Japanese', 'Chinese', 'Chinese-TW [zh-tw]'
translation_path = 'LangDataDB.csv'
'''
The stored full source data
'''
# 技能
datadef = {
    'card': {
        'path': 'carddef.json',
        'fn': lambda info: 'Image_0' in info,
        'prefix': 'Skill'
    },
    'relic': {
        'path': 'relicdef.json',
        'fn': lambda info: '_gdeSchema' in info and info['_gdeSchema'] == 'Item_Passive',
        'prefix': 'Item_Passive'
    },
    'consume': {
        'path': 'consumedef.json',
        'fn': lambda info: '_gdeSchema' in info and info['_gdeSchema'] == 'Item_Consume',
        'prefix': 'Item_Consume'
    },
    'scroll': {
        'path': 'scrolldef.json',
        'fn': lambda info: '_gdeSchema' in info and info['_gdeSchema'] == 'Item_Scroll',
        'prefix': ''
    },
    'active': {
        'path': 'activedef.json',
        'fn': lambda info: '_gdeSchema' in info and info['_gdeSchema'] == 'Item_Active',
        'prefix': 'Item_Active'
    },
    'potion': {
        'path': 'potiondef.json',
        'fn': lambda info: '_gdeSchema' in info and info['_gdeSchema'] == 'Item_Potions',
        'prefix': ''
    },
    'equip': {
        'path': 'equipdef.json',
        'fn': lambda info: '_gdeSchema' in info and info['_gdeSchema'] == 'Item_Equip',
        'prefix': 'Item_Equip'
    },
}
# merge
full_path = r"D:\Steam\steamapps\workshop\content\1188930\2980869866\gdata\Replace\translation.json"
merged_path = "../scripts/carddef_merge_fixedtranslation.js"
merge_path = "../scripts/carddef_merge.js"

# target
json_store_path = "./"


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


def get_trans(defi, data, key, item, value=None):
    K = f"{defi['prefix']+'/' if defi['prefix']!='' else ''}{key}_{item.capitalize()}"
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
# ''=净化
key_to_remove = set(['S_EnchantedRing',
                     '',
                     'S_Lucy_4',
                     'S_Public_37_0',
                     'S_TutoDoll_0',
                     'S_TutoDoll_1',
                     'S_Popcongirl_Lucy', 'S_Popcongirl_Lucy_0'])


def complete_cards(d):
    for i in list(d.keys()):
        if i in key_to_remove:
            del d[i]
            continue
        info = d[i]
        # if info.get('User') == '':
        #    del d[i]
        #    continue
        if 'KeyID' in info:
            info['KeyID'] = info['KeyID'] or i
        else:
            info['KeyID'] = i
        if 'name' in info:
            del info['name']
        for k in list(info.keys()):
            if k in attr_to_remove:
                del info[k]
            elif info[k] == "null":
                info[k] = None


def main(defi):
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
        if defi['fn'](info):
            cards[i] = info
    # translate Name and Description
    for i in cards:
        info = cards[i]
        Name = info.get('Name') or info.get('name')
        Description = info['Description']
        translation_chs = get_trans(defi, t, i, 'Name', Name)
        if translation_chs:
            info['Name'] = translation_chs
        translation_chs = get_trans(defi, t, i, 'Description', Description)
        if translation_chs:
            info['Description'] = translation_chs

    # export
    clean_cards(cards)
    complete_cards(cards)
    cards_string = code.prettyjson(cards)
    file.write(os.path.join(json_store_path, defi['path']), cards_string)


false = False
true = True
image = "image"
null = None


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
                elif source_v is None:
                    pass
                else:
                    sv = source_v
                    if sv == '':
                        sv = "(empty string)"
                    elif sv == "null":
                        sv = "'null'"
                    elif isinstance(sv, str):
                        sv = f'"{sv}"'
                    print(
                        f'{target["KeyID"]}[{k}]=\n{target_v}\nbut source is\n{sv}')
                    if input("Merge?(input anything to skip)").strip() == "":
                        target[k] = source_v
        else:
            target[k] = source[k]


def merge(target, source):
    for k in source:
        if k not in target:
            target[k] = source[k]
        else:
            merge_inner(target[k], source[k])


def merge_from_translation(source=merge_path, translation=full_path):
    s = file.readstr(source)
    if source.endswith("js"):
        s = s[s.find("{"):]
        try:
            s = json.load(s)
        except BaseException:
            s = eval(s)
    else:
        s = json.loads(s)
    t = file.readstr(translation)
    t = json.loads(t)
    for i in t:
        if i not in s:
            continue
        for j in t[i]:
            if j not in s[i]:
                continue
            if t[i][j] != s[i][j]:
                print(f"{i}[{j}]=\n{s[i][j]}\ntranslation=\n{t[i][j]}")
                s[i][j] = t[i][j]
    cards_string = code.prettyjson(s)
    cards_string = "window.carddef=" + cards_string
    file.write(merged_path, cards_string)


class MergeFunctions:
    @staticmethod
    def CopyKeys(my, other):
        for i in other:
            if i not in my:
                my[i] = other[i]

    @staticmethod
    def CopyAttributes(my, other):
        for i in other:
            if i not in my:
                my[i] = other[i]
            else:
                MergeFunctions.CopyKeys(my[i], other[i])

    @staticmethod
    def CopyImage(my, other):
        for i in other:
            if 'image' not in my[i]:
                if 'image' in other[i]:
                    my[i]['image'] = other[i]['image']
                else:
                    pass
            else:
                if 'image' in other[i] and my[i]['image'] != other[i]['image']:
                    if input(
                            f"{i}=[{my[i]['image']}]<-{other[i]['image']}?(input anything to skip)").strip() == '':
                        my[i]['image'] = other[i]['image']
                else:
                    pass

    @staticmethod
    def CopyUser(my, other):
        for i in other:
            if 'User' not in my[i]:
                if 'User' in other[i]:
                    my[i]['User'] = other[i]['User']
                else:
                    pass
            else:
                if 'User' in other[i] and my[i]['User'] != other[i]['User']:
                    if input(
                            f"{i}=[{my[i]['User']}]<-{other[i]['User']}?(input anything to skip)").strip() == '':
                        my[i]['User'] = other[i]['User']
                else:
                    pass

    @staticmethod
    def CopyImageAndUser(my, other):
        MergeFunctions.CopyKeys(my, other)
        MergeFunctions.CopyImage(my, other)
        MergeFunctions.CopyUser(my, other)

    @staticmethod
    def CleanUrl(my, other=None):
        for i in my:
            im = my[i]
            if 'image' in im:
                img = im['image']
                im['image'] = img[img.rfind('/') + 1:]


def loadfile(path):
    if path is None:
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


def MergeWithFunction(fn, base_path, other_path, name):
    my = loadfile(base_path)
    other = loadfile(other_path)
    assert isinstance(my, dict)
    # clean_cards(my)
    # complete_cards(my)
    fn(my, other)
    my = code.prettyjson(my)
    my = f"window.{name}=" + my
    file.write(base_path, my)


def clean_merged():
    merge_string = file.readstr(merged_path)
    pos = merge_string.find('{')
    merge_string = merge_string[pos:]
    cards = eval(merge_string)
    clean_cards(cards)
    complete_cards(cards)
    cards_string = code.prettyjson(cards)
    cards_string = "window.carddef=" + cards_string
    file.write(merged_path, cards_string)


if __name__ == '__main__':
    # merge_into()
    # clean_merged()
    #main(datadef['relic'])
    # merge_from_translation()
    MergeWithFunction(
       MergeFunctions.CopyImageAndUser,
       'scripts/carddef.js',
       'scripts/carddef_merge_fixedtranslation.js',
          'carddef')
    #MergeWithFunction(
    #    MergeFunctions.CopyAttributes,
    #    'scripts/relicdef.js',
    #    'relicdef.json',
    #    'relicdef'
    #)
    #MergeWithFunction(
    #    MergeFunctions.CleanUrl,
    #    'equipdef.json',
    #    None,
    #    'equipdef'
    #)
    pass
