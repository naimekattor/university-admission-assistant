import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        return res.status(400).json({
          success: false,
          error: 'Validation Failed',
          details: issues.map((e: any) => ({ field: Array.isArray(e.path) ? e.path.join('.') : String(e.path), message: e.message })),
        });
      }
      next(error);
    }
  };
}
