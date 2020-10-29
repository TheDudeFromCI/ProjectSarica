const config = require('../botConfig.json');

/**
 * Gets the value of the config at the current path.
 * 
 * @param path - The path to resolve.
 * 
 * @returns The object at the given path, or undefined if the
 *          path does not exist in the config.
 */
function resolvePath(path: string): any
{
    if (!path) return undefined;

    const parts = path.split('.');

    let elem = config;
    for (const part of parts)
    {
        elem = elem[part];
        if (!elem) return undefined;
    }

    return elem;
}

/**
 * Checks if the given path exists in the config.
 * 
 * @param path - The path to check.
 */
export function hasPath(path: string): boolean
{
    return resolvePath(path) !== undefined;
}

/**
 * Gets the object at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getObject(path: string, def: any): any
{
    const value = resolvePath(path);
    if (value === undefined) return def;

    return value;
}

/**
 * Gets the string at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getString(path: string, def: string): string
{
    return <string>getObject(path, def);
}

/**
 * Gets the number at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getNumber(path: string, def: number): number
{
    return <number>getObject(path, def);
}

/**
 * Gets the number at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getBool(path: string, def: boolean): boolean
{
    return <boolean>getObject(path, def);
}

/**
 * Gets the string list at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getStringList(path: string, def: string[]): string[]
{
    return <string[]>getObject(path, def);
}

/**
 * Gets the number list at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getNumberList(path: string, def: number[]): number[]
{
    return <number[]>getObject(path, def);
}

/**
 * Gets the boolean list at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getBoolList(path: string, def: boolean[]): boolean[]
{
    return <boolean[]>getObject(path, def);
}

/**
 * Gets the object list at the current path within the config.
 * 
 * @param path - The config path.
 * @param def - The default value to return if the path does not exist.
 */
export function getObjectList(path: string, def: any[]): any[]
{
    return <any[]>getObject(path, def);
}
