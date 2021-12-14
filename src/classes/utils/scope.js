export default class Scope {
    #funcs = [];
    #name;
    #isOpen = false;

    constructor(name) {
        this.#name = name;
    }

    open(name, func) {
        if (this.#isOpen) {
            throw new Error(`scope ${this.#name} is already open.`);
        }

        this.#isOpen = true;
        this.#funcs.push({ name, func });
    }

    close(name, func) {
        if (!this.#isOpen) {
            throw new Error(`scope ${this.#name} is not open.`);
        }

        this.#isOpen = false;
        this.#funcs.push({ name, func });
    }

    add(name, func) {
        if (!this.#isOpen) {
            throw new Error(`scope ${this.#name} is not open.`);
        }

        this.#funcs.push({ name, func });
    }

    run(value, oldValue) {
        for (let dir of this.#funcs) {
            const res = dir.func(value, oldValue);

            if (typeof res === 'function') {
                return res();
            } else if (res !== false) {
                throw new Error(
                    `scope ${this.#name}: invalid return type in ${func.name}.`
                );
            }
        }
    }
}
