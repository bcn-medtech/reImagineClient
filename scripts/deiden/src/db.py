import os, sys
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Sequence
from sqlalchemy import sql

import csv

Base = declarative_base()

class Patient(Base):
  __tablename__ = 'patients'
  anonid = Column(Integer, Sequence('anon_id_seq',minvalue=1), primary_key=True)    
  pid = Column(String(50))  
  name = Column(String(50))
  accessionNumber = Column(String(50))    

  def __repr__(self):
      return "<Patient(anonid=%d, pid=%s, accessionNumer=%s, name='%s')>" % (
                              self.anonid, self.pid, self.accessionNumber,
                              self.name)  

  @staticmethod
  def getColumns():
    return Patient.__table__.c.keys()

class LocalDB(object):                                
  def __init__(self, verbose=True, sqlfile=None):
    #self._engine = create_engine('sqlite:///:memory:', echo=verbose)
    basedir = os.getcwd()
    if (not sqlfile):
      sqlfile = os.path.join(basedir, "patients.sqlite")
    
    #self._engine = create_engine('sqlite:///:memory:', echo=verbose)
    self._engine = create_engine('sqlite:///%s'%sqlfile, echo=verbose)            
    self._sessionMaker = sessionmaker(bind=self._engine)    
    self._session = self._sessionMaker() 

  def _initdb(self):
    Base.metadata.create_all(self._engine)    
    
  def getAllPatients(self):    
    for instance in self._session.query(Patient).order_by(Patient.anonid):
      yield instance
    
  def searchId(self, pid):
    for instance in self._session.query(Patient).\
                    order_by(Patient.pid).\
                    filter_by(pid=pid):
      yield instance
    
  def searchAnonId(self, anonid):
    for instance in self._session.query(Patient).\
                    filter_by(anonid=anonid):
      yield instance
    
  def createPatient(self, pid, name, accessionNumber):
    p = Patient(pid=str(pid), name=name, accessionNumber=accessionNumber)
    self._session.add(p)
    self._session.commit()
    return p

  def exportDb(self, fname):
    select = sql.select([Patient])
    result = self._session.execute(select)
    headers = result.keys()

    with open(fname, 'w') as fh:
      outcsv = csv.writer(fh)
      outcsv.writerow(headers)
      outcsv.writerows(result)
