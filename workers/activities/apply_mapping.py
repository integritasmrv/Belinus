import yaml
import polars as pl
from pathlib import Path
from typing import Any
from temporalio import activity


def _extract(data: dict, path: str) -> Any:
    parts = path.split(".")
    value = data
    for part in parts:
        if isinstance(value, dict):
            value = value.get(part)
        else:
            return None
    return value


def _transform(value: Any, transform: str) -> Any:
    if value is None:
        return None
    if not transform:
        return value
    if transform == "strip":
        return str(value).strip()
    if transform == "upper":
        return str(value).upper()
    if transform == "lower":
        return str(value).lower()
    if transform == "string":
        return str(value)
    if transform == "int":
        try:
            return int(value)
        except (ValueError, TypeError):
            return None
    if transform.startswith("const:"):
        return transform.split(":", 1)[1]
    return value


def _set_nested(data: dict, path: str, value: Any) -> None:
    parts = path.split(".")
    current = data
    for part in parts[:-1]:
        if part not in current:
            current[part] = {}
        current = current[part]
    current[parts[-1]] = value


def _apply_single_mapping(payload: dict, config: dict, passthrough: bool = False) -> dict:
    result = {}
    explicit_sources = set()
    
    for field in config.get("fields", []):
        value = _extract(payload, field["source"])
        value = _transform(value, field.get("transform", ""))
        _set_nested(result, field["target"], value)
        explicit_sources.add(field["source"])
    
    if passthrough:
        for key, value in payload.items():
            if key not in explicit_sources and value is not None:
                _set_nested(result, f"entity_attributes.{key}", value)
    
    return result


@activity.defn
def apply_mapping(payload: dict, mapping_name: str) -> dict:
    config = yaml.safe_load(
        Path(f"/opt/integritasmrv/mappings/{mapping_name}.yaml").read_text()
    )
    
    if "targets" in config:
        passthrough = config.get("passthrough", False)
        return {
            target_name: _apply_single_mapping(payload, target_config, passthrough)
            for target_name, target_config in config["targets"].items()
        }
    else:
        return _apply_single_mapping(payload, config, config.get("passthrough", False))


@activity.defn
def apply_mapping_batch(file_path: str, mapping_name: str) -> list[dict]:
    config = yaml.safe_load(
        Path(f"/opt/integritasmrv/mappings/{mapping_name}.yaml").read_text()
    )
    df = pl.read_csv(
        file_path,
        separator=config.get("separator", ","),
        encoding=config.get("encoding", "utf-8"),
        infer_schema_length=0,
    )
    rename_map = {f["source"]: f["target"].split(".")[-1] for f in config["fields"]}
    return df.rename(rename_map).to_dicts()