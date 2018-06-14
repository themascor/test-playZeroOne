/** Contain the list of posible token types */
export type TokenType = 0 | 1;

/** Contain the token paramets*/
export class Tokens {
  constructor(
    // Type of token
    public type: TokenType = 1,
    //  String to view token
    public token: string = '0',
    // Direction and large of step when token move
    public direction: -1 | 0 | 1 = 1,
    // Time out for token move
    public timeOut = 500,
    // Default postion when token will be init in game
    public initPosition: number = 0,
    // Id of token
    public id: string = `${new Date()
      .getTime()
      .toString()
      .slice(-6)}.${Math.random()
      .toString()
      .slice(-4)}`,
    // List of types token can replace when do move in game
    public canReplace: TokenType[] = [0]
  ) {}
}
