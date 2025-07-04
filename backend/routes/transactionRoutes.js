const express = require('express');
const router = express.Router();

// Mock data for transactions
const mockTransactions = [
  {
    id: 1,
    type: 'credit',
    amount: 1500.00,
    description: 'Salary deposit',
    date: '2024-01-15T10:30:00Z',
    category: 'income',
    status: 'completed'
  },
  {
    id: 2,
    type: 'debit',
    amount: 89.99,
    description: 'Online purchase',
    date: '2024-01-14T15:45:00Z',
    category: 'shopping',
    status: 'completed'
  },
  {
    id: 3,
    type: 'debit',
    amount: 45.50,
    description: 'Restaurant payment',
    date: '2024-01-13T19:20:00Z',
    category: 'food',
    status: 'completed'
  }
];

// GET all transactions
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      data: mockTransactions,
      count: mockTransactions.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
});

// GET transaction by ID
router.get('/:id', (req, res) => {
  try {
    const transaction = mockTransactions.find(t => t.id === parseInt(req.params.id));
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction'
    });
  }
});

// POST new transaction
router.post('/', (req, res) => {
  try {
    const { type, amount, description, category } = req.body;
    
    if (!type || !amount || !description) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const newTransaction = {
      id: mockTransactions.length + 1,
      type,
      amount: parseFloat(amount),
      description,
      category: category || 'other',
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    mockTransactions.push(newTransaction);
    
    res.status(201).json({
      success: true,
      data: newTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create transaction'
    });
  }
});

// GET transaction statistics
router.get('/stats/summary', (req, res) => {
  try {
    const totalTransactions = mockTransactions.length;
    const totalCredit = mockTransactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = mockTransactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    res.json({
      success: true,
      data: {
        totalTransactions,
        totalCredit,
        totalDebit,
        netAmount: totalCredit - totalDebit,
        averageAmount: (totalCredit + totalDebit) / totalTransactions
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

module.exports = router;
