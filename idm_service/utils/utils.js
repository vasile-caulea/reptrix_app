export function buildResponse(statuscode, message) {
    return {
        statusCode: statuscode,
        body: JSON.stringify(message),
    };
}
