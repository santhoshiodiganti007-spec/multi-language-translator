from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.database import get_db
from app.database.models import TranslationHistory
from app.models.translation import HistoryCreate, HistoryResponse

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=List[HistoryResponse])
def get_history(limit: int = 50, offset: int = 0, db: Session = Depends(get_db)):
    """
    Get recent translation history items.
    """
    items = (
        db.query(TranslationHistory)
        .order_by(desc(TranslationHistory.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )
    return items

@router.post("", response_model=HistoryResponse, status_code=status.HTTP_201_CREATED)
def create_history_item(payload: HistoryCreate, db: Session = Depends(get_db)):
    """
    Manually save a translation item to history.
    """
    item = TranslationHistory(
        original_text=payload.original_text,
        translated_text=payload.translated_text,
        source_language=payload.source_language,
        target_language=payload.target_language,
        detected_language=payload.detected_language,
        provider_used=payload.provider_used or "google"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def delete_history_item(id: int, db: Session = Depends(get_db)):
    """
    Delete a single translation history record by ID.
    """
    item = db.query(TranslationHistory).filter(TranslationHistory.id == id).first()
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"History item with ID {id} not found."
        )
    db.delete(item)
    db.commit()
    return {"message": f"History item {id} successfully deleted.", "id": id}

@router.delete("", status_code=status.HTTP_200_OK)
def clear_all_history(db: Session = Depends(get_db)):
    """
    Clear all translation history records.
    """
    count = db.query(TranslationHistory).delete()
    db.commit()
    return {"message": "Translation history cleared successfully.", "deleted_count": count}
