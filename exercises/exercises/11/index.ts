import {
    strReverse,
    strToLower,
    strToUpper,
    strRandomize,
    strInvertCase
} from 'str-utils';

/*

Вступление:

    Чтобы вовлечь пользователей в общение
    друг с другом, мы решили украсить имена пользователей
    различными способами. Краткий поиск привел нас к библиотеке
    под названием "str-utils". Плохо то, что в ней отсутствуют
    Объявления TypeScript.

Упражнение:

    Проверьте реализацию модуля str-utils в:
    node_modules/str-utils/index.js
    node_modules/str-utils/README.md

    Предоставьте объявление типа для этого модуля в:
    declarations/str-utils/index.d.ts

    Старайтесь избегать дублирования объявлений типов,
    используйте псевдонимы типов.
*/

interface User {
    type: 'user';
    name: string;
    age: number;
    occupation: string;
}

interface Admin {
    type: 'admin';
    name: string;
    age: number;
    role: string;
}

type Person = User | Admin;

const admins: Admin[] = [
    { type: 'admin', name: 'Jane Doe', age: 32, role: 'Administrator' },
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' },
    { type: 'admin', name: 'Steve', age: 40, role: 'Steve' },
    { type: 'admin', name: 'Will Bruces', age: 30, role: 'Overseer' },
    { type: 'admin', name: 'Superwoman', age: 28, role: 'Customer support' }
];

const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' },
    { type: 'user', name: 'Moses', age: 70, occupation: 'Desert guide' },
    { type: 'user', name: 'Superman', age: 28, occupation: 'Ordinary person' },
    { type: 'user', name: 'Inspector Gadget', age: 31, occupation: 'Undercover' }
];

const isAdmin = (person: Person): person is Admin => person.type === 'admin';
const isUser = (person: Person): person is User => person.type === 'user';

export const nameDecorators = [
    strReverse,
    strToLower,
    strToUpper,
    strRandomize,
    strInvertCase
];

function logPerson(person: Person) {
    let additionalInformation: string = '';
    if (isAdmin(person)) {
        additionalInformation = person.role;
    }
    if (isUser(person)) {
        additionalInformation = person.occupation;
    }
    const randomNameDecorator = nameDecorators[
        Math.round(Math.random() * (nameDecorators.length - 1))
    ];
    const name = randomNameDecorator(person.name);
    console.log(
        ` - ${name}, ${person.age}, ${additionalInformation}`
    );
}

([] as Person[])
    .concat(users, admins)
    .forEach(logPerson);

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
