import * as crypto from 'crypto';
import { ParsedFireHOLData } from '../types/HolData';

export class CidrCache {
    private cache: Map<string, ParsedFireHOLData[]> = new Map();
    private checksums: Map<string, string> = new Map();

    // Compute the checksum of the file content
    computeChecksum(content: string): string {
        return crypto.createHash('md5').update(content, 'utf8').digest('hex');
    }

    // Get the parsed data from cache if the checksum matches
    getFromCache(filename: string, currentChecksum: string): ParsedFireHOLData[] | null {
        const cachedChecksum = this.checksums.get(filename);
        if (cachedChecksum && cachedChecksum === currentChecksum) {
            return this.cache.get(filename) || null;
        }
        return null;
    }

    // Update the cache with new parsed data and checksum
    updateCache(filename: string, currentChecksum: string, parsedData: ParsedFireHOLData[]): void {
        this.cache.set(filename, parsedData);
        this.checksums.set(filename, currentChecksum);
    }
}
