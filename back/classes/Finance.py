from pydantic import BaseModel
from typing import Optional

class FinanceEntry(BaseModel):
    user_id: str
    time: float
    amount: float
    type: str
    note: Optional[str] = None
    finance_type: str
    to_time: Optional[float] = None
