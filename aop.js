/** Helping function used to get all methods of an object that is an instance of a class */
const getMethods = (obj) => Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(item => typeof obj[item] === 'function')


/**
 * Function that add a new function implementation, called aspect, inside an existent method from an object, and then execute the original method and return its value.
 * @param {Object} target - The object that contains the method.
 * @param {string} methodName - The name of the method. 
 * @param {Function} aspect - The function that will be added inside the method. 
 * @param {string} advice - The type of advice that will be added. It means when the aspect must run. Can be "before", "around", "after" or "afterReturning".
 */
function replaceMethod(target, methodName, aspect, advice) {
    const originalCode = target[methodName]
    target[methodName] = function (...args) {
        if(['before', 'around'].includes(advice)) {
            aspect.apply(this, args)
        }

        const returnedValue = originalCode.apply(this, args)

        if(['after', 'around'].includes(advice)) {
            aspect.apply(this, args)
        }

        if(advice === 'afterReturning') {
            return aspect.apply(this, [returnedValue])
        } 

        return returnedValue
    }
}

/**
 * Function that injects an aspect inside a target.
 * @param {Object} target - The object that contains the method.
 * @param {Function} aspect - The function that will be injected inside the method. 
 * @param {string} advice - The type of advice that will be added. It means when the aspect must run. Can be "before", "around", "after" or "afterReturning".
 * @param {string} pointcut - The place on the targer code where the aspect will be injected. Can be "method" or "class".
 * @param {string} method - The method name that will receive the aspect if pointcut is "method".
 * @returns {void}
 */
function inject(target, aspect, advice, pointcut, method = null) {
    if(pointcut === 'method') {
        if(method) {
            replaceMethod(target, method, aspect, advice)
        } else {
            throw new Error('Method not specified')
        }
    }
    if(pointcut === 'class') {
        const methods = getMethods(target)
        methods.forEach(methodName => replaceMethod(target, methodName, aspect, advice))
    }
}

export default { inject }