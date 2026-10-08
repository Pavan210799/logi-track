// Test server that only replies with success
const API_URL = 'https://jsonplaceholder.typicode.com/posts'

// Sends one request and throws an error if it fails
async function sendRequest(url, method, body) {
  const options = { method: method }

  if (body) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }

  let response
  try {
    response = await fetch(url, options)
  } catch (err) {
    console.error(err)
    throw new Error('Could not reach the server. Check your internet connection.')
  }

  if (!response.ok) {
    throw new Error(method + ' request failed with status ' + response.status)
  }
}

export async function apiGet() {
  await sendRequest(API_URL + '/1', 'GET')
}

export async function apiPost(body) {
  await sendRequest(API_URL, 'POST', body)
}

export async function apiPut(body) {
  await sendRequest(API_URL + '/1', 'PUT', body)
}

export async function apiDelete() {
  await sendRequest(API_URL + '/1', 'DELETE')
}
