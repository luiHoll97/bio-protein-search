import os
from typing import Dict, List, Optional, Union, Any
import json
import pandas as pd
import numpy as np
import pyarrow.parquet as pq
from fastapi import HTTPException

from models import Edge, GoTerm, Protein, ProteinDetail, ProteinIdRecord, ProteinSearchResult


class DataService:
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = data_dir
        self.proteins_df = None
        self.go_terms_df = None
        self.edges_df = None
        self.protein_id_records_df = None
        self.load_data()

    def load_data(self):
        """Load all parquet files into pandas"""
        try:
            protein_file = os.path.join(self.data_dir, "protein_nodes.parquet")
            self.proteins_df = pq.read_table(protein_file).to_pandas()

            go_term_file = os.path.join(self.data_dir, "go_term_nodes.parquet")
            self.go_terms_df = pq.read_table(go_term_file).to_pandas()

            edges_file = os.path.join(self.data_dir, "edges.parquet")
            self.edges_df = pq.read_table(edges_file).to_pandas()

            protein_id_records_file = os.path.join(self.data_dir, "protein_id_records.parquet")
            self.protein_id_records_df = pq.read_table(protein_id_records_file).to_pandas()

        except Exception as e:
            print(f"Error loading protein info: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to load data: {str(e)}")

    def _clean_record_for_pydantic(self, record: dict) -> dict:
        """Clean up a record dictionary for pydantic models"""
        cleaned = {}
        for key, value in record.items():
            if isinstance(value, pd.Timestamp):
                cleaned[key] = value.isoformat()
            elif isinstance(value, np.ndarray):
                if value.size == 1:
                    cleaned[key] = value.item()
                else:
                    cleaned[key] = value.tolist()
            elif isinstance(value, (np.int64, np.int32, np.float64, np.float32)):
                cleaned[key] = value.item()
            elif pd.isna(value):
                cleaned[key] = None
            else:
                cleaned[key] = value
        return cleaned

    def normalise_id(self, id: str) -> str:
        """Normalise the ID by removing leading/trailing spaces and converting to lowercase"""
        return id.strip().lower()
    
    
    def search_proteins(self, query: str, search_type: str = "all") -> List[ProteinSearchResult]:
        """
        Search for proteins
        
        Args:
            query: search query
            search_type: type of search (accession, unambiguous, all, go_term)
            
        Returns:
            List of proteins
        """
        results = []
        
        if search_type in ["accession", "all"]:

            normalised_query = self.normalise_id(query)


            direct_matches = self.proteins_df[
                self.proteins_df["name"].astype(str).str.strip().str.lower() == normalised_query
            ]

            for _, protein_row in direct_matches.iterrows():
                protein_dict = self._clean_record_for_pydantic(protein_row.to_dict())
                protein = Protein(**protein_dict)
                id_records = self._get_protein_id_records(protein.id)
                results.append(ProteinSearchResult(protein=protein, identifiers=id_records))
        
        if search_type in ["unambiguous", "all"] and len(results) == 0:

            normalised_query = self.normalise_id(query)

            matches = self.protein_id_records_df[
                (self.protein_id_records_df["secondary_ids"].apply(
                    lambda ids: any(self.normalise_id(id) == normalised_query for id in ids) 
                )) |
                (self.protein_id_records_df["ambiguous_secondary_ids"].apply(
                    lambda ids: any(self.normalise_id(id) == normalised_query for id in ids) 
                ))
            ]
            
            for _, record_row in matches.iterrows():
                uuid = record_row["uuid"]
                protein_row = self.proteins_df[self.proteins_df["id"] == uuid]
                
                if len(protein_row) > 0:
                    protein_dict = self._clean_record_for_pydantic(protein_row.iloc[0].to_dict())
                    protein = Protein(**protein_dict)
                    id_records = self._get_protein_id_records(protein.id)
                    results.append(ProteinSearchResult(protein=protein, identifiers=id_records))

        if search_type in ["go_term", "all"] and len(results) == 0:

            query = query.lower().strip()
            go_matches = self.go_terms_df[
                (self.go_terms_df["external_id"].str.lower() == query) | 
                (self.go_terms_df["name"].str.lower() == query)
            ]
            
            if len(go_matches) > 0:
                go_term_id = go_matches.iloc[0]["id"]
                relevant_edges = self.edges_df[
                    (self.edges_df["target"] == go_term_id) & 
                    (self.edges_df["relationship"].str.contains("FunctionalAnnotation"))
                ]

                for _, edge in relevant_edges.iterrows():
                    protein_id = edge["source"]
                    protein_row = self.proteins_df[self.proteins_df["id"] == protein_id]
                    
                    if len(protein_row) > 0:
                        protein_dict = self._clean_record_for_pydantic(protein_row.iloc[0].to_dict())
                        protein = Protein(**protein_dict)
                        id_records = self._get_protein_id_records(protein.id)
                        results.append(ProteinSearchResult(protein=protein, identifiers=id_records))
        
        if search_type == "all" and len(results) == 0:

            for _, record in self.protein_id_records_df.iterrows():
                ambiguous_ids = record.get("ambiguous_secondary_ids", [])
                
                is_match = False
                try:
                    if isinstance(ambiguous_ids, np.ndarray):
                        is_match = np.any(ambiguous_ids == query)
                    elif isinstance(ambiguous_ids, list):
                        is_match = query in ambiguous_ids
                    elif isinstance(ambiguous_ids, str):
                        is_match = query == ambiguous_ids or query in ambiguous_ids.split(',')
                except:
                    continue
                
                if is_match:
                    uuid = record["uuid"]
                    protein_row = self.proteins_df[self.proteins_df["id"] == uuid]
                    
                    if len(protein_row) > 0:
                        protein_dict = self._clean_record_for_pydantic(protein_row.iloc[0].to_dict())
                        protein = Protein(**protein_dict)
                        id_records = self._get_protein_id_records(protein.id)
                        results.append(ProteinSearchResult(protein=protein, identifiers=id_records))
        
        return results

    def get_protein_detail(self, protein_id: str) -> ProteinDetail:
        """Get detailed information about a specific protein"""
        protein_row = self.proteins_df[self.proteins_df["id"] == protein_id]
        if len(protein_row) == 0:
            raise HTTPException(status_code=404, detail=f"Protein with ID {protein_id} not found")
        
        protein_dict = self._clean_record_for_pydantic(protein_row.iloc[0].to_dict())
        protein = Protein(**protein_dict)
        
        id_records = self._get_protein_id_records(protein_id)
        
        functional_annotations = self._get_functional_annotations(protein_id)
        
        protein_interactions = self._get_protein_interactions(protein_id)
        
        return ProteinDetail(
            protein=protein,
            identifiers=id_records,
            functional_annotations=functional_annotations,
            protein_interactions=protein_interactions
        )

    def _get_protein_id_records(self, protein_id: str) -> List[ProteinIdRecord]:
        """Get all ID records for a specific protein"""
        # print(protein_id, "protein id LUI LOOK HERE")
        records = self.protein_id_records_df[self.protein_id_records_df["uuid"] == protein_id]
        print(records, "records")
        result = []
        
        for _, record in records.iterrows():
            record_dict = self._clean_record_for_pydantic(record.to_dict())
            result.append(ProteinIdRecord(**record_dict))
            
        return result

    def _get_functional_annotations(self, protein_id: str) -> List[Dict]:
        """Get functional annotations for a specific protein"""

        annotations = self.edges_df[
            (self.edges_df["source"] == protein_id) & 
            (self.edges_df["relationship"].str.contains("FunctionalAnnotation"))
        ]
    
        results = []
        for _, edge in annotations.iterrows():
            go_term_id = edge["target"]
            go_term_row = self.go_terms_df[self.go_terms_df["id"] == go_term_id]
            
            if len(go_term_row) > 0:
                go_term_dict = self._clean_record_for_pydantic(go_term_row.iloc[0].to_dict())
                go_term = GoTerm(**go_term_dict)
                
                edge_dict = self._clean_record_for_pydantic(edge.to_dict())
                
                annotation_type = None
                if "BiologicalProcess" in edge["relationship"]:
                    annotation_type = "BiologicalProcess"
                elif "MolecularFunction" in edge["relationship"]:
                    annotation_type = "MolecularFunction"
                elif "CellularComponent" in edge["relationship"]:
                    annotation_type = "CellularComponent"
                
                results.append({
                    "edge": Edge(**edge_dict),
                    "go_term": go_term,
                    "score": edge_dict.get("ML_prediction_score", None),
                    "annotation_type": annotation_type
                })
        
        return results

    def _get_protein_interactions(self, protein_id: str) -> List[Dict]:
        """Get protein-protein interactions for a specific protein."""

        interactions = self.edges_df[
            ((self.edges_df["source"] == protein_id) | (self.edges_df["target"] == protein_id))
            &  (self.edges_df["relationship"] == "Protein-Protein-ProteinProteinInteraction")
        ]
        results = []

        for _, edge in interactions.iterrows():
            other_protein_id = edge["target"] if edge["source"] == protein_id else edge["source"]
            other_protein_row = self.proteins_df[self.proteins_df["id"] == other_protein_id]
            
            if len(other_protein_row) > 0:
                other_protein_dict = self._clean_record_for_pydantic(other_protein_row.iloc[0].to_dict())
                other_protein = Protein(**other_protein_dict)
                
                edge_dict = self._clean_record_for_pydantic(edge.to_dict())
                
                results.append({
                    "edge": Edge(**edge_dict),
                    "protein": other_protein,
                    "score": edge_dict.get("string_combined_score", None)
                })
        
        return results