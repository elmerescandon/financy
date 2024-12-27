from fastapi import FastAPI, HTTPException
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

@app.get("/")
def read_root():
    return {"Hello": "World"}


Session = sessionmaker(bind=engine)
session = Session()

@app.get("/get-entries/{user_id}")
def get_entries(user_id: str):
    """
        Get the last 10 entries from the database
    """

    try:
        print(user_id)
        query = finance_data.select().where(finance_data.c.user_id == user_id).order_by(finance_data.c.time.desc()).limit(10)
        
        print(query)
        result = session.execute(query).fetchall()
        entries = [
            {
                "id": row[0],
                "time": row[1].timestamp(),
                "amount": row[2],
                "type": row[3],
                "note": row[4],
            }
            for row in result
        ]

        if not entries:
            return JSONResponse(status_code=404, content={"message": "No entries found"})
        
        return JSONResponse(status_code=200, content={"entries": entries, "message": "Entries fetched successfully"})	

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Server error, try again later"})




@app.post("/save-entry")
def save_entry(entry: FinanceEntry):
    try: 
        user_id = uuid.UUID(entry.user_id)
        insert_stmt = finance_data.insert().values(
            time=datetime.datetime.fromtimestamp(entry.time),
            note=entry.note,
            amount=entry.amount,
            type=entry.type,
            user_id=user_id
        )
        session.execute(insert_stmt)
        session.commit()
        return JSONResponse(status_code=201, content={"message": "Entry saved successfully"})
    except (ValueError, OSError):
        return JSONResponse(status_code=400, content={"message": "Invalid date format. Date must be a valid timestamp."})
    except Exception as e:
        session.rollback()
        return JSONResponse(status_code=500, content={"message": str(e)})
    

#! uvicorn app:app --host 0.0.0.0 --port 8000 --reload

