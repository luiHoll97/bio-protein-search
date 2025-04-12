export interface Protein {
    id: string;
    date?: string;
    name?: string;
    external_id?: string;
    protein_sequence?: string;
    dataset?: string;
    organism?: string;
    organism_name?: string;
    node_type?: string;
  }
  
  export interface GoTerm {
    id: string;
    date?: string;
    name?: string;
    external_id?: string;
    dataset?: string;
    description?: string;
    node_type?: string;
  }
  
  export interface Edge {
    source: string;
    target: string;
    relationship: string;
    date?: string;
    go_code?: string;
    source_external_id?: string;
    target_external_id?: string;
    dataset?: string;
    ML_prediction_score?: number;
    string_combined_score?: number;
    source_type?: string;
    target_type?: string;
  }
  
  export interface ProteinIdRecord {
    uuid: string;
    name?: string;
    external_id_system?: string;
    external_id?: string;
    entity_type?: string;
    secondary_ids?: string[];
    ambiguous_secondary_ids?: string[];
  }
  
  export interface ProteinSearchResult {
    protein: Protein;
    identifiers: ProteinIdRecord[];
  }
  
  export interface FunctionalAnnotation {
    edge: Edge;
    go_term: GoTerm;
    score?: number;
  }
  
  export interface ProteinInteraction {
    edge: Edge;
    protein: Protein;
    score?: number;
  }
  
  export interface ProteinDetail {
    protein: Protein;
    identifiers: ProteinIdRecord[];
    functional_annotations: FunctionalAnnotation[];
    protein_interactions: ProteinInteraction[];
  }
  
  export interface SearchResponse {
    results: ProteinSearchResult[];
    count: number;
  }
  
  export type SearchType = 'accession' | 'unambiguous' | 'all' | 'go_term';