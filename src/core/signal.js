export const Signal = new class {
    #reg = new Map();
    #def = new Map();

    defaults = {
        prefix: '',
        signal: 'signal'
    };

    register(name, elem) {
        this.#reg.set(name, {
            elem,
            finally(func) {
                if(typeof func == 'function') {
                    this.func = func;
                } else {
                    throw new TypeError('"finally" expects a FUNCTION: got ' + typeof func);
                }
            }
        });

        if(this.#def.has(name)) {
            for(let func of this.#def.get(name)) {
                func();
            }

            this.#def.delete(name);
        }

        return this.#reg.get(name);
    }

    unRegister(name) {
        this.#reg.delete(name);
    }

    #exec(name, info) {
        const {
            prefix = this.defaults.prefix,
            signal = this.defaults.signal,
            data
        } = info;

        return this.#reg.get(name).elem[prefix + signal]?.(data);
    }

    send(name, info) {
        const ret = this.#reg.has(name)
            ? Promise.resolve(this.#exec(name, info))
            : new Promise(rslv => {
                this.#def.has(name) || this.#def.set(name, []);

                this.#def.get(name).push(() => {
                    rslv(this.#exec(name, info));
                });
            });

        return ret.then(val => {
            this.#reg.get(name).func?.(val);

            return val;
        });
    }

    *prodcast(info, pattern = /.+/) {
        const all = [
            ...this.#reg.keys(),
            ...this.#def.keys()
        ].filter(name => pattern.test(name));

        for(let name of all) {
            yield this.send(name, info);
        }
    }

}
