/*

Вступление:

    Идея опытных пользователей была плохой. Как только эти пользователи получили
    расширенные разрешения, они начали травить других
    и мы потеряли много отличных пользователей.
    В ответ мы потратили все оставшиеся деньги
на маркетинг и привлекли еще больше пользователей.
    Нам нужно начать подготовку к переносу всего в
реальную базу данных. Пока мы просто выполняем некоторые макеты.

    Формат серверного API был выбран следующим:

    В случае успеха: { статус: 'successful', данные: RESPONSE_DATA }
    В случае ошибки: { статус: 'ошибка', ошибка: ERROR_MESSAGE }

    Инженер API начал создавать типы для этого API и
быстро понял, что количество типов, которые необходимо
создать, слишком велико.

Упражнение:

    Удалите типы ответов Api пользователей и Api администраторов
    и используйте общий тип Api Response, чтобы указать форматы ответов API
    для каждой из функций.

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

export type ApiResponse<T> = {
    status: 'success';
    data: T;
    } |
    {
        status: 'error';
        error: string;
    };

// type AdminsApiResponse = (
//     {
//         status: 'success';
//         data: Admin[];
//     } |
//     {
//         status: 'error';
//         error: string;
//     }
// );

export function requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
        status: 'success',
        data: admins
    });
}

// type UsersApiResponse = (
//     {
//         status: 'success';
//         data: User[];
//     } |
//     {
//         status: 'error';
//         error: string;
//     }
// );

export function requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
        status: 'success',
        data: users
    });
}

export function requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
        status: 'success',
        data: Date.now()
    });
}

export function requestCoffeeMachineQueueLength(callback: (response: ApiResponse<number>) => void) {
    callback({
        status: 'error',
        error: 'Numeric value has exceeded Number.MAX_SAFE_INTEGER.'
    });
}

function logPerson(person: Person) {
    console.log(
        ` - ${person.name}, ${person.age}, ${person.type === 'admin' ? person.role : person.occupation}`
    );
}

function startTheApp(callback: (error: Error | null) => void) {
    requestAdmins((adminsResponse) => {
        console.log('Admins:');
        if (adminsResponse.status === 'success') {
            adminsResponse.data.forEach(logPerson);
        } else {
            return callback(new Error(adminsResponse.error));
        }

        console.log();

        requestUsers((usersResponse) => {
            console.log('Users:');
            if (usersResponse.status === 'success') {
                usersResponse.data.forEach(logPerson);
            } else {
                return callback(new Error(usersResponse.error));
            }

            console.log();

            requestCurrentServerTime((serverTimeResponse) => {
                console.log('Server time:');
                if (serverTimeResponse.status === 'success') {
                    console.log(`   ${new Date(serverTimeResponse.data).toLocaleString()}`);
                } else {
                    return callback(new Error(serverTimeResponse.error));
                }

                console.log();

                requestCoffeeMachineQueueLength((coffeeMachineQueueLengthResponse) => {
                    console.log('Coffee machine queue length:');
                    if (coffeeMachineQueueLengthResponse.status === 'success') {
                        console.log(`   ${coffeeMachineQueueLengthResponse.data}`);
                    } else {
                        return callback(new Error(coffeeMachineQueueLengthResponse.error));
                    }

                    callback(null);
                });
            });
        });
    });
}

startTheApp((e: Error | null) => {
    console.log();
    if (e) {
        console.log(`Error: "${e.message}", but it's fine, sometimes errors are inevitable.`)
    } else {
        console.log('Success!');
    }
});

// In case you are stuck:
// https://www.typescriptlang.org/docs/handbook/2/generics.html
