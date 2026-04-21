// app/tools/ssl-checker/actions.ts
'use server';

import * as tls from 'tls';

export interface CertificateDetails {
  subject: {
    commonName?: string;
    organization?: string;
    organizationalUnit?: string;
    locality?: string;
    state?: string;
    country?: string;
  };
  issuer: {
    commonName?: string;
    organization?: string;
    country?: string;
  };
  validFrom: string;
  validTo: string;
  serialNumber: string;
  fingerprint: string;
  fingerprint256: string;
  publicKeyAlgorithm: string;
  signatureAlgorithm: string;
  subjectAltNames: string[];
  daysRemaining: number;
  isValid: boolean;
  protocol?: string;
  cipher?: string;
}

// Helper to extract first string from possibly array value
function getFirstString(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

function parseCert(cert: tls.PeerCertificate): CertificateDetails {
  const now = new Date();
  const validFrom = new Date(cert.valid_from);
  const validTo = new Date(cert.valid_to);
  const daysRemaining = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isValid = now >= validFrom && now <= validTo;

  const subjectAltNames: string[] = [];
  if (cert.subjectaltname) {
    cert.subjectaltname.split(',').forEach(name => {
      const trimmed = name.trim();
      const match = trimmed.match(/^DNS:(.+)$/i);
      if (match) subjectAltNames.push(match[1]);
    });
  }

  return {
    subject: {
      commonName: getFirstString(cert.subject?.CN),
      organization: getFirstString(cert.subject?.O),
      organizationalUnit: getFirstString(cert.subject?.OU),
      locality: getFirstString(cert.subject?.L),
      state: getFirstString(cert.subject?.ST),
      country: getFirstString(cert.subject?.C),
    },
    issuer: {
      commonName: getFirstString(cert.issuer?.CN),
      organization: getFirstString(cert.issuer?.O),
      country: getFirstString(cert.issuer?.C),
    },
    validFrom: validFrom.toISOString(),
    validTo: validTo.toISOString(),
    serialNumber: cert.serialNumber || 'N/A',
    fingerprint: cert.fingerprint || 'N/A',
    fingerprint256: cert.fingerprint256 || 'N/A',
    // These may not exist on all Node.js types; fallback to 'N/A'
    publicKeyAlgorithm: (cert as any).publicKeyAlgorithm || 'N/A',
    signatureAlgorithm: (cert as any).signatureAlgorithm || 'N/A',
    subjectAltNames,
    daysRemaining,
    isValid,
  };
}

export async function checkSSLCertificate(domain: string): Promise<{ success: boolean; data?: CertificateDetails; error?: string }> {
  return new Promise((resolve) => {
    const options: tls.ConnectionOptions = {
      host: domain,
      port: 443,
      servername: domain,
      rejectUnauthorized: false,
      requestCert: true,
    };

    const socket = tls.connect(options, () => {
      const cert = socket.getPeerCertificate(true);
      const cipher = socket.getCipher();
      
      if (!cert || Object.keys(cert).length === 0) {
        socket.destroy();
        resolve({ success: false, error: 'No SSL certificate found for this domain.' });
        return;
      }

      const parsedCert = parseCert(cert);
      parsedCert.protocol = socket.getProtocol() || undefined;
      parsedCert.cipher = `${cipher.name} ${cipher.version}`;

      socket.destroy();
      resolve({ success: true, data: parsedCert });
    });

    socket.on('error', (err) => {
      resolve({ success: false, error: err.message });
    });

    socket.setTimeout(10000, () => {
      socket.destroy();
      resolve({ success: false, error: 'Connection timeout. Please try again.' });
    });
  });
}