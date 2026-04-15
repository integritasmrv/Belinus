# Generic Multi-Target Mapping Specification

## Overview

The new mapping format supports **multiple CRM targets** in a single mapping file: `lead`, `contact`, and `company`. Each target produces a separate mapped record that gets upserted to its corresponding CRM table independently.

## Format Structure

```yaml
targets:
  <target_name>:
    table: <crm_table_name>
    fields:
      - source: <source_field_path>
        target: <target_field_path>
        transform: <transform_type>
  ...

passthrough: true|false
```

### Top-Level Keys

| Key | Required | Description |
|-----|----------|-------------|
| `targets` | Yes | Container for all target mappings |
| `passthrough` | No | If `true`, unmapped fields pass through as `entity_attributes.<field_name>` |

### Target Definition

| Key | Required | Description |
|-----|----------|-------------|
| `table` | Yes | CRM table name: `nb_crm_leads`, `nb_crm_contacts`, `nb_crm_customers` |
| `fields` | Yes | List of field mappings |

### Field Mapping

| Key | Required | Description |
|-----|----------|-------------|
| `source` | Yes | Dot-notation path to extract from input payload |
| `target` | Yes | Dot-notation path to set in output record |
| `transform` | No | Transform type (see below) |

### Transform Types

| Transform | Description |
|-----------|-------------|
| `strip` | Trim whitespace |
| `upper` | Convert to uppercase |
| `lower` | Convert to lowercase |
| `string` | Convert to string |
| `int` | Convert to integer |
| `const:<value>` | Use constant value |
| (none) | No transform |

### Passthrough Behavior

When `passthrough: true`:
- Any field in the source payload **not** in the explicit `fields` list
- Gets added as `entity_attributes.<original_field_name>`
- Allows arbitrary extra fields to flow through

## Example: Webform to CRM

```yaml
targets:
  lead:
    table: nb_crm_leads
    fields:
      - source: first_name
        target: name
        transform: strip
      - source: email
        target: email
        transform: strip
      - source: company
        target: company
        transform: strip
      - source: phone
        target: phone
        transform: strip
      - source: job_title
        target: title
        transform: strip
      - source: message
        target: description
        transform: strip
      - source: form_id
        target: source
        transform: strip
      - source: form_id
        target: status
        transform: const:new
      - source: product_interest
        target: entity_attributes.product_interest
        transform: strip
      - source: source_url
        target: entity_attributes.source_url
        transform: strip

  contact:
    table: nb_crm_contacts
    fields:
      - source: first_name
        target: label
        transform: strip
      - source: last_name
        target: entity_attributes.last_name
        transform: strip
      - source: email
        target: entity_attributes.email
        transform: strip
      - source: phone
        target: entity_attributes.phone
        transform: strip
      - source: job_title
        target: entity_attributes.job_title
        transform: strip
      - source: company
        target: entity_attributes.company_name
        transform: strip
      - source: company_website
        target: entity_attributes.company_website
        transform: strip
      - source: form_id
        target: lead_source
        transform: strip
      - source: source_url
        target: entity_attributes.source_url
        transform: strip
      - source: message
        target: entity_attributes.message
        transform: strip
      - source: product_interest
        target: entity_attributes.product_interest
        transform: strip

  company:
    table: nb_crm_customers
    fields:
      - source: company
        target: label
        transform: strip
      - source: company_website
        target: entity_attributes.website
        transform: strip
      - source: phone
        target: entity_attributes.phone
        transform: strip
      - source: company
        target: entity_attributes.name
        transform: strip
      - source: form_id
        target: source_system
        transform: const:webform
      - source: source_url
        target: entity_attributes.source_url
        transform: strip
      - source: message
        target: entity_attributes.description
        transform: strip
      - source: product_interest
        target: entity_attributes.product_interest
        transform: strip

passthrough: true
```

## Output Structure

