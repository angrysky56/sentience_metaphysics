"""Persistence management for SEG framework data."""
import json
import logging
from pathlib import Path
from typing import Any, Dict

logger = logging.getLogger(__name__)


class SEGPersistenceManager:
    """Manages persistent storage for SEG framework components."""

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)

        self.custom_replicants_file = self.data_dir / "custom_replicants.json"
        self.generated_personas_file = self.data_dir / "generated_personas.json"
        self.sessions_file = self.data_dir / "sessions.json"

    def save_custom_replicant(self, replicant: Dict[str, Any]):
        """Save a custom replicant to disk."""
        data = self._load_file(self.custom_replicants_file)
        name = replicant.get("archetype_name")
        if not name:
            logger.error("Replicant missing archetype_name")
            return

        data[name] = replicant
        self._save_file(self.custom_replicants_file, data)

    def load_custom_replicants(self) -> Dict[str, Any]:
        """Load all custom replicants from disk."""
        return self._load_file(self.custom_replicants_file)

    def save_generated_persona(self, persona: Dict[str, Any]):
        """Save a generated persona to disk."""
        data = self._load_file(self.generated_personas_file)
        name = persona.get("name")
        if not name:
            logger.error("Persona missing name")
            return

        data[name] = persona
        self._save_file(self.generated_personas_file, data)

    def load_generated_personas(self) -> Dict[str, Any]:
        """Load all generated personas from disk."""
        return self._load_file(self.generated_personas_file)

    def _load_file(self, file_path: Path) -> Dict[str, Any]:
        """Load JSON file or return empty dict if not exists."""
        if not file_path.exists():
            return {}
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (OSError, json.JSONDecodeError) as e:
            logger.error("Error loading %s: %s", file_path, e)
            return {}

    def _save_file(self, file_path: Path, data: Dict[str, Any]):
        """Save dictionary to JSON file."""
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except OSError as e:
            logger.error("Error saving %s: %s", file_path, e)
