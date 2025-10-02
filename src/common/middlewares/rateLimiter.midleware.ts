import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

// Create the rate limiter instance once
const limiter = rateLimit({
  windowMs:  1000, 
  max: 10, // Limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    // Instead of sending response directly, throw Nest exception
    // Nest will catch this in your global exception filter
    next(new BadRequestException("too many requests in limited time"));
  },
  standardHeaders: true, // Include rate limit info in response headers
  legacyHeaders: false,  // Disable deprecated headers
});

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    limiter(req, res, next); // Reuse the singleton instance
  }
}
