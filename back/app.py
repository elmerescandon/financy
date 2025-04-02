from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker
from classes.Finance import FinanceEntry
import datetime
from fastapi.responses import JSONResponse
import uuid
from typing import List, Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

DATABASE_URL = os.getenv("LOCAL_POSTGRES_URL").replace("postgresql://", "postgresql+psycopg2://")
engine = create_engine(DATABASE_URL)
metadata = MetaData()
finance_data = Table("finance_data", metadata, autoload_with=engine)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
     return JSONResponse(status_code=422, content={"message": "Invalid data format"})

@app.get("/")
def read_root():
    return {"Hello": "World"}


Session = sessionmaker(bind=engine)
session = Session()

@app.get("/get-expenses/{user_id}")
def get_entries(user_id: str, request: Request):
    """
        Get entries from the database with pagination
    """
    try:
        page = int(request.query_params.get('page', 1))
        items_per_page = int(request.query_params.get('items_per_page', 100))
        offset = (page - 1) * items_per_page

        total_items_query = finance_data.select().where(
            (finance_data.c.user_id == user_id) & 
            (finance_data.c.finance_type == 'expense')
        )
        total_items = session.execute(total_items_query).rowcount

        query = finance_data.select().where(
            (finance_data.c.user_id == user_id) & 
            (finance_data.c.finance_type == 'expense')
        ).order_by(finance_data.c.time.desc()).offset(offset).limit(items_per_page)
        
        result = session.execute(query).fetchall()
        columns = finance_data.columns.keys()
        column_index_map = {column: index for index, column in enumerate(columns)}
        entries = [
            {
                "id": row[column_index_map["id"]],
                "time": row[column_index_map["time"]].timestamp(),
                "amount": row[column_index_map["amount"]],
                "type": row[column_index_map["type"]],
                "note": row[column_index_map["note"]],
                "finance_type": row[column_index_map["finance_type"]],
            }
            for row in result
        ]

        total_pages = (total_items + items_per_page - 1) // items_per_page

        if not entries:
            return JSONResponse(status_code=404, content={"message": "No entries found"})
        
        return JSONResponse(status_code=200, content={
            "entries": entries,
            "message": "Entries fetched successfully",
            "current_page": page,
            "total_pages": total_pages,
            "offset": offset,
            "total_items": total_items
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": str(e)})


class ExpenseQuery(BaseModel):
    start_date: datetime.datetime
    end_date: datetime.datetime
    expense_types: List[str]

@app.post("/get-expenses-range/{user_id}")
def get_entries_range(user_id: str, query: ExpenseQuery):
    """
        Get entries from the database within a date-time range and specified expense types
    """
    try:
        print(user_id)
        print(query)

        query_stmt = finance_data.select().where(
            (finance_data.c.user_id == user_id) &
            (finance_data.c.finance_type == 'expense') &
            (finance_data.c.time >= query.start_date) &
            (finance_data.c.time <= query.end_date) &
            (finance_data.c.type.in_(query.expense_types))
        ).order_by(finance_data.c.time.desc())
        
        result = session.execute(query_stmt).fetchall()
        columns = finance_data.columns.keys()
        column_index_map = {column: index for index, column in enumerate(columns)}
        entries = [
            {
                "id": row[column_index_map["id"]],
                "time": row[column_index_map["time"]].timestamp(),
                "amount": row[column_index_map["amount"]],
                "type": row[column_index_map["type"]],
                "note": row[column_index_map["note"]],
                "finance_type": row[column_index_map["finance_type"]],
            }
            for row in result
        ]

        if not entries:
            return JSONResponse(status_code=200, content={"entries": [], "message": "No entries found"})
        
        return JSONResponse(status_code=200, content={"entries": entries, "message": "Entries fetched successfully"})

    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": str(e)})


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
    
@app.post("/set-income")
def set_income(entry: FinanceEntry):
    try:
        print(entry)
        user_id = uuid.UUID(entry.user_id)
        insert_stmt = finance_data.insert().values(
            time=datetime.datetime.fromtimestamp(float(entry.time)),
            to_time=datetime.datetime.fromtimestamp(float(entry.to_time)),
            amount=entry.amount,
            type=entry.type,
            user_id=user_id,
            finance_type='income'
        )
        session.execute(insert_stmt)
        session.commit()
        return JSONResponse(status_code=201, content={"message": "Income entry saved successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": str(e)})

@app.delete("/delete-entry/{entry_id}")
def delete_entry(entry_id: str):
    try:
        delete_stmt = finance_data.delete().where(finance_data.c.id == entry_id)
        result = session.execute(delete_stmt)
        session.commit()
        
        if result.rowcount == 0:
            return JSONResponse(status_code=404, content={"message": "Entry not found"})
            
        return JSONResponse(status_code=200, content={"message": "Entry deleted successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": str(e)})

#! uvicorn app:app --host 0.0.0.0 --port 8000 --reload

