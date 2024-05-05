import {RealEmitter} from './event'

export class EventLink {
  elemID?: string
  destDirect?: any
  propName: string
}

export class EventProperty<T> {
  value?: T
  name: string
  owner: RealEmitter<any>
  allowDisconnect: boolean = false

  links: EventLink[] = []

  constructor(owner: RealEmitter<any>, name: string) {
    this.owner = owner
    this.name = name
  }

  emit(value?: T): this {
    if (value !== undefined) {
      this.value = value
    }

    for (const link of this.links) {
      const dest = this.resolveLink(link)

    }

    return this
  }
}
