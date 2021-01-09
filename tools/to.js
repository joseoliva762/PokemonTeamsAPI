exports.to = async promise => {
    try {
        data = await promise;
        return [null, data];
    } catch (err) {
        return [err, null];
    }    
}
// promise.then(data => {
//     return [null, data];
// }).catch(err => [err, null]);
