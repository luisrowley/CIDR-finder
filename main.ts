// Define a Trie node structure
class TrieNode {
    children: { [key: string]: TrieNode } = {};
    isEndOfCidr: boolean = false;
    cidrRange: string | null = null;
}

// Define the Trie structure
class IpTrie {
    root: TrieNode = new TrieNode();

    // Function to insert a CIDR range into the Trie
    insert(cidr: string) {
        let node = this.root;
        const [subnet, bits] = cidr.split('/');
        const binarySubnet = this.toBinary(subnet);

        console.log(`binarySubnet: ${binarySubnet}`)
        
        for (let i = 0; i < parseInt(bits); i++) {
            const bit = binarySubnet[i];
            if (!node.children[bit]) {
                node.children[bit] = new TrieNode();
            }
            node = node.children[bit];
        }
        
        node.isEndOfCidr = true;
        node.cidrRange = cidr;
    }

    // Function to search for an IP in the Trie
    search(ip: string): string | null {
        let node = this.root;
        const binaryIp = this.toBinary(ip);
        
        for (let i = 0; i < binaryIp.length; i++) {
            const bit = binaryIp[i];
            if (!node.children[bit]) {
                break;
            }
            node = node.children[bit];
            if (node.isEndOfCidr) {
                return node.cidrRange;
            }
        }
        
        return null;
    }

    // Utility function to convert IP address to binary string
    toBinary(ip: string): string {
        return ip.split('.').map((octet) => {
            return parseInt(octet, 10).toString(2).padStart(8, '0');
        }).join('');
    }
}

// Example usage
const ipTrie = new IpTrie();
ipTrie.insert('192.168.1.0/24');
ipTrie.insert('10.0.0.0/8');

console.log(ipTrie.search('192.168.1.1'));  // Output: '192.168.1.0/24'
console.log(ipTrie.search('10.1.1.1'));    // Output: '10.0.0.0/8'
console.log(ipTrie.search('172.16.0.1'));  // Output: null
