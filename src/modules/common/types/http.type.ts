import { Output } from './output.type';

interface HTTPClientInterface {
  get<T>(url: string, authorization: HTTPAuthorization): Promise<Output<T>>;
}

type HTTPAuthorizationScheme = 'Basic' | 'Bearer' | 'Digest' | 'HOBA' | 'Mutual' | 'Negotiate' | 'NTLM' | 'VAPID' | 'SCRAM' | 'AWS4-HMAC-SHA256';

interface HTTPAuthorization {
  scheme: HTTPAuthorizationScheme;
  parameter: string;
}

export { HTTPClientInterface, HTTPAuthorization, HTTPAuthorizationScheme };
