import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import FUNDS, { type Fund } from './data/funds.ts';
import type { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

declare global {
  namespace Express {
    interface Request {
      fund?: Fund;
    }
  }
}

interface PortfolioItem {
  id: string;
  quantity: number;
}

// In-memory portfolio
let portfolio: PortfolioItem[] = [];

// GET /funds - List with pagination
app.get('/funds', (req: Request, res: Response) => {
  const funds = FUNDS;
  const page = parseInt(req.query.page as string) ?? 1;
  const limit = parseInt(req.query.limit as string) ?? 10;

  if (page < 1 || limit < 1) {
    return res.status(400).json({ error: 'Invalid pagination parameters' });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedFunds = funds.slice(startIndex, endIndex);

  res.json({
    pagination: {
      page,
      limit,
      totalFunds: funds.length,
      totalPages: Math.ceil(funds.length / limit),
    },
    data: paginatedFunds,
  });
});

const getFundById = (id: string): Fund | undefined => FUNDS.find((f) => f.id === id);

const fundRoute = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    return res.status(400).json({ error: 'Invalid fund ID' });
  }

  const id = req.params.id;
  const fund = getFundById(id);
  if (!fund) {
    return res.status(404).json({ error: 'Fund not found' });
  }

  req.fund = fund;
  next();
};

// GET /funds/:id - Fund details
app.get('/funds/:id', fundRoute, (req: Request, res: Response) => res.json({ data: req.fund }));

// POST /funds/:id/buy - Buy a fund
app.post('/funds/:id/buy', fundRoute, (req: Request, res: Response) => {
  const id = req.fund?.id;
  if (!id) return res.status(404).json({ error: 'Fund not found' });

  const { quantity } = req.body;
  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const holding = portfolio.find((p) => p.id === id);
  if (holding) {
    holding.quantity += quantity;
  } else {
    portfolio.push({ id, quantity });
  }

  res.json({ message: 'Purchase successful', data: { portfolio } });
});

// POST /funds/:id/sell - Sell a fund
app.post('/funds/:id/sell', fundRoute, (req: Request, res: Response) => {
  const id = req.params.id;
  const { quantity } = req.body;

  const holding = portfolio.find((p) => p.id === id);
  if (!holding || holding.quantity < quantity) {
    return res.status(400).json({ error: 'Not enough units to sell' });
  }

  holding.quantity -= quantity;
  if (holding.quantity === 0) {
    portfolio = portfolio.filter((p) => p.id !== id);
  }

  res.json({ message: 'Sale successful', data: { portfolio } });
});

// POST /transfer - Transfer between funds
app.post('/funds/transfer', (req: Request, res: Response) => {
  const { fromFundId, toFundId, quantity } = req.body;
  if (!fromFundId || !toFundId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  if (fromFundId === toFundId) {
    return res.status(400).json({ error: 'Cannot transfer to the same fund' });
  }

  const fromHolding = portfolio.find((p) => p.id === fromFundId);
  if (!fromHolding || fromHolding.quantity < quantity) {
    return res.status(400).json({ error: 'Not enough units to transfer' });
  }

  const toFund = getFundById(toFundId);
  if (!toFund) {
    return res.status(404).json({ error: 'Destination fund not found' });
  }

  fromHolding.quantity -= quantity;
  if (fromHolding.quantity === 0) {
    portfolio = portfolio.filter((p) => p.id !== fromFundId);
  }

  const toHolding = portfolio.find((p) => p.id === toFundId);
  if (toHolding) {
    toHolding.quantity += quantity;
  } else {
    portfolio.push({ id: toFundId, quantity });
  }

  res.json({ message: 'Transfer successful', data: { portfolio } });
});

// GET /portfolio - View current portfolio
app.get('/portfolio', (req: Request, res: Response) => {
  const detailedPortfolio = portfolio.map(p => {
    const fund = getFundById(p.id);
    return {
      id: p.id,
      name: fund?.name,
      quantity: p.quantity,
      totalValue: p.quantity * (fund?.value ?? 0)
    };
  });
  res.json({ data: detailedPortfolio });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
