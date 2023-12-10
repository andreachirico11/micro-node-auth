const unbearerTokenString = (possibileBearerToken: string) => {
    const r = new RegExp('bearer', 'i');
    return r.test(possibileBearerToken) ? possibileBearerToken.split(' ')[1] : possibileBearerToken;
}

export default unbearerTokenString;