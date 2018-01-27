//[{
//    id: 
//    name: 
//    room:
//}]


//we are gonna be learning ES6 classes and how to make methods and shit regarding that

//the methods we are going to create

//add(id, name, room)
//remove(id)
//getUser(id)
//getUserList(room)


// class <className> {}  <-- used to create a new class
//class Person {
//    //constructor function - specific to the class and lets u initialize the instance of the class
//    constructor(name, age) { //gets called by default and gets called depending on the arguments defined in the braces here
//        this.name = name; //refers to the instance, rather than the class
//        this.age = age;
//    }
//    //defining methods
//    getUserDescription() {
//        return `${this.name} is ${this.age} years old`
//    }
//};

//// to create a new instance of a function
//var me = new Person('Sangeet', 23);

//describe = me.getUserDescription();
//console.log(describe);

class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = { id, name, room };
        this.users.push(user);
        return user;
    }

    removeUser(id) {
        var userFound = this.users.filter((user) => user.id === id)[0];
        this.users = this.users.filter((user) => user.id !== id);
        return userFound;
    };

    getUser(id) {
        var userFound = this.users.filter((user) => user.id === id)[0];

        return userFound;
    };

    getUserList(room) {
        var users = this.users.filter((user) => user.room === room);
        var NamesArray = users.map((user) => user.name);

        return NamesArray;
    }

}


module.exports = {
    Users
}