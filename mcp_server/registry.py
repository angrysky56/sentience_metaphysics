from typing import Any, Dict, List, Optional

from .persistence import SEGPersistenceManager
from .replicants import REPLICANT_DEFINITIONS


class ReplicantRegistry:
    """Registry that merges core and custom replicants."""

    def __init__(self, persistence_manager: SEGPersistenceManager):
        self.persistence = persistence_manager
        self.static_replicants = REPLICANT_DEFINITIONS
        self.custom_replicants = self.persistence.load_custom_replicants()

    def get_all_definitions(self) -> Dict[str, Any]:
        """Get all replicant definitions (static + custom)."""
        all_defs = self.static_replicants.copy()
        all_defs.update(self.custom_replicants)
        return all_defs

    def get_names(self) -> List[str]:
        """Get list of all replicant names."""
        names = list(self.static_replicants.keys())
        names.extend(list(self.custom_replicants.keys()))
        return names

    def get_definition(self, name: str) -> Optional[Dict[str, Any]]:
        """Get definition for a specific replicant."""
        if name in self.static_replicants:
            return self.static_replicants[name]
        return self.custom_replicants.get(name)

    def add_custom_replicant(self, replicant: Dict[str, Any]):
        """Add and persist a custom replicant."""
        name = replicant.get("archetype_name")
        if name:
            self.custom_replicants[name] = replicant
            self.persistence.save_custom_replicant(replicant)
