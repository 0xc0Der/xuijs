export default class Scope {
    #funcs = {};
    #name;

    constructor(name) {
        this.#name = name;
    }

    addIf(func) {
        if(this.hasIf()) {
            throw new Error(`scope ${this.name} aleady has "if".`);
        } else {
            this.#funcs['if'] = func;
        }
    }

    addElse(func) {
        if(this.hasElse()) {
            throw new Error(`scope ${this.name} aleady has "else".`);
        } else {
            this.#funcs['else'] = func;
        }
    }

    run(value, el) {
        const ifRes = this.#funcs['if'](value, el);

        if(ifRes === false) {
                this.#funcs['else']?.(value, el);
        } else if(typeof ifRes === 'function') {
            ifRes();
        } else {
            throw new Error(`"if" return value must be function or false.`);
        }
    }

    hasIf() {
        return this.hasOwnProperty('if');
    }

    hasElse() {
        return this.hasOwnProperty('else');
    }

}


