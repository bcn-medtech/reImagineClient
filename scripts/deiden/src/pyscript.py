#!/usr/bin/python

import os, sys
import hashlib
from operator import xor

if __name__ == '__main__':

	clinical_id = sys.argv[1].encode('utf-8')
	clinical_dob = sys.argv[2].encode('utf-8')
	clinical_name = sys.argv[3].encode('utf-8')

	hid = hashlib.md5()
	hdob = hashlib.md5()	
	hname = hashlib.md5()	
	
	hid.update(clinical_id)
	hdob.update(clinical_dob)
	hname.update(clinical_name)

	hid = hid.digest()
	hdob = hdob.digest()
	hname = hname.digest()
	print("hid",hid)
	print("hdob",hdob)	
	print("hname",hname)

	idXdob = bytes(map(xor, hid, hdob))
	idXname = bytes(map(xor, hid, hname))
	print("hid XOR hdob", idXdob.hex())
	print("hid XOR hname", idXname.hex())
	
	pid = 0
	print("New patient id:", pid)
