import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, interval } from 'rxjs';
import { takeUntil, map, shareReplay, tap, distinctUntilChanged } from 'rxjs/operators';

const DEG_PER_H = 360 / 12;
const DEG_PER_MIN = 360 / 60;
const DEG_PER_SEC = DEG_PER_MIN;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  destroy$: Subject<void> = new Subject();
  hourDegrees$: Observable<number>;
  minDegrees$: Observable<number>;
  secDegrees$: Observable<number>;

  @ViewChild('hrHand', {static : false}) hrHand : ElementRef;
  @ViewChild('minHand', {static : false}) minHand : ElementRef;
  @ViewChild('secHand', {static : false}) secHand : ElementRef;
  constructor(){
    
  }
  ngOnInit() {
    const date$ = interval(250)
      .pipe(
        takeUntil(this.destroy$),
        map(() => new Date()),
        shareReplay()
      );
    this.hourDegrees$ = date$.pipe(
      map(date => DEG_PER_H * date.getHours() + date.getMinutes()*0.5),
      distinctUntilChanged()
    );
    this.minDegrees$ = date$.pipe(
      map(date => DEG_PER_MIN * date.getMinutes() ),
      distinctUntilChanged()
    );
    this.secDegrees$ = date$.pipe(
      map(date => DEG_PER_SEC * date.getUTCSeconds() ),
      distinctUntilChanged()
    );
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  updateClock(date){
    this.secHand.nativeElement.style.transform='rotate('+date.getSeconds()*6 +'deg)';
    this.minHand.nativeElement.style.transform='rotate('+date.getMinutes() * 6 +'deg)';
    this.hrHand.nativeElement.style.transform='rotate('+date.getHours() * 30+'deg)';
  }
}
