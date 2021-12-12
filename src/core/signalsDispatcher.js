export default class SignalsDispatcher {
    #registered = new Map();
    #defered = new Map();

    register(name, elem) {
        this.#registered.set(name, elem);

        if (this.isDefered(name)) {
            for (let func of this.getDefered(name)) {
                func();
            }

            this.#defered.delete(name);
        }

        return this.getRegistered(name);
    }

    unregister(name) {
        if (this.isRegistered(name)) {
            this.#registered.delete(name);
        }
    }

    #exec(name, info) {
        const { signal, data } = info;

        return this.getRegistered(name)[signal]?.(data);
    }

    send(name, info) {
        return this.isRegistered(name)
            ? Promise.resolve(this.#exec(name, info))
            : new Promise(rslv => {
                  this.isDefered(name) || this.#defered.set(name, []);

                  this.getDefered(name).push(() => {
                      rslv(this.#exec(name, info));
                  });
              });
    }

    *prodcast(info, pattern = /.+/) {
        const all = [
            ...this.#registered.keys(),
            ...this.#defered.keys()
        ].filter(name => pattern.test(name));

        for (let name of all) {
            yield this.send(name, info);
        }
    }

    isRegistered(name) {
        return this.#registered.has(name);
    }

    isDefered(name) {
        return this.#defered.has(name);
    }

    getDefered(name) {
        if (this.isDefered(name)) {
            return this.#defered.get(name);
        } else {
            throw new Error(`${name} is not defered.`);
        }
    }

    getRegistered(name) {
        if (this.isRegistered(name)) {
            return this.#registered.get(name);
        } else {
            throw new Error(`${name} is not registered.`);
        }
    }
}
