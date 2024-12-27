from pydantic import BaseModel
from typing import Optional

class FinanceEntry(BaseModel):
    user_id: str
    time: float
    note: Optional[str] = None
    amount: float
    type: str
