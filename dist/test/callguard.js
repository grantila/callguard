'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
require("mocha");
var chai_1 = require("chai");
var sinon = require("sinon");
var _1 = require("../");
function immediate() {
    return new Promise(function (resolve) { return setImmediate(resolve); });
}
function rejection(promise) {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promise];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, err_1];
                case 3: throw new Error("Expected promise to contain exception");
            }
        });
    });
}
describe('sync', function () {
    it('should allow success flow through with undefined', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            spy = sinon.spy();
            fn = _1.syncGuard(spy);
            ret = fn(function () { return void (0); })();
            chai_1.expect(ret).to.be.undefined;
            sinon.assert.notCalled(spy);
            return [2 /*return*/];
        });
    }); });
    it('should allow success flow through with null', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            spy = sinon.spy();
            fn = _1.syncGuard(spy);
            ret = fn(function () { return null; })();
            chai_1.expect(ret).to.be.null;
            sinon.assert.notCalled(spy);
            return [2 /*return*/];
        });
    }); });
    it('should allow success flow through with value', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            spy = sinon.spy();
            fn = _1.syncGuard(spy);
            ret = fn(function () { return "foo"; })();
            chai_1.expect(ret).to.equal("foo");
            sinon.assert.notCalled(spy);
            return [2 /*return*/];
        });
    }); });
    it('should forward zero argument', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            spy = sinon.spy();
            fn = _1.syncGuard(spy);
            ret = fn(function (value) { return value; })();
            chai_1.expect(ret).to.be.undefined;
            sinon.assert.notCalled(spy);
            return [2 /*return*/];
        });
    }); });
    it('should forward one argument', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            spy = sinon.spy();
            fn = _1.syncGuard(spy);
            ret = fn(function (value) { return value; })("foo");
            chai_1.expect(ret).to.equal("foo");
            sinon.assert.notCalled(spy);
            return [2 /*return*/];
        });
    }); });
    it('should forward multiple arguments', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            spy = sinon.spy();
            fn = _1.syncGuard(spy);
            ret = fn(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return args;
            })("foo", "bar");
            chai_1.expect(ret).to.deep.equal(["foo", "bar"]);
            sinon.assert.notCalled(spy);
            return [2 /*return*/];
        });
    }); });
    describe('default return value', function () {
        it('should catch sync errors', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                spy = sinon.spy();
                err = new Error("foo");
                fn = _1.syncGuard(spy);
                ret = fn(function () {
                    throw err;
                })();
                chai_1.expect(ret).to.be.null;
                sinon.assert.calledWith(spy, err);
                chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                return [2 /*return*/];
            });
        }); });
        it('should catch sync errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                spy = sinon.spy();
                err = new Error("foo");
                fn = _1.syncGuard(spy, { longStackTraces: true });
                ret = fn(function () {
                    throw err;
                })();
                chai_1.expect(ret).to.be.null;
                sinon.assert.calledOnce(spy);
                chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                return [2 /*return*/];
            });
        }); });
        it('should not catch async errors if not wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.syncGuard(spy);
                        ret = fn(function () {
                            // Evil evil user
                            return err;
                        })();
                        return [4 /*yield*/, immediate()];
                    case 2:
                        _a.sent();
                        chai_1.expect(ret).to.not.be.null;
                        sinon.assert.notCalled(spy);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.syncGuard(spy, { catchAsync: true });
                        ret = fn(function () {
                            // Evil evil user
                            return err;
                        })();
                        return [4 /*yield*/, immediate()];
                    case 2:
                        _a.sent();
                        chai_1.expect(ret).to.not.be.null;
                        sinon.assert.calledWith(spy, theError);
                        chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.syncGuard(spy, { catchAsync: true, longStackTraces: true });
                        ret = fn(function () {
                            // Evil evil user
                            return err;
                        })();
                        return [4 /*yield*/, immediate()];
                    case 2:
                        _a.sent();
                        chai_1.expect(ret).to.not.be.null;
                        sinon.assert.calledOnce(spy);
                        chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('custom return value', function () {
        it('should catch sync errors', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                spy = sinon.spy();
                err = new Error("foo");
                fn = _1.syncGuard(spy, { defaultReturn: "bar" });
                ret = fn(function () {
                    throw err;
                })();
                chai_1.expect(ret).to.equal("bar");
                sinon.assert.calledWith(spy, err);
                chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                return [2 /*return*/];
            });
        }); });
        it('should catch sync errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                spy = sinon.spy();
                err = new Error("foo");
                fn = _1.syncGuard(spy, { defaultReturn: "bar", longStackTraces: true });
                ret = fn(function () {
                    throw err;
                })();
                chai_1.expect(ret).to.equal("bar");
                sinon.assert.calledOnce(spy);
                chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                return [2 /*return*/];
            });
        }); });
        it('should not catch async errors if not wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.syncGuard(spy, { defaultReturn: "bar" });
                        ret = fn(function () {
                            // Evil evil user
                            return err;
                        })();
                        return [4 /*yield*/, immediate()];
                    case 2:
                        _a.sent();
                        chai_1.expect(ret).to.not.equal("bar");
                        sinon.assert.notCalled(spy);
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.syncGuard(spy, { defaultReturn: "bar", catchAsync: true });
                        ret = fn(function () {
                            // Evil evil user
                            return err;
                        })();
                        return [4 /*yield*/, immediate()];
                    case 2:
                        _a.sent();
                        chai_1.expect(ret).to.not.equal("bar");
                        sinon.assert.calledWith(spy, theError);
                        chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.syncGuard(spy, {
                            defaultReturn: "bar",
                            catchAsync: true,
                            longStackTraces: true
                        });
                        ret = fn(function () {
                            // Evil evil user
                            return err;
                        })();
                        return [4 /*yield*/, immediate()];
                    case 2:
                        _a.sent();
                        chai_1.expect(ret).to.not.equal("bar");
                        sinon.assert.calledOnce(spy);
                        chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('async', function () {
    it('should allow sync success flow through with undefined', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () { return void (0); })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.be.undefined;
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow sync success flow through with null', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () { return null; })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.be.null;
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow sync success flow through with value', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () { return "foo"; })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.equal("foo");
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow async success flow through with undefined', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () { return Promise.resolve(void (0)); })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.be.undefined;
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow async success flow through with null', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () { return Promise.resolve(null); })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.be.null;
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should allow async success flow through with value', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () { return Promise.resolve("foo"); })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.equal("foo");
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should forward zero argument', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function (value) { return value; })()];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.be.undefined;
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should forward one argument', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function (value) { return value; })("foo")];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.equal("foo");
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should forward multiple arguments', function () { return __awaiter(_this, void 0, void 0, function () {
        var spy, fn, ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spy = sinon.spy();
                    fn = _1.asyncGuard(spy);
                    return [4 /*yield*/, fn(function () {
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return args;
                        })("foo", "bar")];
                case 1:
                    ret = _a.sent();
                    chai_1.expect(ret).to.deep.equal(["foo", "bar"]);
                    sinon.assert.notCalled(spy);
                    return [2 /*return*/];
            }
        });
    }); });
    describe('default return value', function () {
        it('should catch sync errors', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = new Error("foo");
                        fn = _1.asyncGuard(spy);
                        return [4 /*yield*/, fn(function () {
                                throw err;
                            })()];
                    case 1:
                        ret = _a.sent();
                        chai_1.expect(ret).to.be.null;
                        sinon.assert.calledWith(spy, err);
                        chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch sync errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = new Error("foo");
                        fn = _1.asyncGuard(spy, { longStackTraces: true });
                        return [4 /*yield*/, fn(function () {
                                throw err;
                            })()];
                    case 1:
                        ret = _a.sent();
                        chai_1.expect(ret).to.be.null;
                        sinon.assert.calledOnce(spy);
                        chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.asyncGuard(spy);
                        return [4 /*yield*/, fn(function () {
                                return err;
                            })()];
                    case 2:
                        ret = _a.sent();
                        return [4 /*yield*/, immediate()];
                    case 3:
                        _a.sent();
                        chai_1.expect(ret).to.be.null;
                        sinon.assert.calledWith(spy, theError);
                        chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.asyncGuard(spy, { longStackTraces: true });
                        return [4 /*yield*/, fn(function () {
                                return err;
                            })()];
                    case 2:
                        ret = _a.sent();
                        return [4 /*yield*/, immediate()];
                    case 3:
                        _a.sent();
                        chai_1.expect(ret).to.be.null;
                        sinon.assert.calledOnce(spy);
                        chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('custom return value', function () {
        it('should catch sync errors', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = new Error("foo");
                        fn = _1.asyncGuard(spy, { defaultReturn: "bar" });
                        return [4 /*yield*/, fn(function () {
                                throw err;
                            })()];
                    case 1:
                        ret = _a.sent();
                        chai_1.expect(ret).to.equal("bar");
                        sinon.assert.calledWith(spy, err);
                        chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch sync errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = new Error("foo");
                        fn = _1.asyncGuard(spy, { defaultReturn: "bar", longStackTraces: true });
                        return [4 /*yield*/, fn(function () {
                                throw err;
                            })()];
                    case 1:
                        ret = _a.sent();
                        chai_1.expect(ret).to.equal("bar");
                        sinon.assert.calledOnce(spy);
                        chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.asyncGuard(spy, { defaultReturn: "bar" });
                        return [4 /*yield*/, fn(function () {
                                return err;
                            })()];
                    case 2:
                        ret = _a.sent();
                        return [4 /*yield*/, immediate()];
                    case 3:
                        _a.sent();
                        chai_1.expect(ret).to.equal("bar");
                        sinon.assert.calledWith(spy, theError);
                        chai_1.expect(spy.args[0][0].stack).not.to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
        it('should catch async errors with long stack if wanted', function () { return __awaiter(_this, void 0, void 0, function () {
            var spy, err, theError, fn, ret;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spy = sinon.spy();
                        err = Promise.reject(new Error("foo"));
                        return [4 /*yield*/, rejection(err)];
                    case 1:
                        theError = _a.sent();
                        fn = _1.asyncGuard(spy, { defaultReturn: "bar", longStackTraces: true });
                        return [4 /*yield*/, fn(function () {
                                return err;
                            })()];
                    case 2:
                        ret = _a.sent();
                        return [4 /*yield*/, immediate()];
                    case 3:
                        _a.sent();
                        chai_1.expect(ret).to.equal("bar");
                        sinon.assert.calledOnce(spy);
                        chai_1.expect(spy.args[0][0].stack).to.contain("[callguard]");
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
describe('errors', function () {
    it('should print to console.error when internal error handler throws', function () { return __awaiter(_this, void 0, void 0, function () {
        var oldError, spy, fn, ret;
        return __generator(this, function (_a) {
            oldError = console.error;
            spy = sinon.spy();
            console.error = spy;
            fn = _1.syncGuard(function (err) { throw new Error("foo"); });
            ret = fn(function () { throw new Error("bar"); })();
            sinon.assert.calledTwice(spy);
            chai_1.expect(spy.args[0][0]).to.contain("[callguard");
            chai_1.expect(spy.args[0][1].message).to.contain("foo");
            chai_1.expect(spy.args[1][0]).to.contain("[callguard");
            chai_1.expect(spy.args[1][1].message).to.contain("bar");
            console.error = oldError;
            return [2 /*return*/];
        });
    }); });
    it('should print to console.error when non-Error is thrown', function () { return __awaiter(_this, void 0, void 0, function () {
        var oldError, guardSpy, spy, fn, ret;
        return __generator(this, function (_a) {
            oldError = console.error;
            guardSpy = sinon.spy();
            spy = sinon.spy();
            console.error = spy;
            fn = _1.syncGuard(guardSpy, { longStackTraces: true });
            ret = fn(function () { throw void 0; })();
            sinon.assert.notCalled(guardSpy);
            sinon.assert.calledOnce(spy);
            chai_1.expect(spy.args[0][0]).to.contain("probably caused");
            console.error = oldError;
            return [2 /*return*/];
        });
    }); });
});
//# sourceMappingURL=callguard.js.map