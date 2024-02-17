import { getConnection } from "../db";

export const TransactionIn = async (card: string, inStation: string) => {
  try {
    // Get the database and collection
    const db = await getConnection();
    const transactionsCollection = db.collection("Transactions");

    // Check if card exists
    const existingTransaction = await transactionsCollection.findOne({ card });
    if (existingTransaction) {
      // If card exists, add new transaction to the existing transactions array
      await transactionsCollection.updateOne(
        { card },
        {
          $push: {
            transactions: {
              inStation,
              outStation: "",
              distance: 0,
              cost: 0,
              dateIn: new Date().toISOString(),
              dateOut: "",
            },
          },
        }
      );
    } else {
      // If card doesn't exist, create a new transaction
      const newTransaction = {
        card,
        transactions: [
          {
            inStation,
            outStation: "",
            distance: 0,
            cost: 0,
            dateIn: new Date().toISOString(),
            dateOut: "",
          },
        ],
      };
      await transactionsCollection.insertOne(newTransaction);
    }
  } catch (error) {
    console.error("Error creating transaction:", error);
  }
};

export const TransactionOut = async (card:string,outStation:string,cost:number,distance:number) => {

    try {
        // Get the database and collection
        const db = await getConnection()
        const transactionsCollection = db.collection('Transactions');
    
        // Find the transaction corresponding to the card
        const existingTransaction = await transactionsCollection.findOne({ card });
    
        if (!existingTransaction) {
          return 
        }
    
        // Find the latest transaction and update tap out details
        const latestTransactionIndex = existingTransaction.transactions.length - 1;
        existingTransaction.transactions[latestTransactionIndex].outStation = outStation;
        existingTransaction.transactions[latestTransactionIndex].distance = distance;
        existingTransaction.transactions[latestTransactionIndex].cost = cost;
        existingTransaction.transactions[latestTransactionIndex].dateOut = new Date().toISOString();
    
        // Update the document in the collection
        await transactionsCollection.updateOne(
          { card },
          { $set: { transactions: existingTransaction.transactions } }
        );
}catch(error){
    console.error("Error creating transaction:", error);

}}
