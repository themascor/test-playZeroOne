import { ListOfRules } from './clasess/listOfRules';
import { Injectable } from '@angular/core';
import { Tokens } from './clasess/tokens';
import { LogerService } from '@loger/loger.service';

@Injectable()
export class PlayRulesService {
  /** Describe rules for token types */
  public rules: ListOfRules[] = [
    {
      type: 1,
      // Order in array is  define priority of rule
      rules: [this.comeToRightLimit, this.comeToLeftLimit, this.nextSameToken, this.goToNext],
      that: this
    }
  ];

  constructor(public to: LogerService) {}

  /** Whet token come to end of array */
  public comeToRightLimit(tokenIndex: number, playArray: Tokens[], bgToken: Tokens): Promise<Tokens[] | null> {
    return new Promise((resolve, reject) => {
      try {
        const token = playArray[tokenIndex];
        if (tokenIndex + token.direction + 1 > playArray.length) {
          playArray[tokenIndex].direction = -1;
          this.to.log('Coming to right limit of game area');
          this.goToNext(tokenIndex, playArray, bgToken)
            .then(array => {
              resolve(array);
            })
            .catch(err => reject(err));
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /** Whe token come to begin of array */
  public comeToLeftLimit(tokenIndex: number, playArray: Tokens[], bgToken: Tokens): Promise<Tokens[] | null> {
    return new Promise((resolve, reject) => {
      try {
        const token = playArray[tokenIndex];
        if (tokenIndex + token.direction < 0) {
          playArray[tokenIndex].direction = 1;
          this.to.log('Coming to left limit of game area');
          this.goToNext(tokenIndex, playArray, bgToken)
            .then(array => {
              resolve(array);
            })
            .catch(err => reject(err));
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /** When token gona step to position when same token allready stay */
  public nextSameToken(tokenIndex: number, playArray: Tokens[], bgToken: Tokens): Promise<Tokens[] | null> {
    return new Promise((resolve, reject) => {
      try {
        const curentToken = playArray[tokenIndex];
        const nextToken = playArray[tokenIndex + curentToken.direction];
        if (nextToken !== undefined && curentToken.type === nextToken.type) {
          playArray[tokenIndex].direction *= -1;
          this.to.log('On next step finded the same token');
          this.goToNext(tokenIndex, playArray, bgToken)
            .then(array => {
              resolve(array);
            })
            .catch(err => reject(err));
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /** Make step to next position in direction define in token */
  public goToNext(tokenIndex: number, playArray: Tokens[], bgToken: Tokens): Promise<Tokens[] | null> {
    return new Promise((resolve, reject) => {
      try {
        const curentToken = playArray[tokenIndex];
        const nextToken = playArray[tokenIndex + curentToken.direction];
        if (nextToken !== undefined && curentToken.canReplace.indexOf(nextToken.type) >= 0) {
          playArray[tokenIndex] = bgToken;
          playArray[tokenIndex + curentToken.direction] = curentToken;
          this.to.log('Jump to next pisition in move direction');
          resolve(playArray);
        } else {
          resolve(null);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
