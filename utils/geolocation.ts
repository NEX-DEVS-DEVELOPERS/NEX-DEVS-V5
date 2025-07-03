/**
 * Geolocation Utility for IP-based location detection
 * Provides comprehensive location information including IP geolocation
 */

export interface LocationInfo {
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  regionCode: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  organization: string;
  asn: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
  accuracy: number;
  timestamp: string;
}

export interface SecurityInfo {
  vpn: boolean;
  tor: boolean;
  threat: boolean;
  riskScore: number;
  lastSeen: string;
}

export class GeolocationService {
  private static instance: GeolocationService;
  private cache: Map<string, { data: LocationInfo; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  /**
   * Get location information for an IP address
   */
  public async getLocationInfo(ip?: string): Promise<LocationInfo> {
    try {
      // Use multiple services for better accuracy
      const services = [
        () => this.getFromIPAPI(ip),
        () => this.getFromIPInfo(ip),
        () => this.getFromIPGeolocation(ip)
      ];

      // Try services in order until one succeeds
      for (const service of services) {
        try {
          const result = await service();
          if (result) {
            return result;
          }
        } catch (error) {
          console.warn('Geolocation service failed:', error);
          continue;
        }
      }

      // Fallback to basic info
      return this.getFallbackInfo(ip);
    } catch (error) {
      console.error('All geolocation services failed:', error);
      return this.getFallbackInfo(ip);
    }
  }

  /**
   * Get security information for an IP address
   */
  public async getSecurityInfo(ip: string): Promise<SecurityInfo> {
    try {
      // This would typically use a security service like AbuseIPDB or similar
      // For now, return basic security info
      return {
        vpn: false,
        tor: false,
        threat: false,
        riskScore: 0,
        lastSeen: new Date().toISOString()
      };
    } catch (error) {
      console.error('Security info lookup failed:', error);
      return {
        vpn: false,
        tor: false,
        threat: false,
        riskScore: 0,
        lastSeen: new Date().toISOString()
      };
    }
  }

  /**
   * Get comprehensive location and security info
   */
  public async getComprehensiveInfo(ip?: string): Promise<{
    location: LocationInfo;
    security: SecurityInfo;
  }> {
    const [location, security] = await Promise.all([
      this.getLocationInfo(ip),
      ip ? this.getSecurityInfo(ip) : this.getSecurityInfo('unknown')
    ]);

    return { location, security };
  }

  private async getFromIPAPI(ip?: string): Promise<LocationInfo | null> {
    try {
      const url = ip ? `http://ip-api.com/json/${ip}` : 'http://ip-api.com/json/';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`IP-API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'fail') {
        throw new Error(`IP-API error: ${data.message}`);
      }

      return {
        ip: data.query,
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        regionCode: data.region,
        city: data.city,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone,
        isp: data.isp,
        organization: data.org,
        asn: data.as,
        mobile: data.mobile || false,
        proxy: data.proxy || false,
        hosting: data.hosting || false,
        accuracy: 85, // IP-API typical accuracy
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('IP-API service failed:', error);
      return null;
    }
  }

  private async getFromIPInfo(ip?: string): Promise<LocationInfo | null> {
    try {
      // Note: ipinfo.io requires an API key for production use
      const url = ip ? `https://ipinfo.io/${ip}/json` : 'https://ipinfo.io/json';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`IPInfo request failed: ${response.status}`);
      }

      const data = await response.json();
      const [lat, lon] = (data.loc || '0,0').split(',').map(Number);

      return {
        ip: data.ip,
        country: data.country,
        countryCode: data.country,
        region: data.region,
        regionCode: data.region,
        city: data.city,
        latitude: lat,
        longitude: lon,
        timezone: data.timezone || 'Unknown',
        isp: data.org || 'Unknown',
        organization: data.org || 'Unknown',
        asn: data.org || 'Unknown',
        mobile: false,
        proxy: false,
        hosting: false,
        accuracy: 80, // IPInfo typical accuracy
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.warn('IPInfo service failed:', error);
      return null;
    }
  }

  private async getFromIPGeolocation(ip?: string): Promise<LocationInfo | null> {
    try {
      // This would use ipgeolocation.io or similar service
      // For demo purposes, return null to fall back to other services
      return null;
    } catch (error) {
      console.warn('IP Geolocation service failed:', error);
      return null;
    }
  }

  private getFallbackInfo(ip?: string): LocationInfo {
    return {
      ip: ip || 'Unknown',
      country: 'Unknown',
      countryCode: 'XX',
      region: 'Unknown',
      regionCode: 'XX',
      city: 'Unknown',
      latitude: 0,
      longitude: 0,
      timezone: 'Unknown',
      isp: 'Unknown',
      organization: 'Unknown',
      asn: 'Unknown',
      mobile: false,
      proxy: false,
      hosting: false,
      accuracy: 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Extract IP address from request headers
   */
  public static extractIPFromHeaders(headers: Headers): string {
    // Try various headers in order of preference
    const ipHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'cf-connecting-ip',
      'x-client-ip',
      'x-cluster-client-ip',
      'forwarded-for',
      'forwarded'
    ];

    for (const header of ipHeaders) {
      const value = headers.get(header);
      if (value) {
        // Handle comma-separated IPs (take the first one)
        const ip = value.split(',')[0].trim();
        if (this.isValidIP(ip)) {
          return ip;
        }
      }
    }

    return 'unknown';
  }

  /**
   * Validate IP address format
   */
  private static isValidIP(ip: string): boolean {
    // Basic IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Regex.test(ip)) {
      const parts = ip.split('.');
      return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
      });
    }

    // Basic IPv6 validation (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv6Regex.test(ip);
  }

  /**
   * Get distance between two coordinates
   */
  public static getDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

// Export singleton instance
export const geolocationService = GeolocationService.getInstance();
