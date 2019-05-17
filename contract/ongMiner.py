from boa.interop.System.Storage import GetContext, Get, Put,Delete
from ontology.libont import *
from boa.interop.System.ExecutionEngine import GetScriptContainer, GetCallingScriptHash, GetEntryScriptHash, \
    GetExecutingScriptHash
from boa.interop.System.Transaction import GetTransactionHash
from boa.interop.System.Blockchain import GetHeight
from boa.interop.System.Runtime import GetTime, Serialize,Deserialize,Notify, CheckWitness
from boa.interop.Ontology.Runtime import GetCurrentBlockHash,AddressToBase58,Base58ToAddress
from boa.builtins import ToScriptHash
from boa.interop.Ontology.Native import Invoke

ADDR_USERID_PRE = bytearray(b'\x01')
INDEX_USER_PRE=bytearray(b'\x02')
INDEX_BLOCK_PRE=bytearray(b'\x03')
UIDKEY_STATE_PRE=bytearray(b'\x04')
USER_INDEX_KEY =bytearray(b'\x4b\x01')
BLOCK_INDEX_KEY=bytearray(b'\x4b\x02')
BLOCK_BONUS_KEY=bytearray(b'\x4b\x03')
BLOCK_RATE_KEY=bytearray(b'\x4b\x04')

BLOCK_TYPE_MINE  = 0
BLOCK_TYPE_OUT   = 1
ONG_DECIMAL = 1000000000