Given the webform mapping above and this input:

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+1234567890",
  "job_title": "CEO",
  "product_interest": "Carbon Credits",
  "message": "Interested in bulk purchase",
  "form_id": "belinus_b2b_v3",
  "source_url": "https://belinus.com/contact"
}
```

The mapping produces **three separate records**:

### Lead Record
```json
{
  "name": "John",
  "email": "john@example.com",
  "company": "Acme Corp",
  "phone": "+1234567890",
  "title": "CEO",
  "description": "Interested in bulk purchase",
  "source": "belinus_b2b_v3",
  "status": "new",
  "entity_attributes": {
    "product_interest": "Carbon Credits",
    "source_url": "https://belinus.com/contact"
  },
  "table": "nb_crm_leads"
}
```

### Contact Record
```json
{
  "label": "John",
  "entity_attributes": {
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "job_title": "CEO",
    "company_name": "Acme Corp",
    "company_website": null,
    "lead_source": "belinus_b2b_v3",
    "source_url": "https://belinus.com/contact",
    "message": "Interested in bulk purchase",
    "product_interest": "Carbon Credits"
  },
  "table": "nb_crm_contacts"
}
```

### Company Record
```json
{
  "label": "Acme Corp",
  "entity_attributes": {
    "website": null,
    "phone": "+1234567890",
    "name": "Acme Corp",
    "source_url": "https://belinus.com/contact",
    "description": "Interested in bulk purchase",
    "product_interest": "Carbon Credits"
  },
  "source_system": "webform",
  "table": "nb_crm_customers"
}
```

## Implementing for HubSpot

To convert HubSpot to use the new multi-target format:

### Step 1: Create `hubspot_to_crm.yaml`

```yaml
targets:
  contact:
    table: nb_crm_contacts
    fields:
      - source: properties.firstname
        target: label
        transform: strip
      - source: properties.lastname
        target: entity_attributes.lastname
        transform: strip
      - source: properties.hs_object_id
        target: external_ids.hubspot_id
        transform: string
      - source: properties.email
        target: entity_attributes.email
        transform: strip
      - source: properties.phone
        target: entity_attributes.phone
        transform: strip
      - source: properties.jobtitle
        target: entity_attributes.job_title
        transform: strip
      - source: properties.linkedin_primary_company
        target: entity_attributes.linkedin_url
        transform: strip
      - source: properties.city
        target: entity_attributes.city
        transform: strip
      - source: properties.state
        target: entity_attributes.state
        transform: strip
      - source: properties.country
        target: entity_attributes.country
        transform: strip
      - source: properties.website
        target: entity_attributes.website
        transform: strip
      - source: properties.company
        target: entity_attributes.company_name
        transform: strip
      - source: properties.hs_lead_status
        target: source_system
        transform: const:hubspot

  company:
    table: nb_crm_customers
    fields:
      - source: properties.name
        target: label
        transform: strip
      - source: properties.hs_object_id
        target: external_ids.hubspot_company_id
        transform: string
      - source: properties.vat_number__c
        target: external_ids.vat_number
        transform: strip
      - source: properties.country
        target: entity_attributes.country
        transform: upper
      - source: properties.industry
        target: entity_attributes.industry
        transform: strip
      - source: properties.website
        target: entity_attributes.website
        transform: strip
      - source: properties.phone
        target: entity_attributes.phone
        transform: strip
      - source: properties.description
        target: entity_attributes.description
        transform: strip
      - source: properties.city
        target: entity_attributes.city
        transform: strip
      - source: properties.linkedin_company_page
        target: entity_attributes.linkedin_url
        transform: strip
      - source: properties.hs_lead_status
        target: source_system
        transform: const:hubspot

  lead:
    table: nb_crm_leads
    fields:
      - source: properties.firstname
        target: name
        transform: strip
      - source: properties.email
        target: email
        transform: strip
      - source: properties.company
        target: company
        transform: strip
      - source: properties.phone
        target: phone
        transform: strip
      - source: properties.jobtitle
        target: title
        transform: strip
      - source: properties.hs_lead_status
        target: status
        transform: const:new
      - source: properties.hs_lead_status
        target: source
        transform: const:hubspot
      - source: properties.website
        target: entity_attributes.website
        transform: strip
      - source: properties.city
        target: entity_attributes.city
        transform: strip
      - source: properties.country
        target: entity_attributes.country
        transform: strip

passthrough: true
```

### Step 2: The Workflow Handles Multi-Target Automatically

The `IngestWorkflow` already has logic to detect `source == "webform"` and iterate over multiple targets. **This same logic will work for HubSpot** - the workflow just needs the correct `mapping_name`.

No workflow changes needed if you keep the workflow as-is and only update the mapping.

### Step 3: Consider Adding a `lead` Upsert Path

Currently `upsert_crm_entity` handles leads via `ON CONFLICT (email)`. Verify this works or you may need to adjust the upsert logic.

## Important Notes

1. **Field Naming**: The HubSpot payload uses `properties.firstname`, `properties.lastname`, etc. Make sure your mapping sources match exactly.

2. **Business Key**: The workflow sets `business_key_value` as `webform-{target_name}-{email}`. For HubSpot, you may want `hubspot-contact-{hs_object_id}` or similar.

3. **Upsert Logic**: The `upsert_crm_entity` activity needs to support all three tables. Check if the current implementation handles `nb_crm_leads` and `nb_crm_customers` or just `nb_crm_contacts`.

4. **Backward Compatibility**: The old single-target format (no `targets` key) still works. The new format is only used when `targets` key is present.
