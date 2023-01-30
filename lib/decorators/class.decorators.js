"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoUnsub = void 0;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const autoUnsub = () => (componentClass) => {
    const origNgOnDestroy = componentClass.prototype.ngOnDestroy;
    // componentClass.prototype.destroyed$ = new Subject();
    // mutate component ngOnDestroy
    componentClass.prototype.ngOnDestroy = function () {
        // console.log('PROTO destroy$', componentClass.prototype?.destroyedTest$);
        // console.log('componentClass', componentClass);
        /** if (componentClass.prototype.destroyed$) {
          componentClass.prototype.destroyed$.next(true);
          componentClass.prototype.destroyed$.complete();
        }**/
        if (this.destroyed$) {
            this.destroyed$.next(true);
            this.destroyed$.complete();
        }
        // componentClass.prototype.destroyed$.unsubscribe();
        if (origNgOnDestroy) {
            // console.log('ORGIS DESTRUCTIONS FN IS', origNgOnDestroy);
            origNgOnDestroy.apply(this, arguments);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    // componentClass.prototype.destroyed$ = new Subject();
    /** return class extends componentClass {
      destroyed$ = new Subject();
    };*/
};
exports.autoUnsub = autoUnsub;
//# sourceMappingURL=class.decorators.js.map