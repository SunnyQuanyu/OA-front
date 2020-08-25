export function getToken() {
  let number = localStorage.getItem('number');
  let password = localStorage.getItem('password');

  if (number !== null && password !== null) {
    number = atob(number)
    password = atob(password)
    return { number, password }
  }
  return null;
}

export function setToken({ number, password }) {
  localStorage.setItem('number', btoa(number))
  localStorage.setItem('password', btoa(password))
}



export function clearToken() {
  localStorage.removeItem('number')
  localStorage.removeItem('password')
}
