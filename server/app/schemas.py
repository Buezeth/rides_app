from pydantic import BaseModel


class RideBase(BaseModel):
    car_id: str
    location: str
    path: list[str]
    
    class Config:
        from_attributes = True

