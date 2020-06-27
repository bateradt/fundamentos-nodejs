import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface RequestTransactionDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: RequestTransactionDTO): Transaction {
    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    if (type !== 'income' && type !== 'outcome') {
      throw Error('Invalid content for field type');
    }

    if (type === 'outcome') {
      const balance = this.transactionsRepository.getBalance();
      const tempTotal = balance.total - value;
      if (tempTotal < 0) {
        throw Error('insufficient funds to perform this transaction');
      }
    }

    return transaction;
  }
}

export default CreateTransactionService;
