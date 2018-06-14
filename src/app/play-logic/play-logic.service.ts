import { LogerService } from '@loger/loger.service';
import { EventOrder } from './clasess/eventOrder';
import { Tokens, TokenType } from '@logic/clasess/tokens';
import { PlayRulesService } from '@logic/play-rules.service';
import { ListOfRules } from '@logic/clasess/listOfRules';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { tokenKey } from '@angular/core/src/view';

@Injectable({
  providedIn: 'root'
})
export class PlayLogicService {
  /** Place when games is in progress */
  private _game: Tokens[] = [];

  /** Order of events to be checked*/
  private _eventOrder: EventOrder[] = [];

  /** Is rules implemention in progress */
  private _waitImplement = false;

  /** User choose whot token be in background */
  private _bgToken: Tokens = null;

  /** Run interval*/
  private _run: any = null;

  /** Send view of initiated array */
  private _showFisrtView = true;

  /** Fire when array is stable and can be output in view */
  public whenStable$: Subject<string[]> = new Subject<string[]>();

  constructor(private _playRuls: PlayRulesService, public to: LogerService) {}
  /**
   * Creating play array and fill with in background tokens and run game process
   * @param length length of play array
   * @param bgToken token as background
   */
  createGame(length = 1, bgToken: Tokens = new Tokens(0, '0', 0)): Subject<string[]> {
    // When game already run return its stable views
    if (this._game.length > 0) {
      return this.whenStable$;
    }
    length = length > 0 ? length : 1;
    this._game = [];
    this._bgToken = bgToken;
    this._game.length = length;
    this._game.fill(bgToken);
    this._runGame();
    return this.whenStable$;
  }

  /** Add new token to game */
  addToken(token: Tokens = new Tokens(1, '1', 1)) {
    this._eventOrder.push(new EventOrder('add', token));
  }

  /** Run game progress  */
  private _runGame() {
    this._run = setInterval(() => {
      // If need send view of fill aray whith bg Tokens
      if (this._showFisrtView) {
        this._sendStableView();
        this._showFisrtView = false;
      }
      // When prvios cheking is finish and order is not empty
      if (!this._waitImplement && this._eventOrder.length > 0) {
        this._check();
      }
    });
  }

  /** Do job form event order */
  private _check(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        // Set flag of bussy
        this._waitImplement = true;
        // Take first event on order and remove it from order
        const currentEvent = this._eventOrder.shift();
        this.to.log(`Token ID: ${currentEvent.token.id}, Event: ${currentEvent.eventType}`);
        // See whot the event we take
        switch (currentEvent.eventType) {
          case 'add':
            // Add new token to game array
            const newToken = currentEvent.token;
            this._injectNewTokensToGame(newToken).then(() => {
              this._waitImplement = false;
              resolve(true);
              this._sendStableView();
            });
            break;
          case 'move':
            // Some token whont to move at new position
            const idOfToken = currentEvent.token.id;
            this._implementRules(idOfToken).then(() => {
              this._sendStableView();
              this._waitImplement = false;
              resolve(true);
            });
            break;
          default:
            console.warn(`Have no jobs for action: ${currentEvent.eventType}`);
            this._waitImplement = false;
            resolve(true);
            break;
        }
      } catch (error) {
        reject(error);
        this._waitImplement = false;
      }
    });
  }
  // Fire ruls for token type
  private async _implementRules(tokenId: string): Promise<void> {
    try {
      const index = this._getTokenIndexById(tokenId, this._game);
      // If token not in order just trow it
      if (index === null) {
        return;
      }
      const token = this._game[index];
      const typeRules = this._getRulesByTokenType(token.type);
      // If havent rules for this tokens  type  just trow it
      if (typeRules === null) {
        return;
      }
      const rules = typeRules.rules;
      outer: for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const result = await rule.call(typeRules.that, index, this._game, this._bgToken);
        // Stop after fisrt implentation
        if (result !== null) {
          this._game = result;
          break outer;
        }
      }
    } catch (error) {
      throw error;
    }
  }
  /** Get index of toke in array */
  private _getTokenIndexById(id: string, arrayOfTokens: Tokens[]): number | null {
    for (let i = 0; i < arrayOfTokens.length; i++) {
      const token = arrayOfTokens[i];
      if (token.id == id) {
        return i;
      }
    }
    return null;
  }
  /** Get reules for token type */
  private _getRulesByTokenType(tokenType: TokenType): ListOfRules | null {
    for (let i = 0; i < this._playRuls.rules.length; i++) {
      const rules = this._playRuls.rules[i];
      if ((rules.type = tokenType)) {
        return rules;
      }
    }
    return null;
  }

  /** Return array of view of tokens */
  private _makeViewArrayFromTokens(arrayOfTokens: Tokens[]): string[] {
    let view: string[] = [];
    arrayOfTokens.forEach(token => {
      view.push(token.token);
    });
    return view;
  }
  /** Add new token to game array */
  private _injectNewTokensToGame(token: Tokens): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const tokenToReplace = this._game[token.initPosition];
      if (token.canReplace.indexOf(tokenToReplace.type) < 0) {
        this.to.log('Cant replace token type:', tokenToReplace.type);
        resolve(false);
        return;
      }
      this._game[token.initPosition] = token;
      const interval = setInterval(() => {
        if (this._getTokenIndexById(token.id, this._game) == null) {
          this.to.log('Cant find id in order... stop listening', token.id);
          clearInterval(interval);
        }
        this._eventOrder.push(new EventOrder('move', token));
      }, token.timeOut);
      resolve(true);
    });
  }
  /** Send view of game to consumer */
  private _sendStableView() {
    const stableView = this._makeViewArrayFromTokens(this._game);
    this.whenStable$.next(stableView);
  }
}
