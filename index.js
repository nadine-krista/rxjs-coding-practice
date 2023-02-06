import { interval, of, throwError, interval, fromEvent, timer, from,ajax, Observable} from "rxjs";
import { take, filter, tap } from "rxjs/operators";
import {Subject, BehaviourSubject, ReplaySubject} from 'rxjs';

const btnStart = document.getElementById("btnStart");
const result = document.getElementById("result");
//RxJS marbles can be used to learn more in an interactive way

btnStart.addEventListener("click", () => {
  //order of operators are important
  const stream$ = interval(1000).pipe(
    filter((e) => e % 2 === 0),
    take(3)
  );

  const observer = {
    next: function (e) {
      result.textContent = e;
    },
  };
  const subscription = stream$.subscribe(observer);

  //creating observables
  const stream1$ = of(1, 2, 3, 4, 5, 6, 7, 8, 9);
  const subscrip1 = stream1$.subscribe((e) => {
    result.textContent = e;
    // result.textContent+=e;
  });

  setTimeout(() => {
    subscription.unsubscribe();
    subscrip1.unsubscribe();
  }, 5000);

  //EMPTY, NEVER, throwError are always used to create observables for testing purpose. but should never be used in production
  const data$ = of(1, 2, 3, 4, 5, 6, 7, 8);
  const data1$ = of(1, 2, 3, 4, 5, 6, 7, 8).pipe(tap(e=>console.log('tap',e)));
  const empty$ = EMPTY;
  const never$ = NEVER;
  const error$ = throwError(()=>new Error("Something bad just happened"));
  const time$=interval(1000).pipe(take(3));

  const timer$= timer(5000,1000).subscribe(e=>this.result=e.textContent);
  //from expects an observable input like subscribable, promise, array or iterable and emits the input values synchronously
  from([1,2,3,4,5]).subscribe(e=>console.log(e));

  const p= new Promise(resolve=>setTimeout(()=>resolve(42),2000));
  from(p).subscribe(e=>result.textContent=e);
  //timer waits for some time and then starts emitting an event . it can be used for scheduling future event
  //interval emits emit every time on the interval specified and is used for scheduling recurring event
  //create observables for DOM events using fromEvent
  fromEvent(btnStart,'click').subscribe((e)=>this.result=e.textContent)
  //In UI data, EMPTY, never will always show Complete . in console you will be able to see values
  data$.subscribe({
    next: (e) => {
      console.log(e);
      result.textContent = e;
    },
    error: (error) => (result.textContent = error.message),
    complete: () => (result.textContent = "Complete"),
  });

  //tap operator is mainly used for debugging and it will work only with subscribe

  //Another way of creating observable is using forEach which will return a promise 
  data1$.forEach(e=>console.log(e)).then(()=>console.log('Complete'));

  //using observer Object

  const observerObj={
    next:e=>{
      console.log('Next',e);
      result.textContent=e;
    },
    error:error=>(result.textContent=error.message),
    complete:()=>(result.textContent='Complete')
  }
  const subscription$=data$.subscribe(observerObj);
  const timeSub$=time$.subscribe(observerObj);
  setTimeout(() => {
    subscription$.unsubscribe();
    timeSub$.unsubscribe();
  }, timeout);
  ///ajax uses XMLHttpRequest object
  const url='';
  ajax({url}).subscribe(e=>result.textContent=e);
  ajax.getJSON(url).subscribe(e=>result.textContent=e);

  //Subjects is another way of creating Observables. A Subject is both an observable and a subscriber

    //Special Subjects
    //1. Async Subject - emits value only when completed
    //2. Behaviour Subject- emits the last value when it is subscribed
    //3. ReplaySubject - Emits all previous values when it is subscribed

  const subject$=new Subject();// standard Asyn Subject
  // subject$.subscribe(e=>result.textContent=e);
  // subject$.next('RXJS');
  // subject$.next('is');
  // subject$.next('Cool');

  //Above  will print RXJS then is then Cool

  
  subject$.next('RXJS');
  subject$.next('is');
  subject$.subscribe(e=>result.textContent=e);
  subject$.next('Cool');

  //Above will print Cool in console. ie only after subscribe what is emitted those alone gets logged


  //BehaviourSubject
  const subject1$=new BehaviourSubject('Start');
  subject1$.next('RXJS');
  subject1$.next('is');
  subject1$.subscribe(e=>result.textContent=e);
  subject1$.next('Cool');

  //Above will print is and then Cool

  subject1$.subscribe(e=>result.textContent=e);
  subject1$.next('RXJS');
  subject1$.next('is');
  subject1$.next('Cool');
// Above will print Start and then RXJS is Cool


  subject1$.next('RXJS');
  subject1$.next('is');
  subject1$.next('Cool');
  subject1$.subscribe(e=>result.textContent=e);

  ///Above will give the last emiited value Cool

  const subject2$=new ReplaySubject();
  subject2$.next('RXJS');
  subject2$.next('is');
  subject2$.next('Cool');
  subject2$.subscribe(e=>result.textContent=e);

  //Above prints all RXJS is Cool

  const subject3$=new ReplaySubject(2);
  subject3$.next('RXJS');
  subject3$.next('is');
  subject3$.next('Cool');
  subject3$.subscribe(e=>result.textContent=e);

  //Above prints last 2 is Cool

  //Hot & Cold Observables
  //Cold Observables 
  //Only Starts emitting when there is a subscription. Usually subscriber has its own source of events
  //Most standard Observables are cold what ever we craete using Observable.create
  //Hot Observables start emitting even if theer is no subscription and usally events are shared between all subscriptions
  //Subjects are used to create hot observables

  //Above prints all RXJS is Cool
  //Custom Observables

  function time(ms){
    return interval(ms).pipe(map(()=>new Date().toLocaleTimeString()));
  }
  time(1000).subscribe(e=>result.textContent=e);

  function time(ms){
    return Observable.create(subscriber=>{
      subscriber.next('hello');
    })

    //retrun new Observale with clear interval
    return Observable.create(subscriber=>{
      const handler=setInterval(()=>{
        subscriber.next(new Date().toLocaleTimeString());
      },ms);

      return()=> clearInterval(handler);
    })
  }
});

