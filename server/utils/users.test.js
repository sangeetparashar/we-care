const expect = require('expect');
var { Users } = require('./users');

describe('Users', () => {
    var users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Sangeet',
            room: 'Bonsai Lane'
        },
            {
                id: '2',
                name: 'Madhur',
                room: 'Bonsai Lane'
            },
            {
                id: '3',
                name: 'Madhuri',
                room: 'Rohini'
            }]
    });

    it('should add new user', () => {
        var users = new Users();

        var user = {
            id: '123',
            name: 'Sangeet',
            room: 'theofficefans'
        };
        var responseUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]); 
    });

    it('should return names for node course', () => {
        var userList = users.getUserList('Bonsai Lane');
        expect(userList).toEqual(['Sangeet', 'Madhur']);
    });

    it('should return names for Rohini course', () => {
        var userList = users.getUserList('Rohini');
        expect(userList).toEqual(['Madhuri']);
    });

    it('should remove user with given id', () => {
        var removeUser = users.removeUser('1');
        expect(removeUser.name).toBe('Sangeet');
    });
    it('should NOT remove user with given id', () => {
        var removeUser = users.removeUser('12');
        expect(removeUser).toBe(undefined);
    });

    it('should find user', () => {
        var userID = '1';
        var user = users.getUser(userID);
        expect(user.id).toBe(userID)
    });

    it('should not find user', () => {
        var userID = '999';
        var user = users.getUser(userID);
        expect(user).toNotExist();
    });

}); 