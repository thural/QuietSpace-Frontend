//action : increment
export const increment = () => {
    return { type: 'increment' }
  }
  
  //action : decrement
  export const decrement = () => {
    return { type: 'decrement' }
  }
  
  //action : increment by value
  export const incrementByValue = (value) => {
    return {
      type: 'incrementByValue',
      value: value
    }
  }

  //action : register login
  export const isLogged = () => {
    return {
        type: 'isLogged',
    }
  }

  //action : register logout
  export const isNotLogged = () => {
    return {
        type: 'isNotLogged'
    }
  }