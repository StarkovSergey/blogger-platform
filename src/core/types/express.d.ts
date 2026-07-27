declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
      }
    }
  }
}

// TODO: разобрать, зачем здесь export и нужен ли он здесь
export {}
