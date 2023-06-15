import AOP from './aop.js'

class MyBussinessLogic {

    add(a, b) {
        console.log('Calling add method')
        return a + b
    }
}

function logginAspect(...args) {
    console.log('Calling the logger function')
    console.log('Arguments', args)
}

function printTypeOfReturnedValueAspect(value) {
    console.log('Returned value type', typeof value)

}

void function() {
    const myBussinessLogic = new MyBussinessLogic()
    
    AOP.inject(myBussinessLogic, logginAspect, 'before', 'class')
    AOP.inject(myBussinessLogic, printTypeOfReturnedValueAspect, 'afterReturning', 'method', 'add')

    myBussinessLogic.add(3, 2)
}()