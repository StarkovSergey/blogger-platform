import { NextFunction, Request, Response } from 'express'
import { matchedData } from 'express-validator'

/**
 * Нужен, чтобы доставать трансформированные значения из внутреннего хранилища валидатора.
 * А далее перезаписываем values на трансформированные.
 * Ставится в цепочке ПОСЛЕ валидаторов и `inputValidationResultMiddleware`; в handler уже попадают трансформированные значения
 * */
export function sanitizeQueryMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const sanitized = matchedData(req, {
    locations: ['query'],
    includeOptionals: true,
  })

  // Нужно именно `.defineProperty`, т.к. обычное присваивание запрещено getter'ом (в Express 5 req.query — иммутабельный getter)
  Object.defineProperty(req, 'query', {
    value: { ...req.query, ...sanitized },
    configurable: true,
    enumerable: true,
    writable: false,
  })

  next()
}
