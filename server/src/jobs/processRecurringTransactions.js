const MongooseRecurringTransactionRepository = require("../infrastructure/repositories/MongooseRecurringTransactionRepository");
const MongooseTransactionRepository = require("../infrastructure/repositories/MongooseTransactionRepository");
const CreateTransaction = require("../application/use_cases/transaction/CreateTransaction");

class ProcessRecurringTransactions {
  constructor(recurringTransactionRepository, transactionRepository) {
    this.recurringTransactionRepository = recurringTransactionRepository;
    this.transactionRepository = transactionRepository;
  }

  async execute() {
    try {
      console.log("[ProcessRecurringTransactions] Starting job...");
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of day

      // Find all recurring transactions due today
      const dueTransactions =
        await this.recurringTransactionRepository.findDueToday();
      console.log(
        `[ProcessRecurringTransactions] Found ${dueTransactions.length} recurring transactions due today`
      );

      let processedCount = 0;
      let skippedCount = 0;

      for (const recurringTransaction of dueTransactions) {
        try {
          // Check if already executed today
          if (recurringTransaction.lastExecuted) {
            const lastExecutedDate = new Date(
              recurringTransaction.lastExecuted
            );
            lastExecutedDate.setHours(0, 0, 0, 0);

            if (lastExecutedDate.getTime() === today.getTime()) {
              console.log(
                `[ProcessRecurringTransactions] Skipping ${recurringTransaction.name} - already executed today`
              );
              skippedCount++;
              continue;
            }
          }

          // Create the actual transaction
          const transactionData = {
            userId: recurringTransaction.userId,
            accountId: recurringTransaction.accountId,
            categoryId:
              recurringTransaction.categoryId._id ||
              recurringTransaction.categoryId,
            amount: recurringTransaction.amount,
            type: recurringTransaction.type,
            description: `${recurringTransaction.name} (Recurring)`,
            date: new Date(),
          };

          const createTransaction = new CreateTransaction(
            this.transactionRepository
          );
          await createTransaction.execute(transactionData);

          // Update lastExecuted
          await this.recurringTransactionRepository.update(
            recurringTransaction.id,
            {
              lastExecuted: new Date(),
            }
          );

          console.log(
            `[ProcessRecurringTransactions] Processed: ${recurringTransaction.name} - $${recurringTransaction.amount}`
          );
          processedCount++;
        } catch (error) {
          console.error(
            `[ProcessRecurringTransactions] Error processing ${recurringTransaction.name}:`,
            error.message
          );
        }
      }

      console.log(
        `[ProcessRecurringTransactions] Job completed. Processed: ${processedCount}, Skipped: ${skippedCount}`
      );
      return { processedCount, skippedCount };
    } catch (error) {
      console.error("[ProcessRecurringTransactions] Job failed:", error);
      throw error;
    }
  }
}

// Initialize and export
const recurringTransactionRepository =
  new MongooseRecurringTransactionRepository();
const transactionRepository = new MongooseTransactionRepository();
const processRecurringTransactions = new ProcessRecurringTransactions(
  recurringTransactionRepository,
  transactionRepository
);

module.exports = processRecurringTransactions;
