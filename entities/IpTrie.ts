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

            console.log(`binarySubnet[i]: ${binarySubnet[i]}`)
        
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
            console.log(`binaryIp: ${binaryIp} bit: ${bit}`)
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

    // Utility function to log the Trie structure
    logTrie(node: TrieNode = this.root, prefix: string = ''): void {
        console.log(`${prefix}Node - isEndOfCidr: ${node.isEndOfCidr}, cidrRange: ${node.cidrRange}`);
        for (const [bit, childNode] of Object.entries(node.children)) {
            this.logTrie(childNode, `${prefix}${bit}`);
        }
    }
}

