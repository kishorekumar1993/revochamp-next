// app/tools/ip-lookup/actions.ts
'use server';

export interface IpInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
  status: string;
  message?: string;
}

export async function lookupIp(ip: string): Promise<{ success: boolean; data?: IpInfo; error?: string }> {
  try {
    const url = `http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'fail') {
      return { success: false, error: data.message || 'Failed to lookup IP address.' };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' };
  }
}