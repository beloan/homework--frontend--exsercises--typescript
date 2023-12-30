/*

Вступление:

    Теперь у нас есть асинхронные функции, передовые технологии.
    Теперь это официально делает нас технологическим стартапом.
    Но один из консультантов разрушил наши мечты о
неизбежном будущем лидерстве в ИТ.
    Он сказал, что асинхронность на основе
обратного вызова больше не популярна, и все должны использовать Promises.
    Он пообещал, что если мы перейдем к обещаниям, это принесет
    многообещающие результаты.

Упражнение:

    Мы не хотим переопределять все данные, запрашивающие
    функции. Давайте украсим старые
    функции, основанные на обратном вызове, новым результатом, совместимым с обещаниями.
    Конечная функция должна возвращать обещание, которое
    разрешалось бы с конечными данными напрямую
    (т.е. пользователями или администраторами) или отклонялось бы с ошибкой
    (или ошибкой типа).

    Функция должна называться promisify.

Бонусное упражнение повышенной сложности:

    Создайте функцию promisifyAll, которая принимает объект
    с функциями и возвращает новый объект, где каждая
    функция является promisified.

    Перепишите создание api соответствующим образом:

        const api = promisifyAll(oldApi);

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
    { type: 'admin', name: 'Bruce Willis', age: 64, role: 'World saver' }
];

const users: User[] = [
    { type: 'user', name: 'Max Mustermann', age: 25, occupation: 'Chimney sweep' },
    { type: 'user', name: 'Kate Müller', age: 23, occupation: 'Astronaut' }
];

export type ApiResponse<T> = (
    {
        status: 'success';
        data: T;
    } |
    {
        status: 'error';
        error: string;
    }
);

export function promisify<T>(arg: (callback: (response: ApiResponse<T>) => void) => void): () => Promise<T> {
    return () =>
        new Promise((resolve, reject) => {
            arg((response) => {
                if (response.status === "success") resolve(response.data);
                else reject(response.error);
            });

        });
}

const oldApi = {
    requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
        callback({
            status: 'success',
            data: admins
        });
    },
    requestUsers(callback: (response: ApiResponse<User[]>) => void) {
        callback({
            status: 'success',
            data: users
        });
    },
    requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
        callback({
            status: 'success',
            data: Date.now()
        });
    },
    requestCoffeeMachineQueueLength(callback: (response: ApiResponse<number>) => void) {
        callback({
            status: 'error',
            error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.'
        });
    }
};

export const api = {
    requestAdmins: promisify(oldApi.requestAdmins),
    requestUsers: promisify(oldApi.requestUsers),
    requestCurrentServerTime: promisify(oldApi.requestCurrentServerTime),
    requestCoffeeMachineQueueLength: promisify(oldApi.requestCoffeeMachineQueueLength)
};

function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

async function startTheApp() {
    console.log('Admins:');
    (await api.requestAdmins()).forEach(logPerson);
    console.log();

    console.log('Users:');
    (await api.requestUsers()).forEach(logPerson);
    console.log();

    console.log('Server time:');
    console.log(`   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`);
    console.log();

    console.log('Coffee machine queue length:');
    console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);
}

startTheApp().then(
    () => {
        console.log('Success!');
    },
    (e: Error) => {
        console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`);
    }
);

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/generics.html
