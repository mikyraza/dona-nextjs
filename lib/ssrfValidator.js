import dns from 'dns/promises';
import net from 'net';

/**
 * Checks if an IPv4 or IPv6 address is private, loopback, link-local, or reserved.
 */
export function isPrivateOrReservedIp(ip) {
  if (!net.isIP(ip)) return false;

  // IPv4 checks
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    const [b0, b1, b2, b3] = parts;

    // 0.0.0.0/8 (Current network)
    if (b0 === 0) return true;

    // 10.0.0.0/8 (Private network)
    if (b0 === 10) return true;

    // 127.0.0.0/8 (Loopback)
    if (b0 === 127) return true;

    // 169.254.0.0/16 (Link-local & cloud metadata)
    if (b0 === 169 && b1 === 254) return true;

    // 172.16.0.0/12 (Private network: 172.16.0.0 – 172.31.255.255)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;

    // 192.168.0.0/16 (Private network)
    if (b0 === 192 && b1 === 168) return true;

    // 100.64.0.0/10 (Carrier-grade NAT)
    if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;

    // 192.0.0.0/24, 192.0.2.0/24 (TEST-NET-1)
    if (b0 === 192 && b1 === 0 && (b2 === 0 || b2 === 2)) return true;

    // 198.51.100.0/24 (TEST-NET-2), 203.0.113.0/24 (TEST-NET-3)
    if (b0 === 198 && b1 === 51 && b2 === 100) return true;
    if (b0 === 203 && b1 === 0 && b2 === 113) return true;

    // 224.0.0.0/4 (Multicast), 240.0.0.0/4 (Reserved)
    if (b0 >= 224) return true;

    // 255.255.255.255 (Broadcast)
    if (b0 === 255 && b1 === 255 && b2 === 255 && b3 === 255) return true;

    return false;
  }

  // IPv6 checks
  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();
    
    // ::1 (Loopback) or :: (Unspecified)
    if (normalized === '::1' || normalized === '::' || normalized === '0:0:0:0:0:0:0:1' || normalized === '0:0:0:0:0:0:0:0') {
      return true;
    }

    // IPv4-mapped IPv6 (::ffff:127.0.0.1 etc)
    if (normalized.startsWith('::ffff:') || normalized.startsWith('0:0:0:0:0:ffff:')) {
      const ipv4Part = normalized.split(':').pop();
      if (ipv4Part && net.isIPv4(ipv4Part)) {
        return isPrivateOrReservedIp(ipv4Part);
      }
    }

    // fe80::/10 (Link-local)
    if (normalized.startsWith('fe8') || normalized.startsWith('fe9') || normalized.startsWith('fea') || normalized.startsWith('feb')) {
      return true;
    }

    // fc00::/7 & fd00::/8 (Unique Local Address)
    if (normalized.startsWith('fc') || normalized.startsWith('fd')) {
      return true;
    }

    return false;
  }

  return false;
}

/**
 * Validates a remote URL against SSRF threats.
 * Ensures http/https protocol and blocks internal hostnames and private/reserved IP resolutions.
 * @param {string} rawUrl
 * @returns {Promise<{ isValid: boolean, error?: string, parsedUrl?: URL }>}
 */
export async function validateRemoteUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: "URL manquante ou invalide." };
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (e) {
    return { isValid: false, error: "Format d'URL invalide." };
  }

  // 1. Enforce strict HTTP/HTTPS protocol
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: "Protocole non supporté. Seuls HTTP et HTTPS sont autorisés." };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Block prohibited localhost and internal domain names
  const blockedHostnames = ['localhost', 'broadcasthost', 'local', 'internal', 'lan', 'home', 'corp'];
  if (
    blockedHostnames.includes(hostname) ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan')
  ) {
    return { isValid: false, error: "Accès aux hôtes locaux ou internes interdit (SSRF Protection)." };
  }

  // 3. If hostname is a literal IP, check directly
  if (net.isIP(hostname)) {
    if (isPrivateOrReservedIp(hostname)) {
      return { isValid: false, error: "Accès aux adresses IP privées ou réservées interdit (SSRF Protection)." };
    }
  } else {
    // 4. Resolve DNS and check all resolved IP addresses
    try {
      const addresses = await dns.lookup(hostname, { all: true });
      if (!addresses || addresses.length === 0) {
        return { isValid: false, error: "Impossible de résoudre le nom de domaine." };
      }

      for (const addr of addresses) {
        if (isPrivateOrReservedIp(addr.address)) {
          return { isValid: false, error: `Le domaine résout vers une adresse IP interne (${addr.address}) non autorisée.` };
        }
      }
    } catch (dnsError) {
      return { isValid: false, error: `Échec de résolution DNS: ${dnsError.message}` };
    }
  }

  return { isValid: true, parsedUrl: parsed };
}
