console.log(111)

class Person{
  constructor(name){
    this.name = name
  }
  setName(name){
    this.name = name
  }
  getName(){
    return this.name
  }
}

let p1 = new Person('scc')