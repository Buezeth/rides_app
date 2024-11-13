from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Rides(Base):
    __tablename__ = "rides"

    # id = Column(Integer, primary_key=True, nullable=False)
    car_id = Column(String,  primary_key=True, nullable=False)
    # lcoation_x_axis = Column(Integer, nullable=False)
    # lcoation_y_axis = Column(Integer, nullable=False)
    location = Column(String)
    path = Column(String)
    # customers = relationship("Customers", back_populates="rides")


class Drivers(Base):
    __tablename__ = "drivers"

    driver_id = Column(String, primary_key=True)
    name = Column(String)
    status = Column(String)
    location = Column(String)
    path = Column(String)
    path_index = Column(String)
    # licence_number = Column(String)
    customer_id = Column(String, ForeignKey("customers.customer_id", ondelete="CASCADE"))
    customer_name = Column(String, ForeignKey("customers.name", ondelete="CASCADE"))
    # customer = relationship("Customers")

class Customers(Base): 
    __tablename__ = "customers"

    customer_id = Column(String, primary_key=True)
    name = Column(String, unique=True)
    active = Column(Boolean)
    location = Column(String)
    destination = Column(String)
    driver_id = Column(String, ForeignKey("drivers.driver_id", ondelete="CASCADE"))
    # driver_id = relationship("Drivers", back_populates="customers")
    # rides = relationship("Rides", back_populates="customers")
    
    