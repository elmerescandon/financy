from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from classes.Finance import FinanceEntry
import datetime
from fastapi.responses import JSONResponse
import uuid

# Load environment variables from .env file
load_dotenv()


app = FastAPI()

DATABASE_URL = os.getenv("LOCAL_POSTGRES_URL").replace("postgresql://", "postgresql+psycopg2://")
engine = create_engine(DATABASE_URL)
metadata = MetaData()
finance_data = Table("finance_data", metadata, autoload_with=engine)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
     print(exc)
     return JSONResponse(status_code=422, content={"message": "Invalid data format"})

@app.get("/")
def read_root():
    return {"Hello": "World"}


Session = sessionmaker(bind=engine)
session = Session()

@app.get("/get-expenses/{user_id}")
def get_entries(user_id: str):
    """
        Get the last 10 entries from the database
    """

    try:
        print(user_id)
        query = finance_data.select().where(
            (finance_data.c.user_id == user_id) & 
            (finance_data.c.finance_type == 'expense')
        ).order_by(finance_data.c.time.desc()).limit(10)
        
        result = session.execute(query).fetchall()
        entries = [
            {
                "id": row[0],
                "amount": row[2],
                "time": row[3].timestamp(),
                "type": row[4],
                "finance_type": row[5],
                "note": row[6],
            }
            for row in result
        ]
        print(entries)

        if not entries:
            return JSONResponse(status_code=404, content={"message": "No entries found"})
        
        return JSONResponse(status_code=200, content={"entries": entries, "message": "Entries fetched successfully"})	

    except Exception as e:
        return JSONResponse(status_code=500, content={"message":str(e)})




@app.post("/save-entry")
def save_entry(entry: FinanceEntry):
    try:  
        print(entry)
        user_id = uuid.UUID(entry.user_id)
        insert_stmt = finance_data.insert().values(
            time=datetime.datetime.fromtimestamp(float(entry.time)),
            note=entry.note,
            amount=entry.amount,
            type=entry.type,
            user_id=user_id,
            finance_type=entry.finance_type
        )
        session.execute(insert_stmt)
        session.commit()
        return JSONResponse(status_code=201, content={"message": "Entry saved successfully"})
    # except (ValueError, OSError):
    #     return JSONResponse(status_code=400, content={"message": "A server error occurred, try again later."})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": str(e)})
    

#! uvicorn app:app --host 0.0.0.0 --port 8000 --reload

