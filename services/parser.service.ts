import ipaddr = require('ipaddr.js');
import * as fs from 'fs';

import { ParsedFireHOLData } from '../types/HolData';
import { CidrCache } from '../helpers/cidr-cache';

export class ParserService {

    constructor(public cidrCache: CidrCache) {}

    async parse(filenames: string[]): Promise<ParsedFireHOLData[]> {
        const parsedData: ParsedFireHOLData[] = [];
        
        for (const filename of filenames) {
            const fileData: ParsedFireHOLData = { filename, ips: [] };
            
            try {
                const data = await fs.readFileSync(filename, 'utf8');
                const lines = data.toString().split('\n');

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    
                    if (trimmedLine && !trimmedLine.startsWith('#')) {
                        if (ipaddr.isValid(trimmedLine)) {
                            const parsed = ipaddr.parse(trimmedLine);
                            if (parsed.kind() === 'ipv4' || parsed.kind() === 'ipv6') {
                                fileData.ips.push(parsed.toString());
                            } else {
                                throw new Error(`File with invalid IPs should throw an Error`);
                            }
                        } else {
                            throw new Error(`File with garbage data should throw an Error`);
                        }
                    }
                }
                
                parsedData.push(fileData);
                
            } catch (err: any) {
                console.error(err.code, err.message);
                if (err.code === 'ENOENT') {
                    throw new Error(`Nonexistent file should throw an Error`);
                } else {
                    throw err;
                }
            }
        }
        
        return parsedData;
    }
}