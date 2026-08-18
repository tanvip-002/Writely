import { seedInitialDatabase } from "../src/lib/initial-data";

async function main() {
  console.log("Seeding database...");
  await seedInitialDatabase();
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
