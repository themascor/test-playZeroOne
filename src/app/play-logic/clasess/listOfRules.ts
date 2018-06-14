import { TokenType, Tokens } from './tokens';
/** Subscribe the rules of action for specify types of token  */
export class ListOfRules {
  constructor(
    public type: TokenType,
    // Order in array is  define priority of rule
    public rules: Array<(tokenIndex: number, playArray: Tokens[], bgToken: Tokens) => Promise<Tokens[] | null>>,
    public that: any
  ) {}
}
