import os
import zipfile
import fnmatch


def is_ignored(file, ignore_patterns):
    for pattern in ignore_patterns:
        if file.find(pattern)>=0:
            return True
    return False


def pack_folder(folder_path, zip_path, ignore_patterns):
    ignored_files = set()
    for root, dirs, files in os.walk(folder_path):
        if is_ignored(root, ignore_patterns):
            continue
        for file in files:
            if is_ignored(file, ignore_patterns):
                ignored_files.add(os.path.join(root, file))
                continue
            file_path = os.path.join(root, file)
            arcname = os.path.relpath(file_path, folder_path)
            zip_file = zipfile.ZipFile(zip_path, 'a', zipfile.ZIP_DEFLATED)
            zip_file.write(file_path, arcname)
            zip_file.close()


# 示例用法
ignore_patterns = ['images_raw', '.gitignore', 'src', '.git']
folder_path = './'
zip_path = 'z:/网页版卡牌浏览器[v2.0beta]（未完成）.zip'
packed_files = pack_folder(folder_path, zip_path, ignore_patterns)
