import { CancelExecutor, CancelToken as ICancelToken, Canceler, CancelTokenSource } from '../types'

interface ResolvePromise {
  (reason?: string): void
}

export default class CancelToken implements ICancelToken {
  promise: Promise<string>
  reason?: string

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise((resolve) => {
      resolvePromise = resolve as ResolvePromise
    })
    executor((message) => {
      // 防止多次取消
      if (this.reason) {
        return
      }
      this.reason = message
      // 变更promise状态
      resolvePromise(message)
    })
  }
  throwIfRequested() {
    if (this.reason) {
      throw new Error(this.reason)
    }
  }
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken((c) => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
