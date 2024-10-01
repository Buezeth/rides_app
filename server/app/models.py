from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Rides(Base):
    __tablename__ = "rides"

    id = Column(Integer, primary_key=True, nullable=False)
    car_id = Column(String)
    # lcoation_x_axis = Column(Integer, nullable=False)
    # lcoation_y_axis = Column(Integer, nullable=False)
    location = Column(String)
    path = Column(String)


class Drivers(Base):
    __tablename__ = "drivers"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    phone = Column(Integer, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    licence_number = Column(String, nullable=False)

