

export async function getApiResponse(url, method, body, token) {

    const headers = new Headers({ 'content-type': 'application/json' });
    if (token != null) headers.append("Authorization", "Bearer " + token);

    const options = {
        method: method,
        headers: headers,
    };

    if (body != null) options.body = JSON.stringify(body);

    const response = await fetch(url, options);

    return response;

}

export const fetchSignup = async (url, body) => {
    try {
        const response = await getApiResponse(url, 'POST', body, null);
        return response;
    } catch (error) { console.log(error) }
}

export const fetchLogin = async (url, body) => {
    try {
        const response = await getApiResponse(url, 'POST', body, null);
        return response;
    } catch (error) { console.log(error) }
}

export const fetchLogout = async (url, token) => {
    try {
        const response = await getApiResponse(url, 'POST', null, token);
        return response;
    } catch (error) { console.log(error) }
}

export const fetchUser = async (url, token) => {
    try {
      const response = await getApiResponse(url, 'GET', null, token);
      return response;
    } catch (err) { console.log(err) }
  }

export const fetchPosts = async (url, token) => {
    try {
        const response = await getApiResponse(url, 'GET', null, token);
        return response;
    } catch (err) { console.log(err) }
}

export const fetchCreatePost = async (url, body, token) => {
    try {
        const response = await getApiResponse(url, 'POST', body, token);
        return response;
    } catch (err) { console.log(err) }
}

export const fetchEditPost = async (url, body, token, postId) => {
    try {
        const response = await getApiResponse(url + `/${postId}`, 'PUT', body, token);
        return response;
    } catch (err) { console.log(err) }
}

export const fetchDeletePost = async (url, token, postId) => {
    try {
        const response = await getApiResponse(url + `/${postId}`, 'DELETE', null, token);
        return response;
    } catch (err) { console.log(err) }
}