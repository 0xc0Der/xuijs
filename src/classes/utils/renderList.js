import Xui from '../../core/xui.js';

async function addListElement(key, template, parent) {
    const listElement = template.cloneNode(true);
    const ctrl = new Xui();

    listElement.setAttribute('key', key);
    parent.appendChild(listElement);

    if(listElement.hasAttribute(ctrl.mount)) {
        (await ctrl.loadClass(listElement)).mount(
            listElement, {
                key: key.split(' - ')[1],
                name: key
            }, {
                before: 'onBeforeMount',
                after: 'onMount'
            }
        );
    } else {
        throw new Error('element must be mountable.');
    }
}

export async function renderList(list, name, func, template, parent) {
    const getElementByKey = key => parent.querySelector(`[key='${key}']`);
    const { setup, cleanup, render } = func();

    for(let [rawKey, value] of Object.entries(list)) {
        const key = `${name} - ${rawKey}`;

        if(!getElementByKey(key)) {
            await addListElement(key, template, parent);

            setup?.(key, parent);
        }

        render?.(key, value);
    }

    for(let elm of parent.children) {
        const strKey = elm.getAttribute('key') || '';
        const [_, key] = strKey.split(' - ');

        if(key && !Object.keys(list).includes(key)) {
            cleanup?.(strKey);
        }
    }
}
