import { Tokens } from './tokens';

/** Subscribe the event type and token whot want to call event */
export class EventOrder {
  constructor(public eventType: 'move' | 'add', public token: Tokens = null) {}
}
