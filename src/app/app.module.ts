import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlayLogicService } from '@logic/play-logic.service';
import { PlayRulesService } from '@logic/play-rules.service';
import { LogerService } from '@loger/loger.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [PlayLogicService, PlayRulesService, LogerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
