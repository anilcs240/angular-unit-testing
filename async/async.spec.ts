import {
  async,
  ComponentFixture,
  fakeAsync,
  flush,
  flushMicrotasks,
  TestBed,
  tick,
} from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe("async test example with done", () => {
  it("async  example", (done: DoneFn) => {
    let test = false;
    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 500);
  });

  it("async  example", fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      test = true;
    }, 500);

    tick(500); // clear macrotask as btn click, setimeout,setinterval and advance time flush  works  as tick
    expect(test).toBeTruthy();
  }));

  it("promised based async  example", fakeAsync(() => {
    let test = false;
    setTimeout(() => {
      test = true;
    }, 500);

    flush();
    expect(test).toBeTruthy();
  }));

  it("promised based async  example", fakeAsync(() => {
    let test = false;
    Promise.resolve().then(() => {
      test = true;
    });
    flushMicrotasks();
    expect(test).toBeTruthy();
  }));

  it("promised based async  example", fakeAsync(() => {
    let test = false;
    Promise.resolve().then(() => {
      setTimeout(() => (test = true), 500);
    });
    flushMicrotasks(); // clear microtask ques like promise return elapased time
    tick(500);

    expect(test).toBeTruthy();
  }));

  it("observal  based sync  example", fakeAsync(() => {
    let test = false;

    const test$ = of(test);
    test$.subscribe(() => {
      test = true;
    });

    flushMicrotasks();
    expect(test).toBeTruthy();
  }));

  it("observal  based async  example", fakeAsync(() => {
    let test = false;

    const test$ = of(test).pipe(delay(500));
    test$.subscribe(() => {
      test = true;
    });

    tick(1000);
    expect(test).toBeTruthy();
  }));
});
