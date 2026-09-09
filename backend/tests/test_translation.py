import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.database import Base, engine
from app.services.language_detection_service import language_detection_service
from app.services.translation_service import translation_service

# Initialize test tables
Base.metadata.create_all(bind=engine)
client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data
    assert "provider" in data

def test_get_languages():
    response = client.get("/api/languages")
    assert response.status_code == 200
    languages = response.json()
    assert isinstance(languages, list)
    assert len(languages) >= 20
    codes = [l["code"] for l in languages]
    assert "en" in codes
    assert "te" in codes  # Telugu
    assert "hi" in codes  # Hindi
    assert "ta" in codes  # Tamil

def test_language_detection_service_heuristic():
    # Telugu script detection
    code, name = language_detection_service.detect_language("నమస్కారం, మీరు ఎలా ఉన్నారు?")
    assert code == "te"
    assert name == "Telugu"

    # Hindi / Devanagari script detection
    code, name = language_detection_service.detect_language("नमस्ते, आप कैसे हैं?")
    assert code == "hi"
    assert name == "Hindi"

    # Tamil script detection
    code, name = language_detection_service.detect_language("வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?")
    assert code == "ta"
    assert name == "Tamil"

def test_detect_language_endpoint():
    response = client.post("/api/detect-language", json={"text": "నమస్కారం"})
    assert response.status_code == 200
    data = response.json()
    assert data["language_code"] == "te"
    assert data["language_name"] == "Telugu"

def test_detect_language_empty_text():
    response = client.post("/api/detect-language", json={"text": "   "})
    assert response.status_code == 422

def test_translation_service_same_language():
    # Direct pass-through if source == target
    result = translation_service.translate_text("Hello world", "en", "en")
    assert result["translated_text"] == "Hello world"
    assert result["source_language"] == "en"
    assert result["target_language"] == "en"

def test_translate_endpoint_live():
    response = client.post("/api/translate", json={
        "text": "Hello, how are you?",
        "source_language": "en",
        "target_language": "te"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["original_text"] == "Hello, how are you?"
    assert data["source_language"] == "en"
    assert data["target_language"] == "te"
    assert len(data["translated_text"]) > 0
    # Verify translated text has non-empty output
    assert data["translated_text"] != ""

def test_translate_empty_text_validation():
    response = client.post("/api/translate", json={
        "text": "  ",
        "source_language": "en",
        "target_language": "te"
    })
    assert response.status_code == 422

def test_translate_unsupported_language():
    response = client.post("/api/translate", json={
        "text": "Hello",
        "source_language": "xyz_invalid",
        "target_language": "te"
    })
    assert response.status_code == 400

    response2 = client.post("/api/translate", json={
        "text": "Hello",
        "source_language": "en",
        "target_language": "xyz_invalid"
    })
    assert response2.status_code == 400

def test_history_crud_flow():
    # 1. Clear history first
    del_res = client.delete("/api/history")
    assert del_res.status_code == 200

    # 2. Add history item via POST /api/history
    post_res = client.post("/api/history", json={
        "original_text": "Good morning",
        "translated_text": "శుభోదయం",
        "source_language": "en",
        "target_language": "te",
        "detected_language": "English",
        "provider_used": "google"
    })
    assert post_res.status_code == 201
    item = post_res.json()
    item_id = item["id"]
    assert item["original_text"] == "Good morning"
    assert item["translated_text"] == "శుభోదయం"

    # 3. List history items
    get_res = client.get("/api/history")
    assert get_res.status_code == 200
    history_items = get_res.json()
    assert len(history_items) >= 1
    assert any(h["id"] == item_id for h in history_items)

    # 4. Delete specific item
    del_item_res = client.delete(f"/api/history/{item_id}")
    assert del_item_res.status_code == 200

    # 5. Verify deleted item is not found
    del_again = client.delete(f"/api/history/{item_id}")
    assert del_again.status_code == 404
