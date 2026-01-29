export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method "${request.method}" not allowed` });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      return response.status(201).json(migratedMigrations);
    }
  } catch (error) {
    console.error("❌ /api/v1/migrations error:", error);

    return response.status(500).json({
      error: "Internal Server Error",
    });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
