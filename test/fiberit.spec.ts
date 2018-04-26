import {expect} from 'chai';
import {NodeCallback, Fiberit} from "../src/fiberit";
import * as fibers from "fibers";

describe("given waiter", () => {
  describe("when launch fiber", () => {
    it("then should create a fiber", (done) => {
      Fiberit.launchFiber(() => {
        expect(fibers.current).to.not.null;
        done();
      });
    });
  });

  describe("when wait for an async function", () => {
    it("then should yield execution", (done) => {
      Fiberit.launchFiber(() => {
        const theNumber: number = Fiberit.for<number>(asynFunction, 5);
        expect(theNumber).to.equal(10);
        done();
      });
    });
  });

  describe("when wait for method property", () => {
    it("then should yield execution", (done) => {
      Fiberit.launchFiber(() => {
        const sut = new TestAsyncMethodClass();
        const theNumber = Fiberit.forMethod<TestAsyncMethodClass, number>(sut, 'someAsyncMethod', 5);
        expect(theNumber).to.equal(10);
        done();
      });
    });
  });

  describe("when wait for a promise", () => {
    it("then should return data if promise is resolved", (done) => {
      Fiberit.launchFiber(() => {
        const sut = new TestAsyncMethodClass();
        const theNumber = Fiberit.forPromise<TestAsyncMethodClass, number>(sut, 'somePromise', 5);
        expect(theNumber).to.equal(5);
        done();
      });
    });

    it("then should throw if promise is rejected", (done) => {
      Fiberit.launchFiber(() => {
        const sut = new TestAsyncMethodClass();
        const shouldThrow = () => Fiberit.forPromise<TestAsyncMethodClass, number>(sut, 'someRejectPromise', 5);
        expect(shouldThrow).to.throw("An error");
        done();
      });
    });

    describe("when resolve promise but expect fails", () => {
      it("then should throw outside promise", (done) => {
        Fiberit.launchFiber(() => {
          const sut = new TestAsyncMethodClass();
          const theNumber = Fiberit.forPromise<TestAsyncMethodClass, number>(sut, 'somePromise', 5);
          expect(theNumber).to.equal(15);
          done();
        });
      });
    });
  });
});


function asynFunction(someNumber: number, cb: Function) {
  setTimeout(() => cb(null, someNumber * 2), 500);
}

class TestAsyncMethodClass {
  someAsyncMethod(someNumber: number, cb: NodeCallback<number>) {
    setTimeout(() => cb(null, someNumber * 2), 500);
  }

  somePromise(someNumber: number): Promise<number> {
    return new Promise<number>(resolve => setTimeout(() => resolve(someNumber), 500));
  }

  someRejectPromise(someNumber: number): Promise<number> {
    return new Promise<number>((_, reject) => setTimeout(() => reject("An error"), 500));
  }
}
