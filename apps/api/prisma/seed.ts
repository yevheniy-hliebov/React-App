import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Function to seed the priority table with 'Low', 'Medium', and 'High' values
async function seedPriority() {
  const priorities = ['Low', 'Medium', 'High']
  for (const priority of priorities) {
    await prisma.priority.create({
      data: {
        name: priority
      }
    })
  }
}

// Function to seed the taskList table with 'To Do', 'Planned', 'In progress', and 'Closed' values
async function seedBasicTaskList() {
  const lists = ['To Do', 'Planned', 'In progress', 'Closed']
  for (const list of lists) {
    await prisma.taskList.create({
      data: {
        name: list
      }
    })
  }
}

// Function to run the seed functions and disconnect from the Prisma client
async function seed() {
  await Promise.all([seedPriority(), seedBasicTaskList()]);
  await prisma.$disconnect();
}

// Call the seed function and catch any errors
seed()
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
