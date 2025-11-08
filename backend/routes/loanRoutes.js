import express from 'express';
import {
  saveSimulation,
  getUserSimulations,
  deleteSimulation,
  getStatistics
} from '../services/firestoreService.js';

const router = express.Router();

// Save simulation
router.post('/simulations', async (req, res) => {
  try {
    const { userId, ...simulationData } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const simulation = await saveSimulation(userId, {
      ...simulationData,
      timestamp: simulationData.timestamp || new Date().toISOString()
    });
    
    res.json({ message: 'Simulation saved successfully', simulation });
  } catch (error) {
    console.error('Error saving simulation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user simulations
router.get('/simulations', async (req, res) => {
  try {
    const { userId, page = 1, limit = 50, startDate, endDate } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const result = await getUserSimulations(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      startDate,
      endDate
    });
    
    res.json(result);
  } catch (error) {
    console.error('Error getting simulations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete simulation
router.delete('/simulations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteSimulation(id);
    res.json({ message: 'Simulation deleted successfully' });
  } catch (error) {
    console.error('Error deleting simulation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get loan offers (static/synthetic data)
router.get('/loans', async (req, res) => {
  try {
    const { preference = 'lowestEMI' } = req.query;
    
    // Synthetic loan data
    const loanOffers = [
      {
        id: 1,
        bankName: 'Prime Bank',
        interestRate: 4.5,
        tenure: 60,
        eligibilityRange: '50000-200000',
        approvalTime: '2-3 days',
        emi: 1865,
        maxAmount: 200000
      },
      {
        id: 2,
        bankName: 'Quick Finance',
        interestRate: 5.2,
        tenure: 48,
        eligibilityRange: '30000-150000',
        approvalTime: '1-2 days',
        emi: 1932,
        maxAmount: 150000
      },
      {
        id: 3,
        bankName: 'Secure Lending',
        interestRate: 3.8,
        tenure: 72,
        eligibilityRange: '60000-250000',
        approvalTime: '5-7 days',
        emi: 1756,
        maxAmount: 250000
      },
      {
        id: 4,
        bankName: 'FastTrack Loans',
        interestRate: 5.8,
        tenure: 36,
        eligibilityRange: '25000-100000',
        approvalTime: '24 hours',
        emi: 2100,
        maxAmount: 100000
      },
      {
        id: 5,
        bankName: 'Elite Banking',
        interestRate: 4.2,
        tenure: 84,
        eligibilityRange: '80000-300000',
        approvalTime: '3-5 days',
        emi: 1820,
        maxAmount: 300000
      }
    ];

    // Sort based on preference
    const sortedOffers = [...loanOffers].sort((a, b) => {
      switch (preference) {
        case 'lowestEMI':
          return a.emi - b.emi;
        case 'lowestInterest':
          return a.interestRate - b.interestRate;
        case 'fastestApproval':
          const aTime = parseInt(a.approvalTime);
          const bTime = parseInt(b.approvalTime);
          return aTime - bTime;
        default:
          return 0;
      }
    });

    res.json(sortedOffers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/statistics', async (req, res) => {
  try {
    const { loanType, timeRange } = req.query;
    
    const statistics = await getStatistics({ loanType, timeRange });
    res.json(statistics);
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export functionality
router.get('/export/:format', async (req, res) => {
  try {
    const { format } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    if (format === 'csv') {
      const result = await getUserSimulations(userId, { page: 1, limit: 1000 });
      const simulations = result.simulations || [];
      
      const csv = [
        ['Date', 'Score', 'Risk Category', 'Income', 'Expenses', 'Credit Score'].join(','),
        ...simulations.map(sim => [
          sim.timestamp ? new Date(sim.timestamp).toISOString() : '',
          sim.score || 0,
          sim.riskCategory || '',
          sim.financialData?.income || 0,
          sim.financialData?.expenses || 0,
          sim.financialData?.creditScore || 0
        ].join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=simulations.csv');
      res.send(csv);
    } else if (format === 'pdf') {
      // PDF export would require pdfkit or similar library
      res.status(501).json({ error: 'PDF export not yet implemented' });
    } else {
      res.status(400).json({ error: 'Invalid format. Use csv or pdf' });
    }
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

