import { pathToFileURL } from 'url';
import path from 'path';

const projectRoot = process.cwd();

const aliases = {
    '@shared': 'shared'
};

export async function resolve(specifier, context, defaultResolve) {
    for (const alias in aliases) {
        if (specifier.startsWith(alias)) {
            const subPath = specifier.slice(alias.length);
            const fullPath = path.join(projectRoot, aliases[alias], subPath);
            return defaultResolve(pathToFileURL(fullPath).href, context);
        }
    }
    return defaultResolve(specifier, context);
}
