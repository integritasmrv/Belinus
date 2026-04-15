import asyncio
from concurrent.futures import ThreadPoolExecutor
from temporalio.client import Client
from temporalio.worker import Worker, SandboxedWorkflowRunner, SandboxRestrictions


async def main():
    temporal_addr = "10.0.4.16:7233"
    task_queue = "integritasmrv-ingest"

    client = await Client.connect(temporal_addr)

    worker = Worker(
        client,
        task_queue=task_queue,
        workflows=[
            "workers.workflows.ingest_workflow.IngestWorkflow",
            "workers.workflows.writeback_workflow.WritebackWorkflow",
            "workers.workflows.enrichment_workflow.EnrichmentWorkflow",
        ],
        activities=[
            "workers.activities.apply_mapping.apply_mapping",
            "workers.activities.apply_mapping.apply_mapping_batch",
            "workers.activities.upsert_crm.upsert_crm_entity",
            "workers.activities.upsert_crm.get_crm_entity",
            "workers.activities.upsert_crm.check_entity_exists",
            "workers.activities.update_crm.update_crm_enrichment",
            "workers.activities.dedup_merge_check.dedup_merge_check",
            "workers.activities.update_hubspot.update_hubspot_contact",
            "workers.activities.update_hubspot.update_hubspot_company",
            "workers.activities.update_hubspot.trigger_enrichiq",
        ],
        activity_executor=ThreadPoolExecutor(max_workers=10),
        workflow_runner=SandboxedWorkflowRunner(
            restrictions=SandboxRestrictions(
                passthrough_modules={
                    "asyncio",
                    "asyncpg",
                    "platform",
                    "socket",
                    "ssl",
                    "select",
                    "os",
                    "sys",
                    "io",
                    "errno",
                    "signal",
                    "threading",
                    "time",
                    "weakref",
                    "collections",
                    "contextvars",
                    "types",
                    "gc",
                    "traceback",
                    "typing",
                    "temporalio",
                    "temporalio.client",
                    "temporalio.worker",
                    "temporalio.workflow",
                    "temporalio.activity",
                    "temporalio.api",
                    "temporalio.bridge",
                    "temporalio.bridge.temporal_sdk_bridge",
                    "google",
                    "google.protobuf",
                    "google.api",
                    "grpc",
                    "posix",
                    "fcntl",
                    "resource",
                    "syslog",
                    "grp",
                    "pwd",
                    "stat",
                },
            ),
        ),
    )

    print(f"Temporal worker connecting to {temporal_addr}, namespace=Integritasmrv, task_queue={task_queue}")
    await worker.run()


if __name__ == "__main__":
    asyncio.run(main())
