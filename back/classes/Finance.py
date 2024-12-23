from pydantic import BaseModel
from typing import Optional

class FinanceEntry(BaseModel):
    user_id: int
    time: int
    note: Optional[str] = None
    amount: float
    type: str
