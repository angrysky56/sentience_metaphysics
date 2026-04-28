"""Bootstrap utility for the SEG Molecular Self v1.2 custom-replicant set.

Two operations:

    python bootstrap.py export
        Read the current registry at data/custom_replicants.json and copy it
        into seg_molecular_self/bootstrap/replicants_v1_2.json. Run this when
        the live registry is in a known-good state and you want to capture
        it for redistribution.

    python bootstrap.py install [--force]
        Read seg_molecular_self/bootstrap/replicants_v1_2.json and merge it
        into data/custom_replicants.json. Without --force, existing replicants
        are skipped (idempotent install on a partial registry). With --force,
        existing replicants are overwritten.

Why this exists:

The MCP server's create_custom_replicant tool requires a running server and
manual invocation per replicant. After a fresh clone (or after data/ is
wiped) the v1.2 work — Base Assistant, the four historical thinkers, and
the seven Panksepp affect-system personas — would otherwise have to be
recreated by replaying conversation history. This script makes the v1.2
replicant set reproducible: capture once, replay anywhere.

The canonical source for replicants is the live registry JSON, not the
markdown persona files in personas/. The markdown is human-readable
specification; the JSON is what the server actually uses. Keeping the
markdown and JSON synchronized is the human-side discipline; the script
only handles the JSON path.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


# Resolve project paths from the script's own location, not from cwd.
# This keeps `python bootstrap.py` working regardless of where it's invoked.
_SCRIPT_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _SCRIPT_DIR.parent
_LIVE_REGISTRY = _PROJECT_ROOT / "data" / "custom_replicants.json"
_BOOTSTRAP_DIR = _SCRIPT_DIR / "bootstrap"
_BOOTSTRAP_FILE = _BOOTSTRAP_DIR / "replicants_v1_2.json"


def _load_json(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # indent=2 + ensure_ascii=False keeps the file readable and preserves
    # the em-dashes / unicode arrows in molecular_self blocks.
    path.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def _validate_replicant(name: str, replicant: dict[str, Any]) -> list[str]:
    """Return a list of validation issues. Empty list = clean."""
    issues: list[str] = []
    required_top = {"archetype_name", "core_function", "directive", "version"}
    for key in required_top:
        if key not in replicant:
            issues.append(f"missing required field: {key}")

    if replicant.get("archetype_name") != name:
        issues.append(
            f"archetype_name mismatch: registry key '{name}' "
            f"vs field value '{replicant.get('archetype_name')}'"
        )

    ms = replicant.get("molecular_self")
    if ms is None:
        issues.append("molecular_self is null or missing (v1.1-style replicant)")
    elif not isinstance(ms, dict):
        issues.append(f"molecular_self is not a dict: type={type(ms).__name__}")
    else:
        # The v1.2 canonical seven keys. Missing keys are warnings, not errors —
        # a partial molecular_self is still strictly better than none.
        canonical_keys = {
            "recursive_anchor",
            "gradient_pump",
            "backbone",
            "reflection",
            "exploration",
            "switch_trigger",
            "emotion_vector_primary",
        }
        missing = canonical_keys - set(ms.keys())
        if missing:
            issues.append(f"molecular_self missing keys: {sorted(missing)}")

    return issues


def cmd_export() -> int:
    if not _LIVE_REGISTRY.exists():
        print(f"ERROR: live registry not found at {_LIVE_REGISTRY}", file=sys.stderr)
        return 1

    live = _load_json(_LIVE_REGISTRY)
    if not live:
        print(f"ERROR: live registry is empty: {_LIVE_REGISTRY}", file=sys.stderr)
        return 1

    # Validate every replicant before exporting. Refuse to export a registry
    # in inconsistent state — that would propagate problems to every install.
    all_issues: dict[str, list[str]] = {}
    for name, rep in live.items():
        issues = _validate_replicant(name, rep)
        if issues:
            all_issues[name] = issues

    if all_issues:
        print("ERROR: registry has validation issues; export aborted.", file=sys.stderr)
        for name, issues in all_issues.items():
            print(f"  {name}:", file=sys.stderr)
            for issue in issues:
                print(f"    - {issue}", file=sys.stderr)
        return 2

    _write_json(_BOOTSTRAP_FILE, live)
    print(f"Exported {len(live)} replicant(s) to {_BOOTSTRAP_FILE}")
    for name in sorted(live):
        version = live[name].get("version", "?")
        print(f"  {name:20s}  version={version}")
    return 0


def cmd_install(force: bool = False) -> int:
    if not _BOOTSTRAP_FILE.exists():
        print(
            f"ERROR: bootstrap file not found at {_BOOTSTRAP_FILE}\n"
            f"       Run `python bootstrap.py export` first, or check out a commit\n"
            f"       that includes the bootstrap file.",
            file=sys.stderr,
        )
        return 1

    bootstrap = _load_json(_BOOTSTRAP_FILE)
    live = _load_json(_LIVE_REGISTRY)

    installed: list[str] = []
    skipped: list[str] = []
    overwritten: list[str] = []

    for name, rep in bootstrap.items():
        if name in live and not force:
            skipped.append(name)
            continue
        if name in live and force:
            overwritten.append(name)
        else:
            installed.append(name)
        live[name] = rep

    _write_json(_LIVE_REGISTRY, live)

    print(f"Bootstrap installed to {_LIVE_REGISTRY}")
    if installed:
        print(f"  Installed ({len(installed)}): {', '.join(sorted(installed))}")
    if overwritten:
        print(f"  Overwritten ({len(overwritten)}): {', '.join(sorted(overwritten))}")
    if skipped:
        print(
            f"  Skipped — already present ({len(skipped)}): "
            f"{', '.join(sorted(skipped))}"
        )
        print("  (use --force to overwrite existing replicants)")

    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        description="Bootstrap utility for the SEG Molecular Self v1.2 replicant set.",
    )
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser(
        "export",
        help="Capture the live registry into the bootstrap file.",
    )

    install = sub.add_parser(
        "install",
        help="Replay the bootstrap file onto the live registry.",
    )
    install.add_argument(
        "--force",
        action="store_true",
        help="Overwrite replicants that already exist in the live registry.",
    )

    args = parser.parse_args(argv)

    if args.command == "export":
        return cmd_export()
    if args.command == "install":
        return cmd_install(force=args.force)

    parser.error(f"unknown command: {args.command}")
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
