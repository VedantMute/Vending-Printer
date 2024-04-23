import os
import win32print # pip install win32printing
import win32api # pip install win-api

currentprinter = win32print.GetDefaultPrinter()
print(currentprinter)
gspath = r"E:\gs10.03.0\bin\gswin64.exe"
gsp_path = r"E:\gsview5-win64\gsview\gsprint.exe"

for i in os.listdir(r"E:\rpay\uploads"):
    print(i)
    path = r"E:\rpay\uploads"+"\%s"%(i)
    win32api.ShellExecute(0, 'open', gsp_path, '-ghostscript "'+gspath+'" -printer "'+currentprinter+'" "%s"'%(path), '.', 0)


