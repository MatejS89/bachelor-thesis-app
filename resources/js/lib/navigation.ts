export default function createNavigationLink(lng: number, lat: number): string {
    const userAgent = navigator.userAgent;

    if (isAndroid(userAgent)) {
        return `geo:${lat},${lng}?q=${lat},${lng}`;
    } else if (isIOS(userAgent)) {
        return `geo-navigation:///directions?destination=${lat},${lng}`;
    } else {
        return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
}

function isAndroid(userAgent: string) {
    return /Android/.test(userAgent);
}

function isIOS(userAgent: string): boolean {
    const iOSDevice = /iPad|iPhone|iPod/.test(userAgent);
    const claimsToBeMac = /Macintosh|Mac OS X/.test(userAgent);

    const hasTouchScreen =
        typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1;

    const iPadOSDesktopMode = claimsToBeMac && hasTouchScreen;

    return iOSDevice || iPadOSDesktopMode;
}
