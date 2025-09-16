export function encode(str: string): string {
  try {
    const base64 = btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
        String.fromCharCode(Number(`0x${p1}`))
      )
    );

    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    console.error('Encode failed:', e);
    return '';
  }
}

export function decode(base64url: string): string {
  try {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch (e) {
    console.error('Decode failed:', e);
    return '';
  }
}
