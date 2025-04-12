from typing import Dict, List, Optional, Union
from pydantic import BaseModel


class Protein(BaseModel):
    id: str
    date: Optional[str] = None
    name: Optional[str] = None
    external_id: Optional[str] = None
    protein_sequence: Optional[str] = None
    dataset: Optional[str] = None
    organism: Optional[str] = None
    organism_name: Optional[str] = None
    node_type: Optional[str] = None


class GoTerm(BaseModel):
    id: str
    date: Optional[str] = None
    name: Optional[str] = None
    external_id: Optional[str] = None
    dataset: Optional[str] = None
    description: Optional[str] = None
    node_type: Optional[str] = None


class Edge(BaseModel):
    source: str
    target: str
    relationship: str
    date: Optional[str] = None
    go_code: Optional[str] = None
    source_external_id: Optional[str] = None
    target_external_id: Optional[str] = None
    dataset: Optional[Union[List[str], str]] = None 
    ML_prediction_score: Optional[float] = None
    string_combined_score: Optional[float] = None
    source_type: Optional[str] = None
    target_type: Optional[str] = None

class ProteinIdRecord(BaseModel):
    uuid: str
    name: Optional[str] = None
    external_id_system: Optional[str] = None
    external_id: Optional[str] = None
    entity_type: Optional[str] = None
    secondary_ids: Optional[Union[List[str], str]] = None
    ambiguous_secondary_ids: Optional[Union[List[str], str]] = None


class ProteinSearchResult(BaseModel):
    protein: Protein
    identifiers: List[ProteinIdRecord] = []


class ProteinDetail(BaseModel):
    protein: Protein
    identifiers: List[ProteinIdRecord] = []
    functional_annotations: List[Dict] = []
    protein_interactions: List[Dict] = []


class SearchResponse(BaseModel):
    results: List[ProteinSearchResult]
    count: int