//Operators
//If we want to find the right operator we can refer the ReactiveX Decision Tree 

//tap is used for side effects and will be used for debugging purpose

//by side effects it means disabling or enabling buttons
timer(2000)
.pipe(tap(console.log),
tap({complete:()=>btnStart.disabled=false}))
.subscribe(e=>console.log(e))

//Map oprator is used to transform data
//filter oprator is used to filter out based on some criteria, pluck operator is also there in case only 1 item is needed
//Examples of other operator sthat filter - take(), takeLast(),first(),last(),skip()
//Take emits first n values and takeLast() emits last n values
//first() and last() are just like take(1) and takeLast(1)

//takeLast() emits only when the input observable is closed ie input observable emits 1, 2, 3 ,4 and closes and then takeLast(1) emits 4
//take(closes when observable closes)
//

//takeWhile - as long as the predicate i strue it keeps emitting once the first failure happens it closes the observable 
//Filter on the other hand will keep the observable open till all the emitted values are filtered 
//takeWhile(x=> x<5)

//[1,3,2, 7, 4,6,10]
//It console 1,3,2 and then stops , closes the observable since 7 is > 5

//takeUntil takes another observable as input . so it is like emit first observable untill the second observable starts emitting
//Once the second obserbale starts the outer observable stops emitting
//can be used to start or stop functionalities. 
//difference between takeWhile and takeUntil is takeWhile take a predicate whereas takeUntil takes another observable

//scan and reduce operators takes accumalator function s along with an optional value 
//scan emits of every accumalated value where as reduce will give the final singles value once the observable closes


//pairwise - pairwise() is used - to give away pairs like previous, current as array , (A,B); (B,C); (C,D)
//It is useful for pairing values emitted

//*Map operators are used to map one observable to another observable

//mergeMap emits values when the nested observables do
//interleaves the results from all observables in the order they were emitted
//concatMap waits for a nested observable to be completed before starting new one
//everything will be ordered
//switchMap emits value from the last nested observable
//startWith immediately emits initial value and then all other values
//Testing library to test rxjs is rxjs-marbles 
//import marbles from rxjs-marbles/jest
//lastValueFrom and firstValueFrom can be used instead of Promise. This will create a promise from an observable and resolve with one item
//subscribe and tap will take an observer object with next, error & complete
//flapMap renamed to mergeMap
//thorwError takes a factory function 
//Instead of Observable.create use new Observable(subscriber=>)
//rxjs operators can be imported from top level rxjs rather than rxjs/operatos

//scerarios 
/*



























*/

if (module.hot) {
  module.hot.dispose(function () {
    location.reload();
  });
}
