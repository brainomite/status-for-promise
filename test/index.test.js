const { expect } = require("chai");
const { addStatusToPromise } = require("../lib");

describe("addStatusToPromise", () => {
  it("should be a function", () => {
    expect(addStatusToPromise).to.be.instanceof(Function);
  });

  it("Should mutate and return the promise", async () => {
    const beforePromise = Promise.resolve();
    const afterPromise = addStatusToPromise(beforePromise);
    expect(beforePromise === afterPromise).to.be.true;
  });

  it("Should throw an error if the any of the properties already exist", () => {
    const aThenable = {
      isSettled: undefined,
      catch: () => {},
      then: () => {},
    };
    let errorThrown = false;
    try {
      addStatusToPromise(aThenable);
    } catch (e) {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true;
  });

  it("Should throw an error if then or catch are not functions", () => {
    const notAThenable = {
      isSettled: undefined,
      isFulfilled: undefined,
      isRejected: undefined,
    };
    let errorThrown = false;
    try {
      addStatusToPromise(notAThenable);
    } catch (e) {
      errorThrown = true;
    }
    expect(errorThrown).to.be.true;
  });

  it("Should initialize in a non-settled state", () => {
    const unsettledPromise = new Promise(() => {});
    addStatusToPromise(unsettledPromise);
    expect(unsettledPromise.isSettled).to.be.false;
    expect(unsettledPromise.isFulfilled).to.be.null;
    expect(unsettledPromise.isRejected).to.be.null;
  });

  it("Should correctly set properties after the promise has been resolved", (done) => {
    const resolvedPromise = new Promise((resolve) => resolve());
    addStatusToPromise(resolvedPromise);
    setTimeout(() => {
      expect(resolvedPromise.isSettled).to.be.true;
      expect(resolvedPromise.isFulfilled).to.be.true;
      expect(resolvedPromise.isRejected).to.be.false;
      done();
    });
  });

  it("Should correctly set properties after the promise has been rejected", (done) => {
    const rejectedPromise = new Promise((_, reject) => reject());
    addStatusToPromise(rejectedPromise);
    setTimeout(() => {
      expect(rejectedPromise.isSettled).to.be.true;
      expect(rejectedPromise.isFulfilled).to.be.false;
      expect(rejectedPromise.isRejected).to.be.true;
      done();
    });
  });
});