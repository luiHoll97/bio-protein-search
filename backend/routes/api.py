from typing import Optional

from fastapi import APIRouter, Depends, Query

from models import ProteinDetail, SearchResponse
from services.data_service import DataService

router = APIRouter()


def get_data_service():
    return DataService()


@router.get("/search", response_model=SearchResponse)
async def search(
    query: str,
    search_type: str = Query("all", enum=["accession", "unambiguous", "all", "go_term"]),
    data_service: DataService = Depends(get_data_service),
):
    """
    Search for proteins by identifier
    
    - accession: Search by protein accession only
    - unambiguous: Search by unambiguous secondary identifiers
    - all: Search by any identifier (default)
    - go_term: Search for proteins associated with a GO term
    """
    results = data_service.search_proteins(query, search_type)
    return SearchResponse(results=results, count=len(results))


@router.get("/protein/{protein_id}", response_model=ProteinDetail)
async def get_protein(
    protein_id: str,
    data_service: DataService = Depends(get_data_service),
):
    """Get detailed information about a protein"""
    return data_service.get_protein_detail(protein_id)