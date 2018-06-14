import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { PlayLogicService } from '@logic/play-logic.service';
import { takeUntil } from 'rxjs/operators';
import { Tokens } from '@logic/clasess/tokens';
import { LogerService } from '@loger/loger.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  /** For unsubscribe from all subscriptions when destroy component */
  private _whenDestroy: Subject<boolean> = new Subject();

  /** subscription for stable array */
  private _whenStable: Subscription;

  /** Default init values */
  public defaultInitValues = new Tokens(0, '0', 0);

  /** Lenght of play array */
  public playArrayLength = 100;

  /** Displayed play area*/
  public playView = '';

  /** Show console log or not */
  public showlog = true;

  constructor(public logic: PlayLogicService, private cd: ChangeDetectorRef, public loger: LogerService) {}

  /** Init params of game and subscribe to stables views */
  initPlayArray(length = this.playArrayLength, bgTokens = this.defaultInitValues) {
    // When initiated allready done
    if (this._whenStable) {
      console.error('Subscription _whenStable is not empty 0_o');
      return;
    }
    this.loger.show = this.showlog;
    this._whenStable = this.logic
      .createGame(length, bgTokens)
      .pipe(takeUntil(this._whenDestroy))
      .subscribe(stableArrray => {
        this.playView = stableArrray.toString().replace(/,/gm, '');
        this.cd.markForCheck();
      });
  }

  /** Add new token to game */
  add() {
    this.logic.addToken(new Tokens(1, '1', 1));
  }

  ngOnInit() {
    this.initPlayArray();
  }

  ngOnDestroy() {
    //  Unsubscribe from all subscriptions in this component
    this._whenDestroy.next(true);
  }
}
