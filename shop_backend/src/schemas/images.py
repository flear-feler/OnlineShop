from pydantic import BaseModel

class UploadOutFile(BaseModel):
    photo_id: int
    good_id: int
    good: str

class InputFile(BaseModel):
    good_id: int

class OutputFile(BaseModel):
    id: int
    good_id: int