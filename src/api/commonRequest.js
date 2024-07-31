

export async function getApiResponse(url, method, body, token) {

    const headers = new Headers({ 'content-type': 'application/json' });
    headers.append("Access-Control-Allow-Headers", "Location");
    if (token != null) headers.append("Authorization", "Bearer " + token);

    const options = {
        method: method,
        headers: headers
    };

    if (body != null) options.body = JSON.stringify(body);

    const response = await fetch(url, options);
    if(response.ok) return response;
    else return Promise.reject(response);

}




