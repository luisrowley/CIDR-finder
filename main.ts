// Example usage
// const ipTrie = new IpTrie();
// ipTrie.insert('192.168.1.0/24');
// ipTrie.logTrie(); // Log the structure after inserting 192.168.1.0/24
// ipTrie.insert('10.0.0.0/8');
// ipTrie.logTrie(); // Log the structure after inserting 10.0.0.0/8

// console.log(ipTrie.search('192.168.1.1'));  // Output: '192.168.1.0/24'
// console.log(ipTrie.search('10.1.1.1'));    // Output: '10.0.0.0/8'
// console.log(ipTrie.search('172.16.0.1'));  // Output: null

import { CidrCache } from './helpers/cidr-cache';
import { ParserService } from './services/parser.service';

async function main() {
    const parserService = new ParserService(new CidrCache());
    const filenames = ['./data/tor_exits.ipset'];
    
    try {
        const parsedData = await parserService.parse(filenames);
        console.log('Parsed Data:', JSON.stringify(parsedData, null, 2));
    } catch (error: any) {
        console.error('Error parsing files:', error.message);
    }
}

main();
