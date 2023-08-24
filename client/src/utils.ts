
const isjson = (injson: string): boolean => {
    try {
        const parsedJson = JSON.parse(injson);
        if (typeof parsedJson === 'object' && parsedJson !== null) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}



export { isjson };