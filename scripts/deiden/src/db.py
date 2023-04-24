from email.mime import image
import os, sys
from sqlalchemy import create_engine
#from sqlalchemy.ext.declarative import declarative_base
from typing import Optional, List

from sqlalchemy import ForeignKey
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Sequence
from sqlalchemy import sql
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

import csv

class Base(DeclarativeBase):
    pass

class Patient(Base):
  __tablename__ = 'patient'
  idx = Column(Integer, Sequence('anon_id_seq',minvalue=1), primary_key=True)
  anoncode: Mapped[str]
  pid: Mapped[str]
  name: Mapped[str]
  studyId: Mapped[str]
  images: Mapped[List["Image"]] = relationship(back_populates="patient")

  def __repr__(self):
      return "<Patient(idx=%d, anoncode=%s, pid=%s, studyId=%s, name='%s')>" % (
                              self.idx, self.anoncode, self.pid,
                              self.studyId, self.name)  

  @staticmethod
  def getColumns():
    return Patient.__table__.c.keys()

class Image(Base):
  __tablename__ = 'image'
  idx = Column(Integer, Sequence('image_id_seq',minvalue=1), primary_key=True)
  imageId: Mapped[str]
  patientId = mapped_column(ForeignKey("patient.idx"))
  patient: Mapped["Patient"] = relationship(back_populates="images")

  def __repr__(self):
      return "<Image(idx=%d, imageId=%s, pid=%s)>" % (
                              self.idx, self.imageId, self.patient.idx
                              )  

  @staticmethod
  def getColumns():
    return Image.__table__.c.keys()

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
    
  def searchImage(self, imageId):
    for instance in self._session.query(Image).\
                    order_by(Image.imageId).\
                    filter_by(imageId=imageId):
      yield instance

  def searchAnonCode(self, anoncode):
    for instance in self._session.query(Patient).\
                    filter_by(anoncode=anoncode):
      yield instance
    
  def createPatient(self, anoncode, pid, name, studyId):
    p = Patient(anoncode=anoncode, pid=str(pid), name=name, studyId=studyId)
    self._session.add(p)
    self._session.commit()
    return p

  def createImage(self, imageId, patient):
    image = Image(imageId=imageId, patient=patient)
    self._session.add(image)
    self._session.commit()
    return image

  def exportDb(self, fname):
    select = sql.select(Patient)
    result = self._session.execute(select)
    headers = result.keys()

    with open(fname, 'w') as fh:
      outcsv = csv.writer(fh)
      outcsv.writerow(headers)
      outcsv.writerows(result)
