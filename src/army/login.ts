import { postRequest } from '@heptacode/http-request';
import { stringify } from 'qs';
import { config, paths } from '../config.js';
import { extractCookies } from '../utils/extractCookies.js';

/**
 * 더캠프 로그인
 * @returns {void} void
 */
export async function login(): Promise<void> {
  if (!process.env.THECAMP_ID || !process.env.THECAMP_PW) {
    throw new Error('Invalid Credentials');
  }

  const { headers, data } = await postRequest<any>(
    paths.army.login,
    stringify({
      state: 'email-login',
      autoLoginYn: 'N',
      findPwType: 'pwFind',
      userId: process.env.THECAMP_ID,
      userPwd: process.env.THECAMP_PW,
    })
  );

  if (data.resultCd !== '0000') {
    throw new Error('Invalid Credentials');
  }

  const { iuid, token } = extractCookies(headers['set-cookie']!);
  config.iuid = iuid.match(/\d+/)![0];
  config.httpRequestConfig.headers = {
    Cookie: `${iuid}; ${token}`,
  };
}