SELF_CONTRACT = GetExecutingScriptHash()
ONT_CONTRACT = bytearray(b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01')
ONG_CONTRACT = bytearray(b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02')
BUILDER_ADDRESS  = bytearray(b'\x22\xeb\xf7\x30\xbd\x97\x16\x36\x02\x79\x8c\xaf\x2a\x42\x92\x91\x60\x8a\xd6\x05')

def Main(operation, args):
    if operation == 'getUser':
        return getUser(args[0])
    if operation == 'getUserNumber':
        return getUserNumber()
    if operation == 'getBlockNumber':
        return getBlockNumber()
    if operation == 'getBlock':
        return getBlock(args[0])
    if operation == 'getBlocks':
        return getBlocks(args[0],args[1])
    if operation == 'getContractBalance':
        return getContractBalance()

    if operation =='mine':
        return mine(args[0],args[1])

    if operation =='init':
        return init(args[0])
    if operation =='start':
        return start(args[0])
    if operation =='setBonus':
        return setBonus(args[0],args[1])
    if operation =='setRate':
        return setRate(args[0],args[1],args[2])
    if operation =='withdraw':
        return withdraw(args[0],args[1])
    if operation =='deposit':
        return deposit(args[0],args[1])
    return False

def init(addr):
    if not _isBuilder(addr):
        return False
    
    saveUserIdIndex(0)
    saveBlockIndex(0)
    saveBlockBonus(100*ONG_DECIMAL)
    saveBlockRate(Rate(1000,9999))
    return True

def start(addr):
    if not _isBuilder(addr):
        return False
    _newBlock()
    return True

def setRate(addr,min,max):
    if not _isBuilder(addr):
        return False
    
    saveBlockRate(Rate(min,max))

def setBonus(addr,bon):
    if not _isBuilder(addr):
        return False
    saveBlockBonus(bon)
    return bon

def deposit(addr,amount):
    if not _isBuilder(addr):
        return False
    if not transferONG(addr,SELF_CONTRACT,amount):
        return Error('deposit failed')
    return Success(sstr(amount))

def withdraw(addr,amount):
    if not _isBuilder(addr):
        return False
    if not transferONG(SELF_CONTRACT,addr,amount):
        return Error('withdraw failed')
    return Success(sstr(amount))


def getUser(addr):
    uid=addrToUserId(addr)
    if uid is None:
        return False
    user=indexToUser(uid)
    return UserStr(user)

def getUserNumber():
    return sstr(userIdIndex())

def getBlockNumber():
    return sstr(blockIndex())

def getBlock(id):
    b=indexToBlock(id)
    return BlockStr(b)
    
def getBlocks(start,end): 
    blocks=[]
    for i in range(start,end+1):
        bs=getBlock(i)
        blocks.append(bs)
    return arrStr(blocks)


def getContractBalance():
    param = state(SELF_CONTRACT)
    res = Invoke(0, ONG_CONTRACT, 'balanceOf', param)
    return sstr(res)


#=====================================

def _regis(addr):
    uIndex=userIdIndex()
    uIndex+=1
    addr58=AddressToBase58(addr)
    user=User(0,'',[],0,addr58)
    
    saveUserIdIndex(uIndex)
    saveIndexToUser(uIndex,user)
    saveAddrToUserId(addr,uIndex)
    return uIndex

def _newBlock():
    bH=blockIndex()
    
    if bH>0:
        pB=indexToBlock(bH)
        preHash=pB['hash']
        hash=nextHash(preHash)
    else:
        hash=nextHash(0)
        preHash=hash
    bH+=1
    key=getBlockKey(0,0,False,bH)
    bonus=blockBonus()
    b=Block(bH,hash,preHash,key,BLOCK_TYPE_MINE,bonus,'',GetTime())
    saveBlockIndex(bH)
    saveIndexToBlock(bH,b)
    return bH


def mine(addr,uni):
    if not CheckWitness(addr): 
        return Error('auth failed')
    uid=addrToUserId(addr)
    if uid is None:
        uid=_regis(addr)
    u=indexToUser(uid)
    bH=blockIndex()
    if bH==0:
        return Error('not start')
    b=indexToBlock(bH)
    if b['type'] == BLOCK_TYPE_OUT:
        return Error('block is out')
    key=getBlockKey(uid,bH,uni,bH)
    saveUidBidKeyToMineState(uid,bH,key,True)
    isKey=key==b['key']

    if isKey:
        _newBlock()
        b['miner']=u['addr']
        b['type']=BLOCK_TYPE_OUT
        if transferONG(SELF_CONTRACT,addr,b['bonus']):
            u['bonus']+=b['bonus']
            u['bids'].append(sstr(bH))
        saveIndexToBlock(bH,b)
    pm=concat(sstr(bH),concat('#',concat(sstr(key),concat('#',sstr(isKey)))))
    u['mt']+=1
    u['pm']=pm
    saveIndexToUser(uid,u)
    return Success(pm)


def _isBuilder(addr):
    if not CheckWitness(addr):
        return Error('auth failed')
    if not CheckWitness(BUILDER_ADDRESS):
        return Error('only builder!')
    return True


def userIdIndex():
    return getStorage(USER_INDEX_KEY)
def saveUserIdIndex(idx):
    putStorage(USER_INDEX_KEY,idx)
def blockIndex():
    return getStorage(BLOCK_INDEX_KEY)
def saveBlockIndex(idx):
    putStorage(BLOCK_INDEX_KEY,idx)

def addrToUserId(addr):
    return getStorage(concat(ADDR_USERID_PRE,addr))
def saveAddrToUserId(addr,idx):
    putStorage(concat(ADDR_USERID_PRE,addr),idx)


def blockBonus():
    return getStorage(BLOCK_BONUS_KEY)
def saveBlockBonus(t):
    putStorage(BLOCK_BONUS_KEY,t)

def blockRate():
    return Deserialize(getStorage(BLOCK_RATE_KEY))
def saveBlockRate(r):
    putStorage(BLOCK_RATE_KEY,Serialize(r))


    
def uidBidKeyToMineState(uid,bid,key):
    return getStorage(concat(concat(UIDKEY_STATE_PRE,sstr(uid)),concat('_',concat(sstr(bid),concat('_',sstr(key))))))
def saveUidBidKeyToMineState(uid,bid,key,st):
    putStorage(concat(concat(UIDKEY_STATE_PRE,sstr(uid)),concat('_',concat(sstr(bid),concat('_',sstr(key))))),st)



def indexToUser(idx):
    return Deserialize(getStorage(concat(INDEX_USER_PRE,sstr(idx))))
def saveIndexToUser(idx,user):
    putStorage(concat(INDEX_USER_PRE,sstr(idx)),Serialize(user))

def indexToBlock(idx):
    return Deserialize(getStorage(concat(INDEX_BLOCK_PRE,sstr(idx))))
def saveIndexToBlock(idx,b):
    putStorage(concat(INDEX_BLOCK_PRE,sstr(idx)),Serialize(b))

#mt:mine time pm:preMine
def User(mt,pm,bids,bonus,addr):
    return {"mt":mt,"pm":pm, "bids":bids,"bonus":bonus,"addr":addr}
def UserStr(u):
    s='{'
    s=concat(s,kv('mt',sstr(u['mt'])))
    s=concat(s,concat(',',kv('pm',u['pm'])))
    s=concat(s,concat(',',kv('bids',arrStr(u['bids']))))
    s=concat(s,concat(',',kv('bonus',sstr(u['bonus']))))
    s=concat(s,concat(',',kv('addr',u['addr'])))
    return concat(s,'}')


def Block(height,hash,preHash,key,type,bonus,miner,time):
    return {'height':height,"hash":hash,"preHash":preHash,"key":key,"type":type,"bonus":bonus,"miner":miner,"time":time}
def BlockStr(b):
    s='{'
    s=concat(s,kv('height',sstr(b['height'])))
    s=concat(s,concat(',',concat('"hash":',b['hash'])))
    s=concat(s,concat(',',concat('"preHash":',b['preHash'])))
    s=concat(s,concat(',',kv('key',sstr(b['key']))))
    s=concat(s,concat(',',kv('type',sstr(b['type']))))
    s=concat(s,concat(',',kv('bonus',sstr(b['bonus']))))
    s=concat(s,concat(',',kv('miner',b['miner'])))
    s=concat(s,concat(',',kv('time',sstr(b['time']))))
    return concat(s,'}')

def Rate(min,max):
    return {"min":min,"max":max}

def transferONT(fromaddr, toaddr, amount):
    param = state(fromaddr, toaddr, amount)
    res = Invoke(0, ONT_CONTRACT, "transfer", [param])
    return res
    
def transferONG(fromaddr, toaddr, amount):
    param = state(fromaddr, toaddr, amount)
    res = Invoke(0, ONG_CONTRACT, "transfer", [param])
    return res


def nextHash(preHash):
    hash=GetCurrentBlockHash()
    sysseed = [preHash, hash]
    return sha256(Serialize(sysseed))

def getBlockKey(uid,bid,uni,salt):
    r=blockRate()
    key=random(r['min'],r['max'],salt)
    if uni:
        while uidBidKeyToMineState(uid,bid,key)>0:
            key=random(r['min'],r['max'],key)
    return key

def random(min,max,salt):# min>=x and x<=max
    txid = GetTransactionHash(GetScriptContainer())
    blockTime = GetTime()
    blockHash = GetCurrentBlockHash()
    sysseed = [txid,blockHash, salt, blockTime]
    sysseed = sha256(Serialize(sysseed))
    res = abs(sysseed)
    number = res % (max-min+1)
    number = number + min
    return number
    
def putStorage(key,content):
    Put(GetContext(),key, content)

def getStorage(key):
    return Get(GetContext(),key)
def sstr(i):
    return str(i) if i>0 else "0"
def arrStr(arr):
    s='['
    for i in range(0,len(arr)):
        v=arr[i]
        isDic=findStr(v,'{')
        a = '' if isDic else '"'
        if i>0 :
            s=concat(s,',')
        s=concat(s,concat(a,concat(v,a)))
    s=concat(s,']')
    return s


def findStr(s,a):
    for i in range(0,len(s)):
        if s[i:i+1] is a:
            return True
    return False


def kv(k,v):
    isArr=findStr(v,'[')
    isDic=findStr(v,'{')
    a = '":' if isArr or isDic else '":"'
    b = '' if isArr or isDic else '"'
    return concat(concat(concat('"',k),concat(a,v)),b)

def Error(error):
    Notify(["error",error])
    return False

def Success(msg):
    Notify(["success",msg])
    return True