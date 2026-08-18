declare global {
  namespace Express {
    interface Request {
      // будет declaration merging
      user?: {
        id: string
      }
    }
  }
}

// TODO: разобрать, зачем здесь export и нужен ли он здесь
// нужен, чтобы сделать файл модулем; declare global можно писать только в модуле
export {}
