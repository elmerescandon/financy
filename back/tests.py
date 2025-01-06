from fastapi.testclient import TestClient
from app import app, session, finance_data
import datetime
import uuid 

client = TestClient(app)



def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}

def test_get_entries():
    # Insert test data
    user_id = "d09bd4f7-e50c-486c-8b04-93c6540f48bb" # str(uuid.uuid4())
    # test_data = {
    #     "time": datetime.datetime.now(),
    #     "note": "Test note",
    #     "amount": 100.0,
    #     "type": "income",
    #     "user_id": user_id
    # }
    # insert_stmt = finance_data.insert().values(**test_data)
    # session.execute(insert_stmt)
    # session.commit()

    response = client.get("/get-entries/{}".format(user_id))
    print(response.json())
    assert response.status_code == 200
    assert "entries" in response.json()
    assert len(response.json()["entries"]) > 0

def test_save_entry():
    user_id = str(uuid.uuid4())
    entry_data = {
        "time": datetime.datetime.now().timestamp(),
        "note": "Test note",
        "amount": 100.0,
        "type": "income",
        "user_id": user_id
    }
    response = client.post("/save-entry", json=entry_data)
    assert response.status_code == 201
    assert response.json() == {"message": "Entry saved successfully"}

    # # Verify the entry was saved
    query = finance_data.select().where(finance_data.c.user_id == user_id).order_by(finance_data.c.time.desc()).limit(1)
    result = session.execute(query).fetchone()
    assert result is not None
    assert result.note == "Test note"
    assert result.amount == 100.0
    assert result.type == "income"
    assert str(result.user_id) == user_id


if __name__ == "__main__":
    test_read_root()
    # test_save_entry()
    test_get_entries()
    print("All tests passed!")	